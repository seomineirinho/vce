import { Github, Twitter, Bot } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Bot className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">AIChat</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-gray-900">
              <Twitter className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900">
              <Github className="w-6 h-6" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AIChat. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
