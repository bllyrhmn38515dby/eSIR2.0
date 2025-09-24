import React, { useState, useEffect } from 'react';
import { Card, StatusIndicator } from '../ui';
import './VitalSignsMonitor.css';

const VitalSignsMonitor = ({ 
  patientId,
  vitalSigns = {},
  onUpdate,
  realTime = false,
  className = '',
  ...props 
}) => {
  const [currentVitals, setCurrentVitals] = useState({
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    temperature: 36.5,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    bloodSugar: 100,
    weight: 70,
    height: 170,
    lastUpdated: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [alerts, setAlerts] = useState([]);

  // Load initial vital signs
  useEffect(() => {
    if (vitalSigns && Object.keys(vitalSigns).length > 0) {
      setCurrentVitals(prev => ({
        ...prev,
        ...vitalSigns,
        lastUpdated: vitalSigns.lastUpdated || new Date().toISOString()
      }));
    }
  }, [vitalSigns]);

  // Real-time updates simulation
  useEffect(() => {
    if (realTime) {
      const interval = setInterval(() => {
        setCurrentVitals(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString()
        }));
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [realTime]);

  // Check for critical values and generate alerts
  useEffect(() => {
    const newAlerts = [];
    
    // Blood Pressure alerts
    if (currentVitals.bloodPressure.systolic > 140 || currentVitals.bloodPressure.diastolic > 90) {
      newAlerts.push({
        type: 'warning',
        message: 'Tekanan darah tinggi terdeteksi',
        vital: 'bloodPressure',
        value: `${currentVitals.bloodPressure.systolic}/${currentVitals.bloodPressure.diastolic}`
      });
    }
    
    if (currentVitals.bloodPressure.systolic < 90 || currentVitals.bloodPressure.diastolic < 60) {
      newAlerts.push({
        type: 'danger',
        message: 'Tekanan darah rendah terdeteksi',
        vital: 'bloodPressure',
        value: `${currentVitals.bloodPressure.systolic}/${currentVitals.bloodPressure.diastolic}`
      });
    }
    
    // Heart Rate alerts
    if (currentVitals.heartRate > 100) {
      newAlerts.push({
        type: 'warning',
        message: 'Denyut jantung cepat (tachycardia)',
        vital: 'heartRate',
        value: currentVitals.heartRate
      });
    }
    
    if (currentVitals.heartRate < 60) {
      newAlerts.push({
        type: 'warning',
        message: 'Denyut jantung lambat (bradycardia)',
        vital: 'heartRate',
        value: currentVitals.heartRate
      });
    }
    
    // Temperature alerts
    if (currentVitals.temperature > 38) {
      newAlerts.push({
        type: 'danger',
        message: 'Demam tinggi terdeteksi',
        vital: 'temperature',
        value: currentVitals.temperature
      });
    }
    
    if (currentVitals.temperature < 35) {
      newAlerts.push({
        type: 'danger',
        message: 'Hipotermia terdeteksi',
        vital: 'temperature',
        value: currentVitals.temperature
      });
    }
    
    // Oxygen Saturation alerts
    if (currentVitals.oxygenSaturation < 95) {
      newAlerts.push({
        type: 'warning',
        message: 'Saturasi oksigen rendah',
        vital: 'oxygenSaturation',
        value: currentVitals.oxygenSaturation
      });
    }
    
    if (currentVitals.oxygenSaturation < 90) {
      newAlerts.push({
        type: 'danger',
        message: 'Saturasi oksigen kritis',
        vital: 'oxygenSaturation',
        value: currentVitals.oxygenSaturation
      });
    }
    
    setAlerts(newAlerts);
  }, [currentVitals]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({ ...currentVitals });
  };

  const handleSave = () => {
    const updatedVitals = {
      ...currentVitals,
      ...editValues,
      lastUpdated: new Date().toISOString()
    };
    
    setCurrentVitals(updatedVitals);
    setIsEditing(false);
    
    if (onUpdate) {
      onUpdate(updatedVitals);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleInputChange = (field, value) => {
    if (field === 'bloodPressure') {
      const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
      setEditValues(prev => ({
        ...prev,
        bloodPressure: { systolic: systolic || 0, diastolic: diastolic || 0 }
      }));
    } else {
      setEditValues(prev => ({
        ...prev,
        [field]: parseFloat(value) || 0
      }));
    }
  };

  const getVitalStatus = (vital, value) => {
    switch (vital) {
      case 'bloodPressure':
        if (value.systolic > 140 || value.diastolic > 90) return 'warning';
        if (value.systolic < 90 || value.diastolic < 60) return 'danger';
        return 'normal';
      
      case 'heartRate':
        if (value > 100 || value < 60) return 'warning';
        return 'normal';
      
      case 'temperature':
        if (value > 38 || value < 35) return 'danger';
        return 'normal';
      
      case 'oxygenSaturation':
        if (value < 90) return 'danger';
        if (value < 95) return 'warning';
        return 'normal';
      
      default:
        return 'normal';
    }
  };

  const getVitalIcon = (vital) => {
    switch (vital) {
      case 'bloodPressure': return '🩸';
      case 'heartRate': return '💓';
      case 'temperature': return '🌡️';
      case 'oxygenSaturation': return '🫁';
      case 'respiratoryRate': return '🫁';
      case 'bloodSugar': return '🍯';
      case 'weight': return '⚖️';
      case 'height': return '📏';
      default: return '📊';
    }
  };

  const getVitalUnit = (vital) => {
    switch (vital) {
      case 'bloodPressure': return 'mmHg';
      case 'heartRate': return 'bpm';
      case 'temperature': return '°C';
      case 'oxygenSaturation': return '%';
      case 'respiratoryRate': return '/min';
      case 'bloodSugar': return 'mg/dL';
      case 'weight': return 'kg';
      case 'height': return 'cm';
      default: return '';
    }
  };

  const formatVitalValue = (vital, value) => {
    if (vital === 'bloodPressure') {
      return `${value.systolic}/${value.diastolic}`;
    }
    return value.toString();
  };

  const vitalSignsData = [
    { key: 'bloodPressure', label: 'Tekanan Darah', value: currentVitals.bloodPressure },
    { key: 'heartRate', label: 'Denyut Jantung', value: currentVitals.heartRate },
    { key: 'temperature', label: 'Suhu Tubuh', value: currentVitals.temperature },
    { key: 'oxygenSaturation', label: 'Saturasi Oksigen', value: currentVitals.oxygenSaturation },
    { key: 'respiratoryRate', label: 'Frekuensi Napas', value: currentVitals.respiratoryRate },
    { key: 'bloodSugar', label: 'Gula Darah', value: currentVitals.bloodSugar },
    { key: 'weight', label: 'Berat Badan', value: currentVitals.weight },
    { key: 'height', label: 'Tinggi Badan', value: currentVitals.height }
  ];

  return (
    <div className={`vital-signs-monitor ${className}`} {...props}>
      <Card variant="medical">
        <Card.Header>
          <div className="monitor-header">
            <Card.Title>
              <span className="monitor-icon">📊</span>
              Vital Signs Monitor
              {realTime && <span className="realtime-indicator">LIVE</span>}
            </Card.Title>
            <div className="monitor-actions">
              {!isEditing ? (
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={handleEdit}
                >
                  ✏️ Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={handleSave}
                  >
                    💾 Simpan
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancel}
                  >
                    ❌ Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="vital-alerts">
              {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.type}`}>
                  <span className="alert-icon">
                    {alert.type === 'danger' ? '🚨' : '⚠️'}
                  </span>
                  <span className="alert-message">{alert.message}</span>
                  <span className="alert-value">{alert.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Vital Signs Grid */}
          <div className="vital-signs-grid">
            {vitalSignsData.map((vital) => {
              const status = getVitalStatus(vital.key, vital.value);
              const isEditingThis = isEditing && editValues[vital.key] !== undefined;
              const displayValue = isEditingThis ? editValues[vital.key] : vital.value;
              
              return (
                <div key={vital.key} className={`vital-item vital-${status}`}>
                  <div className="vital-header">
                    <span className="vital-icon">{getVitalIcon(vital.key)}</span>
                    <span className="vital-label">{vital.label}</span>
                    <StatusIndicator 
                      status={status === 'normal' ? 'stable' : status === 'warning' ? 'urgent' : 'critical'}
                      size="sm"
                    />
                  </div>
                  
                  <div className="vital-content">
                    {isEditingThis ? (
                      <div className="vital-edit">
                        {vital.key === 'bloodPressure' ? (
                          <input
                            type="text"
                            className="form-input vital-input"
                            value={`${displayValue.systolic}/${displayValue.diastolic}`}
                            onChange={(e) => handleInputChange(vital.key, e.target.value)}
                            placeholder="120/80"
                          />
                        ) : (
                          <input
                            type="number"
                            className="form-input vital-input"
                            value={displayValue}
                            onChange={(e) => handleInputChange(vital.key, e.target.value)}
                            step={vital.key === 'temperature' ? '0.1' : '1'}
                          />
                        )}
                        <span className="vital-unit">{getVitalUnit(vital.key)}</span>
                      </div>
                    ) : (
                      <div className="vital-display">
                        <span className="vital-value">
                          {formatVitalValue(vital.key, displayValue)}
                        </span>
                        <span className="vital-unit">{getVitalUnit(vital.key)}</span>
                      </div>
                    )}
                  </div>
                  
                  {status !== 'normal' && (
                    <div className="vital-status">
                      {status === 'warning' ? '⚠️ Perhatian' : '🚨 Kritis'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Last Updated */}
          <div className="last-updated">
            <span className="update-label">Terakhir diperbarui:</span>
            <span className="update-time">
              {new Date(currentVitals.lastUpdated).toLocaleString('id-ID')}
            </span>
            {realTime && (
              <span className="realtime-badge">
                🔄 Real-time
              </span>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VitalSignsMonitor;
