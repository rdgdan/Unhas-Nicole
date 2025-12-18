import React, { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
import DataMigrationTool from '../components/admin/DataMigrationTool';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' ou 'tools'

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie usuários e execute tarefas de manutenção do sistema.</p>
      </div>
      
      <div className="admin-page-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gerenciar Usuários
        </button>
        <button 
          className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Ferramentas do Sistema
        </button>
      </div>

      <div className="admin-page-content">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'tools' && <DataMigrationTool />}
      </div>
    </div>
  );
};

export default AdminPage;
