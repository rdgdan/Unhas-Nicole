
import React from 'react';
import './ClientList.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

// 1. Receber `onEdit` e `onDelete` como props
const ClientList = ({ clients, onEdit, onDelete }) => {

  if (clients.length === 0) {
    return <p className="empty-message">Nenhum cliente encontrado.</p>;
  }

  return (
    <div className="client-list-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data do Serviço</th>
            <th>Modelo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{new Date(client.serviceDate.replace(/-/g, '/')).toLocaleDateString()}</td>
              <td>{client.nailModel}</td>
              <td>R$ {client.amount.toFixed(2)}</td>
              <td className="actions-cell">
                {/* 2. Ligar os botões às funções recebidas */}
                <button className="action-btn edit" onClick={() => onEdit(client)}><FiEdit /></button>
                <button className="action-btn delete" onClick={() => onDelete(client.id)}><FiTrash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
