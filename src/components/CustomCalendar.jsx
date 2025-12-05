import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [holidays, setHolidays] = useState([]); // Estado para os feriados

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Busca os feriados na Brasil API quando o componente é montado ou o ano muda
  useEffect(() => {
    const year = currentDate.getFullYear();
    fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
      .then(response => response.json())
      .then(data => {
        // Formata as datas para facilitar a comparação
        const formattedHolidays = data.map(holiday => holiday.date);
        setHolidays(formattedHolidays);
      })
      .catch(error => console.error("Erro ao buscar feriados:", error));
  }, [currentDate.getFullYear()]); // Dependência apenas no ano

  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth; i > 0; i--) {
      daysArray.push({ day: prevMonthDays - i + 1, month: 'prev', date: new Date(year, month - 1, prevMonthDays - i + 1) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, month: 'current', date: new Date(year, month, i) });
    }

    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({ day: i, month: 'next', date: new Date(year, month + 1, i) });
    }

    setDays(daysArray);
  }, []);

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, generateCalendarDays]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Função para formatar a data no formato YYYY-MM-DD
  const formatDate = (date) => {
      return date.toISOString().split('T')[0];
  }

  const isHoliday = (date) => {
      return holidays.includes(formatDate(date));
  };

  // Função para verificar se é fim de semana (Sábado ou Domingo)
  const isWeekend = (date) => {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Domingo, 6 = Sábado
  };

  const formatDateForId = (date) => {
      return date.toISOString().split('T')[0];
  }

  return (
    <div className="aurora-calendar">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="nav-buttons">
          <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="calendar-grid">
        {weekdays.map(day => <div key={day} className="weekday-header">{day}</div>)}
        {days.map((dayInfo, index) => {
          // Determina a classe com base na prioridade: Feriado > Fim de Semana
          let specialDayClass = '';
          if (dayInfo.month === 'current') { // Aplica apenas para dias do mês corrente
            if (isHoliday(dayInfo.date)) {
              specialDayClass = 'holiday-background';
            } else if (isWeekend(dayInfo.date)) {
              specialDayClass = 'weekend-background';
            }
          }
          
          return (
            <div
              key={index}
              className={`day-cell ${dayInfo.month !== 'current' ? 'not-current-month' : ''} ${isToday(dayInfo.date) ? 'today' : ''} ${specialDayClass}`}
              onClick={() => onDateClick(formatDateForId(dayInfo.date))}
            >
              <div className="day-number">{dayInfo.day}</div>
              <div className="events-container">
                  {/* Adicionar pontos de eventos aqui se necessário */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
