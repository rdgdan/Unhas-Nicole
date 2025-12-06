import React from 'react';
import './DashboardFilters.css';

const DashboardFilters = ({
  nailModelFilter,
  setNailModelFilter,
  dateRange,
  setDateRange,
  allNailModels, // Recebe a lista de todos os modelos de unha únicos
  onClearFilters // Recebe a função para limpar os filtros
}) => {

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-filters">
      {/* Filtro por Modelo de Unha */}
      <div className="filter-group">
        <label htmlFor="nail-model-filter">Modelo de Unha</label>
        <select
          id="nail-model-filter"
          value={nailModelFilter}
          onChange={(e) => setNailModelFilter(e.target.value)}
        >
          <option value="all">Todos os Modelos</option>
          {allNailModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {/* Filtro por Intervalo de Datas */}
      <div className="filter-group">
        <label htmlFor="start">Data Inicial</label>
        <input
          type="date"
          id="start"
          name="start"
          value={dateRange.start}
          onChange={handleDateChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="end">Data Final</label>
        <input
          type="date"
          id="end"
          name="end"
          value={dateRange.end}
          onChange={handleDateChange}
        />
      </div>
      <div className="filter-group-action">
         <button onClick={onClearFilters} className="clear-filters-btn">
            Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default DashboardFilters;
