"use client";

import React, { JSX } from "react";
import {
  FiHome,
  FiFileText,
  FiGrid,
  FiActivity,
  FiShield,
  FiFile,
  FiGlobe,
  FiMessageSquare,
  FiBox,
  FiUser,
  FiGithub,
} from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaPenAlt, FaUser } from "react-icons/fa";
import { LuKeyRound, LuShieldCheck } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { GrContact } from "react-icons/gr";

// --- Types ---
type LinkItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// --- Data ---
const navigationLinks: LinkItem[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Docs", href: "/docs", icon: FiFileText },
  { name: "Integrations", href: "/integrations", icon: FiGrid },
  { name: "Logs", href: "/logs", icon: FiActivity },
  { name: "About", href: "/about-us", icon: FaUser },
];

const legalLinks: LinkItem[] = [
  { name: "Privacy Policy", href: "/privacy-policy", icon: FiShield },
  { name: "Terms & Conditions", href: "/terms", icon: FiFile },
];

const creatorLinks: LinkItem[] = [
  { name: "cloudkinshuk.in", href: "https://cloudkinshuk.in", icon: FiGlobe },
  {
    name: "Feedback.in",
    href: "https://clkfeedbacks.cloudkinshuk.in",
    icon: FiMessageSquare,
  },
  { name: "Kosha.in", href: "https://kosha.cloudkinshuk.in", icon: FiBox },
  {
    name: "Github",
    href: "https://github.com/kinshukjainn/opaque",
    icon: FiGithub,
  },
];

const socialLinks: LinkItem[] = [
  {
    name: "Github",
    href: "https://github.com/kinshukjainn/opaque",
    icon: FiGithub,
  },
  {
    name: "Twitter",
    href: "https://x.com/@realkinshuk004",
    icon: FaXTwitter,
  },
  {
    name: "Linkedin",
    href: "https://linkedin.com/kinshukjainn",
    icon: FaLinkedin,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/kinshukjainn",
    icon: FaInstagram,
  },
  {
    name: "Blogs",
    href: "https://cloudkinshuk.in/blogs",
    icon: FaPenAlt,
  },
];

export default function LightthemeFooter(): JSX.Element {
  return (
    <footer className="bg-[#F8F9FA] border-t border-gray-200 py-16 text-sm text-gray-600">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Changed to 5 columns to properly fit Brand + 4 link categories */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand & Security Badge */}
          <div className="flex flex-col items-start gap-5 lg:col-span-1">
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-2xl tracking-tight">
              <LuKeyRound className="h-7 w-7 text-[#1A73E8]" />
              <span>Opaque</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm">
              <LuShieldCheck className="h-4 w-4" />
              <span>End-to-End Encrypted</span>
            </div>

            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Secure, transparent, and built for privacy.
              <br />
              &copy; {new Date().getFullYear()} Opaque. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-gray-900 font-semibold tracking-wide">
              Platform
            </h3>
            <ul className="flex flex-col gap-3.5">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex w-fit items-center gap-2.5 transition-all duration-200 text-gray-600 hover:text-gray-900"
                  >
                    <link.icon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-[#1A73E8]" />
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-gray-900 font-semibold tracking-wide">Legal</h3>
            <ul className="flex flex-col gap-3.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex w-fit items-center gap-2.5 transition-all duration-200 text-gray-600 hover:text-gray-900"
                  >
                    <link.icon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-[#1A73E8]" />
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator Info */}
          <div className="flex flex-col gap-5">
            <h3 className="flex items-center gap-2 text-gray-900 font-semibold tracking-wide">
              <FiUser className="h-4 w-4 text-[#1A73E8]" />
              <span>@kinshuk jain</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {creatorLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-2.5 transition-all duration-200 text-gray-600 hover:text-gray-900"
                  >
                    <link.icon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-[#1A73E8]" />
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-5">
            <h3 className="flex items-center gap-2 text-gray-900 font-semibold tracking-wide">
              <GrContact className="h-4 w-4 text-[#1A73E8]" />
              <span>Social Links</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-2.5 transition-all duration-200 text-gray-600 hover:text-gray-900"
                  >
                    <link.icon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-[#1A73E8]" />
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
