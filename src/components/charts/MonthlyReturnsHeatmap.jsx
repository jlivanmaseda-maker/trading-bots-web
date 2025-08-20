import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import realPortfolioData from '../../data/real_portfolio_data.json';

const MonthlyReturnsHeatmap = ({ portfolioId, className = "" }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  useEffect(() => {
    try {
      const portfolioData = realPortfolioData.portfolios[portfolioId];
      if (portfolioData && portfolioData.monthly_returns) {
        const monthlyData = portfolioData.monthly_returns;
        
        // Organizar datos por año y mes
        const years = [...new Set(monthlyData.map(d => d.year))].sort();
        const organizedData = [];
        
        years.forEach(year => {
          const yearData = { year };
          let yearTotal = 0;
          let monthsWithData = 0;
          
          months.forEach((monthName, index) => {
            const monthData = monthlyData.find(d => 
              d.year === year && 
              d.month.toLowerCase().includes(monthName.toLowerCase().substring(0, 3))
            );
            
            if (monthData) {
              yearData[monthName] = monthData.return;
              yearTotal += monthData.return;
              monthsWithData++;
            } else {
              yearData[monthName] = null;
            }
          });
          
          yearData.yearTotal = monthsWithData > 0 ? yearTotal : 0;
          organizedData.push(yearData);
        });
        
        setHeatmapData(organizedData);
        
        // Calcular estadísticas
        const allReturns = monthlyData.map(d => d.return);
        const positiveReturns = allReturns.filter(r => r > 0);
        const negativeReturns = allReturns.filter(r => r < 0);
        
        setStats({
          totalMonths: allReturns.length,
          positiveMonths: positiveReturns.length,
          negativeMonths: negativeReturns.length,
          winRate: ((positiveReturns.length / allReturns.length) * 100).toFixed(1),
          avgPositive: positiveReturns.length > 0 ? (positiveReturns.reduce((a, b) => a + b, 0) / positiveReturns.length).toFixed(2) : 0,
          avgNegative: negativeReturns.length > 0 ? (negativeReturns.reduce((a, b) => a + b, 0) / negativeReturns.length).toFixed(2) : 0,
          bestMonth: Math.max(...allReturns).toFixed(2),
          worstMonth: Math.min(...allReturns).toFixed(2)
        });
        
      } else {
        setError('No se encontraron datos de retornos mensuales para este portafolio');
      }
    } catch (err) {
      setError('Error cargando datos de retornos mensuales');
      console.error('Error loading monthly returns data:', err);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);
  
  const getColorForReturn = (returnValue) => {
    if (returnValue === null || returnValue === undefined) {
      return 'bg-gray-100 text-gray-400';
    }
    
    const intensity = Math.min(Math.abs(returnValue) / 8, 1); // Normalizar a 8% para intensidad máxima
    
    if (returnValue > 0) {
      if (intensity < 0.3) return 'bg-green-100 text-green-800';
      if (intensity < 0.6) return 'bg-green-300 text-green-900';
      if (intensity < 0.8) return 'bg-green-500 text-white';
      return 'bg-green-700 text-white';
    } else {
      if (intensity < 0.3) return 'bg-red-100 text-red-800';
      if (intensity < 0.6) return 'bg-red-300 text-red-900';
      if (intensity < 0.8) return 'bg-red-500 text-white';
      return 'bg-red-700 text-white';
    }
  };
  
  const getBestWorstMonths = () => {
    const allMonthsData = [];
    heatmapData.forEach(yearData => {
      months.forEach(month => {
        if (yearData[month] !== null && yearData[month] !== undefined) {
          allMonthsData.push({
            month,
            year: yearData.year,
            return: yearData[month]
          });
        }
      });
    });
    
    const sortedByReturn = allMonthsData.sort((a, b) => b.return - a.return);
    return {
      best: sortedByReturn[0],
      worst: sortedByReturn[sortedByReturn.length - 1]
    };
  };
  
  if (loading) {
    return (
      <div className={`monthly-heatmap ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`monthly-heatmap ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!heatmapData.length) {
    return (
      <div className={`monthly-heatmap ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos de retornos mensuales disponibles</p>
        </div>
      </div>
    );
  }
  
  const bestWorst = getBestWorstMonths();
  
  return (
    <div className={`monthly-heatmap ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          Heatmap de Rendimientos Mensuales
        </h3>
        <p className="text-sm text-gray-600">
          Rendimiento mensual histórico del portafolio por año
        </p>
      </div>
      
      {/* Tabla de heatmap */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                {months.map(month => (
                  <th key={month} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {month}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {heatmapData.map((yearData, index) => (
                <tr key={yearData.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {yearData.year}
                  </td>
                  {months.map(month => {
                    const returnValue = yearData[month];
                    return (
                      <td key={month} className="px-1 py-2">
                        <div 
                          className={`w-12 h-8 rounded text-xs flex items-center justify-center font-semibold mx-auto ${getColorForReturn(returnValue)}`}
                          title={returnValue !== null ? `${month} ${yearData.year}: ${returnValue.toFixed(1)}%` : 'Sin datos'}
                        >
                          {returnValue !== null ? returnValue.toFixed(1) : '-'}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={yearData.yearTotal > 0 ? 'text-green-600' : 'text-red-600'}>
                      {yearData.yearTotal.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="flex items-center justify-center mb-6 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Pérdidas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Ganancias</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Sin datos</span>
        </div>
        <div className="text-xs text-gray-500">
          Intensidad del color = magnitud del retorno
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">Tasa de Acierto</h4>
          <p className="text-2xl font-bold text-blue-600">{stats.winRate}%</p>
          <p className="text-xs text-blue-700">
            {stats.positiveMonths} de {stats.totalMonths} meses positivos
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Mes Promedio +
          </h4>
          <p className="text-2xl font-bold text-green-600">+{stats.avgPositive}%</p>
          <p className="text-xs text-green-700">
            Ganancia promedio en meses positivos
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 flex items-center">
            <TrendingDown className="h-4 w-4 mr-1" />
            Mes Promedio -
          </h4>
          <p className="text-2xl font-bold text-red-600">{stats.avgNegative}%</p>
          <p className="text-xs text-red-700">
            Pérdida promedio en meses negativos
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800">Rango</h4>
          <p className="text-lg font-bold text-purple-600">
            {stats.bestMonth}% / {stats.worstMonth}%
          </p>
          <p className="text-xs text-purple-700">
            Mejor / Peor mes
          </p>
        </div>
      </div>
      
      {/* Mejores y peores meses */}
      {bestWorst.best && bestWorst.worst && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">🏆 Mejor Mes</h4>
            <p className="text-lg font-bold text-green-600">
              {bestWorst.best.month} {bestWorst.best.year}: +{bestWorst.best.return.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">📉 Peor Mes</h4>
            <p className="text-lg font-bold text-red-600">
              {bestWorst.worst.month} {bestWorst.worst.year}: {bestWorst.worst.return.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReturnsHeatmap;

