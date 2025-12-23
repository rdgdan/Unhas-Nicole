import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth(); // Usando o novo estado isAdmin

  // Se ainda estiver carregando, exibe a tela de carregamento.
  if (loading) {
    return <LoadingScreen />;
  }

  // Se o usuário estiver logado E for um admin, permite o acesso.
  if (currentUser && isAdmin) {
    return children;
  }

  // Se não for admin, redireciona para o dashboard.
  // Usamos replace para que o usuário não possa usar o botão "voltar" do navegador para acessar a rota admin.
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
