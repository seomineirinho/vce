"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(() => import("./particle-background"), {
  ssr: false,
});

export default function Hero() {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <div className="relative overflow-hidden bg-transparent pt-32 pb-24 sm:pt-40 sm:pb-32">
      <ParticleBackground />
      
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="container mx-auto px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="flex justify-center mb-8"
          >
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg">
              <MessageCircle className="w-12 h-12 text-blue-600" />
            </div>
          </motion.div>

          <motion.h1
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Sua conversa com IA,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#a18cd1] to-[#fbc2eb]">
              elevada a outro nível
            </span>
          </motion.h1>
          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Experimente o futuro da comunicação. Nossa plataforma de chat com IA
            oferece respostas instantâneas, personalizadas e inteligentes.
          </motion.p>

          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Começar Agora (É Grátis)
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
