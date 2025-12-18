import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Novas paletas "Rosé" - mais quentes, femininas e sem tons azulados.
  const themes = {
    light: { // Tema "Rosé Light"
      '--background': '#fff9f7',      // Um branco com um toque de pêssego
      '--text': '#5c5454',          // Um cinza quente e escuro
      '--sidebarBg': '#ffffff',       // Branco puro para um contraste limpo
      '--sidebarText': '#7b6f6f',    // Cinza um pouco mais claro
      '--sidebarActive': '#ffeae2',   // Um fundo rosado bem suave para itens ativos
      '--primary': '#e5989b',        // O tom principal: um rosé queimado elegante
      '--cardBg': '#ffffff',         // Cards brancos e limpos
      '--shadow': 'rgba(229, 152, 155, 0.15)', // Sombra suave baseada na cor primária
      '--border-color': '#f0e5e3'  // Borda muito sutil
    },
    dark: { // Tema "Rosé Dark"
      '--background': '#2b1c1e',      // Um fundo ameixa profundo
      '--text': '#e0d8d8',          // Texto em tom pastel claro
      '--sidebarBg': '#3a2c2e',      // Sidebar um pouco mais clara que o fundo
      '--sidebarText': '#bfa9aa',     // Texto da sidebar com baixo contraste
      '--sidebarActive': '#5c4548',  // Item ativo mais destacado
      '--primary': '#ffb4a2',        // Um pêssego/rosé vibrante para o tema escuro
      '--cardBg': '#4a3c3e',        // Cards que se destacam do fundo
      '--shadow': 'rgba(0, 0, 0, 0.2)', // Sombra escura padrão
      '--border-color': '#5c4548'  // Borda sutil
    },
  };

  useEffect(() => {
    const currentTheme = themes[theme];
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    for (const key in currentTheme) {
      root.style.setProperty(key, currentTheme[key]);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
