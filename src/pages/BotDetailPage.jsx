import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, Target, Clock, DollarSign, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import RealEquityCurve from '../components/charts/RealEquityCurve';
import DrawdownChart from '../components/charts/DrawdownChart';
import individualBotsData from '../data/individual_bots_data.json';

// Datos de ejemplo de bots (en producción vendrían de una API o base de datos)
const botsData = {
  'oro-long-stop-m10': {
    id: 'oro-long-stop-m10',
    name: 'ORO LONG STOP M10',
    symbol: 'XAUUSD',
    timeframe: 'M10',
    strategy: 'Long Stop',
    category: 'Commodities',
    price: 299,
    tier: 'Elite',
    metrics: {
      netProfit: 6230.2,
      totalTrades: 487,
      winningRate: 47.84,
      sharpeRatio: 1.12,
      maxDrawdown: 8.45,
      cagr: 28.46,
      factorK: 7.191,
      profitFactor: 1.89
    },
    description: 'Estrategia especializada en operaciones largas en oro con sistema de stop loss optimizado para timeframe M10.',
    features: [
      'Sistema de stop loss dinámico',
      'Optimizado para volatilidad del oro',
      'Backtesting de 7+ años',
      'Gestión de riesgo avanzada'
    ],
    benefits: [
      'Alto rendimiento en mercados alcistas',
      'Protección contra caídas bruscas',
      'Adaptable a diferentes condiciones de mercado',
      'Señales claras de entrada y salida'
    ],
    period: '2018-2025',
    reportFile: 'OROLONGSTOPM104.20.97.pdf'
  },
  'dax-m30-long-lmt': {
    id: 'dax-m30-long-lmt',
    name: 'DAX M30 LONG LMT Elite',
    symbol: 'DAX',
    timeframe: 'M30',
    strategy: 'Long Limit',
    category: 'Índices',
    price: 399,
    tier: 'Elite',
    metrics: {
      netProfit: 8500,
      totalTrades: 324,
      winningRate: 52.16,
      sharpeRatio: 1.35,
      maxDrawdown: 0.78,
      cagr: 31.2,
      factorK: 8.5,
      profitFactor: 2.1
    },
    description: 'Estrategia elite para DAX con órdenes límite optimizadas para capturar movimientos en timeframe M30.',
    features: [
      'Órdenes límite inteligentes',
      'Drawdown ultra bajo',
      'Optimizado para DAX',
      'Señales de alta precisión'
    ],
    benefits: [
      'Excelente ratio riesgo/beneficio',
      'Drawdown mínimo',
      'Consistencia en diferentes mercados',
      'Fácil implementación'
    ],
    period: '2018-2025',
    reportFile: 'DAXM30LONGLMT1367.26.82.pdf'
  },
  'ws30-long-mkt-m15': {
    id: 'ws30-long-mkt-m15',
    name: 'WS30 LONG MKT M15',
    symbol: 'US30',
    timeframe: 'M15',
    strategy: 'Long Market',
    category: 'Índices',
    price: 349,
    tier: 'Professional',
    metrics: {
      netProfit: 7200,
      totalTrades: 456,
      winningRate: 48.9,
      sharpeRatio: 1.56,
      maxDrawdown: 2.1,
      cagr: 26.8,
      factorK: 6.8,
      profitFactor: 1.95
    },
    description: 'Bot especializado en Dow Jones con ejecución a mercado para capturar tendencias en M15.',
    features: [
      'Ejecución a mercado rápida',
      'Análisis de tendencias',
      'Optimizado para US30',
      'Gestión automática de posiciones'
    ],
    benefits: [
      'Aprovecha tendencias fuertes',
      'Ejecución sin deslizamiento',
      'Ideal para cuentas institucionales',
      'Resultados consistentes'
    ],
    period: '2018-2025',
    reportFile: 'WS30LONGMKTM156.18.81.pdf'
  }
};

export default function BotDetailPage() {
  const { botId } = useParams();
  const bot = botsData[botId];

  if (!bot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bot no encontrado</h1>
          <Link to="/bots-individuales" className="text-blue-600 hover:text-blue-800">
            Volver a Bots Individuales
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadReport = () => {
    // En producción, esto descargaría el archivo PDF real
    const link = document.createElement('a');
    link.href = `/reports/bots/${bot.reportFile}`;
    link.download = bot.reportFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/bots-individuales" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Bots Individuales
        </Link>
        <span>/</span>
        <span className="text-gray-900">{bot.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
            <Badge variant={bot.tier === 'Elite' ? 'default' : 'secondary'} className="text-sm">
              {bot.tier}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{bot.symbol}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{bot.timeframe}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{bot.strategy}</span>
            </div>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed">{bot.description}</p>
        </div>

        <div className="lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-4">${bot.price}</div>
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  Comprar Ahora
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDownloadReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Métricas de Rendimiento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ${bot.metrics.netProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Net Profit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {bot.metrics.sharpeRatio}
            </div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {bot.metrics.cagr}%
            </div>
            <div className="text-sm text-gray-600">CAGR</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {bot.metrics.maxDrawdown}%
            </div>
            <div className="text-sm text-gray-600">Max Drawdown</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalladas */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Trading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Operaciones:</span>
              <span className="font-semibold">{bot.metrics.totalTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de Acierto:</span>
              <span className="font-semibold">{bot.metrics.winningRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Factor K:</span>
              <span className="font-semibold">{bot.metrics.factorK}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Factor:</span>
              <span className="font-semibold">{bot.metrics.profitFactor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Período de Backtesting:</span>
              <span className="font-semibold">{bot.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Características Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {bot.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Beneficios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Beneficios Clave</CardTitle>
          <CardDescription>
            Ventajas principales de utilizar este bot de trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {bot.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Rendimiento */}
      <div className="grid md:grid-cols-1 gap-6 mb-8">
        {/* Curva de Equity */}
        <Card>
          <CardHeader>
            <CardTitle>Curva de Equity</CardTitle>
            <CardDescription>
              Evolución del rendimiento durante el período de backtesting (2018-2024)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RealEquityCurve 
              portfolioId={bot.id.replace(/-/g, '_')} 
              dataSource="individual_bots"
              className="h-80"
            />
          </CardContent>
        </Card>

        {/* Gráfico de Drawdown */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Drawdown</CardTitle>
            <CardDescription>
              Períodos de pérdida y recuperación del bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrawdownChart 
              portfolioId={bot.id.replace(/-/g, '_')} 
              dataSource="individual_bots"
              className="h-64"
            />
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para empezar a operar con {bot.name}?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Únete a cientos de traders que ya están utilizando nuestros bots para maximizar sus ganancias 
            en los mercados financieros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Comprar por ${bot.price}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contacto">Contactar Asesor</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

