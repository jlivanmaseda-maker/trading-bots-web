import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import realPortfolioData from '../../data/real_portfolio_data.json';
import individualBotsData from '../../data/individual_bots_data.json';

const DrawdownChart = ({ portfolioId, dataSource = "portfolios", className = "" }) => {
  const [drawdownData, setDrawdownData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      let portfolioData;
      
      if (dataSource === "individual_bots") {
        portfolioData = individualBotsData[portfolioId];
      } else {
        portfolioData = realPortfolioData.portfolios[portfolioId];
      }
      
      if (portfolioData && (portfolioData.drawdown_curve || portfolioData.drawdown_data)) {
        const drawdownSource = portfolioData.drawdown_curve || portfolioData.drawdown_data;
        
        // Formatear datos para el gráfico
        const formattedData = drawdownSource.map(point => ({
          ...point,
          date: new Date(point.date).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short',
            day: 'numeric'
          }),
          drawdown: Math.abs(point.drawdown) // Convertir a positivo para mejor visualización
        }));
        
        setDrawdownData(formattedData);
        
        // Calcular estadísticas
        const drawdownValues = formattedData.map(d => d.drawdown);
        const maxDrawdown = Math.max(...drawdownValues);
        const avgDrawdown = drawdownValues.reduce((sum, val) => sum + val, 0) / drawdownValues.length;
        const recoveryTime = calculateRecoveryTime(formattedData);
        
        setStats({
          maxDrawdown: maxDrawdown.toFixed(2),
          avgDrawdown: avgDrawdown.toFixed(2),
          recoveryTime: recoveryTime,
          totalPeriods: drawdownValues.length
        });
        
      } else {
        setError('No se encontraron datos de drawdown para este portafolio');
      }
    } catch (err) {
      setError('Error cargando datos de drawdown');
      console.error('Error loading drawdown data:', err);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);
  
  const calculateRecoveryTime = (data) => {
    if (data.length < 2) return 0;
    
    let totalRecoveryDays = 0;
    let recoveryPeriods = 0;
    
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].drawdown > 1 && data[i + 1].drawdown < 1) {
        recoveryPeriods++;
        // Estimación simple: 30 días promedio entre puntos
        totalRecoveryDays += 30;
      }
    }
    
    return recoveryPeriods > 0 ? Math.round(totalRecoveryDays / recoveryPeriods) : 45;
  };
  
  if (loading) {
    return (
      <div className={`drawdown-chart ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`drawdown-chart ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!drawdownData.length) {
    return (
      <div className={`drawdown-chart ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos de drawdown disponibles</p>
        </div>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-red-600">
            <span className="font-medium">Drawdown: </span>
            -{value.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pérdida temporal desde el máximo anterior
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={`drawdown-chart ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
          Análisis de Drawdown
        </h3>
        <p className="text-sm text-gray-600">
          Pérdidas temporales desde los máximos históricos del portafolio
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={drawdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tickFormatter={(value) => `-${value}%`}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Línea de referencia en 0% */}
            <ReferenceLine 
              y={0} 
              stroke="#10b981" 
              strokeWidth={2}
              label={{ value: "Sin pérdidas", position: "insideTopRight" }}
            />
            
            <Area 
              type="monotone" 
              dataKey="drawdown" 
              stroke="#ef4444" 
              strokeWidth={2}
              fill="url(#drawdownGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Estadísticas de drawdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-red-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Max Drawdown
              </h4>
              <p className="text-2xl font-bold text-red-600">
                -{stats.maxDrawdown}%
              </p>
              <p className="text-xs text-red-700 mt-1">
                Pérdida máxima registrada
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-orange-800">
                Drawdown Promedio
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                -{stats.avgDrawdown}%
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Pérdida promedio típica
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-800 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Tiempo de Recuperación
              </h4>
              <p className="text-2xl font-bold text-yellow-600">
                ~{stats.recoveryTime} días
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Tiempo promedio para recuperarse
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interpretación del riesgo */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Interpretación del Riesgo</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {parseFloat(stats.maxDrawdown) <= 5 && (
            <p>✅ <strong>Riesgo Bajo:</strong> Drawdown máximo muy controlado (&lt;5%)</p>
          )}
          {parseFloat(stats.maxDrawdown) > 5 && parseFloat(stats.maxDrawdown) <= 10 && (
            <p>⚠️ <strong>Riesgo Moderado:</strong> Drawdown máximo aceptable (5-10%)</p>
          )}
          {parseFloat(stats.maxDrawdown) > 10 && (
            <p>🔴 <strong>Riesgo Alto:</strong> Drawdown máximo significativo (&gt;10%)</p>
          )}
          
          {stats.recoveryTime <= 30 && (
            <p>⚡ <strong>Recuperación Rápida:</strong> El portafolio se recupera en menos de un mes</p>
          )}
          {stats.recoveryTime > 30 && stats.recoveryTime <= 90 && (
            <p>🔄 <strong>Recuperación Normal:</strong> Tiempo de recuperación de 1-3 meses</p>
          )}
          {stats.recoveryTime > 90 && (
            <p>⏳ <strong>Recuperación Lenta:</strong> Puede tomar más de 3 meses recuperarse</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawdownChart;

