import { GoogleAdminUser } from '../types';

// Default authorized administrative accounts
export const DEFAULT_AUTHORIZED_EMAILS = [
  'singh.lovepreet88@gmail.com', // Store Owner & Super Admin
  'eperfumestorenz@gmail.com',   // Boutique HQ Operations
];

const SESSION_STORAGE_KEY = 'eperfume_admin_session';
const WHITELIST_STORAGE_KEY = 'eperfume_admin_whitelist';
const CLIENT_ID_STORAGE_KEY = 'eperfume_google_client_id';
const AUDIT_LOG_KEY = 'eperfume_admin_audit_logs';

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  email: string;
  action: 'login' | 'logout' | 'auth_failed' | 'whitelist_added' | 'whitelist_removed';
  method: string;
  status: 'success' | 'blocked';
  userAgent?: string;
}

// Global declaration for Google Identity Services (GIS)
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
            }
          ) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
          revoke: (hint: string, done: () => void) => void;
        };
      };
    };
  }
}

/**
 * Retrieve list of authorized admin emails
 */
export function getAuthorizedAdminEmails(): string[] {
  try {
    const stored = localStorage.getItem(WHITELIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default emails are always included
        const set = new Set([...DEFAULT_AUTHORIZED_EMAILS, ...parsed.map((e) => String(e).toLowerCase().trim())]);
        return Array.from(set);
      }
    }
  } catch {
    // fallback
  }
  return [...DEFAULT_AUTHORIZED_EMAILS];
}

/**
 * Add an authorized email to the whitelist
 */
export function addAuthorizedEmail(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) return false;

  const current = getAuthorizedAdminEmails();
  if (!current.includes(cleanEmail)) {
    const updated = [...current, cleanEmail];
    localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(updated));
    recordAuditLog(cleanEmail, 'whitelist_added', 'admin_action', 'success');
    return true;
  }
  return false;
}

/**
 * Remove an authorized email from the whitelist (cannot remove owner)
 */
export function removeAuthorizedEmail(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === 'singh.lovepreet88@gmail.com') {
    return false; // Prevent removing primary store owner
  }
  const current = getAuthorizedAdminEmails();
  const updated = current.filter((e) => e !== cleanEmail);
  localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(updated));
  recordAuditLog(cleanEmail, 'whitelist_removed', 'admin_action', 'success');
  return true;
}

/**
 * Check if an email is authorized to access the Admin Portal
 */
export function isAuthorizedAdmin(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const authorized = getAuthorizedAdminEmails();
  return authorized.includes(cleanEmail);
}

const PASSCODE_STORAGE_KEY = 'eperfume_admin_master_passcode';
export const DEFAULT_MASTER_PASSCODE = '8888';

/**
 * Retrieve current Master Admin Passcode (defaults to 8888)
 */
export function getAdminMasterPasscode(): string {
  try {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_MASTER_PASSCODE;
  } catch {
    return DEFAULT_MASTER_PASSCODE;
  }
}

/**
 * Update the Master Admin Passcode
 */
export function setAdminMasterPasscode(newPasscode: string): boolean {
  const clean = newPasscode.trim();
  if (!clean || clean.length < 4) return false;
  try {
    localStorage.setItem(PASSCODE_STORAGE_KEY, clean);
    recordAuditLog('singh.lovepreet88@gmail.com', 'admin_action' as any, 'passcode_updated', 'success');
    return true;
  } catch {
    return false;
  }
}

/**
 * Verify admin credentials (Email + Master Passcode)
 */
export function verifyAdminCredentials(email: string, passcode: string): { success: boolean; error?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPasscode = passcode.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid administrator email address.' };
  }

  if (!isAuthorizedAdmin(cleanEmail)) {
    recordAuditLog(cleanEmail, 'auth_failed', 'credentials', 'blocked');
    return {
      success: false,
      error: `Access Denied: "${cleanEmail}" is not recognized in the authorized admin whitelist.`
    };
  }

  const currentPasscode = getAdminMasterPasscode();
  if (cleanPasscode !== currentPasscode) {
    recordAuditLog(cleanEmail, 'auth_failed', 'credentials', 'blocked');
    return {
      success: false,
      error: 'Invalid Master Admin Passcode. Please enter the correct authorization key.'
    };
  }

  return { success: true };
}

/**
 * Get stored Google session (strictly checks whitelist and expiration)
 */
export function getStoredAdminSession(): GoogleAdminUser | null {
  try {
    // Invalidate deprecated mock sessions from localStorage
    const legacyMock = localStorage.getItem(SESSION_STORAGE_KEY);
    if (legacyMock) {
      try {
        const parsed = JSON.parse(legacyMock);
        if (parsed.authMethod === 'google_verified_profile') {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    // Check sessionStorage first (secure session), then localStorage if remembered
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed: GoogleAdminUser = JSON.parse(raw);
      // Deprecate mock profile
      if (parsed.authMethod === 'google_verified_profile') {
        clearAdminSession();
        return null;
      }

      // Check session age (maximum 4 hours)
      if (parsed.authenticatedAt) {
        const ageMs = Date.now() - new Date(parsed.authenticatedAt).getTime();
        if (ageMs > 4 * 60 * 60 * 1000) {
          clearAdminSession();
          return null;
        }
      }

      // Double check if still in whitelist
      if (parsed && parsed.email && isAuthorizedAdmin(parsed.email)) {
        return parsed;
      }
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

/**
 * Save Google Admin session
 */
export function saveAdminSession(user: GoogleAdminUser, remember = false): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    if (remember) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    recordAuditLog(user.email, 'login', user.authMethod, 'success');
  } catch {
    // Storage issue
  }
}

/**
 * Clear Google Admin session
 */
export function clearAdminSession(): void {
  try {
    const current = getStoredAdminSession();
    if (current) {
      recordAuditLog(current.email, 'logout', current.authMethod, 'success');
    }
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Storage issue
  }
}

/**
 * Get / Set Google OAuth Client ID
 */
export function getStoredGoogleClientId(): string {
  try {
    return (
      localStorage.getItem(CLIENT_ID_STORAGE_KEY) ||
      '428198762952-demo.apps.googleusercontent.com'
    );
  } catch {
    return '';
  }
}

export function saveGoogleClientId(clientId: string): void {
  try {
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId.trim());
  } catch {
    // Storage issue
  }
}

/**
 * Decode JWT ID token from Google Identity Services
 */
export function decodeGoogleJwt(token: string): {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  email_verified?: boolean;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google JWT', err);
    return null;
  }
}

/**
 * Create a verified Google Admin User profile
 */
export function createGoogleAdminProfile(
  email: string,
  name?: string,
  picture?: string,
  method: GoogleAdminUser['authMethod'] = 'google_gis',
  token?: string
): GoogleAdminUser {
  const isSuperOwner = email.toLowerCase() === 'singh.lovepreet88@gmail.com';
  
  return {
    id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: email.toLowerCase().trim(),
    name: name || (isSuperOwner ? 'Lovepreet Singh' : email.split('@')[0]),
    picture:
      picture ||
      (isSuperOwner
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : undefined),
    role: isSuperOwner ? 'Super Admin' : 'Store Manager',
    location: 'Invercargill HQ, New Zealand',
    authMethod: method,
    authenticatedAt: new Date().toISOString(),
    token
  };
}

/**
 * Audit log recording
 */
export function recordAuditLog(
  email: string,
  action: AdminAuditLog['action'],
  method: string,
  status: 'success' | 'blocked'
): void {
  try {
    const logs = getAuditLogs();
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      email,
      action,
      method,
      status,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };
    const updated = [newLog, ...logs].slice(0, 50); // Keep last 50
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function getAuditLogs(): AdminAuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [
    {
      id: 'log_seed_1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      email: 'singh.lovepreet88@gmail.com',
      action: 'login',
      method: 'google_gis',
      status: 'success'
    }
  ];
}
