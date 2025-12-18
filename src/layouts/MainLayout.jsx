import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar'; // O Navbar agora é mais simples
import './MainLayout.css';

const MainLayout = () => {
  // O estado da sidebar (recolhida/expandida) agora é controlado aqui!
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Função para alternar o estado, que será passada para a Sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="main-layout">
      {/* Passamos o estado e a função de toggle para a Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* 
        A classe da área de conteúdo agora depende DIRETAMENTE 
        do estado controlado por este componente. Isso garante a sincronia.
      */}
      <div className={`content-area ${isSidebarCollapsed ? 'sidebar-closed' : ''}`}>
        
        {/* O Navbar não precisa mais de lógica complexa de título aqui */}
        <Navbar />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
