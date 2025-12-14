
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ onDateClick, holidays = [] }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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

    return daysArray;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateForId = (date) => {
    return date.toISOString().split('T')[0];
  };

  // ### LÓGICA DE CLASSES CORRIGIDA ###
  const getDayClassName = (dayInfo) => {
    const classes = ['day-cell'];
    const today = new Date();
    const dateStr = formatDateForId(dayInfo.date);
    const dayOfWeek = dayInfo.date.getDay();

    if (dayInfo.month !== 'current') {
      classes.push('not-current-month');
    }

    // Usa dois `if` separados para que um dia possa ser feriado E fim de semana
    if (holidays.includes(dateStr)) {
      classes.push('holiday-day');
    }
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      classes.push('weekend-day');
    }
    
    if (formatDateForId(dayInfo.date) === formatDateForId(today)) {
        classes.push('today');
    }

    return classes.join(' ');
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
        {days.map((dayInfo, index) => (
          <div
            key={index}
            className={getDayClassName(dayInfo)}
            onClick={() => onDateClick(formatDateForId(dayInfo.date))}
          >
            <div className="day-number">{dayInfo.day}</div>
            <div className="events-container">
              {/* Future implementation for event dots */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
