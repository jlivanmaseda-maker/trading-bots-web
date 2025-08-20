import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, Target, Users, DollarSign, BarChart3, Shield, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';

// Datos de ejemplo de portafolios (en producción vendrían de una API o base de datos)
const portfoliosData = {
  'factor-k-elite-96': {
    id: 'factor-k-elite-96',
    name: 'Factor K Elite 9.6',
    description: 'Portafolio premium con las mejores estrategias optimizadas para máximo rendimiento y mínimo riesgo.',
    category: 'Elite',
    price: 1299,
    tier: 'Premium',
    totalBots: 18,
    metrics: {
      netProfit: 394853.28,
      totalTrades: 36247,
      winningRate: 58.7,
      sharpeRatio: 12.98,
      maxDrawdown: 1.17,
      cagr: 45.2,
      factorKElite: 9.6,
      profitFactor: 2.85,
      calmarRatio: 38.6
    },
    composition: [
      { symbol: 'XAUUSD', percentage: 25, bots: 4 },
      { symbol: 'EURUSD', percentage: 20, bots: 3 },
      { symbol: 'GBPUSD', percentage: 15, bots: 3 },
      { symbol: 'NASDAQ', percentage: 20, bots: 4 },
      { symbol: 'DAX', percentage: 10, bots: 2 },
      { symbol: 'US30', percentage: 10, bots: 2 }
    ],
    features: [
      'Diversificación automática entre múltiples mercados',
      'Rebalanceo dinámico de posiciones',
      'Gestión de riesgo avanzada con correlaciones',
      'Optimización continua de parámetros',
      'Monitoreo 24/7 de condiciones de mercado',
      'Alertas automáticas de rendimiento'
    ],
    benefits: [
      'Máxima diversificación de riesgo',
      'Rendimiento superior al mercado',
      'Drawdown ultra bajo',
      'Gestión profesional automatizada',
      'Acceso a estrategias institucionales',
      'Soporte técnico premium'
    ],
    period: '2015-2025',
    reportFile: 'FactorKElite96Portfolio.pdf',
    regimes: {
      trending: { performance: 52.3, trades: 15420 },
      ranging: { performance: 38.9, trades: 12850 },
      volatile: { performance: 41.7, trades: 7977 }
    }
  },
  'multi-asset-balanced': {
    id: 'multi-asset-balanced',
    name: 'Multi-Asset Balanced',
    description: 'Portafolio equilibrado que combina forex, índices y commodities para un crecimiento estable.',
    category: 'Balanced',
    price: 899,
    tier: 'Professional',
    totalBots: 12,
    metrics: {
      netProfit: 245680.15,
      totalTrades: 28456,
      winningRate: 55.2,
      sharpeRatio: 8.45,
      maxDrawdown: 2.34,
      cagr: 32.8,
      factorKElite: 7.2,
      profitFactor: 2.15,
      calmarRatio: 14.0
    },
    composition: [
      { symbol: 'FOREX', percentage: 50, bots: 6 },
      { symbol: 'INDICES', percentage: 30, bots: 4 },
      { symbol: 'COMMODITIES', percentage: 20, bots: 2 }
    ],
    features: [
      'Balance óptimo entre riesgo y rendimiento',
      'Diversificación entre clases de activos',
      'Estrategias complementarias',
      'Gestión de correlaciones',
      'Rebalanceo automático',
      'Análisis de volatilidad'
    ],
    benefits: [
      'Crecimiento consistente',
      'Menor volatilidad',
      'Protección en diferentes mercados',
      'Fácil gestión',
      'Resultados predecibles',
      'Ideal para principiantes'
    ],
    period: '2016-2025',
    reportFile: 'portfolio4.pdf',
    regimes: {
      trending: { performance: 38.5, trades: 12200 },
      ranging: { performance: 42.1, trades: 10850 },
      volatile: { performance: 28.9, trades: 5406 }
    }
  }
};

export default function PortfolioDetailPage() {
  const { portfolioId } = useParams();
  const portfolio = portfoliosData[portfolioId];

  if (!portfolio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portafolio no encontrado</h1>
          <Link to="/portafolios" className="text-blue-600 hover:text-blue-800">
            Volver a Portafolios
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadReport = () => {
    // En producción, esto descargaría el archivo PDF real
    const link = document.createElement('a');
    link.href = `/reports/portfolios/${portfolio.reportFile}`;
    link.download = portfolio.reportFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/portafolios" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Portafolios
        </Link>
        <span>/</span>
        <span className="text-gray-900">{portfolio.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{portfolio.name}</h1>
            <Badge variant={portfolio.tier === 'Premium' ? 'default' : 'secondary'} className="text-sm">
              {portfolio.tier}
            </Badge>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{portfolio.totalBots} Bots</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Factor K Elite: {portfolio.metrics.factorKElite}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{portfolio.category}</span>
            </div>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed">{portfolio.description}</p>
        </div>

        <div className="lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Precio del Portafolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">${portfolio.price}</div>
              <div className="text-sm text-gray-600 mb-4">Acceso completo a {portfolio.totalBots} bots</div>
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  Adquirir Portafolio
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

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ${portfolio.metrics.netProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Net Profit Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {portfolio.metrics.sharpeRatio}
            </div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {portfolio.metrics.cagr}%
            </div>
            <div className="text-sm text-gray-600">CAGR</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {portfolio.metrics.maxDrawdown}%
            </div>
            <div className="text-sm text-gray-600">Max Drawdown</div>
          </CardContent>
        </Card>
      </div>

      {/* Composición del Portafolio */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Composición del Portafolio
          </CardTitle>
          <CardDescription>
            Distribución de activos y estrategias en el portafolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.composition.map((asset, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{asset.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {asset.bots} bots
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{asset.percentage}%</span>
                </div>
                <Progress value={asset.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalladas */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Operaciones:</span>
              <span className="font-semibold">{portfolio.metrics.totalTrades.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de Acierto:</span>
              <span className="font-semibold">{portfolio.metrics.winningRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Factor K Elite:</span>
              <span className="font-semibold">{portfolio.metrics.factorKElite}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Factor:</span>
              <span className="font-semibold">{portfolio.metrics.profitFactor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calmar Ratio:</span>
              <span className="font-semibold">{portfolio.metrics.calmarRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Período de Backtesting:</span>
              <span className="font-semibold">{portfolio.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Régimen de Mercado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mercado Tendencial:</span>
                <span className="font-semibold text-green-600">+{portfolio.regimes.trending.performance}%</span>
              </div>
              <div className="text-xs text-gray-500">
                {portfolio.regimes.trending.trades.toLocaleString()} operaciones
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mercado Lateral:</span>
                <span className="font-semibold text-blue-600">+{portfolio.regimes.ranging.performance}%</span>
              </div>
              <div className="text-xs text-gray-500">
                {portfolio.regimes.ranging.trades.toLocaleString()} operaciones
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mercado Volátil:</span>
                <span className="font-semibold text-purple-600">+{portfolio.regimes.volatile.performance}%</span>
              </div>
              <div className="text-xs text-gray-500">
                {portfolio.regimes.volatile.trades.toLocaleString()} operaciones
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Características y Beneficios */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Características Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {portfolio.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficios Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {portfolio.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Rendimiento (Placeholder) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Evolución del Portafolio</CardTitle>
          <CardDescription>
            Curva de equity y drawdown durante el período de backtesting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Gráficos de Rendimiento</p>
              <p className="text-sm">Curva de equity, drawdown y análisis de correlaciones</p>
              <p className="text-xs mt-2">(Se implementará con datos reales de los PDFs)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Invierte en el {portfolio.name}
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Accede a un portafolio diversificado y optimizado que ha demostrado resultados excepcionales 
            durante más de {portfolio.period.split('-')[1] - portfolio.period.split('-')[0]} años de backtesting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Adquirir por ${portfolio.price}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contacto">Consultar Asesor</Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            <p>✓ Soporte técnico incluido • ✓ Actualizaciones gratuitas • ✓ Garantía de satisfacción</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

