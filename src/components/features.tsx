"use client";

import { motion } from "framer-motion";
import { Bot, BrainCircuit, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Conversas Inteligentes",
    description:
      "Nossa IA entende o contexto e responde de forma natural e precisa, tornando cada interação mais humana.",
    icon: Bot,
  },
  {
    name: "Aprendizado Contínuo",
    description:
      "A cada conversa, nosso sistema aprende e se aprimora, oferecendo respostas cada vez melhores e mais personalizadas.",
    icon: BrainCircuit,
  },
  {
    name: "Segurança e Privacidade",
    description:
      "Seus dados são protegidos com criptografia de ponta. Converse com tranquilidade, sabendo que sua privacidade é nossa prioridade.",
    icon: ShieldCheck,
  },
];

const FADE_IN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
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
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="text-base font-semibold leading-7 text-blue-600"
          >
            Tudo que você precisa
          </motion.h2>
          <motion.p
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          >
            Funcionalidades Poderosas
          </motion.p>
          <motion.p
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Nossa plataforma foi desenhada para ser intuitiva, poderosa e
            segura. Descubra como podemos transformar sua comunicação.
          </motion.p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="flex flex-col p-8 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-10 w-10 flex-none text-blue-600 bg-blue-50 p-2 rounded-lg"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  );
} 