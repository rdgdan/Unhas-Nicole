
import React, { useState, useEffect } from 'react';
import CustomCalendar from '../components/CustomCalendar';
import SchedulingModal from '../components/SchedulingModal';
import { mockClients } from '../data/mockClients'; // 1. IMPORTAR DADOS DOS CLIENTES

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]); // Estado unificado para todos os eventos

  useEffect(() => {
    // Função para buscar feriados
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        if (!response.ok) throw new Error('Falha ao buscar feriados.');
        const holidayData = await response.json();

        return holidayData.map(holiday => ({
          title: holiday.name,
          start: holiday.date,
          allDay: true,
          display: 'background', // Mostra como um background
          color: '#ff9f89' // Cor para feriados
        }));
      } catch (error) {
        console.error("Erro ao carregar feriados:", error);
        return []; // Retorna array vazio em caso de erro
      }
    };

    // Função para processar os clientes
    const processClients = () => {
      return mockClients.map(client => ({
        title: client.name, // 2. O TÍTULO DO EVENTO É O NOME DO CLIENTE
        start: client.serviceDate, // A data do serviço
        allDay: true,
        color: '#8884d8', // Cor para agendamentos de clientes
        textColor: 'white'
      }));
    };

    // Carregar e unificar todos os eventos
    const loadAllEvents = async () => {
      const holidayEvents = await fetchHolidays();
      const clientEvents = processClients();
      setEvents([...holidayEvents, ...clientEvents]); // 3. JUNTA OS EVENTOS
    };

    loadAllEvents();
  }, []); // Executa apenas uma vez

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // Quando um novo evento é salvo do modal
  const handleSaveEvent = (newEvent) => {
    setEvents(currentEvents => [
      ...currentEvents, 
      { ...newEvent, color: '#82ca9d', textColor: 'white' } // Adiciona novo evento com cor diferente
    ]);
    handleCloseModal();
  };

  return (
    <>
      <CustomCalendar 
        onDateClick={handleDateClick} 
        events={events} // 4. PASSA A LISTA UNIFICADA PARA O CALENDÁRIO
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
