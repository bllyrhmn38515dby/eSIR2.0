import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ 
  status, 
  priority, 
  size = 'md',
  showText = true,
  animated = false,
  className = '',
  ...props 
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'critical':
        return {
          color: 'critical',
          text: 'Kritis',
          icon: '🚨',
          description: 'Memerlukan perhatian medis segera'
        };
      case 'urgent':
        return {
          color: 'urgent',
          text: 'Darurat',
          icon: '⚠️',
          description: 'Memerlukan perhatian dalam waktu singkat'
        };
      case 'stable':
        return {
          color: 'stable',
          text: 'Stabil',
          icon: '✅',
          description: 'Kondisi pasien stabil'
        };
      case 'discharged':
        return {
          color: 'discharged',
          text: 'Pulang',
          icon: '🏠',
          description: 'Pasien telah dipulangkan'
        };
      case 'pending':
        return {
          color: 'pending',
          text: 'Menunggu',
          icon: '⏳',
          description: 'Menunggu persetujuan'
        };
      case 'active':
        return {
          color: 'active',
          text: 'Aktif',
          icon: '🔄',
          description: 'Sedang dalam proses'
        };
      case 'completed':
        return {
          color: 'completed',
          text: 'Selesai',
          icon: '✅',
          description: 'Proses telah selesai'
        };
      default:
        return {
          color: 'neutral',
          text: 'Tidak Diketahui',
          icon: '❓',
          description: 'Status tidak diketahui'
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'P1':
        return {
          color: 'p1',
          text: 'P1',
          description: 'Resusitasi - Prioritas tertinggi'
        };
      case 'P2':
        return {
          color: 'p2',
          text: 'P2',
          description: 'Darurat - Prioritas tinggi'
        };
      case 'P3':
        return {
          color: 'p3',
          text: 'P3',
          description: 'Urgent - Prioritas sedang'
        };
      case 'P4':
        return {
          color: 'p4',
          text: 'P4',
          description: 'Standar - Prioritas normal'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(status);
  const priorityConfig = getPriorityConfig(priority);

  const sizeClasses = {
    sm: 'status-sm',
    md: 'status-md',
    lg: 'status-lg'
  };

  const classes = [
    'status-indicator',
    `status-${statusConfig.color}`,
    sizeClasses[size] || sizeClasses.md,
    animated ? 'status-animated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="status-dot" title={statusConfig.description}>
        <span className="status-icon">{statusConfig.icon}</span>
      </div>
      {showText && (
        <span className="status-text">{statusConfig.text}</span>
      )}
      {priorityConfig && (
        <div className={`priority-badge priority-${priorityConfig.color}`} title={priorityConfig.description}>
          {priorityConfig.text}
        </div>
      )}
    </div>
  );
};

// Specialized status indicators for medical use
const PatientStatus = ({ patient, size = 'md', className = '', ...props }) => (
  <StatusIndicator
    status={patient.status}
    priority={patient.priority}
    size={size}
    className={`patient-status ${className}`}
    {...props}
  />
);

const ReferralStatus = ({ referral, size = 'md', className = '', ...props }) => (
  <StatusIndicator
    status={referral.status}
    size={size}
    className={`referral-status ${className}`}
    {...props}
  />
);

const AmbulanceStatus = ({ ambulance, size = 'md', className = '', ...props }) => (
  <StatusIndicator
    status={ambulance.status}
    size={size}
    className={`ambulance-status ${className}`}
    {...props}
  />
);

const SystemStatus = ({ isOnline, size = 'md', className = '', ...props }) => (
  <StatusIndicator
    status={isOnline ? 'active' : 'critical'}
    size={size}
    className={`system-status ${className}`}
    {...props}
  />
);

// Status list component for displaying multiple statuses
const StatusList = ({ statuses, className = '', ...props }) => (
  <div className={`status-list ${className}`} {...props}>
    {statuses.map((statusItem, index) => (
      <StatusIndicator
        key={index}
        status={statusItem.status}
        priority={statusItem.priority}
        size="sm"
        className="status-list-item"
      />
    ))}
  </div>
);

// Export all components
StatusIndicator.Patient = PatientStatus;
StatusIndicator.Referral = ReferralStatus;
StatusIndicator.Ambulance = AmbulanceStatus;
StatusIndicator.System = SystemStatus;
StatusIndicator.List = StatusList;

export default StatusIndicator;
