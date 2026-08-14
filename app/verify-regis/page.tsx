"use client";

import { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
import {
  LockKeyhole,
  ShieldCheck,
  Zap,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const APP_NAME = "Opaque";

function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const e = error as { errors?: { longMessage?: string }[]; message?: string };
  return (
    e.errors?.[0]?.longMessage ??
    e.message ??
    "An unexpected error occurred. Please try again."
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-2 transition-colors">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-400 flex items-center justify-center text-green-700 dark:text-black shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 dark:text-[#E2E2E2] font-bold text-[19px] mb-1.5">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-zinc-300 text-[16px] font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [pendingMfa, setPendingMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const providers = ["Clerk", "Neon", "AWS"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % providers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [providers.length]);

  const handleSignIn = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn.password({ identifier: email, password });
      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/vault";
      } else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const emailFactor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === "email_code",
        );

        if (emailFactor) {
          const { error: sendError } = await signIn.emailCode.sendCode();
          if (sendError) {
            setAuthError(getErrorMessage(sendError));
            setLoading(false);
            return;
          }
          setPendingMfa(true);
          setLoading(false);
        } else {
          setAuthError(
            "Device verification required, but no email factor was found.",
          );
          setLoading(false);
        }
      } else {
        setAuthError(`Status: ${signIn.status} — requires additional steps.`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, email, password]);

  const handleVerifyMfa = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn.emailCode.verifyCode({ code: mfaCode });
      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }
      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/vault";
      } else {
        setAuthError(`Verification incomplete. Status: ${signIn.status}`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, mfaCode]);

  const handleSignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: createErr } = await signUp.password({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      if (createErr) {
        setAuthError(getErrorMessage(createErr));
        setLoading(false);
        return;
      }
      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (sendErr) {
        setAuthError(getErrorMessage(sendErr));
        setLoading(false);
        return;
      }
      setPendingVerification(true);
    } catch (err) {
      setAuthError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [signUp, email, password, firstName, lastName]);

  const handleVerifySignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });
      if (verifyErr) {
        setAuthError(getErrorMessage(verifyErr));
        setLoading(false);
        return;
      }
      if (
        (signUp.status === "complete" || signUp.createdSessionId) &&
        signUp.createdSessionId
      ) {
        await setActive({ session: signUp.createdSessionId });
        window.location.href = "/vault";
      } else {
        const missing = signUp.missingFields ?? [];
        const unverified = signUp.unverifiedFields ?? [];
        setAuthError(
          missing.length > 0
            ? `Missing required fields: ${missing.join(", ")}`
            : unverified.length > 0
              ? `Still unverified: ${unverified.join(", ")}`
              : "Sign-up incomplete. Please try again.",
        );
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signUp, setActive, verificationCode]);

  const handleSubmit = useCallback(() => {
    if (pendingMfa) return handleVerifyMfa();
    if (pendingVerification) return handleVerifySignUp();
    if (isSignUp) return handleSignUp();
    return handleSignIn();
  }, [
    pendingMfa,
    pendingVerification,
    isSignUp,
    handleVerifyMfa,
    handleVerifySignUp,
    handleSignUp,
    handleSignIn,
  ]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    setPendingVerification(false);
    setPendingMfa(false);
    setVerificationCode("");
    setMfaCode("");
  }, []);

  const heading = pendingMfa
    ? "Device Verification"
    : pendingVerification
      ? "Verify Email"
      : isSignUp
        ? "Create your vault"
        : "Welcome back";

  const subtext = pendingMfa
    ? "A security code has been sent to your email."
    : pendingVerification
      ? `A 6-digit code has been sent to ${email}.`
      : isSignUp
        ? `Create your account to set up your secure ${APP_NAME} vault.`
        : `Log in to ${APP_NAME} to unlock your vault.`;

  const canSubmit = pendingMfa
    ? mfaCode.length === 6
    : pendingVerification
      ? verificationCode.length === 6
      : isSignUp
        ? !!(email && password && firstName && lastName)
        : !!(email && password);

  // Material You / Professional Styling Variables
  const inputClass =
    "w-full px-5 py-3.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-transparent focus:border-blue-500 dark:focus:border-[#282A2C] transition-colors text-[16px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#8E918F] outline-none rounded-2xl shadow-sm dark:shadow-none font-medium";
  const labelClass =
    "block text-[15px] font-bold text-gray-800 dark:text-white mb-2 pl-2 tracking-wide";

  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3.5 px-5 font-bold text-[17px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-2xl cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md active:scale-[0.98]";

  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3.5 px-5 font-semibold text-[16px] cursor-pointer bg-white hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-gray-800 dark:text-white border border-gray-200 dark:border-transparent rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm";

  return (
    <div className="grid min-h-screen pt-[72px] grid-cols-1 lg:grid-cols-2 bg-white dark:bg-black text-gray-900 dark:text-[#E2E2E2] selection:bg-blue-200 dark:selection:bg-[#A8C7FA] selection:text-blue-900 dark:selection:text-[#041E49] transition-colors duration-300">
      {/* LEFT PANEL: Branding & Benefits */}
      <div className="relative hidden lg:flex flex-col justify-between rounded-3xl border border-gray-200 dark:border-transparent shadow-xl dark:shadow-md shadow-blue-100/50 dark:shadow-blue-400/10 p-12 xl:p-16 bg-gray-50 dark:bg-[#101010] overflow-hidden my-4 ml-4 transition-colors duration-300">
        <div className="relative z-10 flex flex-col gap-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#E2E2E2] flex items-center flex-wrap gap-3">
              {APP_NAME}
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span className="text-[14px] font-bold px-4 py-1.5 text-blue-700 dark:text-[#A8C7FA] bg-blue-100 dark:bg-transparent border border-blue-200 dark:border-[#282A2C] rounded-full uppercase tracking-wider">
                Authentication
              </span>
            </span>
          </div>

          {/* Value Proposition */}
          <div className="mt-4">
            <h1 className="text-3xl xl:text-4xl font-extrabold mb-6 leading-tight max-w-[480px] text-gray-900 dark:text-white">
              Your passwords, sealed by encryption only you can open.
            </h1>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 mt-2 max-w-md -ml-2">
            <BenefitItem
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Zero-Knowledge Encryption"
              description="Your secrets are encrypted in your browser with AES-256. We store only ciphertext — even we can never read them."
            />
            <BenefitItem
              icon={<KeyRound className="w-6 h-6" />}
              title="One Master Password"
              description="Unlock everything with a single master password, backed by a 12-word recovery phrase that only you hold."
            />
            <BenefitItem
              icon={<Zap className="w-6 h-6" />}
              title="Built-in Generator"
              description="Create strong, unique passwords for every account in one click — no more reusing the same password."
            />
          </div>
        </div>

        {/* Dynamic Security Badge */}
        <div className="relative z-10 flex items-center gap-2 mt-auto pt-10">
          <div className="flex items-center gap-3 text-[15px] bg-yellow-400 dark:bg-yellow-500 border-2 border-black px-6 py-3 rounded-full shadow-md">
            <LockKeyhole className="w-5 h-5 text-black" />
            <span className="text-black font-bold tracking-wide">
              Secured infrastructure by
            </span>
            <div className="relative flex items-center justify-start w-[50px] h-[20px] overflow-hidden font-extrabold text-black">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={providers[index]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute left-0"
                >
                  {providers[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="flex flex-col justify-center items-center w-full px-6 py-12 lg:px-12 bg-white dark:bg-black transition-colors duration-300">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#E2E2E2] flex items-center gap-3">
              {APP_NAME}
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span className="text-[14px] font-bold px-4 py-1 text-blue-700 dark:text-[#A8C7FA] bg-blue-50 dark:bg-transparent border border-blue-200 dark:border-[#282A2C] rounded-full uppercase tracking-wider">
                Auth
              </span>
            </span>
          </div>

          {/* Header */}
          <motion.div layout className="mb-10 text-center sm:text-left">
            <motion.h2
              layout
              className="text-3xl font-extrabold text-gray-900 dark:text-[#E2E2E2] mb-3"
            >
              {heading}
            </motion.h2>
            <motion.p
              layout
              className="text-[16px] font-medium text-green-700 dark:text-green-400 leading-relaxed"
            >
              {subtext}
            </motion.p>
          </motion.div>

          {/* Error Banner */}
          <AnimatePresence>
            {authError && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start gap-3 shadow-sm"
              >
                <div className="mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-[15px] font-semibold text-red-800 dark:text-red-200 leading-snug">
                  {authError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form container */}
          <motion.div layout className="space-y-6">
            <AnimatePresence mode="wait">
              {pendingMfa || pendingVerification ? (
                <motion.div
                  key="otp-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="space-y-6"
                >
                  <div>
                    <label className={labelClass}>Security Code</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="000000"
                      value={pendingMfa ? mfaCode : verificationCode}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        if (pendingMfa) setMfaCode(val);
                        else setVerificationCode(val);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && canSubmit && handleSubmit()
                      }
                      className={`${inputClass} text-center text-4xl tracking-[0.4em] py-6 font-bold`}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !canSubmit}
                      className={primaryButtonClass}
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin w-5 h-5" />
                      ) : (
                        "Verify Code"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setPendingMfa(false);
                        setPendingVerification(false);
                        setVerificationCode("");
                        setMfaCode("");
                        setAuthError(null);
                      }}
                      className="w-full text-center text-[16px] font-bold text-gray-700 dark:text-black bg-gray-200 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-white py-3.5 rounded-2xl cursor-pointer transition-colors active:scale-[0.98]"
                    >
                      Cancel and go back
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="space-y-5"
                >
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-hidden"
                    >
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                          placeholder="Doe"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Master Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={
                          isSignUp ? "new-password" : "current-password"
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && canSubmit && handleSubmit()
                        }
                        className={`${inputClass} pr-14 ${!showPassword && password ? "tracking-[0.25em] text-lg font-bold" : ""}`}
                        placeholder={
                          !showPassword ? "••••••••" : "Your password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#8E918F] hover:text-gray-900 dark:hover:text-[#E2E2E2] hover:bg-gray-200 dark:hover:bg-[#282A2C] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    id="clerk-captcha"
                    data-cl-theme="dark"
                    data-cl-size="flexible"
                    className="pt-1"
                  />

                  <div className="pt-4 space-y-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !canSubmit}
                      className={primaryButtonClass}
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin w-5 h-5" />
                      ) : isSignUp ? (
                        "Create Secure Account"
                      ) : (
                        "Unlock Vault"
                      )}
                    </button>

                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                      </div>
                      <div className="relative px-4 bg-white dark:bg-black text-[14px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        or
                      </div>
                    </div>

                    <button
                      onClick={toggleMode}
                      className={secondaryButtonClass}
                    >
                      {isSignUp
                        ? "Log in to existing account"
                        : "Create a new account"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer Terms */}
          <motion.div
            layout
            className="mt-12 text-center text-[13px] font-medium text-gray-500 dark:text-[#8E918F] leading-relaxed px-4"
          >
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-gray-700 dark:text-[#C4C7C5] hover:text-black dark:hover:text-[#E2E2E2] transition-colors underline decoration-gray-300 dark:decoration-[#282A2C] hover:decoration-blue-400 dark:hover:decoration-[#A8C7FA] underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-gray-700 dark:text-[#C4C7C5] hover:text-black dark:hover:text-[#E2E2E2] transition-colors underline decoration-gray-300 dark:decoration-[#282A2C] hover:decoration-blue-400 dark:hover:decoration-[#A8C7FA] underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </motion.div>
        </div>
      </div>
    </div>
  );
}
