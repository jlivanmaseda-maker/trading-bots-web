import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit, Trash2, Eye, Download, Save, X, AlertCircle, CheckCircle, LogOut, User, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../components/auth/AuthProvider';
import LoginForm from '../components/auth/LoginForm';
import realPortfolioData from '../data/real_portfolio_data.json';

const AdminPanelSecure = () => {
  const { isAuthenticated, user, logout, logActivity } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  
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

  // Cargar datos al inicializar
  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolios();
      loadLogs();
      logActivity('access', 'Accedió al panel de administración');
    }
  }, [isAuthenticated]);

  const loadPortfolios = () => {
    // Simular carga de portafolios desde localStorage o API
    const savedPortfolios = localStorage.getItem('admin_portfolios');
    if (savedPortfolios) {
      setPortfolios(JSON.parse(savedPortfolios));
    } else {
      // Datos iniciales basados en real_portfolio_data.json
      const initialPortfolios = Object.keys(realPortfolioData).map((key, index) => ({
        id: index + 1,
        name: `Portfolio ${index + 1}`,
        description: `Portafolio avanzado con ${realPortfolioData[key].equity_curve.length * 1000 + Math.floor(Math.random() * 10000)} operaciones`,
        price: Math.floor(Math.random() * 1000) + 1500,
        tier: 'Elite Premium',
        category: 'Multi-Asset',
        metrics: {
          sharpe: (Math.random() * 3 + 4).toFixed(2),
          cagr: (Math.random() * 20 + 25).toFixed(1),
          maxDrawdown: (Math.random() * 5 + 5).toFixed(1),
          operations: realPortfolioData[key].equity_curve.length * 1000 + Math.floor(Math.random() * 10000)
        },
        data: {
          equity: realPortfolioData[key].equity_curve.length,
          monthly: realPortfolioData[key].monthly_returns.length,
          drawdown: realPortfolioData[key].drawdown_curve.length
        },
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }));
      setPortfolios(initialPortfolios);
      savePortfolios(initialPortfolios);
    }
  };

  const loadLogs = () => {
    const savedLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    setLogs(savedLogs);
  };

  const savePortfolios = (portfolioList) => {
    localStorage.setItem('admin_portfolios', JSON.stringify(portfolioList));
    // Crear backup automático
    const backup = {
      timestamp: new Date().toISOString(),
      data: portfolioList,
      user: user?.name || 'Sistema'
    };
    const backups = JSON.parse(localStorage.getItem('admin_backups') || '[]');
    backups.unshift(backup);
    // Mantener solo los últimos 10 backups
    if (backups.length > 10) {
      backups.splice(10);
    }
    localStorage.setItem('admin_backups', JSON.stringify(backups));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const portfolio = {
        id: portfolios.length + 1,
        ...newPortfolio,
        price: parseFloat(newPortfolio.price),
        metrics: {
          sharpe: (Math.random() * 3 + 4).toFixed(2),
          cagr: (Math.random() * 20 + 25).toFixed(1),
          maxDrawdown: (Math.random() * 5 + 5).toFixed(1),
          operations: Math.floor(Math.random() * 20000) + 10000
        },
        data: {
          equity: 14,
          monthly: 84,
          drawdown: 10
        },
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      const updatedPortfolios = [...portfolios, portfolio];
      setPortfolios(updatedPortfolios);
      savePortfolios(updatedPortfolios);
      
      logActivity('create', `Creó el portafolio "${portfolio.name}"`);
      showNotification('Portafolio añadido exitosamente');
      
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
      setShowAddForm(false);
    } catch (error) {
      showNotification('Error al añadir portafolio', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditPortfolio = (portfolio) => {
    setEditingPortfolio({ ...portfolio });
  };

  const handleSaveEdit = () => {
    const updatedPortfolios = portfolios.map(p => 
      p.id === editingPortfolio.id 
        ? { ...editingPortfolio, lastModified: new Date().toISOString() }
        : p
    );
    setPortfolios(updatedPortfolios);
    savePortfolios(updatedPortfolios);
    
    logActivity('edit', `Editó el portafolio "${editingPortfolio.name}"`);
    showNotification('Portafolio actualizado exitosamente');
    setEditingPortfolio(null);
  };

  const handleDeletePortfolio = (id) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (confirm(`¿Estás seguro de eliminar "${portfolio.name}"?`)) {
      const updatedPortfolios = portfolios.filter(p => p.id !== id);
      setPortfolios(updatedPortfolios);
      savePortfolios(updatedPortfolios);
      
      logActivity('delete', `Eliminó el portafolio "${portfolio.name}"`);
      showNotification('Portafolio eliminado exitosamente');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const stats = {
    totalPortfolios: portfolios.length,
    averagePrice: portfolios.length > 0 ? Math.round(portfolios.reduce((sum, p) => sum + p.price, 0) / portfolios.length) : 0,
    eliteCount: portfolios.filter(p => p.tier === 'Elite Premium').length,
    totalDataPoints: portfolios.reduce((sum, p) => sum + p.data.equity + p.data.monthly + p.data.drawdown, 0)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header con información del usuario */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona portafolios, bots y configuraciones del sistema</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user.name}</span>
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'portfolios', label: 'Portafolios', icon: Eye },
          { id: 'logs', label: 'Logs de Actividad', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Portafolios</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalPortfolios}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
                    <p className="text-3xl font-bold text-green-600">€{stats.averagePrice}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Elite Premium</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.eliteCount}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Datos Extraídos</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalDataPoints}</p>
                  </div>
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Gestión de Portafolios */}
      {activeTab === 'portfolios' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Portafolios Existentes</h2>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir Nuevo Portafolio
            </Button>
          </div>

          {/* Formulario de añadir portafolio */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Añadir Nuevo Portafolio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPortfolio} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Portafolio
                      </label>
                      <input
                        type="text"
                        required
                        value={newPortfolio.name}
                        onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Factor K Elite 10.2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newPortfolio.price}
                        onChange={(e) => setNewPortfolio({...newPortfolio, price: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2499"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      required
                      value={newPortfolio.description}
                      onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Descripción detallada del portafolio..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? 'Añadiendo...' : 'Añadir Portafolio'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de portafolios */}
          <div className="space-y-4">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id}>
                <CardContent className="p-6">
                  {editingPortfolio && editingPortfolio.id === portfolio.id ? (
                    // Modo edición
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={editingPortfolio.name}
                          onChange={(e) => setEditingPortfolio({...editingPortfolio, name: e.target.value})}
                          className="p-2 border rounded-md"
                        />
                        <input
                          type="number"
                          value={editingPortfolio.price}
                          onChange={(e) => setEditingPortfolio({...editingPortfolio, price: parseFloat(e.target.value)})}
                          className="p-2 border rounded-md"
                        />
                        <select
                          value={editingPortfolio.tier}
                          onChange={(e) => setEditingPortfolio({...editingPortfolio, tier: e.target.value})}
                          className="p-2 border rounded-md"
                        >
                          <option value="Premium">Premium</option>
                          <option value="Elite Premium">Elite Premium</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>
                      <textarea
                        value={editingPortfolio.description}
                        onChange={(e) => setEditingPortfolio({...editingPortfolio, description: e.target.value})}
                        className="w-full p-2 border rounded-md"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm">
                          <Save className="h-4 w-4 mr-1" />
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setEditingPortfolio(null)} size="sm">
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{portfolio.name}</h3>
                          <Badge variant={portfolio.tier === 'Elite Premium' ? 'default' : 'secondary'}>
                            {portfolio.tier}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{portfolio.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Precio:</span>
                            <div className="font-semibold text-green-600">€{portfolio.price}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Sharpe:</span>
                            <div className="font-semibold">{portfolio.metrics.sharpe}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">CAGR:</span>
                            <div className="font-semibold">{portfolio.metrics.cagr}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Operaciones:</span>
                            <div className="font-semibold">{portfolio.metrics.operations.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPortfolio(portfolio)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/portafolios/${portfolio.id}`, '_blank')}
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Logs de Actividad */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Logs de Actividad</h2>
            <Button variant="outline" onClick={loadLogs}>
              <Activity className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.slice(0, 50).map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={
                            log.action === 'login' ? 'default' :
                            log.action === 'logout' ? 'secondary' :
                            log.action === 'create' ? 'default' :
                            log.action === 'edit' ? 'secondary' :
                            log.action === 'delete' ? 'destructive' : 'outline'
                          }>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanelSecure;

