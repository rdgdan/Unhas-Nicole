import React from 'react';
import UserManagement from '../components/admin/UserManagement';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie todos os usuários do sistema.</p>
      </div>
      
      <div className="admin-page-content">
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminPage;
