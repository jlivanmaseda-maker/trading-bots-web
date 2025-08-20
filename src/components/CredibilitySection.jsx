import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Shield, Award, TrendingUp, BarChart3 } from 'lucide-react'

const CredibilitySection = () => {
  // Datos simulados para el gráfico de equity curve (basados en los datos reales proporcionados)
  const equityData = [
    { year: '2014', value: 10000 },
    { year: '2015', value: 12500 },
    { year: '2016', value: 18200 },
    { year: '2017', value: 25800 },
    { year: '2018', value: 31200 },
    { year: '2019', value: 45500 },
    { year: '2020', value: 63300 },
    { year: '2021', value: 82700 },
    { year: '2022', value: 95600 },
    { year: '2023', value: 105900 },
    { year: '2024', value: 125400 },
    { year: '2025', value: 113241 }
  ]

  const badges = [
    {
      icon: Shield,
      title: "Crisis-Tested",
      subtitle: "Probado en 3 Crisis Mayores",
      description: "2008 Financial Crisis, COVID-19 Pandemic, 2022 Market Volatility",
      color: "green"
    },
    {
      icon: Award,
      title: "Factor K Elite 96",
      subtitle: "Métrica Avanzada de Rendimiento",
      description: "Puntuación superior a 7.0 en estrategias élite",
      color: "yellow"
    },
    {
      icon: TrendingUp,
      title: "Sharpe Ratio 12.98",
      subtitle: "Rendimiento Ajustado por Riesgo",
      description: "Muy superior al promedio del mercado (0.5-1.0)",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "10+ Años de Datos",
      subtitle: "Historial Verificable",
      description: "Más de 10,651 operaciones documentadas",
      color: "purple"
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-50 text-green-600 border-green-200",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200"
    }
    return colors[color] || colors.blue
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Respaldado por Datos Verificables
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestras estrategias han sido probadas a través de múltiples ciclos de mercado, 
            crisis económicas y diferentes regímenes de volatilidad.
          </p>
        </div>

        {/* Equity Curve Chart */}
        <div className="mb-16">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Curva de Equity - 10+ Años de Crecimiento Consistente
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Valor del Portafolio']}
                    labelFormatter={(label) => `Año ${label}`}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Crecimiento acumulado de $10,000 iniciales a $113,241 (1,032% de rendimiento total)
            </p>
          </div>
        </div>

        {/* Credibility Badges */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div 
                key={index}
                className={`p-6 rounded-xl border-2 ${getColorClasses(badge.color)} hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="flex items-center mb-4">
                  <Icon className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg">{badge.title}</h3>
                    <p className="text-sm opacity-80">{badge.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  {badge.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Performance Summary */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Resumen de Rendimiento</h3>
            <p className="text-blue-100">Métricas clave del portafolio élite</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">13.53%</p>
              <p className="text-blue-100">CAGR Promedio</p>
              <p className="text-sm text-blue-200 mt-1">Crecimiento Anual Compuesto</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">1.39</p>
              <p className="text-blue-100">Sharpe Ratio Promedio</p>
              <p className="text-sm text-blue-200 mt-1">Rendimiento Ajustado por Riesgo</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">4.83%</p>
              <p className="text-blue-100">Drawdown Máximo</p>
              <p className="text-sm text-blue-200 mt-1">Pérdida Máxima Histórica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CredibilitySection

