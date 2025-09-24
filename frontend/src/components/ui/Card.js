import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    medical: 'card-medical',
    emergency: 'card-emergency',
    patient: 'card-patient',
    stats: 'card-stats'
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// Medical specific card components
const PatientCard = ({ 
  patient, 
  onClick, 
  className = '',
  ...props 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'critical';
      case 'urgent': return 'urgent';
      case 'stable': return 'stable';
      case 'discharged': return 'discharged';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P1': return 'p1';
      case 'P2': return 'p2';
      case 'P3': return 'p3';
      case 'P4': return 'p4';
      default: return 'neutral';
    }
  };

  return (
    <Card 
      variant="patient" 
      className={`patient-card ${getStatusColor(patient.status)} ${className}`}
      onClick={onClick}
      {...props}
    >
      <CardHeader>
        <div className="patient-header">
          <div className="patient-id">{patient.id}</div>
          <div className={`priority-badge priority-${getPriorityColor(patient.priority)}`}>
            {patient.priority}
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="patient-info">
          <h4 className="patient-name">{patient.name}</h4>
          <div className="patient-details">
            <span className="detail-item">
              <i className="detail-icon">👤</i>
              {patient.age} tahun, {patient.gender}
            </span>
            <span className="detail-item">
              <i className="detail-icon">🩺</i>
              {patient.diagnosis}
            </span>
            <span className="detail-item">
              <i className="detail-icon">🏥</i>
              {patient.room}
            </span>
            <span className="detail-item">
              <i className="detail-icon">⏰</i>
              Masuk: {patient.admissionTime}
            </span>
          </div>
        </div>

        {patient.vitalSigns && (
          <div className="vital-signs">
            <h5>Vital Signs</h5>
            <div className="vitals-grid">
              <div className="vital-item">
                <span className="vital-label">BP</span>
                <span className="vital-value">{patient.vitalSigns.bp}</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">HR</span>
                <span className="vital-value">{patient.vitalSigns.hr}</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Temp</span>
                <span className="vital-value">{patient.vitalSigns.temp}</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">SpO2</span>
                <span className="vital-value">{patient.vitalSigns.spo2}</span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '',
  ...props 
}) => {
  const getTrendColor = (trend) => {
    if (trend > 0) return 'trend-up';
    if (trend < 0) return 'trend-down';
    return 'trend-stable';
  };

  return (
    <Card variant="stats" className={`stat-card ${className}`} {...props}>
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-number">{value}</p>
        {trend !== undefined && (
          <div className={`stat-trend ${getTrendColor(trend)}`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Patient = PatientCard;
Card.Stat = StatCard;

export default Card;
