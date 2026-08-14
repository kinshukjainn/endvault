"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloudDoneSharp } from "react-icons/io5";

import { useUser } from "@clerk/nextjs";
import {
  User,
  Menu,
  X,
  Users,
  BookOpen,
  GitBranch,
  Puzzle,
  Activity,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UserProfileDropdown from "./UserprofileDropdown";
import ThemeToggle from "./Themetoggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { isLoaded, isSignedIn } = useUser();

  const navItems = [
    { name: "About Creator", href: "/about-us", icon: Users },
    { name: "Documentation", href: "/docs", icon: BookOpen },
    { name: "Logs", href: "/git-track", icon: GitBranch },
    { name: "Integrations", href: "/integrations", icon: Puzzle },
    { name: "Checker", href: "/checker", icon: Activity },
  ];

  // Refined CTA block to look gorgeous in BOTH light and dark mode
  const ctaBlock =
    "group flex items-center gap-2 px-6 py-2 rounded-full bg-blue-50 dark:bg-[#141414] text-blue-700 dark:text-blue-200 border-2 border-blue-400 dark:border-blue-500 font-bold transition-all whitespace-nowrap shadow-sm transform hover:scale-[1.02] active:scale-95";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-[#282A2C] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto flex h-[72px] items-center justify-between px-4 md:px-6">
        {/* LEFT SECTION: Logo & Nav */}
        <div className="flex h-full flex-1 items-center overflow-hidden gap-2 md:gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-2 transition-colors shrink-0 z-10 outline-none"
          >
            <div className="p-2 bg-gray-100 dark:bg-[#121212] rounded-full border border-gray-200 dark:border-[#333] transition-colors duration-200">
              <Image
                src="/logo/logog.png"
                alt="Opaque Logo"
                width={238}
                height={229}
                className="w-6 h-auto sm:w-7 sm:h-auto object-contain shrink-0"
                priority
              />
            </div>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white whitespace-nowrap">
              Opaque
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 h-full overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative px-4 py-2 flex items-center gap-2 text-[15px] font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors z-10"
                >
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span>{item.name}</span>

                  {hoveredItem === item.name && (
                    <motion.div
                      layoutId="header-hover-pill"
                      className="absolute inset-0 border-2 rounded-full border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-transparent -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SECTION: Auth, Theme, and Mobile Toggle */}
        <div className="flex h-full items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Auth-aware (Desktop Only) */}
          <div className="hidden xl:flex items-center gap-3">
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <a href="https://kosha.cloudkinshuk.in" className={ctaBlock}>
                    <IoCloudDoneSharp className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Open Kosha</span>
                  </a>
                  <div className="flex items-center pl-2">
                    <UserProfileDropdown variant="desktop" />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/verify-regis"
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all bg-gray-100 dark:bg-[#1a1a1a] text-black dark:text-white border border-gray-200 dark:border-[#333] hover:bg-gray-200 dark:hover:bg-[#252525] active:scale-95 shadow-sm"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-[15px]">Sign In</span>
                  </Link>
                  <a href="https://kosha.cloudkinshuk.in" className={ctaBlock}>
                    <IoCloudDoneSharp className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Open Kosha</span>
                  </a>
                </>
              ))}
          </div>

          {/* Theme Toggle (Visible everywhere) */}
          <ThemeToggle />

          {/* MOBILE MENU TOGGLE */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full cursor-pointer bg-gray-100 border border-gray-200 text-black dark:bg-[#252525] dark:border-[#333] dark:text-white transition-colors flex-shrink-0 shadow-sm"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* MOBILE DROP DOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="xl:hidden overflow-hidden bg-white dark:bg-black rounded-b-[32px] border-b border-gray-200 dark:border-[#252525] absolute top-[72px] left-0 w-full z-40 shadow-xl dark:shadow-none"
          >
            <div className="flex flex-col p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* TILES GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#252525] rounded-[24px] px-1 py-3 transition-all active:scale-95"
                    >
                      <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-1" />
                      <span className="text-[14px] font-semibold text-black dark:text-white tracking-wide text-center">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-gray-200 dark:bg-[#282A2C] w-full my-5" />

              {/* AUTH & CTA SECTION */}
              {isLoaded &&
                (isSignedIn ? (
                  <div className="flex flex-col gap-4">
                    <div className="p-1 flex justify-center">
                      <UserProfileDropdown
                        variant="mobile"
                        onAction={() => setIsOpen(false)}
                      />
                    </div>
                    <a
                      href="https://kosha.cloudkinshuk.in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-3.5 bg-blue-600 dark:bg-blue-800 text-white text-[16px] font-bold rounded-full transition-transform active:scale-95 shadow-md"
                    >
                      <IoCloudDoneSharp className="w-5 h-5" />
                      <span>Open Kosha</span>
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/verify-regis"
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col items-center justify-center gap-1 p-3 text-[15px] font-bold text-black dark:text-white bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-[20px] transition-all active:scale-95 shadow-sm"
                    >
                      <User className="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
                      <span>Sign In</span>
                    </Link>
                    <a
                      href="https://kosha.cloudkinshuk.in"
                      className="flex flex-col items-center justify-center gap-1 p-3 text-[15px] font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-[20px] transition-all active:scale-95 shadow-sm"
                    >
                      <IoCloudDoneSharp className="w-5 h-5 mb-1" />
                      <span>Open Kosha</span>
                    </a>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
