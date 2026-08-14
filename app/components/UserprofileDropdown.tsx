"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

interface UserProfileDropdownProps {
  variant?: "desktop" | "mobile";
  onAction?: () => void;
}

export default function UserProfileDropdown({
  variant = "desktop",
  onAction,
}: UserProfileDropdownProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Light & Dark Mode Styled Menu Items ── */
  const menuItemClass =
    "group w-full flex items-center gap-3 py-3 px-3 text-[14px] font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-black transition-all duration-200 outline-none active:scale-[0.98] rounded-full cursor-pointer";

  const dangerMenuItemClass =
    "group w-full flex items-center gap-3 py-3 px-3 text-[14px] font-medium text-red-600 dark:text-white hover:bg-red-50 dark:hover:bg-red-600 transition-all duration-200 outline-none active:scale-[0.98] rounded-full cursor-pointer";

  /* ── Outside click (desktop) ── */
  useEffect(() => {
    if (variant !== "desktop") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  /* ── Esc to close ── */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!user) return null;

  const displayName =
    user.fullName || user.firstName || user.username || "Opaque User";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user.imageUrl;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleManage = () => {
    setIsOpen(false);
    onAction?.();
    openUserProfile();
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onAction?.();
    signOut();
  };

  /* ── Avatar ── */
  const renderAvatar = (size: number) => {
    return (
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={size}
            height={size}
            unoptimized
            className="object-cover rounded-full border border-gray-200 dark:border-[#282A2C] bg-gray-100 dark:bg-[#161923]"
            style={{ width: size, height: size }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="bg-gray-200 dark:bg-[#242836] border border-gray-300 dark:border-[#282A2C] text-gray-700 dark:text-white font-semibold flex items-center justify-center rounded-full"
            style={{
              width: size,
              height: size,
              fontSize: size < 32 ? 12 : 16,
            }}
          >
            {initials}
          </span>
        )}
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     MOBILE — Integrated seamlessly into the Header's Grid Tile Container
     ───────────────────────────────────────────── */
  if (variant === "mobile") {
    return (
      <div
        className="relative w-full bg-transparent antialiased"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 transition-colors duration-200 cursor-pointer outline-none active:scale-[0.98]"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(42)}
          <div className="min-w-0 flex-1 text-left flex flex-col justify-center">
            <p className="text-[15px] font-semibold text-black dark:text-white truncate">
              {displayName}
            </p>
            {email && (
              <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
                {email}
              </p>
            )}
          </div>
          <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full bg-gray-100 dark:bg-[#161923] border border-gray-200 dark:border-[#282A2C]">
            <FiChevronDown
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="h-px bg-gray-200 dark:bg-[#282A2C] w-full mb-2" />
          <div className="flex flex-col gap-1">
            <button onClick={handleManage} className={menuItemClass}>
              <FiSettings className="w-[18px] h-[18px] shrink-0 text-gray-600 dark:text-gray-400" />
              <span>Account Settings</span>
            </button>

            <button onClick={handleSignOut} className={dangerMenuItemClass}>
              <FiLogOut className="w-[18px] h-[18px] shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     DESKTOP — Floating Theme-Aware Panel
     ───────────────────────────────────────────── */
  return (
    <div className="relative antialiased" ref={dropdownRef}>
      {/* Pill Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none active:scale-95 border ${
          isOpen
            ? "bg-gray-200 dark:bg-[#141414] border-gray-300 dark:border-[#282A2C]"
            : "bg-gray-100 dark:bg-[#141414] hover:bg-gray-200 dark:hover:bg-[#202020] border-gray-200 dark:border-transparent"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(28)}
        <FiChevronDown
          className={`w-4 h-4 text-gray-600 dark:text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute right-0 top-[calc(100%+12px)] w-[300px] origin-top-right transition-all duration-200 ease-out z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="relative rounded-4xl bg-white dark:bg-[#141414] shadow-xl dark:shadow-2xl border border-gray-200 dark:border-[#282A2C] flex flex-col p-2 overflow-hidden">
          {/* User Info Header Card */}
          <div className="flex items-center gap-3 p-3 mb-2 rounded-4xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-transparent">
            {renderAvatar(48)}
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <p className="text-[15px] font-semibold text-black dark:text-white truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-[12px] text-blue-600 dark:text-[#ff9100] font-medium truncate mt-0.5">
                  {email}
                </p>
              )}
              {/* Active Status Badge */}
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-400 self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-black animate-pulse" />
                <span className="text-[12px] font-bold text-blue-800 dark:text-black tracking-wider">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-[#141414] w-full my-1" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-1 mt-1">
            <button onClick={handleManage} className={menuItemClass}>
              <FiSettings className="w-[18px] h-[18px] shrink-0 text-gray-600 dark:text-gray-400" />
              <span className="flex-1 text-left">Account Settings</span>
            </button>

            <button onClick={handleSignOut} className={dangerMenuItemClass}>
              <FiLogOut className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1 text-left">Sign out of this device</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
