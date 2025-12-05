
import React, { useState, useMemo } from 'react';
import ClientList from '../components/ClientList/ClientList';
import ClientFilters from '../components/ClientFilters/ClientFilters';
import Modal from '../components/Modal/Modal'; // 1. IMPORTAR
import ClientForm from '../components/ClientForm/ClientForm'; // 1. IMPORTAR
import { mockClients } from '../data/mockClients';
import { FiPlus } from 'react-icons/fi';
import './ClientListPage.css';

const ClientListPage = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name-asc');

  // 2. ESTADOS PARA O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // null para novo, objeto para editar

  // 3. FUNÇÕES DE CONTROLO DO MODAL E SAVE
  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      // Editar cliente
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
    } else {
      // Adicionar novo cliente (usando um ID simples por agora)
      const newClient = { ...clientData, id: Date.now().toString() };
      setClients([newClient, ...clients]);
    }
    handleCloseModal();
  };
  
  const handleDeleteClient = (clientId) => {
      setClients(clients.filter(c => c.id !== clientId));
  }

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];
    if (searchTerm) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nailModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const [key, order] = sortCriteria.split('-');
    result.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (key === 'serviceDate') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [clients, searchTerm, sortCriteria]);

  return (
    <div className="page-container client-list-page">
      <header className="page-header">
        <h1 className="page-title">Meus Clientes</h1>
        {/* Ligar o botão para abrir o modal para um NOVO cliente */}
        <button className="add-client-btn" onClick={() => handleOpenModal()}>
          <FiPlus />
          <span>Cadastrar Cliente</span>
        </button>
      </header>
      
      <ClientFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
      />
      
      {/* 5. PASSAR AS FUNÇÕES PARA A LISTA */}
      <ClientList 
        clients={filteredAndSortedClients} 
        onEdit={handleOpenModal} // Passa a função de abrir o modal para edição
        onDelete={handleDeleteClient}
      />

      {/* 4. RENDERIZAR O MODAL CONDICIONALMENTE */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
      >
        <ClientForm 
          onSave={handleSaveClient} 
          onCancel={handleCloseModal}
          client={editingClient}
        />
      </Modal>
    </div>
  );
};

export default ClientListPage;
