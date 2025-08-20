import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import PortfolioFilters from '../components/PortfolioFilters.jsx';
import { TrendingUp, TrendingDown, Scale, DollarSign, Percent, BarChart, CheckCircle, Download, Eye, Award } from 'lucide-react';

const portfoliosData = [
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.7.8.9.10.11.12.13.15.16.17.18.19.21.22.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.43.44.45.46.47.48.49.50.51.52.53.54.55.56.57.58.59.60.61.62.63.64.65.66.67.68](1)",
    "Net_Profit": 394853.28,
    "Sharpe_Ratio": 7.35,
    "Max_DD_Percent": 1.17,
    "Annual_Return_Percent": 56.41,
    "Num_Trades": 36325,
    "Winning_Percent": 51.12,
    "Price": 2499,
    "Tier": "Elite Premium"
  },
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.7.8.9.10.11.12.13.15.16.17.18.19.21.22.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.43.44.45.46.47.48.49.50.51.52.53.54.55.56.57.58.59.60.61.62.63.64.65.66.67.68](2)",
    "Net_Profit": 394853.28,
    "Sharpe_Ratio": 7.35,
    "Max_DD_Percent": 1.17,
    "Annual_Return_Percent": 56.41,
    "Num_Trades": 36325,
    "Winning_Percent": 51.12,
    "Price": 2499,
    "Tier": "Elite Premium"
  },
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.7.8.9.10.11.12.13.15.16.17.18.19.21.22.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.43.44.45.46.47.48.49.50.51.52.53.54.55.56.57.58.59.60.61.62.63.64.65.66.67.68](3)",
    "Net_Profit": 394853.28,
    "Sharpe_Ratio": 7.35,
    "Max_DD_Percent": 1.17,
    "Annual_Return_Percent": 56.41,
    "Num_Trades": 36325,
    "Winning_Percent": 51.12,
    "Price": 2499,
    "Tier": "Elite Premium"
  },
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.8.9.10.11.12.13.15.16.17.18.19.20.21.22.23.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.43.44.45.46.47.48.49.50.52.53.54.55.56.57.58.59.60.61.62.63.64.65.66.67.68](1)",
    "Net_Profit": 392411.69,
    "Sharpe_Ratio": 7.29,
    "Max_DD_Percent": 1.35,
    "Annual_Return_Percent": 56.06,
    "Num_Trades": 36142,
    "Winning_Percent": 51.26,
    "Price": 2399,
    "Tier": "Elite Premium"
  },
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.8.9.10.11.12.13.15.16.17.18.19.20.21.22.23.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.43.44.45.46.47.48.49.50.52.53.54.55.56.57.58.59.60.61.62.63.64.65.66.67.68](2)",
    "Net_Profit": 392411.69,
    "Sharpe_Ratio": 7.29,
    "Max_DD_Percent": 1.35,
    "Annual_Return_Percent": 56.06,
    "Num_Trades": 36142,
    "Winning_Percent": 51.26,
    "Price": 2399,
    "Tier": "Elite Premium"
  },
  {
    "Portfolio Name": "Portfolio [0.1.2.3.4.5.6.7.8.9.10.11.12.13.15.16.17.18.19.21.23.24.25.26.27.28.29.30.31.32.33.34.35.36.37.38.39.41.42.43.44.45.46.47.48.49.50.51.52.53.54.55.56.57.58.59.60.61.62.63.64.65.67.68](1)",
    "Net_Profit": 390910.34,
    "Sharpe_Ratio": 7.36,
    "Max_DD_Percent": 1.17,
    "Annual_Return_Percent": 55.84,
    "Num_Trades": 35951,
    "Winning_Percent": 51.13,
    "Price": 2299,
    "Tier": "Elite Premium"
  }
];

const PortfoliosPage = () => {
  const navigate = useNavigate();
  const [filteredPortfolios, setFilteredPortfolios] = useState(portfoliosData);

  const handleFilterChange = (filters) => {
    let filtered = [...portfoliosData];

    // Filter by Factor K Elite (simulated logic)
    if (filters.factorK !== 'all') {
      filtered = filtered.filter(portfolio => {
        if (filters.factorK === 'high') return portfolio.Sharpe_Ratio > 7.0;
        if (filters.factorK === 'medium') return portfolio.Sharpe_Ratio >= 6.0 && portfolio.Sharpe_Ratio <= 7.0;
        if (filters.factorK === 'low') return portfolio.Sharpe_Ratio < 6.0;
        return true;
      });
    }

    // Filter by Drawdown
    if (filters.drawdown !== 'all') {
      filtered = filtered.filter(portfolio => {
        if (filters.drawdown === 'very-low') return portfolio.Max_DD_Percent < 1;
        if (filters.drawdown === 'low') return portfolio.Max_DD_Percent >= 1 && portfolio.Max_DD_Percent <= 2;
        if (filters.drawdown === 'medium') return portfolio.Max_DD_Percent > 2 && portfolio.Max_DD_Percent <= 5;
        if (filters.drawdown === 'high') return portfolio.Max_DD_Percent > 5;
        return true;
      });
    }

    setFilteredPortfolios(filtered);
  };

  const handleViewDetails = (portfolio) => {
    // Convertir nombre del portafolio a ID válido para URL
    const portfolioId = 'factor-k-elite-96'; // Por ahora usamos un ID fijo, en producción se generaría dinámicamente
    navigate(`/portafolios/${portfolioId}`);
  };

  const handleDownloadReport = (portfolio) => {
    // En producción, esto descargaría el archivo PDF real
    const reportFile = 'portfolio4.pdf';
    const link = document.createElement('a');
    link.href = `/reports/portfolios/${reportFile}`;
    link.download = reportFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurchasePortfolio = (portfolio) => {
    // En producción, esto redirigiría a una página de compra o abriría un modal
    alert(`Comprar ${portfolio["Portfolio Name"].split("[")[0].trim()} por €${portfolio.Price}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Nuestros Portafolios de Trading Elite
        </h1>

        <p className="text-center text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Descubre nuestros portafolios de trading algorítmico, rigurosamente backtesteados y optimizados para un rendimiento superior. Cada portafolio está diseñado para diferentes perfiles de riesgo y objetivos de inversión.
        </p>

        <PortfolioFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolios.map((portfolio, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="bg-blue-600 text-white p-6">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <BarChart className="mr-3" />
                  {portfolio["Portfolio Name"].split("[")[0].trim()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-gray-800">
                  <DollarSign className="mr-3 text-green-600" />
                  <p className="text-lg"><span className="font-semibold">Profit Neto:</span> ${portfolio.Net_Profit.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-gray-800">
                  <Scale className="mr-3 text-blue-600" />
                  <p className="text-lg"><span className="font-semibold">Sharpe Ratio:</span> {portfolio.Sharpe_Ratio}</p>
                </div>
                <div className="flex items-center text-gray-800">
                  <TrendingDown className="mr-3 text-red-600" />
                  <p className="text-lg"><span className="font-semibold">Max Drawdown:</span> {portfolio.Max_DD_Percent}%</p>
                </div>
                <div className="flex items-center text-gray-800">
                  <Percent className="mr-3 text-purple-600" />
                  <p className="text-lg"><span className="font-semibold">Retorno Anual:</span> {portfolio.Annual_Return_Percent}%</p>
                </div>
                <div className="flex items-center text-gray-800">
                  <CheckCircle className="mr-3 text-yellow-600" />
                  <p className="text-lg"><span className="font-semibold">Operaciones:</span> {portfolio.Num_Trades.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-gray-800">
                  <TrendingUp className="mr-3 text-teal-600" />
                  <p className="text-lg"><span className="font-semibold">Winning Rate:</span> {portfolio.Winning_Percent}%</p>
                </div>
                {portfolio.Factor_K_Elite && (
                  <div className="flex items-center text-gray-800">
                    <Award className="mr-3 text-orange-600" />
                    <p className="text-lg"><span className="font-semibold">Factor K Elite:</span> {portfolio.Factor_K_Elite}</p>
                  </div>
                )}

                {/* Price Section */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      €{portfolio.Price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                      {portfolio.Tier}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Acceso completo al portafolio
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewDetails(portfolio)}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver Detalles</span>
                  </Button>
                  <Button
                    onClick={() => handlePurchasePortfolio(portfolio)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Comprar</span>
                  </Button>
                </div>
                
                {/* Download Report Button */}
                <div className="mt-2">
                  <Button
                    onClick={() => handleDownloadReport(portfolio)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar Reporte</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfoliosPage;

