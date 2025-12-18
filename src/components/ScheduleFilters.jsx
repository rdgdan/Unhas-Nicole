import React from 'react';
import PropTypes from 'prop-types';
import { Search, ListFilter, Calendar, DollarSign } from 'lucide-react';
import './ScheduleFilters.css';

const ScheduleFilters = ({ filters, setFilters, services }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    // Se a data for desmarcada, o valor é uma string vazia. Enviamos null.
    setFilters(prev => ({ ...prev, date: e.target.value || null }));
  };

  return (
    <div className="schedule-filters">
      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="searchTerm"><Search size={16} /> Cliente</label>
          <input 
            type="text"
            id="searchTerm"
            name="searchTerm"
            placeholder="Nome do cliente..."
            value={filters.searchTerm}
            onChange={handleInputChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="service"><ListFilter size={16} /> Serviço</label>
          <select 
            id="service"
            name="service"
            value={filters.service}
            onChange={handleInputChange}
          >
            <option value="all">Todos os serviços</option>
            {(services || []).map(service => (
              <option key={service.id} value={service.name}>{service.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="date"><Calendar size={16} /> Data</label>
          <input 
            type="date"
            id="date"
            name="date"
            value={filters.date || ''} // Input de data espera '' em vez de null
            onChange={handleDateChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="paymentStatus"><DollarSign size={16} /> Pagamento</label>
          <select 
            id="paymentStatus"
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleInputChange}
          >
            <option value="all">Todos</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>
    </div>
  );
};

ScheduleFilters.propTypes = {
  filters: PropTypes.shape({
    searchTerm: PropTypes.string,
    service: PropTypes.string,
    date: PropTypes.string,
    paymentStatus: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
};

export default ScheduleFilters;
