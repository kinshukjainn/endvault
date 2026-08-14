"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaGithub } from "react-icons/fa";
import {
  GitCommit,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  ExternalLink,
  GitBranch,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface CommitData {
  message: string;
  author: CommitAuthor;
}

interface GithubCommit {
  sha: string;
  html_url: string;
  commit: CommitData;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

// ============================================================================
// Configuration
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "opaque",
  branch: "master",
  perPage: 100,
  maxPages: 10,
};

const COMMIT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "feat", label: "Features" },
  { id: "fix", label: "Bug Fixes" },
  { id: "chore", label: "Chores" },
  { id: "docs", label: "Documentation" },
  { id: "refactor", label: "Refactors" },
];

// ============================================================================
// Utility Functions
// ============================================================================

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getCommitTitle = (message: string) => message.split("\n")[0];

// ============================================================================
// Main Component
// ============================================================================

export default function ChangelogTracker() {
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProgress, setFetchingProgress] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCommits = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setLoading(true);
      setError(null);
      setFetchingProgress(0);
    }

    try {
      let allCommits: GithubCommit[] = [];
      let page = 1;
      let shouldFetchMore = true;

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      while (shouldFetchMore && page <= GITHUB_CONFIG.maxPages) {
        setFetchingProgress(page);

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/commits?sha=${GITHUB_CONFIG.branch}&per_page=${GITHUB_CONFIG.perPage}&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 403)
            throw new Error("GitHub API rate limit exceeded.");
          if (response.status === 404) throw new Error("Repository not found.");
          throw new Error(
            `Failed to fetch commits (Status: ${response.status})`,
          );
        }

        const data: GithubCommit[] = await response.json();

        if (data.length === 0) {
          break;
        }

        allCommits = [...allCommits, ...data];

        const oldestDateInBatch = new Date(
          data[data.length - 1].commit.author.date,
        );

        if (oldestDateInBatch < oneYearAgo) {
          shouldFetchMore = false;
        } else {
          page++;
        }
      }

      setCommits(allCommits);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCommits(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCommits]);

  // --------------------------------------------------------------------------
  // Data Processing & Filtering
  // --------------------------------------------------------------------------

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(commits.map((c) => c.commit.author.name)));
  }, [commits]);

  const displayCommits = useMemo(() => {
    return commits.filter((commit) => {
      const msg = commit.commit.message.toLowerCase();
      const authorName = commit.commit.author.name;
      const sha = commit.sha.toLowerCase();

      if (
        searchQuery &&
        !msg.includes(searchQuery.toLowerCase()) &&
        !sha.includes(searchQuery.toLowerCase())
      )
        return false;
      if (authorFilter !== "all" && authorName !== authorFilter) return false;
      if (
        typeFilter !== "all" &&
        !(msg.startsWith(`${typeFilter}:`) || msg.startsWith(`${typeFilter}(`))
      )
        return false;

      return true;
    });
  }, [commits, searchQuery, authorFilter, typeFilter]);

  const lastChangeDate =
    commits.length > 0
      ? new Date(commits[0].commit.author.date).toUTCString()
      : "N/A";

  const inputClass =
    "bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-gray-400 px-4 py-3 rounded-2xl font-medium outline-none transition-all text-sm w-full sm:w-auto focus:border-blue-400 dark:focus:border-zinc-700";

  return (
    <div className="min-h-screen pt-10 bg-white dark:bg-black text-zinc-800 dark:text-zinc-300 selection:bg-blue-200 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white pb-32 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-8">
        {/* ── HEADER ── */}
        <header>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <FaGithub className="w-8 h-8 text-zinc-900 dark:text-zinc-400" />
            Repository logs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-2xl">
            Tracking recent architecture changes, bug fixes, and feature
            integrations directly from the upstream repository.
          </p>
        </header>

        {/* ── META INFO CARD ── */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-4 sm:gap-x-4 text-sm">
            <div className="text-zinc-800 dark:text-white font-medium flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> Branch
            </div>
            <div className="text-blue-800 bg-blue-100 dark:text-white dark:bg-blue-800 font-medium text-xs w-fit px-2 py-1 rounded-full">
              {GITHUB_CONFIG.branch}
            </div>

            <div className="text-zinc-800 dark:text-white font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> Last Change
            </div>
            <div className="text-zinc-600 dark:text-zinc-200">
              {lastChangeDate}
            </div>

            <div className="text-zinc-800 dark:text-white font-medium flex items-center gap-2">
              <FaGithub className="w-4 h-4" /> Origin URL
            </div>
            <div>
              <a
                href={`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:underline break-all inline-flex items-center gap-1.5 transition-colors"
              >
                github.com/{GITHUB_CONFIG.username}/{GITHUB_CONFIG.repository}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ── FILTERS TOGGLE & BLOCK ── */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-2xl font-medium text-zinc-900 dark:text-white flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Commits ({displayCommits.length})
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs tracking-wider border border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-full px-3 py-2 bg-zinc-100 dark:bg-[#202020] text-zinc-700 dark:text-zinc-200 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-zinc-800 dark:text-zinc-100 text-xs font-semibold tracking-wider">
                  Search
                </span>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search messages or SHA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${inputClass} sm:w-64 pl-9`}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-zinc-800 dark:text-zinc-100 text-xs font-semibold tracking-wider">
                  Author
                </span>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <select
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    className={`${inputClass} pl-9 appearance-none`}
                  >
                    <option value="all">All Authors</option>
                    {uniqueAuthors.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-zinc-800 dark:text-zinc-100 text-xs font-semibold tracking-wider">
                  Type
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={inputClass}
                >
                  {COMMIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setAuthorFilter("all");
                  setTypeFilter("all");
                }}
                className="h-[42px] px-5 bg-blue-500 dark:bg-blue-400 text-white dark:text-black text-sm font-medium rounded-full cursor-pointer transition-colors w-full sm:w-auto mt-2 sm:mt-0"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR & LOADING STATES ── */}
        {loading && (
          <div className="p-12 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/10 rounded-xl flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 gap-3 transition-colors">
            <RefreshCw className="w-6 h-6 animate-spin text-zinc-400 dark:text-zinc-500" />
            <p className="text-sm font-medium">
              Fetching repository history (Page {fetchingProgress})...
            </p>
          </div>
        )}

        {error && (
          <div className="p-5 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-800 dark:text-red-200 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-red-600 dark:text-red-400 tracking-wider">
                Connection Error
              </span>
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => fetchCommits(false)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-700 dark:text-red-100 text-sm font-medium rounded-lg transition-colors border border-red-200 dark:border-red-800/50"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && displayCommits.length === 0 && (
          <div className="p-12 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/10 rounded-xl text-center text-zinc-500 dark:text-zinc-400 text-sm transition-colors">
            No commits found matching the current filters.
          </div>
        )}

        {/* ── COMMITS LIST ── */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="flex flex-col">
            {displayCommits.map((commit, index) => {
              const title = getCommitTitle(commit.commit.message);
              // Subtle alternating rows adapted for both light and dark modes
              const isEven = index % 2 === 0;

              return (
                <div
                  key={commit.sha}
                  className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-3 px-5 rounded-2xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                    isEven
                      ? "bg-zinc-50 dark:bg-[#141414]"
                      : "bg-white dark:bg-zinc-900/20"
                  }`}
                >
                  {/* Left: Time & Author */}
                  <div className="flex items-center gap-3 shrink-0 md:w-[180px]">
                    <span className="text-blue-600 dark:text-blue-500 text-xs font-medium w-[65px] shrink-0 text-right">
                      {timeAgo(commit.commit.author.date)}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 hidden md:block" />
                    <span className="text-zinc-600 dark:text-zinc-300 text-sm font-medium font-mono truncate w-[90px]">
                      {commit.commit.author.name}
                    </span>
                  </div>

                  {/* Middle: Commit Message & Tag */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-zinc-900 dark:text-zinc-100 text-sm truncate">
                      {title}
                    </span>
                    {index === 0 && (
                      <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white border border-zinc-300 dark:border-zinc-700 text-[13px] font-bold px-2.5 py-0.5 rounded-full tracking-wider shrink-0">
                        Master
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="shrink-0 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500 md:justify-end">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors flex items-center gap-1"
                    >
                      {commit.sha.substring(0, 7)}
                    </a>
                    <span className="text-zinc-300 dark:text-zinc-200">|</span>
                    <a
                      href={commit.html_url.replace("/commit/", "/tree/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 dark:text-white hover:text-black dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      tree
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
