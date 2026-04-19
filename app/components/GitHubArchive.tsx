'use client';

import { useEffect, useState } from 'react';

/* ============================================
   💡 GITHUB CONFIGURATION
   ============================================ */
const GITHUB_USERNAME = 'REIIIGNS'; // Replace with your GitHub username

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

/* ============================================
   💡 ARCHIVE SETTINGS
   ============================================ */
const ARCHIVE_CONFIG = {
  maxRepos: 3,           // Max repos to display (0 = all)
  sortBy: 'stars',       // 'updated', 'stars', 'name'
  showLanguage: true,      // Show programming language badge
  showStars: true,          // Show star count
  animateOnLoad: true,     // Stagger animation on initial load
};

export default function GitHubArchive() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data: Repo[] = await response.json();

        const sorted = data
          .filter((repo) => !repo.name.startsWith('.') && !repo.name.includes('私人'))
          .sort((a, b) => {
            if (ARCHIVE_CONFIG.sortBy === 'stars') {
              return b.stargazers_count - a.stargazers_count;
            }
            if (ARCHIVE_CONFIG.sortBy === 'name') {
              return a.name.localeCompare(b.name);
            }
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .slice(0, ARCHIVE_CONFIG.maxRepos || undefined);

        setRepos(sorted);
      } catch {
        setError('CONNECTION FAILED');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="font-mono text-xs opacity-60 space-y-2">
          <p>&gt; connecting to archive...</p>
          <p>&gt; querying repositories...</p>
          <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="font-mono text-xs opacity-60 text-red-500">
          <p>&gt; {error}</p>
          <p className="mt-2 opacity-60">&gt; check network connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Header */}
      <div className="font-mono text-[10px] opacity-50 mb-6 space-y-1">
        <p>&gt; ARCHIVE_DB v1.0</p>
        <p>&gt; REPOSITORIES: {repos.length}</p>
        <p>&gt; SOURCE: github.com/{GITHUB_USERNAME}</p>
      </div>

      {/* Repo List */}
      <div className="w-full space-y-3 overflow-y-auto max-h-[calc(100%-100px)] pr-4 scrollbar-thin">
        {repos.map((repo, index) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block group cursor-pointer ${
              ARCHIVE_CONFIG.animateOnLoad ? 'animate-fadeIn' : ''
            }`}
            style={
              ARCHIVE_CONFIG.animateOnLoad
                ? { animationDelay: `${index * 50}ms`, animationFillMode: 'both' }
                : undefined
            }
          >
            <div className="border border-white/10 p-4 transition duration-200 hover:border-white/30 hover:bg-white/5 group">
              {/* Repo Name */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono text-sm opacity-90 group-hover:opacity-100 transition">
                  {repo.name}
                </h3>
                <span className="font-mono text-[10px] opacity-30 group-hover:opacity-60 transition">
                  →
                </span>
              </div>

              {/* Description */}
              <p className="font-mono text-[11px] opacity-50 mb-3 line-clamp-2">
                {repo.description || 'no description available'}
              </p>

              {/* Meta Tags */}
              <div className="flex items-center gap-4 font-mono text-[10px] opacity-40">
                {ARCHIVE_CONFIG.showLanguage && repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white/60" />
                    {repo.language}
                  </span>
                )}
                {ARCHIVE_CONFIG.showStars && (
                  <span>★ {repo.stargazers_count}</span>
                )}
                <span>
                  {new Date(repo.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
