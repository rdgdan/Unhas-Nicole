import React from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Adicionado para visualizações de semana/dia
import interactionPlugin from '@fullcalendar/interaction'; // Adicionado para interatividade
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import './CustomCalendar.css';

const CustomCalendar = ({ events, onDayClick, onEventClick }) => {

  const handleDateClick = (arg) => {
    // `arg.date` é um objeto Date nativo
    onDayClick(arg.date);
  };

  const handleEventClick = (arg) => {
    // `arg.event` é o objeto do evento do FullCalendar
    // O `extendedProps` contém os dados adicionais que passamos
    onEventClick(arg.event.extendedProps.resource);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        locale={ptBrLocale}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={handleDateClick} // Evento para clique em um dia
        eventClick={handleEventClick} // Evento para clique em um evento
        height="calc(100vh - 120px)" // Ajuste de altura para o novo layout
      />
    </div>
  );
};

CustomCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  onDayClick: PropTypes.func.isRequired,
  onEventClick: PropTypes.func.isRequired,
};

export default CustomCalendar;
