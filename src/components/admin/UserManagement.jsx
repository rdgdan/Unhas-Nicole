import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, updateUserRoles } from '../../services/firestoreService';
import { Loader, Search, AlertTriangle, Users } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (err) {
        setError('Falha ao carregar a lista de usuários.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRoles) => {
    // Para evitar que o admin se remova por acidente
    if (newRoles.length === 0) {
        if (!window.confirm("Tem certeza que deseja remover as permissões de administrador deste usuário?")) {
            return;
        }
    }
    try {
      await updateUserRoles(userId, newRoles);
      setUsers(users.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
    } catch (err) {
      alert('Falha ao atualizar as permissões do usuário.');
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-feedback-state">
          <Loader className="spin-icon" size={32} />
          <p>Carregando usuários...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-feedback-state error">
          <AlertTriangle size={32} />
          <p>{error}</p>
        </div>
      );
    }

    if (users.length === 0) {
        return (
            <div className="admin-feedback-state">
              <Users size={32} />
              <p>Nenhum usuário cadastrado no sistema ainda.</p>
            </div>
        );
    }
    
    if (filteredUsers.length === 0) {
        return (
            <div className="admin-feedback-state">
              <p>Nenhum usuário encontrado com o termo "{searchQuery}".</p>
            </div>
        );
    }

    return (
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Data de Cadastro</th>
              <th>Permissão de Admin</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}</td>
                <td>
                  <label className="switch-list-item" title={`Tornar ${user.email} admin`}>
                    <input 
                      type="checkbox" 
                      checked={user.roles?.includes('admin') || false}
                      onChange={(e) => {
                        const newRoles = e.target.checked ? ['admin'] : [];
                        handleRoleChange(user.id, newRoles);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>Lista de Usuários</h2>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por e-mail..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading || users.length === 0}
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default UserManagement;
