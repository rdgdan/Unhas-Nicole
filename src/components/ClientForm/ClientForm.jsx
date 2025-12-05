
import React, { useState } from 'react';
import './ClientForm.css';

const ClientForm = ({ onSave, onCancel, client }) => {
  // Usa o estado inicial do cliente (se estiver a editar) ou um objeto vazio
  const [formData, setFormData] = useState(
    client || { name: '', serviceDate: '', nailModel: '', amount: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <div className="form-group">
        <label htmlFor="name">Nome</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="serviceDate">Data do Serviço</label>
          <input 
            type="date" 
            id="serviceDate" 
            name="serviceDate" 
            value={formData.serviceDate} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Valor (R$)</label>
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            step="0.01" 
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nailModel">Modelo</label>
        <input 
          type="text" 
          id="nailModel" 
          name="nailModel" 
          value={formData.nailModel} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
