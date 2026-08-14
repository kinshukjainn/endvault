"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  Hash,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  analyzePassword,
  generatePassword,
  type GenerateOptions,
  type GenerateResult,
} from "./checker";

// --- Flat Configuration ---
const SCORE_COLORS = [
  "text-red-600 bg-red-600 dark:text-red-500 dark:bg-red-500",
  "text-orange-600 bg-orange-600 dark:text-orange-500 dark:bg-orange-500",
  "text-yellow-500 bg-yellow-500 dark:text-yellow-500 dark:bg-yellow-500",
  "text-lime-500 bg-lime-500 dark:text-lime-500 dark:bg-lime-500",
  "text-green-600 bg-green-600 dark:text-green-500 dark:bg-green-500",
];

function scoreFromBits(bits: number): number {
  if (bits < 30) return 0;
  if (bits < 50) return 1;
  if (bits < 70) return 2;
  if (bits < 100) return 3;
  return 4;
}

export default function PasswordDashboard() {
  const [mode, setMode] = useState<"analyze" | "generate">("analyze");
  const [mounted, setMounted] = useState(false);

  // Analyze State
  const [pw, setPw] = useState("");
  const [reveal, setReveal] = useState(false);
  const result = useMemo(() => analyzePassword(pw), [pw]);

  // Generate State
  const [opts, setOpts] = useState<Required<GenerateOptions>>({
    length: 20,
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    avoidAmbiguous: false,
  });

  const [generated, setGenerated] = useState<GenerateResult>({
    password: "",
    entropyBits: 0,
  });
  const [copied, setCopied] = useState(false);
  const initialOptsRef = useRef(opts);

  useEffect(() => {
    setGenerated(generatePassword(initialOptsRef.current));
    setMounted(true);
  }, []);

  const regenerate = useCallback(
    (next = opts) => {
      try {
        setGenerated(generatePassword(next));
        setCopied(false);
      } catch {
        // Fallback
      }
    },
    [opts],
  );

  const setOpt = (patch: Partial<GenerateOptions>) => {
    const next = { ...opts, ...patch } as Required<GenerateOptions>;
    setOpts(next);
    regenerate(next);
  };

  const copy = async () => {
    if (!generated.password) return;
    await navigator.clipboard.writeText(generated.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted)
    return (
      <div className="p-8 text-gray-500 text-lg">Loading workspace...</div>
    );

  const activeColor = SCORE_COLORS[result.score];
  const genScore = scoreFromBits(generated.entropyBits);
  const genColor = SCORE_COLORS[genScore];

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-8 md:px-12 lg:px-20 mx-auto max-w-[1600px] bg-white dark:bg-black text-gray-800 dark:text-gray-200 transition-colors duration-200">
      {/* Workspace Header & Tabs (Google Material Style) */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
          Password Tools
        </h1>
        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <button
            className={`pb-4 px-2 text-lg font-medium transition-all relative ${
              mode === "analyze"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
            onClick={() => setMode("analyze")}
          >
            Security Analysis
            {mode === "analyze" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
          <button
            className={`pb-4 px-2 text-lg font-medium transition-all relative ${
              mode === "generate"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
            onClick={() => setMode("generate")}
          >
            Generator
            {mode === "generate" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          MODE: ANALYZE (Full Page Dashboard Layout)
          ───────────────────────────────────────────────────────── */}
      {mode === "analyze" && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Huge Hero Input Field */}
          <div className="w-full">
            <div className="relative flex items-center">
              <input
                type={reveal ? "text" : "password"}
                className="w-full bg-gray-50 dark:bg-[#101010] border-2 border-gray-200 dark:border-[#252525] focus:border-blue-500 dark:focus:border-blue-500 transition-all p-6 md:p-8 rounded-[32px] text-2xl md:text-4xl text-black dark:text-white outline-none shadow-sm dark:shadow-none placeholder-gray-400 dark:placeholder-gray-600 font-mono"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Type a password to analyze..."
              />
              <button
                className="absolute cursor-pointer right-6 md:right-8 p-4 bg-gray-200 hover:bg-gray-300 dark:bg-[#252525] dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 transition-all rounded-full"
                onClick={() => setReveal(!reveal)}
                aria-label="Toggle password visibility"
              >
                {reveal ? <EyeOff size={28} /> : <Eye size={28} />}
              </button>
            </div>
          </div>

          {/* Metrics Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Card 1: Security Index */}
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-2">
                <ShieldCheck
                  size={20}
                  className={pw ? activeColor.split(" ")[0] : ""}
                />
                Security Index
              </div>
              <div className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                {pw ? result.label : "N/A"}
              </div>

              {/* Meter inside the card */}
              <div className="flex gap-1.5 w-full h-3 rounded-full overflow-hidden mt-auto pt-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-500 ${
                      i <= result.score && pw
                        ? activeColor.split(" ")[1]
                        : "bg-gray-200 dark:bg-[#282A2C]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Entropy */}
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-2">
                <Hash size={20} className="text-blue-500" />
                Raw Entropy
              </div>
              <div className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                {pw ? `${result.entropyBits}` : "0"}{" "}
                <span className="text-xl md:text-2xl text-gray-400 font-medium">
                  bits
                </span>
              </div>
              <p className="mt-auto pt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                Higher bits mean exponentially more resistance to brute-force
                attacks.
              </p>
            </div>

            {/* Card 3: Crack Time */}
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-2">
                <Clock size={20} className="text-orange-500" />
                Est. Crack Time
              </div>
              <div className="text-3xl md:text-4xl font-bold text-black dark:text-white leading-tight">
                {pw ? result.crackTime : "Instant"}
              </div>
              <p className="mt-auto pt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
                Estimated time for a standard hardware setup to guess this
                password.
              </p>
            </div>
          </div>

          {/* Full-width Audit Logs Panel */}
          {(result.warnings.length > 0 || result.suggestions.length > 0) &&
            pw && (
              <div className="p-8 md:p-10 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] rounded-[32px] w-full">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 uppercase tracking-wider">
                  Actionable Feedback
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Warnings Column */}
                  {result.warnings.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {result.warnings.map((w, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl"
                        >
                          <AlertTriangle
                            className="text-red-600 dark:text-red-500 shrink-0 mt-0.5"
                            size={24}
                          />
                          <span className="text-red-800 dark:text-red-300 font-medium text-lg leading-snug">
                            {w}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Suggestions Column */}
                  {result.suggestions.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {result.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl"
                        >
                          <Lightbulb
                            className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                            size={24}
                          />
                          <span className="text-blue-800 dark:text-blue-300 font-medium text-lg leading-snug">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODE: GENERATE (Split Layout Dashboard)
          ───────────────────────────────────────────────────────── */}
      {mode === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Left Column: Massive Output Display */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="p-8 md:p-12 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-[#252525] rounded-[32px] shadow-sm dark:shadow-none flex flex-col h-full relative">
              <label className="block text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-6">
                Your Secure Credential
              </label>

              <div className="flex-1 flex items-center justify-center min-h-[200px] mb-8">
                <p className="w-full text-center text-4xl md:text-5xl lg:text-6xl font-mono text-black dark:text-white break-all leading-tight font-bold selection:bg-blue-200 dark:selection:bg-blue-900">
                  {generated.password}
                </p>
              </div>

              {/* Strength Meter under output */}
              <div className="w-full mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-bold text-lg text-black dark:text-white">
                    Strength Rating
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    {generated.entropyBits} bits of entropy
                  </span>
                </div>
                <div className="flex gap-2 rounded-full w-full h-3 overflow-hidden">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-colors duration-500 ${
                        i <= genScore
                          ? genColor.split(" ")[1]
                          : "bg-gray-200 dark:bg-[#282A2C]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button
                  onClick={() => regenerate()}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-[#252525] dark:hover:bg-[#333] text-gray-800 dark:text-white border border-gray-300 dark:border-transparent p-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-lg"
                  aria-label="Regenerate Password"
                >
                  <RefreshCw size={24} />
                  Regenerate
                </button>
                <button
                  onClick={copy}
                  className={`${
                    copied
                      ? "bg-green-600 dark:bg-green-600 text-white border-transparent"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                  } p-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-lg shadow-md`}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">Copied!</span>
                  ) : (
                    <>
                      <Copy size={24} /> Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Policy Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-8 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] rounded-[32px] shadow-sm dark:shadow-none h-full">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-8 uppercase tracking-wider border-b border-gray-200 dark:border-[#282A2C] pb-4">
                Configuration
              </h3>

              {/* Length Slider */}
              <div className="mb-10">
                <div className="flex justify-between items-center text-black dark:text-white mb-6 font-medium">
                  <span className="text-lg">Length</span>
                  <span className="font-bold text-2xl bg-white dark:bg-[#252525] px-4 py-1 rounded-xl border border-gray-200 dark:border-[#333]">
                    {opts.length}
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  value={opts.length}
                  onChange={(e) => setOpt({ length: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-[#282A2C] rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                  <span>8</span>
                  <span>128</span>
                </div>
              </div>

              {/* Checkboxes List */}
              <div className="flex flex-col gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Character Sets
                </span>
                {[
                  ["lowercase", "Lowercase (a-z)"],
                  ["uppercase", "Uppercase (A-Z)"],
                  ["digits", "Numbers (0-9)"],
                  ["symbols", "Symbols (!@#*)"],
                  ["avoidAmbiguous", "Exclude Ambiguous (l, I, O, 0)"],
                ].map(([key, lbl]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] rounded-2xl cursor-pointer group hover:border-gray-300 dark:hover:border-[#333] transition-colors"
                  >
                    <span className="text-gray-800 dark:text-white font-medium text-md select-none">
                      {lbl}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={opts[key as keyof GenerateOptions] as boolean}
                        onChange={() =>
                          setOpt({ [key]: !opts[key as keyof GenerateOptions] })
                        }
                        className="w-6 h-6 accent-blue-600 dark:accent-blue-500 cursor-pointer rounded-md border-gray-300 dark:border-gray-600 transition-all"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
