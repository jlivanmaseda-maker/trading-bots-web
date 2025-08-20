import { Button } from '@/components/ui/button.jsx'
import { CheckCircle, TrendingUp, Shield, Award } from 'lucide-react'

const HeroSection = () => {
  return (
    <section id="inicio" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bots de Trading con{' '}
                <span className="text-blue-600">10+ Años</span>{' '}
                de Historial Probado
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Estrategias algorítmicas respaldadas por más de 10,651 operaciones ejecutadas 
                y datos de backtesting verificables. Resultados reales, no promesas.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">€394,853</p>
                  <p className="text-sm text-gray-600">Profit Neto Máximo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">7.35</p>
                  <p className="text-sm text-gray-600">Sharpe Ratio Elite</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.17%</p>
                  <p className="text-sm text-gray-600">Drawdown Mínimo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">36,325</p>
                  <p className="text-sm text-gray-600">Operaciones Ejecutadas</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Ver Resultados Completos
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                Descargar Reporte Gratuito
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Crisis-Tested (2008, COVID, 2022)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Factor K Elite 96</span>
              </div>
            </div>
          </div>

          {/* Right Column - Performance Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard en Tiempo Real
              </h3>
              <p className="text-gray-600">Portafolio Élite (2014-2025)</p>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Profit Total</p>
                  <p className="text-2xl font-bold text-green-600">$103,241.02</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Profit en Pips</p>
                  <p className="text-xl font-bold text-blue-600">1,183,058</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Winning Rate</p>
                  <p className="text-xl font-bold text-purple-600">51.83%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Return/DD Ratio</p>
                  <p className="text-xl font-bold text-yellow-600">76.04</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Factor K Élite</p>
                  <p className="text-xl font-bold text-indigo-600">7.191</p>
                </div>
              </div>

              {/* Live Status */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Estado: Activo y Operando</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

