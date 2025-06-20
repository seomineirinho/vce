import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { MessageSquare, Moon, Sun, History, Zap } from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Recursos Principais
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uma experiência de chat inteligente com foco na simplicidade e
              funcionalidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Interface Limpa",
                description: "Design minimalista focado na conversa",
              },
              {
                icon: <History className="w-6 h-6" />,
                title: "Histórico Persistente",
                description: "Suas conversas são salvas automaticamente",
              },
              {
                icon: <Sun className="w-6 h-6" />,
                title: "Tema Claro/Escuro",
                description: "Adapte a interface ao seu gosto",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Respostas Rápidas",
                description: "IA inteligente com indicador de digitação",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Como Funciona
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Três passos simples para começar sua conversa com a IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Faça Login
              </h3>
              <p className="text-gray-600 text-sm">
                Crie sua conta ou faça login para manter seu histórico
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Inicie a Conversa
              </h3>
              <p className="text-gray-600 text-sm">
                Digite sua mensagem e veja a IA responder em tempo real
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Continue de Onde Parou
              </h3>
              <p className="text-gray-600 text-sm">
                Suas conversas ficam salvas para você continuar depois
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
