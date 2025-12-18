import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css'; // Importa os estilos corrigidos e compartilhados

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao criar a conta. Verifique os dados ou tente outro e-mail.');
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Crie sua conta</h2>
        <p>Comece a organizar seu negócio em poucos passos.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input 
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input 
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input 
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="auth-form-footer">
        <span>Já tem uma conta? </span>
        <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
