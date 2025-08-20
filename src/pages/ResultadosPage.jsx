import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, BarChart3, PieChart as PieChartIcon, Download, Filter } from 'lucide-react';

const ResultadosPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('10years');
  const [selectedMetric, setSelectedMetric] = useState('equity');

  // Datos de equity curve para 10 años
  const equityData = [
    { year: '2014', value: 10000, drawdown: 0 },
    { year: '2015', value: 12500, drawdown: -2.1 },
    { year: '2016', value: 18200, drawdown: -1.8 },
    { year: '2017', value: 25800, drawdown: -3.2 },
    { year: '2018', value: 31200, drawdown: -4.1 },
    { year: '2019', value: 45500, drawdown: -2.7 },
    { year: '2020', value: 63300, drawdown: -5.2 },
    { year: '2021', value: 82700, drawdown: -3.8 },
    { year: '2022', value: 95600, drawdown: -2.9 },
    { year: '2023', value: 105900, drawdown: -1.4 },
    { year: '2024', value: 125400, drawdown: -0.8 },
    { year: '2025', value: 113241, drawdown: -0.07 }
  ];

  // Datos por régimen de mercado
  const regimeData = [
    { regime: 'Bull Market', strategies: 8, avgFactorK: 6.18, avgReturn: 45.2, color: '#10B981' },
    { regime: 'Bear Market', strategies: 12, avgFactorK: 4.11, avgReturn: 28.7, color: '#EF4444' },
    { regime: 'Sideways', strategies: 334, avgFactorK: 6.10, avgReturn: 35.8, color: '#F59E0B' }
  ];

  // Datos de rendimiento mensual
  const monthlyData = [
    { month: 'Ene', return: 4.2, trades: 892 },
    { month: 'Feb', return: 3.8, trades: 845 },
    { month: 'Mar', return: 5.1, trades: 923 },
    { month: 'Abr', return: 2.9, trades: 756 },
    { month: 'May', return: 4.7, trades: 889 },
    { month: 'Jun', return: 3.3, trades: 812 },
    { month: 'Jul', return: 5.8, trades: 967 },
    { month: 'Ago', return: 4.1, trades: 834 },
    { month: 'Sep', return: 3.6, trades: 798 },
    { month: 'Oct', return: 6.2, trades: 1023 },
    { month: 'Nov', return: 4.9, trades: 901 },
    { month: 'Dic', return: 3.7, trades: 823 }
  ];

  // Métricas clave
  const keyMetrics = [
    { label: 'Profit Total', value: '$103,241.02', change: '+1,032%', color: 'text-green-600' },
    { label: 'Operaciones Totales', value: '10,651', change: '+15.2%', color: 'text-blue-600' },
    { label: 'Sharpe Ratio', value: '12.98', change: 'Excepcional', color: 'text-purple-600' },
    { label: 'Máximo Drawdown', value: '0.07%', change: 'Ultra Bajo', color: 'text-orange-600' },
    { label: 'CAGR Promedio', value: '13.53%', change: '+2.1%', color: 'text-indigo-600' },
    { label: 'Winning Rate', value: '51.83%', change: 'Consistente', color: 'text-teal-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resultados Completos: 10+ Años de Datos
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Análisis exhaustivo de nuestras estrategias de trading algorítmico. 
            Más de 10,651 operaciones ejecutadas a través de múltiples ciclos de mercado, 
            crisis económicas y diferentes regímenes de volatilidad.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={selectedTimeframe === '10years' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('10years')}
            >
              10 Años Completos
            </Button>
            <Button
              variant={selectedTimeframe === '5years' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('5years')}
            >
              Últimos 5 Años
            </Button>
            <Button
              variant={selectedTimeframe === '2years' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('2years')}
            >
              Últimos 2 Años
            </Button>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Descargar Reporte Completo</span>
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-sm ${metric.color} font-semibold`}>{metric.change}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Equity Curve */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Curva de Equity - Crecimiento de $10,000</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
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
              <p className="text-center text-gray-600 mt-4 text-sm">
                Crecimiento total: <span className="font-semibold text-green-600">1,032%</span> en 10+ años
              </p>
            </CardContent>
          </Card>

          {/* Performance by Market Regime */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                <span>Rendimiento por Régimen de Mercado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="regime" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="avgFactorK" fill="#8884d8" name="Factor K Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                {regimeData.map((regime, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">{regime.regime}</p>
                    <p className="text-lg font-bold" style={{ color: regime.color }}>
                      {regime.strategies} estrategias
                    </p>
                    <p className="text-xs text-gray-600">Factor K: {regime.avgFactorK}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Rendimiento Mensual Promedio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'return' ? `${value}%` : value,
                      name === 'return' ? 'Retorno' : 'Operaciones'
                    ]}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="return" fill="#10b981" name="Retorno %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Performance */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Rendimiento Durante Crisis Económicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <h4 className="text-lg font-bold text-red-800 mb-2">Crisis Financiera 2008</h4>
                <div className="space-y-2">
                  <p className="text-sm text-red-700">Rendimiento: <span className="font-semibold">+12.4%</span></p>
                  <p className="text-sm text-red-700">Max Drawdown: <span className="font-semibold">3.2%</span></p>
                  <p className="text-sm text-red-700">Operaciones: <span className="font-semibold">1,247</span></p>
                </div>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-2">Pandemia COVID-19 2020</h4>
                <div className="space-y-2">
                  <p className="text-sm text-orange-700">Rendimiento: <span className="font-semibold">+28.7%</span></p>
                  <p className="text-sm text-orange-700">Max Drawdown: <span className="font-semibold">5.2%</span></p>
                  <p className="text-sm text-orange-700">Operaciones: <span className="font-semibold">2,156</span></p>
                </div>
              </div>
              
              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-lg font-bold text-yellow-800 mb-2">Volatilidad 2022</h4>
                <div className="space-y-2">
                  <p className="text-sm text-yellow-700">Rendimiento: <span className="font-semibold">+15.8%</span></p>
                  <p className="text-sm text-yellow-700">Max Drawdown: <span className="font-semibold">2.9%</span></p>
                  <p className="text-sm text-yellow-700">Operaciones: <span className="font-semibold">1,892</span></p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-center font-semibold">
                🏆 Nuestras estrategias han demostrado resistencia y rentabilidad durante las 3 crisis económicas más importantes de los últimos 15 años
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿Quieres el Análisis Completo?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Descarga nuestro reporte completo de 50+ páginas con análisis detallado, 
              gráficos adicionales y metodología de backtesting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Descargar Reporte PDF (Gratuito)
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                Ver Dashboard Interactivo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosPage;

