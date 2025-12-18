import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Context-aware Route Guards
import PrivateRoute from './components/auth/PrivateRoute'; // Corrected import path
import AdminRoute from './components/auth/AdminRoute'; // Corrected import path

// Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import ClientsPage from './pages/ClientsPage';
import ServicesPage from './pages/ServicesPage';
import Configuracoes from './pages/Configuracoes';
import AdminPage from './pages/AdminPage';

// Este componente agrupa as rotas que exigem o MainLayout e autenticação
const ProtectedPages = () => (
  <PrivateRoute>
    <MainLayout />
  </PrivateRoute>
);

// Este componente agrupa as rotas públicas de autenticação
const AuthPages = () => (
    <AuthLayout />
);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas: /login e /register */}
        <Route element={<AuthPages />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rotas Protegidas: Todas as outras */}
        <Route path="/" element={<ProtectedPages />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="servicos" element={<ServicesPage />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route 
                path="admin" 
                element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } 
            />
        </Route>

        {/* Rota de fallback para qualquer outra coisa, redireciona para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
