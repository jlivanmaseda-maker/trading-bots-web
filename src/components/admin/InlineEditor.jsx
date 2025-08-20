import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X, DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const InlineEditor = ({ 
  value, 
  onSave, 
  type = 'text', 
  placeholder = '', 
  className = '',
  prefix = '',
  suffix = '',
  validation = null,
  formatDisplay = null 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleEdit = () => {
    setEditValue(value);
    setError('');
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validación
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Convertir valor según el tipo
    let processedValue = editValue;
    if (type === 'number') {
      processedValue = parseFloat(editValue);
      if (isNaN(processedValue)) {
        setError('Debe ser un número válido');
        return;
      }
    }

    onSave(processedValue);
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const displayValue = formatDisplay ? formatDisplay(value) : `${prefix}${value}${suffix}`;

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className={`px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          />
          <Button size="sm" onClick={handleSave} className="h-7 w-7 p-0">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 w-7 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div 
      className="group flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
      onClick={handleEdit}
    >
      <span className={className}>{displayValue}</span>
      <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const MetricEditor = ({ label, value, onSave, type, icon: Icon, color = 'blue', ...props }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 text-${color}-600`} />}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <InlineEditor
        value={value}
        onSave={onSave}
        type={type}
        className="font-semibold"
        {...props}
      />
    </div>
  );
};

const PriceEditor = ({ value, onSave }) => {
  const validation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return 'El precio debe ser mayor a 0';
    if (num > 10000) return 'El precio no puede exceder €10,000';
    return null;
  };

  const formatDisplay = (val) => `€${parseFloat(val).toLocaleString()}`;

  return (
    <MetricEditor
      label="Precio"
      value={value}
      onSave={onSave}
      type="number"
      icon={DollarSign}
      color="green"
      validation={validation}
      formatDisplay={formatDisplay}
      placeholder="2499"
    />
  );
};

const SharpeEditor = ({ value, onSave }) => {
  const validation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 'Debe ser un número válido';
    if (num < 0) return 'El Sharpe Ratio no puede ser negativo';
    if (num > 20) return 'Valor muy alto, verifica el dato';
    return null;
  };

  return (
    <MetricEditor
      label="Sharpe Ratio"
      value={value}
      onSave={onSave}
      type="number"
      icon={TrendingUp}
      color="blue"
      validation={validation}
      placeholder="7.35"
    />
  );
};

const CAGREditor = ({ value, onSave }) => {
  const validation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 'Debe ser un número válido';
    if (num < -100) return 'CAGR no puede ser menor a -100%';
    if (num > 1000) return 'Valor muy alto, verifica el dato';
    return null;
  };

  const formatDisplay = (val) => `${parseFloat(val).toFixed(1)}%`;

  return (
    <MetricEditor
      label="CAGR"
      value={value}
      onSave={onSave}
      type="number"
      icon={BarChart3}
      color="purple"
      validation={validation}
      formatDisplay={formatDisplay}
      placeholder="56.4"
    />
  );
};

const DrawdownEditor = ({ value, onSave }) => {
  const validation = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 'Debe ser un número válido';
    if (num < 0) return 'Ingresa el valor sin signo negativo';
    if (num > 100) return 'Drawdown no puede ser mayor a 100%';
    return null;
  };

  const formatDisplay = (val) => `-${parseFloat(val).toFixed(1)}%`;

  return (
    <MetricEditor
      label="Max Drawdown"
      value={value}
      onSave={onSave}
      type="number"
      icon={TrendingDown}
      color="red"
      validation={validation}
      formatDisplay={formatDisplay}
      placeholder="11.7"
    />
  );
};

const TierEditor = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const tiers = ['Premium', 'Elite Premium', 'Professional', 'Institutional'];

  if (isEditing) {
    return (
      <div className="space-y-2">
        <select
          value={value}
          onChange={(e) => {
            onSave(e.target.value);
            setIsEditing(false);
          }}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        >
          {tiers.map(tier => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-7 w-7 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Tier</label>
      <div 
        className="group flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={() => setIsEditing(true)}
      >
        <Badge variant={value === 'Elite Premium' ? 'default' : 'secondary'}>
          {value}
        </Badge>
        <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

const DescriptionEditor = ({ value, onSave }) => {
  const validation = (val) => {
    if (val.length < 10) return 'La descripción debe tener al menos 10 caracteres';
    if (val.length > 500) return 'La descripción no puede exceder 500 caracteres';
    return null;
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Descripción</label>
      <InlineEditor
        value={value}
        onSave={onSave}
        type="text"
        validation={validation}
        placeholder="Descripción del portafolio..."
        className="text-sm text-gray-600"
      />
    </div>
  );
};

export {
  InlineEditor,
  MetricEditor,
  PriceEditor,
  SharpeEditor,
  CAGREditor,
  DrawdownEditor,
  TierEditor,
  DescriptionEditor
};

