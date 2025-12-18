import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { migrateDataToUser } from '../../services/firestoreService';

const DataMigrationTool = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMigrate = async () => {
    if (!currentUser) {
      setMessage('Erro: Você precisa estar logado para realizar a migração.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await migrateDataToUser(currentUser.uid);
      const { migratedClients, migratedServices } = result;

      if (migratedClients === 0 && migratedServices === 0) {
        setMessage('Nenhum dado precisava ser migrado. Tudo já está em ordem!');
      } else {
        setMessage(`Migração concluída com sucesso! Clientes migrados: ${migratedClients}. Serviços migrados: ${migratedServices}.`);
      }

    } catch (error) {
      console.error("Erro na migração:", error);
      setMessage(`Ocorreu um erro durante a migração: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-section">
      <h2>Migração de Dados Antigos</h2>
      <p>Esta ação associará todos os clientes e serviços cadastrados (que ainda não têm um dono) ao seu usuário atual.</p>
      <p>É útil para recuperar dados criados antes da implementação do sistema de múltiplos usuários.</p>
      
      <button onClick={handleMigrate} disabled={isLoading || !currentUser}>
        {isLoading ? 'Migrando...' : 'Migrar Dados Antigos para Meu Usuário'}
      </button>
      
      {message && <div className="feedback-message">{message}</div>}
      {!currentUser && <div className="error-message">Por favor, faça login para usar esta ferramenta.</div>}
    </div>
  );
};

export default DataMigrationTool;
