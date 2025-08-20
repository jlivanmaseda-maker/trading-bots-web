import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Clock, Database, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../auth/AuthProvider';

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user, logActivity } = useAuth();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const savedBackups = JSON.parse(localStorage.getItem('admin_backups') || '[]');
    setBackups(savedBackups);
  };

  const createBackup = async () => {
    setIsCreating(true);
    
    try {
      // Obtener todos los datos del sistema
      const portfolios = JSON.parse(localStorage.getItem('admin_portfolios') || '[]');
      const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
      const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
      
      const backup = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        user: user?.name || 'Sistema',
        type: 'manual',
        size: calculateDataSize({ portfolios, logs, settings }),
        data: {
          portfolios,
          logs: logs.slice(0, 100), // Solo últimos 100 logs
          settings,
          version: '1.0',
          metadata: {
            portfolioCount: portfolios.length,
            logCount: logs.length,
            createdBy: user?.name || 'Sistema'
          }
        }
      };

      const existingBackups = JSON.parse(localStorage.getItem('admin_backups') || '[]');
      const updatedBackups = [backup, ...existingBackups];
      
      // Mantener solo los últimos 20 backups
      if (updatedBackups.length > 20) {
        updatedBackups.splice(20);
      }
      
      localStorage.setItem('admin_backups', JSON.stringify(updatedBackups));
      setBackups(updatedBackups);
      
      logActivity('backup_create', `Creó backup manual: ${backup.id}`);
      showNotification('Backup creado exitosamente', 'success');
      
    } catch (error) {
      showNotification('Error al crear backup', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const restoreBackup = async (backup) => {
    if (!confirm(`¿Estás seguro de restaurar el backup del ${new Date(backup.timestamp).toLocaleString()}? Esto sobrescribirá todos los datos actuales.`)) {
      return;
    }

    setIsRestoring(true);
    
    try {
      // Crear backup de seguridad antes de restaurar
      await createBackup();
      
      // Restaurar datos
      const { portfolios, logs, settings } = backup.data;
      
      localStorage.setItem('admin_portfolios', JSON.stringify(portfolios));
      localStorage.setItem('admin_logs', JSON.stringify(logs));
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      
      logActivity('backup_restore', `Restauró backup: ${backup.id}`);
      showNotification('Backup restaurado exitosamente. Recarga la página para ver los cambios.', 'success');
      
    } catch (error) {
      showNotification('Error al restaurar backup', 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = (backupId) => {
    if (!confirm('¿Estás seguro de eliminar este backup?')) {
      return;
    }

    const updatedBackups = backups.filter(b => b.id !== backupId);
    localStorage.setItem('admin_backups', JSON.stringify(updatedBackups));
    setBackups(updatedBackups);
    
    logActivity('backup_delete', `Eliminó backup: ${backupId}`);
    showNotification('Backup eliminado', 'success');
  };

  const downloadBackup = (backup) => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${backup.id}_${new Date(backup.timestamp).toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logActivity('backup_download', `Descargó backup: ${backup.id}`);
  };

  const uploadBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        
        // Validar estructura del backup
        if (!backupData.data || !backupData.timestamp) {
          throw new Error('Formato de backup inválido');
        }

        // Añadir a la lista de backups
        const updatedBackups = [backupData, ...backups];
        localStorage.setItem('admin_backups', JSON.stringify(updatedBackups));
        setBackups(updatedBackups);
        
        logActivity('backup_upload', `Subió backup: ${backupData.id}`);
        showNotification('Backup subido exitosamente', 'success');
        
      } catch (error) {
        showNotification('Error al procesar el archivo de backup', 'error');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const calculateDataSize = (data) => {
    const sizeInBytes = new Blob([JSON.stringify(data)]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return (
    <div className="space-y-6">
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

      {/* Controles principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestión de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={createBackup}
              disabled={isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Crear Backup
                </>
              )}
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={uploadBackup}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Backup
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={loadBackups}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Información sobre Backups:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Los backups se crean automáticamente al modificar portafolios</li>
                  <li>• Se mantienen los últimos 20 backups automáticamente</li>
                  <li>• Puedes descargar backups para almacenamiento externo</li>
                  <li>• La restauración sobrescribe todos los datos actuales</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de backups */}
      <Card>
        <CardHeader>
          <CardTitle>Backups Disponibles ({backups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay backups disponibles</p>
              <p className="text-sm">Crea tu primer backup para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => {
                const { date, time } = formatTimestamp(backup.timestamp);
                return (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{date}</span>
                            <span className="text-sm text-gray-600">{time}</span>
                          </div>
                          <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                            {backup.type === 'manual' ? 'Manual' : 'Automático'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Usuario:</span>
                            <div className="font-medium">{backup.user}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Portafolios:</span>
                            <div className="font-medium">{backup.data.metadata?.portfolioCount || 0}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Tamaño:</span>
                            <div className="font-medium">{backup.size}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">ID:</span>
                            <div className="font-mono text-xs">{backup.id}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadBackup(backup)}
                          title="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreBackup(backup)}
                          disabled={isRestoring}
                          title="Restaurar"
                        >
                          {isRestoring ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBackup(backup.id)}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;

