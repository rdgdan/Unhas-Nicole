import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Plus } from 'lucide-react';
import './ServiceModal.css';

const ServiceModal = ({ isOpen, onClose, serviceToEdit }) => {
  const { services, serviceCategories, addService, updateService, addServiceCategory } = useData();

  // ESTADOS DO FORMULÁRIO
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // NOVOS ESTADOS PARA O FLUXO DE CRIAÇÃO DE CATEGORIA
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const isEditing = !!serviceToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditing) {
            setName(serviceToEdit.name || '');
            setPrice(serviceToEdit.price?.toString() || '');
            setDuration(serviceToEdit.duration?.toString() || '');
            setCategoryId(serviceToEdit.categoryId || '');
            setIsAvailable(serviceToEdit.isAvailable !== false);
        } else {
            // Limpa tudo ao abrir para um novo serviço
            setName('');
            setPrice('');
            setDuration('');
            setCategoryId('');
            setIsAvailable(true);
            setNewCategoryName('');
            setIsCreatingCategory(false);
        }
    }
  }, [isOpen, serviceToEdit, isEditing]);
  
  const handleClose = () => {
      if (isSaving) return;
      onClose();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalCategoryId = categoryId;

    if (isCreatingCategory) {
        if (!newCategoryName.trim()) {
            alert('Por favor, digite o nome da nova categoria.');
            return;
        }
    } else {
        if (!finalCategoryId) {
            alert('Por favor, selecione uma categoria.');
            return;
        }
    }

    if (!name || !price || !duration) {
      alert('Por favor, preencha todos os campos do serviço.');
      return;
    }

    setIsSaving(true);

    try {
        // Se estiver no modo de criação, crie a categoria primeiro
        if (isCreatingCategory) {
            const newCatId = await addServiceCategory(newCategoryName.trim());
            finalCategoryId = newCatId; // Use o ID da categoria recém-criada
        }

        const serviceData = {
          name: name.trim(),
          price: parseFloat(price),
          duration: parseInt(duration, 10),
          categoryId: finalCategoryId,
          isAvailable: isAvailable,
        };

        if (isEditing) {
            await updateService(serviceToEdit.id, serviceData);
        } else {
            await addService(serviceData);
        }
        handleClose();
    } catch (error) {
      console.error("Erro ao salvar o serviço:", error);
      alert('Ocorreu um erro ao tentar salvar. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
          <button className="close-btn" onClick={handleClose} disabled={isSaving}><X size={24} /></button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
                <label htmlFor="serviceName">Nome do Serviço</label>
                <input id="serviceName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Manicure e Pedicure" required />
            </div>

            {/* CAMPO DE CATEGORIA COM MODO DUPLO */}
            <div className="form-group">
                <label htmlFor="serviceCategory">Categoria</label>
                {isCreatingCategory ? (
                    <div className="create-category-wrapper">
                        <input 
                            type="text"
                            placeholder="Nome da nova categoria"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button type="button" className="toggle-category-mode-btn" onClick={() => setIsCreatingCategory(false)}>Selecionar Existente</button>
                    </div>
                ) : (
                    <div className="select-category-wrapper">
                        <select id="serviceCategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="" disabled>Selecione...</option>
                            {serviceCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <button type="button" className="toggle-category-mode-btn alt" onClick={() => setIsCreatingCategory(true)}>
                            <Plus size={16}/> Criar Nova
                        </button>
                    </div>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Preço (R$)</label>
                    <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="30.00" step="0.01" min="0" required />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duração (minutos)</label>
                    <input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" step="1" min="0" required />
                </div>
            </div>
             <div className="form-group">
                <label>Disponibilidade</label>
                <div className="availability-toggle">
                    <span className={!isAvailable ? 'toggle-label-active' : 'toggle-label'}>Indisponível</span>
                    <label className="switch">
                        <input type="checkbox" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
                        <span className="slider round"></span>
                    </label>
                    <span className={isAvailable ? 'toggle-label-active' : 'toggle-label'}>Disponível</span>
                </div>
            </div>
            <footer className="modal-footer">
                <button type="button" className="cancel-btn-modal" onClick={handleClose} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="save-btn-modal" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Serviço')}
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
