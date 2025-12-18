import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted for new location

// Este componente é um \"porteiro\" para as rotas privadas.
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. Se ainda estamos verificando a autenticação, não renderize nada ainda.
  //    Isso evita o \"piscar\" da tela de login para um usuário já logado.
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  // 2. A verificação terminou. Se houver um usuário, permita o acesso à rota filha.
  //    Caso contrário, redirecione para a página de login.
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
