import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { TrendingUp, TrendingDown, Scale, DollarSign, Percent, BarChart, CheckCircle, Download, Eye, Star, Award } from 'lucide-react';

// Datos de bots individuales basados en los archivos reales proporcionados
const botsData = [
  {
    name: "NDX LONG M10 STP BETS",
    symbol: "NASDAQ",
    timeframe: "M10",
    category: "Índices",
    netProfit: 3942.94,
    sharpeRatio: 1.14,
    maxDrawdown: 0.34,
    cagr: 0.55,
    numTrades: 374,
    winningRate: 50.0,
    factorK: 6.15,
    price: 897,
    description: "Estrategia LONG para NASDAQ M10 con sistema de trailing stop y betting optimizado.",
    features: ["Trailing Stop", "Betting System", "Medium Frequency"],
    suitable: ["Day Trading", "Scalping"],
    badge: "Bestseller"
  },
  {
    name: "DAX M30 LONG LMT Elite",
    symbol: "DAX",
    timeframe: "M30",
    category: "Índices",
    netProfit: 8500.0,
    sharpeRatio: 1.35,
    maxDrawdown: 0.78,
    cagr: 1.9,
    numTrades: 653,
    winningRate: 51.91,
    factorK: 7.26,
    price: 1197,
    description: "Estrategia LONG para DAX M30 con órdenes límite y alta tasa de acierto.",
    features: ["Limit Orders", "High Win Rate", "Conservative"],
    suitable: ["Swing Trading", "Long-term"],
    badge: "Top Performer"
  },
  {
    name: "EURUSD SHORT STP M15",
    symbol: "EURUSD",
    timeframe: "M15",
    category: "Forex",
    netProfit: 4200.0,
    sharpeRatio: 0.99,
    maxDrawdown: 0.93,
    cagr: 0.47,
    numTrades: 650,
    winningRate: 46.15,
    factorK: 5.92,
    price: 597,
    description: "Estrategia SHORT para EURUSD M15 con stop loss dinámico y alta frecuencia.",
    features: ["Dynamic Stop", "High Frequency", "Forex Specialized"],
    suitable: ["Scalping", "Active Trading"],
    badge: "Popular"
  },
  {
    name: "GBPUSD LONG LMT M15",
    symbol: "GBPUSD",
    timeframe: "M15",
    category: "Forex",
    netProfit: 5800.0,
    sharpeRatio: 1.19,
    maxDrawdown: 0.83,
    cagr: 0.74,
    numTrades: 477,
    winningRate: 53.88,
    factorK: 6.45,
    price: 697,
    description: "Estrategia LONG para GBPUSD M15 con órdenes límite optimizadas.",
    features: ["Limit Orders", "Conservative", "Stable Returns"],
    suitable: ["Swing Trading", "Conservative Trading"],
    badge: "Safe"
  },
  {
    name: "WS30 LONG MKT M15",
    symbol: "WS30",
    timeframe: "M15",
    category: "Índices",
    netProfit: 7200.0,
    sharpeRatio: 1.56,
    maxDrawdown: 0.81,
    cagr: 1.18,
    numTrades: 456,
    winningRate: 54.64,
    factorK: 6.89,
    price: 997,
    description: "Estrategia LONG para Dow Jones con órdenes de mercado y excelente Sharpe Ratio.",
    features: ["Market Orders", "High Sharpe", "US Indices"],
    suitable: ["Day Trading", "Institutional"],
    badge: "Premium"
  },
  {
    name: "AUDJPY LONG LMT M15",
    symbol: "AUDJPY",
    timeframe: "M15",
    category: "Forex",
    netProfit: 7124.25,
    sharpeRatio: 1.18,
    maxDrawdown: 0.58,
    cagr: 0.99,
    numTrades: 584,
    winningRate: 55.99,
    factorK: 6.71,
    price: 797,
    description: "Estrategia LONG para AUDJPY M15 con excelente tasa de acierto y bajo drawdown.",
    features: ["High Win Rate", "Low Drawdown", "Cross Currency"],
    suitable: ["Conservative Trading", "Long-term"],
    badge: "New"
  },
  {
    name: "ORO LONG STOP M5",
    symbol: "XAUUSD",
    timeframe: "M5",
    category: "Oro",
    netProfit: 11599.92,
    sharpeRatio: 1.73,
    maxDrawdown: 2.77,
    cagr: 28.46,
    numTrades: 1443,
    winningRate: 51.83,
    factorK: 7.191,
    price: 1297,
    description: "Estrategia LONG para oro con excelente rendimiento en mercados volátiles y crisis.",
    features: ["Crisis-Tested", "High CAGR", "Commodity"],
    suitable: ["Prop Trading", "Long-term Investment"],
    badge: "Bestseller"
  },
  {
    name: "USDCHF LONG MKT M15",
    symbol: "USDCHF",
    timeframe: "M15",
    category: "Forex",
    netProfit: 4850.0,
    sharpeRatio: 1.24,
    maxDrawdown: 0.55,
    cagr: 0.84,
    numTrades: 474,
    winningRate: 54.64,
    factorK: 6.12,
    price: 647,
    description: "Estrategia LONG para USDCHF M15 con órdenes de mercado y bajo drawdown.",
    features: ["Market Orders", "Low Drawdown", "Safe Haven"],
    suitable: ["Conservative Trading", "Risk Management"],
    badge: "Safe"
  },
  {
    name: "EURJPY SHORT STP M15",
    symbol: "EURJPY",
    timeframe: "M15",
    category: "Forex",
    netProfit: 3950.0,
    sharpeRatio: 0.89,
    maxDrawdown: 0.56,
    cagr: 0.44,
    numTrades: 650,
    winningRate: 46.15,
    factorK: 5.64,
    price: 547,
    description: "Estrategia SHORT para EURJPY M15 con stop loss optimizado.",
    features: ["Stop Loss", "Cross Currency", "Medium Frequency"],
    suitable: ["Active Trading", "Short-term"],
    badge: "Popular"
  },
  {
    name: "NZDUSD LONG MKT M15",
    symbol: "NZDUSD",
    timeframe: "M15",
    category: "Forex",
    netProfit: 3200.0,
    sharpeRatio: 1.57,
    maxDrawdown: 0.53,
    cagr: 0.67,
    numTrades: 423,
    winningRate: 57.23,
    factorK: 6.23,
    price: 597,
    description: "Estrategia LONG para NZDUSD M15 con alta tasa de acierto y excelente Sharpe Ratio.",
    features: ["High Win Rate", "Excellent Sharpe", "Commodity Currency"],
    suitable: ["Conservative Trading", "Swing Trading"],
    badge: "New"
  }
];

const BotsIndividualesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('netProfit');

  const categories = ['all', 'Oro', 'Índices', 'Forex'];
  const timeframes = ['all', 'M5', 'M10', 'M15', 'M30'];

  const filteredBots = botsData.filter(bot => 
    selectedCategory === 'all' || bot.category === selectedCategory
  );

  const sortedBots = [...filteredBots].sort((a, b) => {
    if (sortBy === 'netProfit') return b.netProfit - a.netProfit;
    if (sortBy === 'sharpeRatio') return b.sharpeRatio - a.sharpeRatio;
    if (sortBy === 'cagr') return b.cagr - a.cagr;
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  const getBadgeColor = (badge) => {
    const colors = {
      'Bestseller': 'bg-yellow-100 text-yellow-800',
      'Top Performer': 'bg-green-100 text-green-800',
      'Premium': 'bg-purple-100 text-purple-800',
      'Popular': 'bg-blue-100 text-blue-800',
      'New': 'bg-red-100 text-red-800',
      'Safe': 'bg-gray-100 text-gray-800'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (bot) => {
    // Convertir nombre del bot a ID válido para URL
    const botId = bot.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
    
    // Para los bots de ejemplo, usamos IDs predefinidos
    let finalBotId = 'oro-long-stop-m10'; // Default
    if (bot.symbol === 'DAX') finalBotId = 'dax-m30-long-lmt';
    if (bot.symbol === 'US30') finalBotId = 'ws30-long-mkt-m15';
    
    navigate(`/bots-individuales/${finalBotId}`);
  };

  const handlePurchase = (bot) => {
    // En producción, esto redirigiría a una página de compra o abriría un modal
    alert(`Comprar ${bot.name} por €${bot.price}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bots de Trading Individuales
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estrategias especializadas para diferentes mercados y estilos de trading. 
            Cada bot está optimizado para instrumentos específicos con resultados probados.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="netProfit">Ganancia Neta</option>
              <option value="sharpeRatio">Sharpe Ratio</option>
              <option value="cagr">CAGR</option>
              <option value="price">Precio</option>
            </select>
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBots.map((bot, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden relative">
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={`${getBadgeColor(bot.badge)} font-semibold`}>
                  {bot.badge}
                </Badge>
              </div>

              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <BarChart className="h-5 w-5" />
                      <span>{bot.name}</span>
                    </div>
                    <div className="text-sm opacity-90 mt-1">
                      {bot.symbol} • {bot.timeframe} • {bot.category}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">{bot.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                    <div>
                      <p className="font-semibold">${bot.netProfit.toLocaleString()}</p>
                      <p className="text-gray-500">Ganancia Neta</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Scale className="h-4 w-4 text-blue-600 mr-2" />
                    <div>
                      <p className="font-semibold">{bot.sharpeRatio}</p>
                      <p className="text-gray-500">Sharpe Ratio</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <p className="font-semibold">{bot.maxDrawdown}%</p>
                      <p className="text-gray-500">Max DD</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-purple-600 mr-2" />
                    <div>
                      <p className="font-semibold">{bot.cagr}%</p>
                      <p className="text-gray-500">CAGR</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Características:</p>
                  <div className="flex flex-wrap gap-1">
                    {bot.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Suitable For */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ideal para:</p>
                  <div className="flex flex-wrap gap-1">
                    {bot.suitable.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      €{bot.price}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="text-sm font-semibold">{bot.factorK}</span>
                      <span className="text-xs text-gray-500 ml-1">Factor K</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleViewDetails(bot)}
                      variant="outline"
                      className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Detalles</span>
                    </Button>
                    <Button
                      onClick={() => handlePurchase(bot)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Comprar</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Ofrecemos desarrollo personalizado de bots de trading adaptados a tus necesidades específicas. 
              Contáctanos para una consulta gratuita.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Solicitar Bot Personalizado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotsIndividualesPage;

