import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

      <div className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Converse com uma{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                IA Inteligente
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Uma experiência de chat minimalista e intuitiva. Suas conversas
              são salvas automaticamente para que você possa continuar de onde
              parou.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Começar Conversa
              </Link>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <span>
                Interface limpa • Histórico persistente • Tema claro/escuro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
