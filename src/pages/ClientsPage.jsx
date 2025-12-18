import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import ClientEditModal from '../components/ClientEditModal'; // Corrigido o nome do modal
import Pagination from '../components/Pagination'; // Importando a Paginação
import { Plus, Edit, Trash2, User, Phone, Mail, Loader } from 'lucide-react';
import './ClientsPage.css';

const ClientsPage = () => {
  const { clients, addClient, updateClient, deleteClient, loading } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  // --- LÓGICA DE PAGINAÇÃO (Transplantada do componente antigo) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9); // 9 para um grid 3x3

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Filtra os clientes para a página atual
  const currentClients = clients.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(clients.length / recordsPerPage);
  // --- FIM DA LÓGICA DE PAGINAÇÃO ---


  const handleOpenModal = (client = null) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentClient(null);
    setIsModalOpen(false);
  };

  const handleSave = async (clientData) => {
    try {
      if (currentClient) {
        await updateClient(currentClient.id, clientData);
      } else {
        await addClient(clientData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação pode apagar agendamentos associados.')) {
      try {
        await deleteClient(clientId);
        // Lógica para voltar a página se o último item for excluído
        if (currentClients.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  return (
    <div className="clients-container">
      <header className="clients-header">
        <h1>Meus Clientes</h1>
        <button onClick={() => handleOpenModal()} className="btn-add-client">
          <Plus size={20} /> Adicionar Cliente
        </button>
      </header>

      {loading && !clients.length && 
        <div className="loading-state">
          <Loader className="spin-icon" /> Carregando clientes...
        </div>
      }

      {!loading && clients.length === 0 &&
          <div className="empty-state">
              <p>Nenhum cliente cadastrado.</p>
              <p>Clique em "Adicionar Cliente" para começar.</p>
          </div>
      }

      <div className="client-list">
        {/* Mapeando sobre os clientes da página atual */}
        {currentClients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-card-header">
              <div className="client-avatar"> <User /> </div>
              <h3>{client.name}</h3>
            </div>
            <div className="client-card-body">
              {client.phone && <p><Phone size={14} /> {client.phone}</p>}
              {client.email && <p><Mail size={14} /> {client.email}</p>}
              {!client.phone && !client.email && <p className="text-secondary-dark">Nenhum contato salvo</p>}
            </div>
            <div className="client-card-actions">
              <button onClick={() => handleOpenModal(client)} className="btn-edit" aria-label="Editar cliente">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(client.id)} className="btn-delete" aria-label="Excluir cliente">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Renderizando a Paginação */}
      {nPages > 1 && (
          <Pagination
              nPages={nPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
          />
      )}

      {isModalOpen && 
        <ClientEditModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal} 
          onSave={handleSave} 
          client={currentClient} 
        />
      }
    </div>
  );
};

export default ClientsPage;
