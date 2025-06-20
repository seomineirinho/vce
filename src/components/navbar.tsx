"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2">
            <Bot
              className={`w-8 h-8 transition-colors ${
                scrolled ? "text-blue-600" : "text-white"
              }`}
            />
            <span
              className={`text-xl font-bold transition-colors ${
                scrolled ? "text-gray-800" : "text-white"
              }`}
            >
              AIChat
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className={`hidden sm:block font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles className="mr-2 w-4 h-4" />
              Começar
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
