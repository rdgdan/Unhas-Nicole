import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { X, Save, PlusCircle } from 'lucide-react'; // Adicionado ícone PlusCircle
import './ClientEditModal.css';

Modal.setAppElement('#root');

const ClientEditModal = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  // Determina se estamos no modo de edição ou adição
  const isEditMode = Boolean(client);

  useEffect(() => {
    if (isEditMode) {
      setFormData({ 
        name: client.name || '', 
        phone: client.phone || '',
        email: client.email || '' 
      });
    } else {
      // Limpa o formulário para um novo cliente
      setFormData({ name: '', phone: '', email: '' });
    }
  }, [client, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose(); // Fechar o modal após salvar
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="modal-content" 
      overlayClassName="modal-overlay"
    >
      <div className="edit-modal-container">
        <header className="edit-modal-header">
          {/* Título dinâmico */}
          <h2>{isEditMode ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
          <button onClick={onClose} className="close-btn" aria-label="Fechar modal">
            <X size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <main className="edit-modal-body">
            <div className="form-group">
              <label htmlFor="name">Nome do Cliente</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Digite o nome completo'
              />
            </div>
             <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='exemplo@email.com'
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) 9XXXX-XXXX"
              />
            </div>
          </main>
          <footer className="edit-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            {/* Botão de salvar dinâmico */}
            <button type="submit" className="btn-save">
              {isEditMode ? <><Save size={18} /> Salvar Alterações</> : <><PlusCircle size={18} /> Adicionar Cliente</>}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
};

ClientEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ClientEditModal;
