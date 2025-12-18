import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css'; // Importando nosso novo e magnífico CSS

const AuthLayout = () => {
  return (
    <div className="auth-layout-container">
      {/* PAINEL ESQUERDO: A Emoção, o Branding, a Arte. */}
      <div className="auth-layout-showcase">
        <div className="showcase-content">
          <h1>By Borges</h1>
          <p>A beleza e a precisão que suas unhas merecem. Gerencie sua arte com a ferramenta que entende sua paixão.</p>
        </div>
      </div>

      {/* PAINEL DIREITO: A Ação, o Foco, o Formulário. */}
      <div className="auth-layout-form">
        {/* O <Outlet> renderizará a página de Login ou Registro aqui dentro */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
