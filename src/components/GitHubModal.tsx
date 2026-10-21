import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [githubUsername, setGithubUsername] = useState('singhlovepreet');
  const [repoName, setRepoName] = useState('eperfumestore');
  const [copiedStep1, setCopiedStep1] = useState(false);
  const [copiedStep2, setCopiedStep2] = useState(false);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${githubUsername}/${repoName}.git`;
  const remoteCommand = `git remote add origin ${repoUrl}`;
  const pushCommand = `git push -u origin main`;
  const fullCommand = `git remote add origin ${repoUrl} && git push -u origin main`;

  const handleCopy = (text: string, type: 'step1' | 'step2') => {
    navigator.clipboard.writeText(text);
    if (type === 'step1') {
      setCopiedStep1(true);
      setTimeout(() => setCopiedStep1(false), 2000);
    } else {
      setCopiedStep2(true);
      setTimeout(() => setCopiedStep2(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
              <GitBranch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-white">Link to GitHub &amp; Vercel</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Git Initialized on Main
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Push ePerfume Store codebase to your GitHub repository and host on Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-stone-700">
          {/* Status banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 block font-sans text-sm">
                Local Git Repository Ready
              </strong>
              <p className="text-xs text-emerald-800 mt-0.5">
                The local repository is initialized, branch set to <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">main</code>, and all 29 files (products, components, admin portal, and README) are committed.
              </p>
            </div>
          </div>

          {/* Repository configuration */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              1. Your GitHub Repository Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 font-medium mb-1">GitHub Username / Org</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value.trim())}
                  placeholder="e.g. lovepreetsingh"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-medium mb-1">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value.trim())}
                  placeholder="eperfumestore"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Create New Repo on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-stone-400 self-center text-[11px]">
                (Do not check &ldquo;Add a README file&rdquo; as we already have one)
              </span>
            </div>
          </div>

          {/* Terminal Commands */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-700" />
              <span>2. Terminal Push Commands</span>
            </h3>

            {/* Remote Command */}
            <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-amber-400 select-all">$ {remoteCommand}</span>
              <button
                onClick={() => handleCopy(remoteCommand, 'step1')}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded shrink-0 flex items-center gap-1 text-[11px]"
              >
                {copiedStep1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep1 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Push Command */}
            <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-amber-400 select-all">$ {pushCommand}</span>
              <button
                onClick={() => handleCopy(pushCommand, 'step2')}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded shrink-0 flex items-center gap-1 text-[11px]"
              >
                {copiedStep2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep2 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Vercel 1-Click Deployment */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">3. Deploy to Vercel (1-Click)</span>
              <span className="text-[10px] font-mono text-stone-500">Preset: Vite</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Once pushed to GitHub, connect your repository on Vercel for instantaneous global CDN deployment with zero server configuration:
            </p>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>Import to Vercel</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>

          {/* Google AI Studio native export option */}
          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-200">
            <strong>Pro-tip:</strong> You can also use the <strong>Export / Connect to GitHub</strong> option directly in the Google AI Studio project header menu to link your repository in one step.
          </div>
        </div>
      </div>
    </div>
  );
};
