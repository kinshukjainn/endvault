"use client";

import { motion, Variants, Transition } from "framer-motion";
import { Shield, Globe, Zap, Unlock, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Show, useUser } from "@clerk/nextjs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
  const { user } = useUser();

  const springTransition: Transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: springTransition },
  };

  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* ========================================== */}
      {/* LOGGED IN VIEW: The Technical Dark Console   */}
      {/* ========================================== */}
      <Show when="signed-in">
        <div className="min-h-screen w-full dark:bg-black bg-white  text-[#E2E2E2] selection:bg-[#A8C7FA] selection:text-[#041E49] flex items-center justify-center overflow-hidden relative">
          {/* Enhanced Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[50vh] bg-blue-300 dark:bg-zinc-800 blur-[120px] rounded-full pointer-events-none z-0" />

          <section className="relative z-10 px-4 sm:px-6 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col items-center w-full"
            >
              {/* Logo with Backlight */}
              <motion.div variants={fadeUp} className="mb-8 relative">
                <div className="absolute inset-0 dark:bg-slate-900/20 bg-blue-800 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <Image
                    src="/logo/logog.png"
                    alt="Opaque Logo"
                    width={238}
                    height={229}
                    className="w-full h-full object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </motion.div>

              {/* Enhanced Typography */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight dark:text-white text-black mb-5 px-2"
              >
                Welcome back, <br className="sm:hidden" />
                <span className="dark:bg-gradient-to-r dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent font-extrabold pb-1">
                  {user?.firstName || "Secure User"}
                </span>
                .
              </motion.h1>

              {/* Subtitle for UX context */}
              <motion.p
                variants={fadeUp}
                className="dark:text-white text-black text-lg sm:text-xl mb-12 max-w-lg mx-auto leading-relaxed"
              >
                Your end-to-end encrypted vault is secured and ready. Access
                your credentials safely.
              </motion.p>

              {/* Premium Glass Button */}
              <motion.div
                variants={fadeUp}
                className="w-full flex justify-center px-4"
              >
                <Link
                  href="/vault"
                  className="group relative flex items-center justify-center gap-4 px-8 py-4 md:py-5 w-full max-w-sm bg-black hover:bg-black hover:border hover:border-black hover:border-blue-800
                  dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border dark:hover:border-white/10 dark:hover:border-blue-500/50
                  rounded-full text-white text-[1.15rem] font-medium backdrop-blur-xs transition-all duration-300  overflow-hidden"
                >
                  {/* Sliding Shine Effect */}
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12 z-0" />

                  <Unlock className="relative z-10 w-6 h-6 text-blue-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <span className="relative z-10">Open your Vault</span>
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </Show>

      {/* ========================================== */}
      {/* LOGGED OUT VIEW: Light Theme Marketing Page  */}
      {/* ========================================== */}
      <Show when="signed-out">
        <div className="min-h-screen w-full dark:bg-black bg-white text-black dark:text-gray-100 dakr:selection:bg-[#E8F0FE] dark:selection:text-[#1A73E8]">
          {/* 1. HERO SECTION (Google-Drive Inspired Layout) */}
          <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
            {/* Subtle light background blur blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] dark:bg-blue-800 bg-black rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Left Column: Text & Actions */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="max-w-xl"
                >
                  <motion.div
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full dark:bg-blue-800  dark:text-blue-100 bg-black text-white text-sm font-medium mb-6"
                  >
                    <Shield className="w-4 h-4" /> Zero-knowledge architecture
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight dark:text-zinc-200 text-zinc-900 mb-6 leading-[1.05]"
                  >
                    Secure your digital life, effortlessly.
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="text-lg sm:text-xl dark:text-zinc-300 text-zinc-900 mb-10 leading-relaxed"
                  >
                    Opaque is a beautifully simple password vault that keeps
                    your credentials safe. We can&apos;t see your data, and
                    neither can anyone else.
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row items-center gap-4"
                  >
                    <Link
                      href="/verify-regis"
                      className="w-full sm:w-auto px-8 py-3.5 dark:bg-blue-800 dark:text-white bg-blue-400 text-black text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center shadow-sm"
                    >
                      Get started for free
                    </Link>
                    <Link
                      href="/docs"
                      className="w-full sm:w-auto px-8 py-3.5 dark:bg-[#141414] dark:text-zinc-300 bg-gray-300 text-black border-gray-500 border text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center"
                    >
                      Learn how it works
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Right Column: Lottie Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, ...springTransition }}
                >
                  <div className="w-full relative flex items-center justify-center lg:h-[550px]">
                    <DotLottieReact
                      src="https://lottie.host/2a2ab846-57b8-4336-a58a-43f0997eab03/rboX8mEeV3.lottie"
                      loop
                      autoplay
                      className="w-full max-w-[700px] object-contain lg:scale-110 drop-shadow-sm"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 2. SIMPLE BENEFITS (Light Theme) */}
          <section
            id="features"
            className="dark:bg-[#141414] bg-blue-100  py-24 "
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <motion.h2
                    variants={fadeUp}
                    className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4"
                  >
                    Everything you need. <br /> Nothing complicated.
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    className="text-lg text-zinc-900 dark:text-zinc-300"
                  >
                    We focus on doing one thing perfectly: keeping your most
                    sensitive information locked away and easily accessible only
                    to you.
                  </motion.p>
                </div>

                <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
                  <motion.div
                    variants={fadeUp}
                    className="bg-[#ff9100] p-8 rounded-3xl shadow-sm  hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F1F1F] mb-3">
                      Effortless Logins
                    </h3>
                    <p className="text-black leading-relaxed">
                      Never click &quot;forgot password&quot; again. Save your
                      credentials once and log in with a single click across all
                      your favorite sites.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="bg-blue-400 p-8 rounded-3xl shadow-sm  hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center mb-6">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Bulletproof Privacy
                    </h3>
                    <p className="text-black leading-relaxed">
                      Your data is encrypted before it ever leaves your device.
                      If our servers are ever breached, hackers get absolutely
                      nothing.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="bg-green-400 p-8 rounded-3xl shadow-sm  hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      Access Anywhere
                    </h3>
                    <p className="text-black leading-relaxed">
                      Your vault syncs securely to the cloud. Access your
                      passwords instantly from your phone, laptop, or tablet.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. BOTTOM CALL TO ACTION */}
          <section className="dark:bg-gradient-to-br dark:from-[#1e1e1e] dark:via-zinc-950 dark:to-blue-950 bg-gradient-to-br from-blue-100 via-zinc-200 to-blue-300 rounded-b-2xl rounded-t-3xl mt-2 mr-2 ml-2 mb-2 border border-blue-800 dark:border dark:border-[#444444] shadow-md shadow-blue-400  py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl font-bold dark:text-white text-black mb-6"
                >
                  Ready to take back your privacy?
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-xl dark:text-zinc-300 text-zinc-800 mb-10 max-w-2xl mx-auto"
                >
                  Join users who have switched to a faster, safer, and
                  completely private credential manager. Setup takes less than a
                  minute.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="flex flex-col items-center justify-center space-y-6"
                >
                  <Link
                    href="/verify-regis"
                    className="px-8 py-4 bg-blue-400  text-black dark:bg-blue-800 dark:text-white text-lg font-medium rounded-full transition-colors transform hover:-translate-y-0.5"
                  >
                    Create your free account
                  </Link>

                  <p className="flex items-center justify-center gap-6 text-sm dark:text-white text-black font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 dark:text-white text-black" />{" "}
                      No credit card required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 dark:text-white text-black" />{" "}
                      End-to-end encrypted
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </Show>
    </main>
  );
}
