
import React from 'react';
import './ClientFilters.css';
import { FiSearch } from 'react-icons/fi';

// Receber as props para controlar o estado a partir do componente pai
const ClientFilters = ({ searchTerm, setSearchTerm, sortCriteria, setSortCriteria }) => {
  return (
    <div className="filters-container">
      <div className="filter-group search-filter">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou modelo..." 
          className="filter-input" 
          value={searchTerm} // Controlar o valor
          onChange={(e) => setSearchTerm(e.target.value)} // Atualizar o estado
        />
      </div>

      <div className="filter-group">
        <label>Ordenar por:</label>
        <select 
          className="filter-select"
          value={sortCriteria} // Controlar o valor
          onChange={(e) => setSortCriteria(e.target.value)} // Atualizar o estado
        >
          <option value="name-asc">Nome (A-Z)</option>
          <option value="name-desc">Nome (Z-A)</option>
          <option value="amount-desc">Valor (Maior)</option>
          <option value="amount-asc">Valor (Menor)</option>
          <option value="date-desc">Data (Recente)</option>
          <option value="date-asc">Data (Antiga)</option>
        </select>
      </div>
    </div>
  );
};

export default ClientFilters;
