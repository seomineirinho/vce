import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-bold text-gray-900">ChatBot IA</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Uma experiência de chat minimalista e inteligente para suas
              conversas com IA.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Termos
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0 text-sm">
            © {currentYear} ChatBot IA. Todos os direitos reservados.
          </div>

          <div className="text-gray-500 text-sm">
            Feito com ❤️ para conversas inteligentes
          </div>
        </div>
      </div>
    </footer>
  );
}
