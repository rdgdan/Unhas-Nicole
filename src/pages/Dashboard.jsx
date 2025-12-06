
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mockClients } from '../data/mockClients';
import { useTheme } from '../context/ThemeContext';
import DashboardFilters from '../components/DashboardFilters/DashboardFilters'; // 1. IMPORTAR O COMPONENTE DE FILTROS
import './Dashboard.css';

// Extrai todos os modelos de unha únicos para popular o filtro
const allNailModels = [...new Set(mockClients.map(client => client.nailModel))];

// === LÓGICA DE DADOS MODIFICADA PARA ACEITAR FILTROS ===
const processDashboardData = (clients, nailModelFilter, dateRange) => {
  // 2. APLICAR FILTROS ANTES DE QUALQUER CÁLCULO
  let filteredClients = clients.filter(client => {
    const clientDate = new Date(client.serviceDate);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0); // Início do dia
    if (endDate) endDate.setHours(23, 59, 59, 999); // Fim do dia

    const isModelMatch = nailModelFilter === 'all' || client.nailModel === nailModelFilter;
    const isDateMatch = 
        (!startDate || clientDate >= startDate) && 
        (!endDate || clientDate <= endDate);

    return isModelMatch && isDateMatch;
  });

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Os cálculos agora usam a lista JÁ FILTRADA
  const pastClients = filteredClients.filter(c => new Date(c.serviceDate) <= today);
  const futureClients = filteredClients.filter(c => new Date(c.serviceDate) > today);

  const clientsServed = pastClients.length;
  const revenueGenerated = pastClients.reduce((acc, client) => acc + client.amount, 0);
  const futureClientsCount = futureClients.length;
  const futureRevenue = futureClients.reduce((acc, client) => acc + client.amount, 0);

  // O resto da lógica de agrupamento e ordenação permanece a mesma
  const dataByMonth = {};
  const modelsCount = {};

  pastClients.forEach(client => {
    const date = new Date(client.serviceDate);
    const sortableKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!dataByMonth[sortableKey]) {
      dataByMonth[sortableKey] = { clientes: 0, receita: 0 };
    }
    dataByMonth[sortableKey].clientes += 1;
    dataByMonth[sortableKey].receita += client.amount;

    const model = client.nailModel;
    modelsCount[model] = (modelsCount[model] || 0) + 1;
  });

  const sortedKeys = Object.keys(dataByMonth).sort();

  const growthChartData = sortedKeys.map(key => {
    const [year, month] = key.split('-');
    const date = new Date(year, month - 1, 1);
    const displayName = date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });

    return {
      name: displayName,
      clientes: dataByMonth[key].clientes,
      receita: dataByMonth[key].receita,
    };
  });

  const topModelsChartData = Object.keys(modelsCount)
    .map(model => ({ name: model, quantidade: modelsCount[model] }))
    .sort((a, b) => b.quantidade - a.quantidade);

  return {
    clientsServed, revenueGenerated, futureClientsCount, futureRevenue,
    growthChartData,
    topModelsChartData
  };
};

const Dashboard = () => {
  const { theme } = useTheme();
  
  // 3. ESTADOS PARA CONTROLAR OS FILTROS
  const [nailModelFilter, setNailModelFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // 4. FUNÇÃO PARA LIMPAR OS FILTROS
  const clearFilters = () => {
    setNailModelFilter('all');
    setDateRange({ start: '', end: '' });
  };

  // 5. MEMOIZAR OS DADOS PROCESSADOS PARA EVITAR RECÁLCULOS
  const memoizedData = useMemo(
    () => processDashboardData(mockClients, nailModelFilter, dateRange),
    [nailModelFilter, dateRange] // Recalcula apenas quando os filtros mudam
  );

  const {
    clientsServed, revenueGenerated, futureClientsCount, futureRevenue,
    growthChartData,
    topModelsChartData
  } = memoizedData;

  const themeColors = {
    textColor: theme === 'light' ? '#2C2C2C' : '#F0F0F5',
    accentColor1: theme === 'light' ? '#E75480' : '#82ca9d',
    accentColor2: theme === 'light' ? '#FBC4D6' : '#8884d8',
    accentColor3: theme === 'light' ? '#E75480' : '#ffc658',
    gridColor: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Analítico</h1>
      
      {/* 6. RENDERIZAR O COMPONENTE DE FILTROS */}
      <DashboardFilters 
        nailModelFilter={nailModelFilter}
        setNailModelFilter={setNailModelFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        allNailModels={allNailModels}
        onClearFilters={clearFilters}
      />

      <div className="metrics-cards">
        <div className="card"><h2>Clientes Atendidos</h2><p>{clientsServed}</p></div>
        <div className="card"><h2>Receita Gerada</h2><p>{revenueGenerated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
        <div className="card future-metric"><h2>Clientes Futuros</h2><p>{futureClientsCount}</p></div>
        <div className="card future-metric"><h2>Receita Futura</h2><p>{futureRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
      </div>

      <div className="charts-section">
        {/* O resto da UI permanece igual, mas agora reage aos filtros */}
        <div className="chart-wrapper">
          <h3>Crescimento da Receita (Histórico)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthChartData}>
              <CartesianGrid stroke={themeColors.gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: themeColors.textColor }} />
              <YAxis tick={{ fill: themeColors.textColor }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }} />
              <Legend wrapperStyle={{ color: themeColors.textColor }} />
              <Line type="monotone" dataKey="receita" stroke={themeColors.accentColor1} name="Receita Mensal" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Modelos de Unhas Mais Populares</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topModelsChartData} layout="vertical">
                <CartesianGrid stroke={themeColors.gridColor} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: themeColors.textColor }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: themeColors.textColor }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }} />
                <Legend wrapperStyle={{ color: themeColors.textColor }} />
                <Bar dataKey="quantidade" fill={themeColors.accentColor2} name="Quantidade de Pedidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Crescimento de Clientes (Histórico)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthChartData}>
              <CartesianGrid stroke={themeColors.gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: themeColors.textColor }} />
              <YAxis tick={{ fill: themeColors.textColor }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)' }} />
              <Legend wrapperStyle={{ color: themeColors.textColor }} />
              <Line type="monotone" dataKey="clientes" stroke={themeColors.accentColor3} name="Novos Clientes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
