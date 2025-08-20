import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import realPortfolioData from '../../data/real_portfolio_data.json';

const RealEquityCurve = ({ portfolioId, className = "" }) => {
  const [equityData, setEquityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      const portfolioData = realPortfolioData.portfolios[portfolioId];
      if (portfolioData && portfolioData.equity_curve) {
        // Formatear datos para el gráfico
        const formattedData = portfolioData.equity_curve.map(point => ({
          ...point,
          date: new Date(point.date).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short' 
          }),
          equity: Math.round(point.equity)
        }));
        
        setEquityData(formattedData);
      } else {
        setError('No se encontraron datos de equity para este portafolio');
      }
    } catch (err) {
      setError('Error cargando datos de equity');
      console.error('Error loading equity data:', err);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);
  
  if (loading) {
    return (
      <div className={`equity-curve-container ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`equity-curve-container ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!equityData.length) {
    return (
      <div className={`equity-curve-container ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos de equity disponibles</p>
        </div>
      </div>
    );
  }
  
  const initialValue = equityData[0]?.equity || 10000;
  const finalValue = equityData[equityData.length - 1]?.equity || 10000;
  const totalReturn = ((finalValue - initialValue) / initialValue) * 100;
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const returnFromStart = ((value - initialValue) / initialValue) * 100;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Equity: </span>
            ${value.toLocaleString()}
          </p>
          <p className={`${returnFromStart >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-medium">Retorno: </span>
            {returnFromStart >= 0 ? '+' : ''}{returnFromStart.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={`equity-curve-container ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Evolución del Portafolio
        </h3>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Curva de Equity Real</span>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Período:</span> {equityData[0]?.date} - {equityData[equityData.length - 1]?.date}
          </div>
          <div className={`font-medium ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-gray-600">Retorno Total:</span> {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={equityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Línea de referencia para inversión inicial */}
            <ReferenceLine 
              y={initialValue} 
              stroke="#9ca3af" 
              strokeDasharray="5 5"
              label={{ value: "Inversión Inicial", position: "insideTopRight" }}
            />
            
            <Line 
              type="monotone" 
              dataKey="equity" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: '#2563eb',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 font-medium">INVERSIÓN INICIAL</p>
          <p className="text-lg font-bold text-blue-900">${initialValue.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-600 font-medium">VALOR ACTUAL</p>
          <p className="text-lg font-bold text-green-900">${finalValue.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-xs text-purple-600 font-medium">GANANCIA TOTAL</p>
          <p className="text-lg font-bold text-purple-900">${(finalValue - initialValue).toLocaleString()}</p>
        </div>
        <div className={`${totalReturn >= 0 ? 'bg-green-50' : 'bg-red-50'} p-3 rounded-lg`}>
          <p className={`text-xs font-medium ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            RETORNO %
          </p>
          <p className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealEquityCurve;

