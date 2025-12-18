import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2 } from 'lucide-react';
import './ScheduleList.css';

const ScheduleList = ({ schedules, onEdit, onDelete, emptyMessage }) => {

  const formatDate = (dateSource) => {
    if (!dateSource) return '-';
    // Converte Timestamps do Firebase ou strings de data
    const date = dateSource.toDate ? dateSource.toDate() : new Date(dateSource);
    return isNaN(date.getTime()) ? 'Inválida' : date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateSource) => {
    if (!dateSource) return '--:--';
    const date = dateSource.toDate ? dateSource.toDate() : new Date(dateSource);
    return isNaN(date.getTime()) ? 'Inválido' : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderPaymentStatus = (schedule) => {
    const { status, paymentDate } = schedule;

    if (status === 'paid') {
      const date = paymentDate?.toDate ? paymentDate.toDate() : new Date(paymentDate);
      const formattedDate = isNaN(date.getTime()) ? '' : `em ${date.toLocaleDateString('pt-BR')}`;
      return (
        <div className="col-payment">
          <span className="status-chip status-paid">Pago</span>
          {paymentDate && <span className="payment-date">{formattedDate}</span>}
        </div>
      );
    }
    
    return (
      <div className="col-payment">
        <span className="status-chip status-pending">Pendente</span>
      </div>
    );
  };

  return (
    <div className="schedule-list-container">
      {/* Cabeçalho da Lista */}
      <div className="schedule-list-header">
        <strong className="col-client">Cliente</strong>
        <strong className="col-service">Serviço</strong>
        <strong className="col-date">Data</strong>
        <strong className="col-start">Início</strong>
        <strong className="col-end">Fim</strong>
        <strong className="col-payment">Pagamento</strong>
        <strong className="col-actions">Ações</strong>
      </div>

      {/* Corpo da Lista */}
      <div className="schedule-list-body">
        {schedules && schedules.length > 0 ? (
          schedules.map(schedule => (
            <div key={schedule.id} className="schedule-item" onClick={() => onEdit(schedule)}>
              <span className="col-client client-name">{schedule.clientName || '-'}</span>
              <span className="col-service">{schedule.serviceName || '-'}</span>
              <span className="col-date">{formatDate(schedule.start)}</span>
              <span className="col-start">{formatTime(schedule.start)}</span>
              <span className="col-end">{formatTime(schedule.end)}</span>
              {renderPaymentStatus(schedule)}
              <div className="col-actions schedule-item-actions">
                <button className="action-icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(schedule); }}>
                  <Edit size={16} />
                </button>
                <button className="action-icon-btn" onClick={(e) => { e.stopPropagation(); onDelete(schedule.id); }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-message">{emptyMessage || 'Nenhum agendamento para mostrar.'}</div>
        )}
      </div>
    </div>
  );
};

ScheduleList.propTypes = {
  schedules: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

export default ScheduleList;
