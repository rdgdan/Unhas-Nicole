
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ onDateClick, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
  
  const formatDate = (date) => {
      return date.toISOString().split('T')[0];
  }
  
  const getEventsForDay = (date) => {
    const dateString = formatDate(date);
    return events.filter(event => event.start === dateString);
  };

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
          const dayEvents = dayInfo.month === 'current' ? getEventsForDay(dayInfo.date) : [];
          const isWeekend = dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6;
          const isHoliday = dayEvents.some(e => e.display === 'background');

          let dayClass = 'day-cell';
          if (dayInfo.month !== 'current') dayClass += ' not-current-month';
          if (isToday(dayInfo.date)) dayClass += ' today';
          if (isWeekend && !isHoliday) dayClass += ' weekend-background'; // Apenas fim de semana, não feriado
          if (isHoliday) dayClass += ' holiday-background';

          return (
            <div
              key={index}
              className={dayClass}
              onClick={() => onDateClick(formatDate(dayInfo.date))}
            >
              <div className="day-number">{dayInfo.day}</div>
              <div className="events-container">
                {dayEvents.map((event, idx) => (
                  event.display !== 'background' && (
                    <div key={idx} className="event-pill">
                      {event.title}
                    </div>
                  )
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
