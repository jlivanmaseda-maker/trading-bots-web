import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Filter, X } from 'lucide-react'

const PortfolioFilters = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    factorK: 'all',
    regime: 'all',
    drawdown: 'all'
  })

  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      factorK: 'all',
      regime: 'all',
      drawdown: 'all'
    }
    setActiveFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== 'all')

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtrar Portafolios</h3>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </Button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Factor K Elite Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factor K Elite
              </label>
              <select
                value={activeFilters.factorK}
                onChange={(e) => handleFilterChange('factorK', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="high">Alto (&gt; 7.0)</option>
                <option value="medium">Medio (6.0 - 7.0)</option>
                <option value="low">Bajo (&lt; 6.0)</option>
              </select>
            </div>

            {/* Market Regime Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Régimen de Mercado
              </label>
              <select
                value={activeFilters.regime}
                onChange={(e) => handleFilterChange('regime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="bull">Alcista (Bull)</option>
                <option value="bear">Bajista (Bear)</option>
                <option value="sideways">Lateral (Sideways)</option>
              </select>
            </div>

            {/* Drawdown Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo Drawdown
              </label>
              <select
                value={activeFilters.drawdown}
                onChange={(e) => handleFilterChange('drawdown', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="very-low">&lt; 1%</option>
                <option value="low">1% - 2%</option>
                <option value="medium">2% - 5%</option>
                <option value="high">&gt; 5%</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                <span>Limpiar Filtros</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.factorK !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Factor K: {activeFilters.factorK}
              <button
                onClick={() => handleFilterChange('factorK', 'all')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {activeFilters.regime !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Régimen: {activeFilters.regime}
              <button
                onClick={() => handleFilterChange('regime', 'all')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {activeFilters.drawdown !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Drawdown: {activeFilters.drawdown}
              <button
                onClick={() => handleFilterChange('drawdown', 'all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default PortfolioFilters

