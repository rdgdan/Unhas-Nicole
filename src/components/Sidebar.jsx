import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, Briefcase, Moon, Sun, LogOut, ChevronLeft, Instagram, Feather, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Corrigido
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    // Acessa os contextos
    const { logout, isAdmin } = useAuth(); // Pega o novo estado isAdmin!
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-wrapper">
                    <Feather className="logo-icon" size={24} />
                    <span className="logo-text">By Borges</span>
                </div>
                <button className="toggle-btn" onClick={toggleSidebar} title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}>
                    <ChevronLeft size={22} />
                </button>
            </div>

            <ul className="sidebar-nav">
                <li>
                    <NavLink to="/dashboard" className="nav-item" title="Dashboard">
                        <Home size={20} className="nav-icon" />
                        <span className="nav-text">Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/agenda" className="nav-item" title="Agenda">
                        <Calendar size={20} className="nav-icon" />
                        <span className="nav-text">Agenda</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/clientes" className="nav-item" title="Clientes">
                        <Users size={20} className="nav-icon" />
                        <span className="nav-text">Clientes</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/servicos" className="nav-item" title="Serviços">
                        <Briefcase size={20} className="nav-icon" />
                        <span className="nav-text">Serviços</span>
                    </NavLink>
                </li>
                
                {/* A MÁGICA ACONTECE AQUI: Usa o novo estado isAdmin do AuthContext */}
                {isAdmin && (
                    <li>
                        <NavLink to="/admin" className="nav-item" title="Administração">
                            <Shield size={20} className="nav-icon" />
                            <span className="nav-text">Admin</span>
                        </NavLink>
                    </li>
                )}
            </ul>

            <ul className="sidebar-footer">
                <li className="nav-item" onClick={toggleTheme} title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
                    {theme === 'dark' ? <Sun size={20} className="nav-icon" /> : <Moon size={20} className="nav-icon" />}
                    <span className="nav-text">Mudar Tema</span>
                </li>
                <li>
                    <a href="https://instagram.com/byborges" target="_blank" rel="noopener noreferrer" className="nav-item" title="Instagram">
                        <Instagram size={20} className="nav-icon" />
                        <span className="nav-text">Instagram</span>
                    </a>
                </li>
                <li className="nav-item" onClick={handleLogout} title="Sair">
                    <LogOut size={20} className="nav-icon" />
                    <span className="nav-text">Sair</span>
                </li>
            </ul>
        </aside>
    );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
