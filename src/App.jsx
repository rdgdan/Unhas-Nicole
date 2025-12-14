
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthProvider from './context/AuthProvider';
import ThemeProvider from './context/ThemeProvider';
import SidebarProvider from './context/SidebarProvider';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
