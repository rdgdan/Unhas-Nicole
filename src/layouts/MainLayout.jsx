
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// 1. IMPORTAR O ÍCONE SPARKLES (BRILHOS)
import { Home, Calendar, Users, LogOut, ChevronLeft, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path) && path !== '/' ? true : location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            {/* 2. SUBSTITUIR O SVG DO CUBO PELO ÍCONE SPARKLES */}
            <Sparkles size={32} className="logo-icon" />
            <span className="logo-text">By Borges</span>
          </div>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={22} />
            <span className="nav-text">Início</span>
          </NavLink>
          <NavLink to="/agenda" className={`nav-item ${isActive('/agenda') ? 'active' : ''}`}>
            <Calendar size={22} />
            <span className="nav-text">Agenda</span>
          </NavLink>
          <NavLink to="/clientes" className={`nav-item ${isActive('/clientes') ? 'active' : ''}`}>
            <Users size={22} />
            <span className="nav-text">Clientes</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            <span className="nav-text">{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={22} />
            <span className="nav-text">Sair</span>
          </button>
          <div className="sidebar-signature">
            <span className="nav-text">@nailsdesignbyborges</span>
          </div>
        </div>
      </aside>

      <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
