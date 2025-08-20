import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X, TrendingUp } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Trading Bots Elite
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Inicio
            </a>
            <a href="/portafolios" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Portafolios
            </a>
            <a href="/bots-individuales" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Bots Individuales
            </a>
            <a href="/resultados" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Resultados
            </a>
            <a href="/contacto" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Contacto
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Ver Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Inicio
              </a>
              <a href="#portafolios" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Portafolios
              </a>
              <a href="#bots" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Bots Individuales
              </a>
              <a href="#resultados" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Resultados
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Contacto
              </a>
              <div className="px-3 py-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

