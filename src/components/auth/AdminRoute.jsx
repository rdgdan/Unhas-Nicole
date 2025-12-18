import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted for new location
import LoadingScreen from '../common/LoadingScreen'; // Adjusted for new location

// Este componente \"porteiro\" verifica se o usuário está logado E se ele é um admin.
const AdminRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();

  // Se ainda estiver carregando os dados do usuário, exibe a tela de carregamento.
  if (loading || !userProfile) {
    return <LoadingScreen />;
  }

  // Verifica se o perfil do usuário inclui a role 'admin'.
  const isAdmin = userProfile.roles?.includes('admin');

  // Se o usuário estiver logado E for um admin, permite o acesso.
  if (currentUser && isAdmin) {
    return children;
  }

  // Caso contrário, redireciona para a página de dashboard (uma melhoria de UX).
  // O usuário já está logado, então não faz sentido mandá-lo para /login.
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
