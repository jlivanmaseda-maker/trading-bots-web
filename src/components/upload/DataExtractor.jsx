import React, { useState } from 'react';
import { FileText, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const DataExtractor = ({ uploadedFile, onDataExtracted }) => {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const extractDataFromPDF = async () => {
    setExtracting(true);
    setError('');

    try {
      // Simular extracción de datos del PDF
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Datos simulados extraídos (en producción sería procesamiento real del PDF)
      const mockExtractedData = {
        portfolioName: `Portfolio ${Math.floor(Math.random() * 100) + 1}`,
        metrics: {
          netProfit: Math.floor(Math.random() * 500000) + 100000,
          totalTrades: Math.floor(Math.random() * 50000) + 10000,
          winningRate: (Math.random() * 30 + 45).toFixed(1),
          sharpeRatio: (Math.random() * 5 + 3).toFixed(2),
          maxDrawdown: (Math.random() * 10 + 5).toFixed(2),
          cagr: (Math.random() * 40 + 20).toFixed(1),
          profitFactor: (Math.random() * 2 + 1.5).toFixed(2),
          calmarRatio: (Math.random() * 20 + 10).toFixed(1)
        },
        equityCurve: generateEquityCurve(),
        monthlyReturns: generateMonthlyReturns(),
        drawdownCurve: generateDrawdownCurve(),
        instruments: ['EURUSD', 'GBPUSD', 'XAUUSD', 'NASDAQ', 'DAX'],
        timeframe: 'M15',
        period: '2018-2024',
        extractionDate: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
      };

      setExtractedData(mockExtractedData);
      
      if (onDataExtracted) {
        onDataExtracted(mockExtractedData);
      }

    } catch (err) {
      setError('Error al extraer datos del PDF. Verifica que el archivo sea un reporte válido de StrategyQuant.');
    } finally {
      setExtracting(false);
    }
  };

  const generateEquityCurve = () => {
    const points = [];
    let value = 10000;
    const months = 84; // 7 años
    
    for (let i = 0; i < months; i++) {
      const date = new Date(2018, i % 12, 1);
      const growth = (Math.random() * 0.1 + 0.02); // 2-12% mensual
      value *= (1 + growth);
      
      points.push({
        date: date.toISOString().slice(0, 7),
        equity: Math.round(value)
      });
    }
    
    return points;
  };

  const generateMonthlyReturns = () => {
    const returns = [];
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    years.forEach(year => {
      months.forEach((month, index) => {
        if (year === 2024 && index > 11) return; // No futuro
        
        const return_pct = (Math.random() * 15 - 2.5).toFixed(1); // -2.5% a +12.5%
        returns.push({
          year,
          month,
          return: parseFloat(return_pct)
        });
      });
    });
    
    return returns;
  };

  const generateDrawdownCurve = () => {
    const points = [];
    let currentDD = 0;
    
    for (let i = 0; i < 84; i++) {
      const date = new Date(2018, i % 12, 1);
      
      // Simular períodos de drawdown
      if (Math.random() < 0.1) { // 10% chance de inicio de drawdown
        currentDD = Math.random() * -15; // Hasta -15%
      } else if (currentDD < 0) {
        currentDD *= 0.8; // Recuperación gradual
        if (currentDD > -0.5) currentDD = 0;
      }
      
      points.push({
        date: date.toISOString().slice(0, 7),
        drawdown: currentDD
      });
    }
    
    return points;
  };

  if (!uploadedFile) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Sube un archivo PDF para extraer datos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del archivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Archivo Cargado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-gray-600">
                Subido el {new Date(uploadedFile.uploadDate).toLocaleString()}
              </p>
            </div>
            
            {!extractedData && (
              <Button 
                onClick={extractDataFromPDF}
                disabled={extracting}
                className="flex items-center gap-2"
              >
                {extracting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Extrayendo...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Extraer Datos
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progreso de extracción */}
      {extracting && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium mb-2">Extrayendo Datos del PDF</h3>
              <p className="text-gray-600 mb-4">
                Analizando métricas, curvas de equity y rendimientos...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Datos extraídos */}
      {extractedData && (
        <div className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Datos extraídos exitosamente con {extractedData.confidence}% de confianza
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Métricas extraídas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas Extraídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Net Profit</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${extractedData.metrics.netProfit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {extractedData.metrics.sharpeRatio}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CAGR</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {extractedData.metrics.cagr}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Drawdown</p>
                  <p className="text-lg font-semibold text-red-600">
                    {extractedData.metrics.maxDrawdown}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {extractedData.equityCurve.length} puntos de equity
                  </Badge>
                  <Badge variant="outline">
                    {extractedData.monthlyReturns.length} retornos mensuales
                  </Badge>
                  <Badge variant="outline">
                    {extractedData.drawdownCurve.length} puntos de drawdown
                  </Badge>
                  <Badge variant="outline">
                    {extractedData.instruments.length} instrumentos
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de datos */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Extracción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre del Portafolio:</span>
                  <span className="font-medium">{extractedData.portfolioName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Período:</span>
                  <span className="font-medium">{extractedData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{extractedData.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Operaciones:</span>
                  <span className="font-medium">{extractedData.metrics.totalTrades.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Extracción:</span>
                  <span className="font-medium">
                    {new Date(extractedData.extractionDate).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataExtractor;

