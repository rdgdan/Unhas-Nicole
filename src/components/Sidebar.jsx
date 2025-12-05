
import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useTheme } from '../context/ThemeContext';
// ADICIONAR O ÍCONE FiUsers
import { FiHome, FiCalendar, FiUsers, FiLogOut, FiMenu, FiSun, FiMoon, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="logo-text">By Borges</h1>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <FiHome />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/agenda" className="nav-item">
          <FiCalendar />
          <span>Agenda</span>
        </NavLink>
        {/* ADICIONAR O NOVO LINK PARA CLIENTES */}
        <NavLink to="/clientes" className="nav-item">
          <FiUsers />
          <span>Clientes</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
