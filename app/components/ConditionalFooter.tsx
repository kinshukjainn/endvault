"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer"; // The new light theme footer
import LightthemeFooter from "./LighthemeFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // 1. Hide the footer entirely on these specific routes
  if (
    pathname?.startsWith("/vault") ||
    pathname?.startsWith("/checker") ||
    pathname?.startsWith("/verify-regis")
  ) {
    return null;
  }

  // 2. Show the Light Theme Footer ONLY on the exact home page "/"
  if (pathname === "/") {
    return <LightthemeFooter />;
  }

  // 3. Show the Dark Theme Footer for all other remaining routes (e.g., /docs, /about-us)
  return <Footer />;
}
