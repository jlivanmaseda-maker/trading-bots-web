import React, { useState, useEffect } from 'react';
import { Activity, Filter, Download, Trash2, Search, Calendar, User, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../auth/AuthProvider';

const ActivityLogger = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    action: 'all',
    user: 'all',
    dateRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [logs, filters]);

  const loadLogs = () => {
    const savedLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    setLogs(savedLogs);
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filtro por acción
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Filtro por usuario
    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.user === filters.user);
    }

    // Filtro por fecha
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate);
      }
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.description.toLowerCase().includes(searchTerm) ||
        log.user.toLowerCase().includes(searchTerm) ||
        log.action.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLogs(filtered);
  };

  const calculateStats = () => {
    const actionCounts = {};
    const userCounts = {};
    let todayCount = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logs.forEach(log => {
      // Contar acciones
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      
      // Contar usuarios
      userCounts[log.user] = (userCounts[log.user] || 0) + 1;
      
      // Contar actividad de hoy
      const logDate = new Date(log.timestamp);
      if (logDate >= today) {
        todayCount++;
      }
    });

    setStats({
      total: logs.length,
      today: todayCount,
      actions: actionCounts,
      users: userCounts,
      mostActiveUser: Object.keys(userCounts).reduce((a, b) => 
        userCounts[a] > userCounts[b] ? a : b, ''
      ),
      mostCommonAction: Object.keys(actionCounts).reduce((a, b) => 
        actionCounts[a] > actionCounts[b] ? a : b, ''
      )
    });
  };

  const clearLogs = () => {
    if (!confirm('¿Estás seguro de eliminar todos los logs? Esta acción no se puede deshacer.')) {
      return;
    }

    localStorage.setItem('admin_logs', JSON.stringify([]));
    setLogs([]);
    
    // Log de la acción de limpieza
    const clearLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user?.name || 'Sistema',
      action: 'logs_clear',
      description: 'Eliminó todos los logs de actividad',
      ip: 'localhost'
    };
    
    localStorage.setItem('admin_logs', JSON.stringify([clearLog]));
    setLogs([clearLog]);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity_logs_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'login': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'logout': return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'create': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'edit': return <Info className="h-4 w-4 text-yellow-600" />;
      case 'delete': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'backup_create': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'backup_restore': return <Info className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action) => {
    const variants = {
      login: 'default',
      logout: 'secondary',
      create: 'default',
      edit: 'secondary',
      delete: 'destructive',
      backup_create: 'default',
      backup_restore: 'secondary',
      access: 'outline'
    };
    
    return <Badge variant={variants[action] || 'outline'}>{action}</Badge>;
  };

  const uniqueUsers = [...new Set(logs.map(log => log.user))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-green-600">{stats.today || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuario Más Activo</p>
                <p className="text-lg font-bold text-purple-600">{stats.mostActiveUser || 'N/A'}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Acción Más Común</p>
                <p className="text-lg font-bold text-orange-600">{stats.mostCommonAction || 'N/A'}</p>
              </div>
              <Filter className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Controles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todas las acciones</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select
                value={filters.user}
                onChange={(e) => setFilters({...filters, user: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos los usuarios</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todo el tiempo</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Buscar en logs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportLogs} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar ({filteredLogs.length})
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Logs
            </Button>
            <Button onClick={loadLogs} variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de logs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Logs de Actividad ({filteredLogs.length} de {logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay logs que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.slice(0, 100).map((log) => (
                <div key={log.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getActionIcon(log.action)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{log.user}</span>
                          {getActionBadge(log.action)}
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{log.description}</p>
                        {log.ip && (
                          <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredLogs.length > 100 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">
                    Mostrando los primeros 100 logs. Usa filtros para refinar la búsqueda.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogger;

