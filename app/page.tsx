"use client";

import { motion, Variants, Transition } from "framer-motion";
import {
  Shield,
  Code2,
  Globe,
  Zap,
  Unlock,
  Activity,
  Check,
} from "lucide-react";
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
        <div className="min-h-screen w-full bg-black text-[#E2E2E2] selection:bg-[#A8C7FA] selection:text-[#041E49] pb-20 md:pb-32">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-[50vh] min-h-[400px] md:h-[600px] bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(168,199,250,0.08),transparent)] pointer-events-none z-0" />

          <section className="relative pt-32 md:pt-40 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center text-center z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col items-center w-full"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-[#A8C7FA]">
                  <Image
                    src="/logo/logog.png"
                    alt="Opaque Logo"
                    width={238}
                    height={229}
                    className="w-15 h-auto sm:w-15 sm:h-auto object-contain shrink-0"
                    priority
                  />
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 px-2"
              >
                Welcome back,{" "}
                <span className="text-blue-500 font-mono font-normal">
                  {user?.firstName || "Secure User"}
                </span>
                .
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg text-gray-200 max-w-xl mb-10 px-4"
              >
                Your encrypted session is ready. Your master key remains
                completely isolated in this browser instance.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="w-max max-w-sm mb-12 md:mb-16 px-4"
              >
                <Link
                  href="/vault"
                  className="group w-full py-2 md:py-2 px-4 flex items-center justify-center gap-3 rounded-full bg-blue-400 text-black font-bold"
                >
                  <Unlock className="w-5 h-5 text-black" />
                  Open your Vault
                </Link>
              </motion.div>

              {/* Status Cards */}
              <motion.div
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-2 sm:px-0"
              >
                <motion.div
                  variants={fadeUp}
                  className="p-4 md:p-5 rounded-full bg-[#121212] hover:bg-[#1E1F20] transition-colors flex items-center gap-4 text-left"
                >
                  <div className="p-3 md:p-3.5 rounded-full bg-blue-800 text-[#C4EDD0]">
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-medium text-white">
                      System Status
                    </h3>
                    <p className="text-[12px] md:text-[13px] text-[#8E918F] mt-0.5">
                      All systems operational
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  className="p-4 md:p-5 rounded-full bg-[#121212] hover:bg-[#1E1F20] transition-colors flex items-center gap-4 text-left"
                >
                  <div className="p-3 md:p-3.5 rounded-full bg-blue-800 text-[#C4EDD0]">
                    <Code2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-medium text-white">
                      Encryption Standard
                    </h3>
                    <p className="text-[12px] md:text-[13px] text-[#8E918F] mt-0.5">
                      AES-256-GCM enforced
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </Show>

      {/* ========================================== */}
      {/* LOGGED OUT VIEW: Light Theme Marketing Page  */}
      {/* ========================================== */}
      <Show when="signed-out">
        <div className="min-h-screen w-full bg-white text-gray-900 selection:bg-[#E8F0FE] selection:text-[#1A73E8]">
          {/* 1. HERO SECTION (Google-Drive Inspired Layout) */}
          <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
            {/* Subtle light background blur blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
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
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6"
                  >
                    <Shield className="w-4 h-4" /> Zero-knowledge architecture
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#1F1F1F] mb-6 leading-[1.05]"
                  >
                    Secure your digital life, effortlessly.
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="text-lg sm:text-xl text-[#444746] mb-10 leading-relaxed"
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
                      href="/sign-up"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center shadow-sm"
                    >
                      Get started for free
                    </Link>
                    <Link
                      href="#features"
                      className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#747775] hover:bg-gray-50 text-[#1A73E8] text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center"
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
            className="bg-[#F8F9FA] py-24 border-y border-gray-100"
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
                    className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4"
                  >
                    Everything you need. <br /> Nothing complicated.
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    className="text-lg text-[#444746]"
                  >
                    We focus on doing one thing perfectly: keeping your most
                    sensitive information locked away and easily accessible only
                    to you.
                  </motion.p>
                </div>

                <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
                  <motion.div
                    variants={fadeUp}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-6">
                      <Zap className="w-7 h-7 text-[#1A73E8]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1F1F1F] mb-3">
                      Effortless Logins
                    </h3>
                    <p className="text-[#444746] leading-relaxed">
                      Never click &quot;forgot password&quot; again. Save your
                      credentials once and log in with a single click across all
                      your favorite sites.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-6">
                      <Shield className="w-7 h-7 text-[#1A73E8]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1F1F1F] mb-3">
                      Bulletproof Privacy
                    </h3>
                    <p className="text-[#444746] leading-relaxed">
                      Your data is encrypted before it ever leaves your device.
                      If our servers are ever breached, hackers get absolutely
                      nothing.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-6">
                      <Globe className="w-7 h-7 text-[#1A73E8]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1F1F1F] mb-3">
                      Access Anywhere
                    </h3>
                    <p className="text-[#444746] leading-relaxed">
                      Your vault syncs securely to the cloud. Access your
                      passwords instantly from your phone, laptop, or tablet.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. BOTTOM CALL TO ACTION */}
          <section className="bg-white py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl font-medium text-[#1F1F1F] mb-6"
                >
                  Ready to take back your privacy?
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-xl text-[#444746] mb-10 max-w-2xl mx-auto"
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
                    href="/sign-up"
                    className="px-8 py-4 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-lg font-medium rounded-full transition-colors shadow-sm transform hover:-translate-y-0.5"
                  >
                    Create your free account
                  </Link>

                  <p className="flex items-center justify-center gap-6 text-sm text-[#5F6368] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-green-600" /> No credit
                      card required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-green-600" /> End-to-end
                      encrypted
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
