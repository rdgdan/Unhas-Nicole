
import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { useData } from '../contexts/DataContext';
import { Timestamp } from 'firebase/firestore';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import './SchedulingModal.css';

Modal.setAppElement('#root');

// Função para obter o valor da variável CSS
// Nota: Isso só funciona no lado do cliente e pode não ser ideal para SSR.
const getCssVar = (varName) => {
    if (typeof window === 'undefined') return ''; // Retorna vazio se não estiver no navegador
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};


// Objeto de estilos dinâmico que se adapta ao tema
const getCustomSelectStyles = () => ({
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--background-color-tertiary)',
        border: `1px solid ${state.isFocused ? 'var(--accent-purple)' : 'var(--border-color)'}`,
        borderRadius: '10px',
        padding: '0.6rem',
        boxShadow: state.isFocused ? '0 0 10px rgba(168, 85, 247, 0.3)' : 'none',
        minHeight: '58px',
        '&:hover': {
            borderColor: 'var(--accent-purple)'
        }
    }),
    menu: provided => ({
        ...provided,
        backgroundColor: 'var(--background-color-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
    }),
    menuPortal: (provided) => ({
        ...provided,
        zIndex: 99999,
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: '220px',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            background: 'var(--background-color-secondary)',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
            background: 'var(--border-color)',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: 'var(--background-color-tertiary)',
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--accent-purple)' : state.isFocused ? 'var(--background-color-tertiary)' : 'transparent',
        color: state.isSelected ? 'var(--text-color-contrast)' : 'var(--text-color-primary)',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: 'var(--accent-purple-darker)'
        }
    }),
    singleValue: provided => ({
        ...provided,
        color: 'var(--text-color-primary)',
    }),
    input: provided => ({
        ...provided,
        color: 'var(--text-color-primary)',
    }),
    placeholder: provided => ({
        ...provided,
        color: 'var(--text-color-secondary)',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--text-color-secondary)',
        '&:hover': {
            color: 'var(--text-color-primary)'
        }
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        color: 'var(--text-color-secondary)'
    })
});


const Stepper = ({ currentStep }) => {
    const steps = ['Cliente', 'Serviço', 'Datas', 'Confirmação'];
    return (
        <div className="stepper-container">
            {steps.map((title, index) => {
                const stepIndex = index + 1;
                let stepClass = 'step-item';
                if (stepIndex === currentStep) stepClass += ' active';
                else if (stepIndex < currentStep) stepClass += ' completed';
                return (
                    <div key={title} className={stepClass}>
                        <div className="step-number">{stepIndex < currentStep ? '✓' : stepIndex}</div>
                        <div className="step-title">{title}</div>
                    </div>
                );
            })}
        </div>
    );
};

const SchedulingModal = ({ isOpen, onClose, onSave, schedule, selectedDate }) => {
  const { clients, services, serviceCategories } = useData();
  
  const [step, setStep] = useState(1);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [formData, setFormData] = useState({});
  const [internalError, setInternalError] = useState('');
  
  // Os estilos são agora um estado para que possam ser recalculados na montagem do modal
  const [customSelectStyles, setCustomSelectStyles] = useState(getCustomSelectStyles());

  useEffect(() => {
    if (isOpen) {
        // Força a reavaliação dos estilos CSS quando o modal é aberto
        setCustomSelectStyles(getCustomSelectStyles());

        setStep(1);
        setIsCreatingClient(false);

        const currentClient = schedule ? clients.find(c => c.id === schedule.clientId) : null;
        const currentService = schedule ? services.find(s => s.id === schedule.serviceId) : null;
        const currentCategory = currentService ? serviceCategories.find(c => c.id === currentService.categoryId) : null;

        const scheduleDate = schedule?.start;
        const initialDate = scheduleDate || selectedDate || new Date();
        const duration = currentService?.duration || 0;

        const initialData = {
            clientSelection: currentClient ? { value: currentClient.id, label: `${currentClient.name} - ${currentClient.phone}` } : null,
            isNewClient: false,
            newClientName: '',
            newClientPhone: '',
            serviceCategory: currentCategory ? { value: currentCategory.id, label: currentCategory.name } : null,
            serviceSubclass: schedule?.serviceId ? { value: schedule.serviceId, label: `${schedule.serviceName} - ${duration} min` } : null,
            date: initialDate.toISOString().split('T')[0],
            startTime: scheduleDate ? scheduleDate.toTimeString().slice(0, 5) : '09:00',
            status: schedule?.status || 'pending',
        };
        setFormData(initialData);
        setInternalError('');
    }
  }, [isOpen, schedule, selectedDate, clients, services, serviceCategories]);

  const nextStep = () => { if (validateStep()) { setInternalError(''); setStep(s => s + 1); } };
  const prevStep = () => setStep(s => s - 1);

  const handleSaveNewClientAndAdvance = () => {
      if (!formData.newClientName || !formData.newClientPhone) {
          setInternalError('Nome e telefone são obrigatórios.');
          return;
      }
      setFormData(prev => ({ ...prev, isNewClient: true, clientSelection: { value: 'new_client', label: formData.newClientName }}));
      setInternalError('');
      setStep(2);
  };

  const validateStep = () => {
    setInternalError('');
    switch (step) {
        case 1:
            if (!isCreatingClient && !formData.clientSelection) {
                setInternalError('Você deve selecionar ou criar um cliente.');
                return false;
            }
            if (isCreatingClient && (!formData.newClientName || !formData.newClientPhone)) {
                setInternalError('Nome e telefone do novo cliente são obrigatórios.');
                return false;
            }
            break;
        case 2:
            if (!formData.serviceCategory || !formData.serviceSubclass) {
                setInternalError('Você deve selecionar a categoria e o serviço.');
                return false;
            }
            break;
        case 3:
            if (!formData.date || !formData.startTime) {
                setInternalError('Você deve definir a data e a hora do agendamento.');
                return false;
            }
            break;
        default: break;
    }
    return true;
  };

  const clientOptions = useMemo(() => 
    clients
      .filter(c => c.name) 
      .map(c => ({ value: c.id, label: `${c.name} - ${c.phone || 'Sem telefone'}` }))
  , [clients]);

  const serviceCategoryOptions = useMemo(() => 
    serviceCategories
      .filter(cat => cat.name) 
      .map(cat => ({ value: cat.id, label: cat.name }))
  , [serviceCategories]);

  const serviceSubclassOptions = useMemo(() => {
      if (!formData.serviceCategory?.value) return [];
      return services
          .filter(s => s.categoryId === formData.serviceCategory.value && s.name)
          .map(s => ({ value: s.id, label: `${s.name} - ${s.duration || 0} min` }));
  }, [services, formData.serviceCategory]);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, option) => {
      const newFormData = { ...formData, [name]: option };
      if (name === 'serviceCategory') newFormData.serviceSubclass = null;
      setFormData(newFormData);
  };
  const handleClientSelection = (option) => setFormData(prev => ({ ...prev, clientSelection: option, isNewClient: false }));

  const handleSubmit = async () => {
    const selectedService = services.find(s => s.id === formData.serviceSubclass?.value);
    if (!selectedService) { setInternalError("Serviço selecionado não encontrado."); return; }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const duration = selectedService.duration || 0;
    const endDateTime = new Date(startDateTime.getTime() + (duration * 60000));
    
    let clientInfo = {};
    if (formData.isNewClient) {
        clientInfo = {
            isNewClient: true,
            clientName: formData.newClientName,
            clientPhone: formData.newClientPhone,
        };
    } else {
        const selectedClient = clients.find(c => c.id === formData.clientSelection.value);
        clientInfo = {
            isNewClient: false,
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            clientPhone: selectedClient.phone,
        };
    }

    const dataToSave = {
        id: schedule?.id,
        ...clientInfo,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        start: Timestamp.fromDate(startDateTime),
        end: Timestamp.fromDate(endDateTime),
        price: selectedService.price || 0, 
        status: formData.status
    };
    
    const success = await onSave(dataToSave);
    if (success) onClose();
  };

  const renderStepContent = () => {
      const commonSelectProps = {
        styles: customSelectStyles, // Usa o estado dos estilos
        noOptionsMessage: () => 'Nenhuma opção disponível',
        loadingMessage: () => 'Carregando...',
        menuPortalTarget: document.body, 
        menuPosition: 'fixed', 
      };

    switch (step) {
      case 1:
        return (
          <>
            <div className="step-header"><h3>{isCreatingClient ? 'Novo Cliente' : 'Selecione um Cliente'}</h3></div>
            {isCreatingClient ? (
                <>
                    <div className="form-group"><label>Nome do Cliente</label><input type="text" name="newClientName" value={formData.newClientName || ''} onChange={handleInputChange} required/></div>
                    <div className="form-group"><label>Telefone</label><input type="tel" name="newClientPhone" value={formData.newClientPhone || ''} onChange={handleInputChange} required/></div>
                </>
            ) : (
                <>
                    <div className="form-group"><label>Buscar Cliente Existente</label><Select {...commonSelectProps} options={clientOptions} value={formData.clientSelection} onChange={handleClientSelection} placeholder="Digite nome ou telefone..."/></div>
                    <div className="or-divider"><span>OU</span></div>
                    <button onClick={() => setIsCreatingClient(true)} className="footer-btn-secondary centered">+ Criar Novo Cliente</button>
                </>
            )}
          </>
        );
      case 2:
        return (
          <>
              <div className="step-header"><h3>Selecione o Serviço</h3></div>
              <div className="form-group"><label>Categoria</label><Select {...commonSelectProps} options={serviceCategoryOptions} value={formData.serviceCategory} onChange={(o) => handleSelectChange('serviceCategory', o)} placeholder="Selecione a categoria..."/></div>
              <div className="form-group"><label>Serviço</label><Select {...commonSelectProps} isDisabled={!formData.serviceCategory} options={serviceSubclassOptions} value={formData.serviceSubclass} onChange={(o) => handleSelectChange('serviceSubclass', o)} placeholder="Selecione o serviço..."/></div>
          </>
        );
      case 3:
        return (
          <>
              <div className="step-header"><h3>Defina a Data e Hora</h3></div>
              <div className="form-group"><label>Data do Agendamento</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required/></div>
              <div className="form-group"><label>Hora de Início</label><input type="time" name="startTime" value={formData.startTime || ''} onChange={handleInputChange} required/></div>
              <div className="form-group"><label>Status do Pagamento</label><Select {...commonSelectProps} options={[{value: 'pending', label: 'Pendente'}, {value: 'paid', label: 'Pago'}]} value={{value: formData.status, label: formData.status === 'paid' ? 'Pago' : 'Pendente'}} onChange={(o) => setFormData(p => ({...p, status: o.value}))} /></div>
          </>
        );
      case 4:
        return (
          <>
            <div className="step-header"><h3>Confirme os Detalhes</h3></div>
            <div className="summary">
                <p><strong>Cliente:</strong> {formData.isNewClient ? `${formData.newClientName} (${formData.newClientPhone})` : formData.clientSelection?.label}</p>
                <p><strong>Serviço:</strong> {formData.serviceSubclass?.label ? formData.serviceSubclass.label.split(' - ')[0] : ''}</p>
                <p><strong>Data:</strong> {formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR') : ''} às {formData.startTime}</p>
                <p><strong>Valor:</strong> {services.find(s => s.id === formData.serviceSubclass?.value)?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}</p>
                <p><strong>Pagamento:</strong> {formData.status === 'paid' ? 'Pago' : 'Pendente'}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="modal-container"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <div className="modal-title-area">
            <h2>{schedule ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
            <p>Siga os passos para {schedule ? 'atualizar o' : 'criar um novo'} agendamento.</p>
        </div>
        <button onClick={onClose} className="close-btn"><X size={24} /></button>
      </div>

      <div className="modal-body">
        <Stepper currentStep={step} />
        {internalError && <p className="modal-error">{internalError}</p>}
        {renderStepContent()}
      </div>

      <div className="modal-footer">
        <button onClick={onClose} className="footer-btn-secondary">Cancelar</button>
        <div className="footer-step-buttons">
            {step > 1 && !isCreatingClient && (
              <button onClick={prevStep} className="footer-btn-secondary with-icon">
                  <ArrowLeft size={16} /> Anterior
              </button>
            )}
             {step === 1 && isCreatingClient && (
                <button onClick={() => setIsCreatingClient(false)} className="footer-btn-secondary with-icon">
                    <ArrowLeft size={16} /> Voltar
                </button>
            )}
            {isCreatingClient && step === 1 ? (
              <button onClick={handleSaveNewClientAndAdvance} className="footer-btn-primary with-icon">
                  Salvar e Avançar <ArrowRight size={16} />
              </button>
            ) : step < 4 ? (
              <button onClick={nextStep} className="footer-btn-primary with-icon">
                  Próximo <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="footer-btn-primary save-main-btn">
                  {schedule ? 'Salvar Alterações' : 'Confirmar Agendamento'}
              </button>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default SchedulingModal;
