
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import './index.css';
import Modal from 'react-modal';

// Define o elemento raiz da aplicação para o react-modal
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza a aplicação com a hierarquia de Providers CORRETA
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider> {/* O AuthProvider deve vir antes do DataProvider */}
        <DataProvider> {/* O DataProvider precisa do contexto do AuthProvider */}
          <SidebarProvider>
            <App /> {/* O App é envolvido por todos os contextos */}
          </SidebarProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
