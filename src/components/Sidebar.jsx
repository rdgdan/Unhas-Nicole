
import React, { useContext } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { SidebarContext } from '../context/sidebar';
import { ThemeContext } from '../context/theme'; 
import { FiHome, FiCalendar, FiLogOut, FiMenu, FiSun, FiMoon, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

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
