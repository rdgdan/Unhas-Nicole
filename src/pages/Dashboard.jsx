
import React, { useMemo, useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DollarSign, Calendar, Users, TrendingUp, Filter, Loader } from 'lucide-react';
import './Dashboard.css';

const toDate = (dateSource) => {
  if (!dateSource) return null;
  if (dateSource.toDate) return dateSource.toDate();
  const date = new Date(dateSource);
  return isNaN(date.getTime()) ? null : date;
};

const Dashboard = () => {
  const { schedules, loading } = useContext(DataContext);
  const [period, setPeriod] = useState('thisMonth');

  // ANALYTICS DO PERÍODO PASSADO
  const periodAnalytics = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (period === 'last7days') startDate.setDate(now.getDate() - 7);
    else if (period === 'last30days') startDate.setDate(now.getDate() - 30);
    else if (period === 'thisMonth') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const relevantSchedules = period === 'allTime' 
      ? schedules.filter(s => toDate(s.start) <= now)
      : schedules.filter(s => {
          const scheduleDate = toDate(s.start);
          return scheduleDate && scheduleDate >= startDate && scheduleDate <= now;
        });

    // **NOVA MÉTRICA: Clientes únicos atendidos no período**
    const attendedClientsCount = new Set(relevantSchedules.map(s => s.clientId)).size;

    const paidSchedules = relevantSchedules.filter(s => s.status === 'paid');
    const totalRevenue = paidSchedules.reduce((sum, s) => sum + (s.price || 0), 0);
    
    const revenueByDay = paidSchedules.reduce((acc, s) => {
      const day = toDate(s.start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      acc[day] = (acc[day] || 0) + s.price;
      return acc;
    }, {});
    const revenueChartData = Object.keys(revenueByDay).map(day => ({
      date: day, Receita: revenueByDay[day]
    })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));

    const serviceCounts = relevantSchedules.reduce((acc, s) => {
        const serviceName = s.serviceName || 'N/A';
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
    }, {});
    const topServices = Object.entries(serviceCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const clientSpending = paidSchedules.reduce((acc, s) => {
        const clientName = s.clientName || 'N/A';
        acc[clientName] = (acc[clientName] || 0) + s.price;
        return acc;
    }, {});
    const topClients = Object.entries(clientSpending).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 5);

    return {
      totalRevenue,
      attendedClientsCount, // Retornando a nova métrica
      revenueChartData,
      topServices,
      topClients
    };
  }, [schedules, period]);

  // ANALYTICS DO FUTURO (PROJEÇÃO)
  const futureAnalytics = useMemo(() => {
      const now = new Date();
      const futureSchedules = schedules.filter(s => toDate(s.start) > now);
      
      const projectedRevenue = futureSchedules.reduce((sum, s) => sum + (s.price || 0), 0);

      return {
          projectedRevenue,
          futureAppointmentsCount: futureSchedules.length
      }
  }, [schedules]);

  if (loading) {
    return <div className="loading-state-full"><Loader className="spin-icon" /> Carregando dashboard...</div>
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="header-content"><h1>Dashboard</h1><p>Análise de desempenho e projeções futuras.</p></div>
        <div className="header-actions">
          <div className="filter-container"><Filter size={16} /><select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select"><option value="thisMonth">Este Mês</option><option value="last7days">Últimos 7 dias</option><option value="last30days">Últimos 30 dias</option><option value="allTime">Todo o Período</option></select></div>
        </div>
      </header>

      {/* REFINADO PARA 4 KPIs ESSENCIAIS */}
      <div className="kpi-grid-four">
        <div className="kpi-card">
            <div className="card-header"><h3 className="card-title">Receita Paga (Período)</h3><DollarSign className="card-icon revenue" /></div>
            <p className="card-value">R$ {periodAnalytics.totalRevenue?.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="kpi-card">
            <div className="card-header"><h3 className="card-title">Clientes Atendidos (Período)</h3><Users className="card-icon clients" /></div>
            <p className="card-value">{periodAnalytics.attendedClientsCount}</p>
        </div>
        <div className="kpi-card">
            <div className="card-header"><h3 className="card-title">Agendamentos (Futuro)</h3><Calendar className="card-icon appointments" /></div>
            <p className="card-value">{futureAnalytics.futureAppointmentsCount}</p>
        </div>
        <div className="kpi-card">
            <div className="card-header"><h3 className="card-title">Receita Futura (Total)</h3><TrendingUp className="card-icon future-revenue" /></div>
            <p className="card-value">R$ {futureAnalytics.projectedRevenue?.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Receita Paga no Período</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={periodAnalytics.revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                <XAxis dataKey="date" tick={{ fill: 'var(--text-color-secondary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text-color-secondary)' }} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`}/>
                <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)' }}/>
                <Legend />
                <Line type="monotone" dataKey="Receita" stroke="var(--primary-color)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
            <h3>Serviços Mais Realizados (Período)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodAnalytics.topServices} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)"/>
                    <XAxis type="number" tick={{ fill: 'var(--text-color-secondary)' }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--text-color-secondary)' }} tickLine={false} axisLine={false}/>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)' }}/>
                    <Legend />
                    <Bar dataKey="count" name="Nº de Vezes" fill="var(--secondary-color)" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="lists-grid">
        <div className="list-container">
          <h3>Top 5 Clientes por Faturamento (Pago, Período)</h3>
          <ul>
            {periodAnalytics.topClients?.map((client, index) => (
              <li key={client.name}>
                <div className="list-item-main"><span className="list-rank">#{index + 1}</span><span className="list-name">{client.name}</span></div>
                <span className="list-value">R$ {client.total.toFixed(2).replace('.', ',')}</span>
              </li>
            ))}
          </ul>
        </div>
         <div className="list-container">
          <h3>Top 5 Serviços por Frequência (Período)</h3>
          <ul>
            {periodAnalytics.topServices?.map((service, index) => (
              <li key={service.name}>
                <div className="list-item-main"><span className="list-rank">#{index + 1}</span><span className="list-name">{service.name}</span></div>
                <span className="list-value">{service.count} vezes</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
