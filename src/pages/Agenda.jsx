
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCalendar from '../components/CustomCalendar';
import SchedulingModal from '../components/SchedulingModal';

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      try {
        const response = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        const holidayDates = response.data.map(holiday => holiday.date);
        setHolidays(holidayDates);
      } catch (error) {
        console.error("Erro ao carregar feriados:", error);
      }
    };

    fetchHolidays();
  }, []);

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSaveEvent = (newEvent) => {
    setEvents(currentEvents => [...currentEvents, newEvent]);
    handleCloseModal();
  };

  return (
    <>
      <CustomCalendar 
        onDateClick={handleDateClick} 
        holidays={holidays} 
        events={events}
      />

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default Agenda;
