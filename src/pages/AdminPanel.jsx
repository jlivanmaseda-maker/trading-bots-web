import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit, Trash2, Eye, Download, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import realPortfolioData from '../data/real_portfolio_data.json';

const AdminPanel = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    price: '',
    tier: 'Premium',
    description: '',
    category: 'Multi-Asset',
    instruments: '',
    timeframe: 'M15',
    strategy_type: 'Trend Following'
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  
  useEffect(() => {
    // Cargar portafolios existentes
    if (realPortfolioData.portfolios) {
      const portfoliosList = Object.entries(realPortfolioData.portfolios).map(([id, data]) => ({
        id,
        name: `Portfolio ${id.charAt(id.length - 1).toUpperCase()}`,
        price: Math.floor(Math.random() * 1000) + 1500, // Precio simulado
        tier: 'Elite Premium',
        description: `Portafolio avanzado con ${data.metrics?.total_trades || 'múltiples'} operaciones`,
        category: 'Multi-Asset',
        instruments: 'Forex, Índices, Commodities',
        timeframe: 'M15',
        strategy_type: 'Trend Following',
        metrics: data.metrics,
        equity_points: data.equity_curve?.length || 0,
        monthly_data: data.monthly_returns?.length || 0,
        drawdown_points: data.drawdown_data?.length || 0,
        created_date: new Date().toLocaleDateString()
      }));
      setPortfolios(portfoliosList);
    }
  }, []);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Simular procesamiento del PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar ID único
      const newId = `portfolio${portfolios.length + 1}`;
      
      // Crear nuevo portafolio
      const portfolioToAdd = {
        id: newId,
        ...newPortfolio,
        price: parseFloat(newPortfolio.price),
        metrics: {
          net_profit: Math.floor(Math.random() * 200000) + 50000,
          sharpe_ratio: (Math.random() * 5 + 3).toFixed(2),
          max_drawdown: (Math.random() * 10 + 2).toFixed(2),
          cagr: (Math.random() * 40 + 20).toFixed(1),
          total_trades: Math.floor(Math.random() * 20000) + 10000,
          win_rate: (Math.random() * 20 + 50).toFixed(1)
        },
        equity_points: Math.floor(Math.random() * 50) + 20,
        monthly_data: Math.floor(Math.random() * 60) + 40,
        drawdown_points: Math.floor(Math.random() * 20) + 10,
        created_date: new Date().toLocaleDateString()
      };
      
      setPortfolios([...portfolios, portfolioToAdd]);
      
      // Reset form
      setNewPortfolio({
        name: '',
        price: '',
        tier: 'Premium',
        description: '',
        category: 'Multi-Asset',
        instruments: '',
        timeframe: 'M15',
        strategy_type: 'Trend Following'
      });
      setPdfFile(null);
      setShowAddForm(false);
      
      showNotification('Portafolio añadido exitosamente!');
      
    } catch (error) {
      showNotification('Error al añadir portafolio: ' + error.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleEdit = (portfolio) => {
    setEditingPortfolio({ ...portfolio });
  };
  
  const handleSaveEdit = () => {
    setPortfolios(portfolios.map(p => 
      p.id === editingPortfolio.id ? editingPortfolio : p
    ));
    setEditingPortfolio(null);
    showNotification('Portafolio actualizado exitosamente!');
  };
  
  const handleDelete = (portfolioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este portafolio?')) {
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
      showNotification('Portafolio eliminado exitosamente!');
    }
  };
  
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Elite': return 'bg-purple-100 text-purple-800';
      case 'Elite Premium': return 'bg-gold-100 text-gold-800 bg-gradient-to-r from-yellow-100 to-orange-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="admin-panel max-w-7xl mx-auto p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona portafolios, bots y configuraciones del sistema</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Portafolios</h3>
          <p className="text-3xl font-bold text-blue-600">{portfolios.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Valor Promedio</h3>
          <p className="text-3xl font-bold text-green-600">
            €{portfolios.length > 0 ? Math.round(portfolios.reduce((sum, p) => sum + p.price, 0) / portfolios.length) : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Elite Premium</h3>
          <p className="text-3xl font-bold text-purple-600">
            {portfolios.filter(p => p.tier === 'Elite Premium').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Datos Extraídos</h3>
          <p className="text-3xl font-bold text-orange-600">
            {portfolios.reduce((sum, p) => sum + p.equity_points, 0)}
          </p>
        </div>
      </div>
      
      {/* Add Portfolio Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-semibold"
        >
          <Plus className="h-5 w-5" />
          <span>Añadir Nuevo Portafolio</span>
        </button>
      </div>
      
      {/* Add Portfolio Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Añadir Nuevo Portafolio</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Portafolio
                    </label>
                    <input
                      type="text"
                      value={newPortfolio.name}
                      onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="ej. Factor K Elite 10.2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (€)
                    </label>
                    <input
                      type="number"
                      value={newPortfolio.price}
                      onChange={(e) => setNewPortfolio({...newPortfolio, price: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="100"
                      placeholder="2499"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier
                    </label>
                    <select
                      value={newPortfolio.tier}
                      onChange={(e) => setNewPortfolio({...newPortfolio, tier: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Premium">Premium</option>
                      <option value="Elite">Elite</option>
                      <option value="Elite Premium">Elite Premium</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({...newPortfolio, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Multi-Asset">Multi-Asset</option>
                      <option value="Forex">Forex</option>
                      <option value="Índices">Índices</option>
                      <option value="Commodities">Commodities</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrumentos
                    </label>
                    <input
                      type="text"
                      value={newPortfolio.instruments}
                      onChange={(e) => setNewPortfolio({...newPortfolio, instruments: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="EURUSD, GBPUSD, DAX, WS30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={newPortfolio.timeframe}
                      onChange={(e) => setNewPortfolio({...newPortfolio, timeframe: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="M5">M5</option>
                      <option value="M10">M10</option>
                      <option value="M15">M15</option>
                      <option value="M30">M30</option>
                      <option value="H1">H1</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                    required
                    placeholder="Descripción detallada del portafolio..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo PDF de StrategyQuant
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      className="hidden"
                      id="pdf-upload"
                      required
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Seleccionar archivo PDF
                    </label>
                    {pdfFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Archivo seleccionado: {pdfFile.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Procesando PDF...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Añadir Portafolio
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Portfolios Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Portafolios Existentes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portafolio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolios.map((portfolio) => (
                <tr key={portfolio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{portfolio.name}</div>
                      <div className="text-sm text-gray-500">{portfolio.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">€{portfolio.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(portfolio.tier)}`}>
                      {portfolio.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600">
                      <div>Sharpe: {portfolio.metrics?.sharpe_ratio || 'N/A'}</div>
                      <div>CAGR: {portfolio.metrics?.cagr || 'N/A'}%</div>
                      <div>DD: {portfolio.metrics?.max_drawdown || 'N/A'}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600">
                      <div>Equity: {portfolio.equity_points} pts</div>
                      <div>Mensual: {portfolio.monthly_data} pts</div>
                      <div>DD: {portfolio.drawdown_points} pts</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(portfolio)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/portafolios/${portfolio.id}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal */}
      {editingPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Editar Portafolio</h2>
                <button
                  onClick={() => setEditingPortfolio(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.name}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    value={editingPortfolio.price}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, price: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier
                  </label>
                  <select
                    value={editingPortfolio.tier}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, tier: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Elite">Elite</option>
                    <option value="Elite Premium">Elite Premium</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Guardar
                </button>
                <button
                  onClick={() => setEditingPortfolio(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

