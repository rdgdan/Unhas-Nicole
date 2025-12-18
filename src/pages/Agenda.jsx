import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import SchedulingModal from '../components/SchedulingModal';
import ScheduleList from '../components/ScheduleList';
import ScheduleFilters from '../components/ScheduleFilters';
import { Loader, Plus, X } from 'lucide-react';
import '../components/CustomCalendar.css';
import '../components/ScheduleList.css';
import './Agenda.css';

const ArrowLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const Agenda = () => {
  const { schedules, loading, deleteSchedule, addSchedule, updateSchedule, services } = useContext(DataContext);

  const [currentDate, setCurrentDate] = useState(new Date());
  // <<< MUDANÇA: Sempre inicia com a data de hoje selecionada
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [holidays, setHolidays] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ isEditing: false, schedule: null });
  const [filters, setFilters] = useState({ searchTerm: '', service: 'all', paymentStatus: 'all' });

  const startOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);

  const fetchHolidays = useCallback(async (year) => {
    try {
      const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
      if (res.ok) { const data = await res.json(); setHolidays(new Set(data.map(h => h.date))); }
    } catch (error) { console.error("Erro ao carregar feriados:", error); }
  }, []);

  useEffect(() => { fetchHolidays(startOfMonth.getFullYear()); }, [startOfMonth, fetchHolidays]);

  const schedulesByDay = useMemo(() => {
    const map = new Map();
    if (schedules) {
      for (const schedule of schedules) {
        // O `schedule.start` já vem como um objeto Date válido do DataContext
        const dateString = schedule.start.toISOString().split('T')[0];
        if (!map.has(dateString)) {
          map.set(dateString, []);
        }
        map.get(dateString).push(schedule);
      }
      for (const daySchedules of map.values()) {
        daySchedules.sort((a, b) => a.start - b.start);
      }
    }
    return map;
  }, [schedules]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleOpenNewSchedule = () => {
    setModalData({ isEditing: false, schedule: null });
    setIsModalOpen(true);
  };
  
  const handleEditSchedule = (schedule) => {
    setModalData({ isEditing: true, schedule });
    setIsModalOpen(true);
  }

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (data) => {
    try {
      if (modalData.isEditing) {
        await updateSchedule(modalData.schedule.id, data);
      } else {
        await addSchedule(data);
      }
      handleCloseModal();
      return true;
    } catch (err) { 
      console.error("Erro ao salvar agendamento:", err);
      return false;
    }
  };

  const handleDelete = async (scheduleId) => {
    try { await deleteSchedule(scheduleId); } catch (error) { console.error("Falha ao excluir:", error); }
  };

  const filteredSchedules = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const daySchedules = schedulesByDay.get(dateStr) || [];

    return daySchedules.filter(s => {
      const clientMatch = s.clientName?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const serviceMatch = filters.service === 'all' || s.serviceName === filters.service;
      const paymentMatch = filters.paymentStatus === 'all' || s.status === filters.paymentStatus;
      return clientMatch && serviceMatch && paymentMatch;
    });
  }, [schedulesByDay, selectedDate, filters]);

  const renderDays = () => {
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) { days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>); }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateString = date.toISOString().split('T')[0];
      const daySchedules = schedulesByDay.get(dateString) || [];

      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      let dayClass = 'calendar-day';
      if (isToday) dayClass += ' today';
      if (isSelected) dayClass += ' selected';

      days.push(
        <div key={d} className={dayClass} onClick={() => setSelectedDate(date)}>
          <span className="day-number">{d}</span>
          <div className="schedules-on-day">
            {daySchedules.slice(0, 2).map(schedule => (
              <div key={schedule.id} className="calendar-schedule-item" onClick={(e) => { e.stopPropagation(); handleEditSchedule(schedule); }}>
                {schedule.clientName.split(' ')[0]}
              </div>
            ))}
            {daySchedules.length > 2 && (
              <div className="calendar-schedule-more">+ {daySchedules.length - 2} mais</div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const listTitle = selectedDate
    ? `Agendamentos para ${selectedDate.toLocaleDateString('pt-BR')}`
    : "Selecione um dia para ver os agendamentos";

  return (
    <div className="agenda-container">
      <header className="agenda-header">
        <h1>Agenda</h1>
        <button 
          className="new-schedule-btn"
          onClick={handleOpenNewSchedule}
          // Sempre habilitado, pois um dia (hoje) está sempre selecionado por padrão
          title={"Novo Agendamento"}
        >
          <Plus /> Novo Agendamento
        </button>
      </header>
      
      <div className="calendar-card">
        <div className="calendar-header"><button onClick={handlePrevMonth} className="nav-btn"><ArrowLeft /></button><h2>{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2><button onClick={handleNextMonth} className="nav-btn"><ArrowRight /></button></div>
        <div className="calendar-grid">
          <div className="calendar-day-name">Dom</div><div className="calendar-day-name">Seg</div><div className="calendar-day-name">Ter</div><div className="calendar-day-name">Qua</div><div className="calendar-day-name">Qui</div><div className="calendar-day-name">Sex</div><div className="calendar-day-name">Sáb</div>
          {renderDays()}
        </div>
      </div>

      <div className="schedules-section">
        <div className="schedules-section-header">
          <h2>{listTitle}</h2>
          {/* <<< REMOVIDO: Botão de limpar seleção para simplificar */}
        </div>
        
        <ScheduleFilters filters={filters} setFilters={setFilters} services={services} />

        {loading && !schedules.length ? <div className="loading-state"><Loader className="spin-icon" /> Carregando...</div> : <ScheduleList schedules={filteredSchedules} onEdit={handleEditSchedule} onDelete={handleDelete} emptyMessage={selectedDate ? "Nenhum agendamento para este dia." : "Selecione um dia no calendário."} />}
      </div>

      {/* <<< CORREÇÃO: Passando a data selecionada para o modal de forma limpa */}
      {isModalOpen && <SchedulingModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} schedule={modalData.schedule} selectedDate={selectedDate} />}
    </div>
  );
};

export default Agenda;
