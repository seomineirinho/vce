"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Como funciona a IA?",
    answer:
      "Nossa IA utiliza modelos de linguagem de última geração para entender e gerar texto de forma natural. Ela foi treinada com uma vasta gama de dados para garantir respostas coerentes e relevantes para diversos contextos.",
  },
  {
    question: "É seguro usar a plataforma?",
    answer:
      "Sim. A segurança é nossa maior prioridade. Utilizamos criptografia de ponta para todas as comunicações e dados armazenados. Suas informações estão seguras conosco.",
  },
  {
    question: "Posso integrar com outras ferramentas?",
    answer:
      "Atualmente, estamos desenvolvendo integrações com as principais ferramentas do mercado. Fique de olho em nossas atualizações para saber mais sobre as novas integrações disponíveis.",
  },
  {
    question: "Qual é o custo para usar a plataforma?",
    answer:
      "Oferecemos um plano gratuito para que você possa experimentar as funcionalidades básicas. Para recursos avançados e maior volume de uso, temos planos pagos que se adaptam às suas necessidades. Confira nossa página de preços para mais detalhes.",
  },
];

const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

export default function FAQ() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
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
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2 variants={FADE_IN_ANIMATION_VARIANTS} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Perguntas Frequentes
          </motion.h2>
          <motion.p variants={FADE_IN_ANIMATION_VARIANTS} className="text-lg text-gray-600">
            Tem alguma dúvida? Encontre as respostas aqui.
          </motion.p>
        </div>

        <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="mt-12 max-w-3xl mx-auto">
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index + 1}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <Accordion.Header className="w-full">
                  <Accordion.Trigger className="flex justify-between items-center w-full p-6 text-left text-lg font-medium text-gray-900 group">
                    {faq.question}
                    <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="p-6 pt-0 text-gray-700">
                  {faq.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
       </motion.div>
    </div>
  );
} 