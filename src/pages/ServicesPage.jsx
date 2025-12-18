import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import ServiceModal from '../components/ServiceModal';
import { Loader, Edit, Trash2, Search, PlusCircle } from 'lucide-react';
import './ServicesPage.css';

const ServicesPage = () => {
  const { services, loading, deleteService, updateService } = useData(); // Adicionar updateService
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const handleOpenModal = (service = null) => {
    setServiceToEdit(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setServiceToEdit(null);
    setIsModalOpen(false);
  };

  // --- NOVA FUNÇÃO PARA O INTERRUPTOR ---
  const handleToggleAvailability = async (serviceId, currentAvailability) => {
    try {
        // Otimisticamente atualiza a UI se desejar, mas vamos focar na atualização direta
        await updateService(serviceId, { isAvailable: !currentAvailability });
    } catch (error) {
        console.error("Erro ao atualizar a disponibilidade:", error);
        alert("Não foi possível alterar o status do serviço. Tente novamente.");
        // Reverter a UI se a atualização falhar (se tivermos feito uma atualização otimista)
    }
  };

  const processedServices = useMemo(() => {
    let filtered = services
      .filter(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(service => {
        if (filterAvailability === 'available') return service.isAvailable !== false;
        if (filterAvailability === 'unavailable') return service.isAvailable === false;
        return true;
      });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'name-asc':
        default: return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [services, searchQuery, sortBy, filterAvailability]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      try {
        await deleteService(id);
        if (serviceToEdit && serviceToEdit.id === id) {
            handleCloseModal();
        }
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Ocorreu um erro ao excluir.');
      }
    }
  };

  return (
    <div className="services-page-container">
      <ServiceModal isOpen={isModalOpen} onClose={handleCloseModal} serviceToEdit={serviceToEdit} />

      <header className="services-header">
        <div className="header-content">
            <h1>Meus Serviços</h1>
            <p>Gerencie os serviços que você oferece.</p>
        </div>
        <button className="add-service-btn" onClick={() => handleOpenModal()}>
            <PlusCircle size={20} />
            <span>Novo Serviço</span>
        </button>
      </header>

      <div className="service-list-card">
        <div className="service-list-controls">
            <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Buscar serviço..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="filter-sort-controls">
                 <select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)} className="control-select">
                    <option value="all">Todos</option>
                    <option value="available">Disponíveis</option>
                    <option value="unavailable">Indisponíveis</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="control-select">
                    <option value="name-asc">Nome (A-Z)</option>
                    <option value="name-desc">Nome (Z-A)</option>
                    <option value="price-asc">Preço (Menor)</option>
                    <option value="price-desc">Preço (Maior)</option>
                </select>
            </div>
        </div>

        {loading ? (
          <div className="loading-state"><Loader className="spin-icon" /><span>Carregando...</span></div>
        ) : services.length === 0 ? (
            <div className="empty-state">
                <p>Você ainda não tem serviços cadastrados.</p>
                <button className="add-service-btn-secondary" onClick={() => handleOpenModal()}>Criar Primeiro Serviço</button>
            </div>
        ) : processedServices.length === 0 ? (
            <div className="empty-state"><p>Nenhum serviço corresponde aos filtros selecionados.</p></div>
        ) : (
          <ul className="service-list">
            {processedServices.map(service => (
              <li key={service.id} className={`service-item ${service.isAvailable === false ? 'unavailable' : ''}`}>
                <div className="service-info">
                  <span className="service-name">{service.name}</span>
                  <span className="service-details">R$ {service.price.toFixed(2)} • {service.duration} min</span>
                </div>
                
                {/* --- INTERRUPTOR DE DISPONIBILIDADE NA LISTA --- */}
                <div className="service-actions">
                    <label className="list-switch-label">Disponível</label>
                    <label className="switch-list-item">
                        <input 
                            type="checkbox" 
                            checked={service.isAvailable !== false} 
                            onChange={() => handleToggleAvailability(service.id, service.isAvailable !== false)} 
                        />
                        <span className="slider round"></span>
                    </label>
                  <button onClick={() => handleOpenModal(service)} className="icon-btn" title="Editar"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(service.id)} className="icon-btn" title="Excluir"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
