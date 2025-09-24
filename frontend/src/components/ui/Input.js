import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  help,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputClasses = [
    'form-input',
    error ? 'error' : '',
    success ? 'success' : '',
    disabled ? 'disabled' : '',
    icon ? `has-icon has-icon-${iconPosition}` : '',
    isFocused ? 'focused' : '',
    className
  ].filter(Boolean).join(' ');

  const inputElement = (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      required={required}
      className={inputClasses}
      {...props}
    />
  );

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && (
          <div className="input-icon input-icon-left">
            {icon}
          </div>
        )}
        
        {inputElement}
        
        {icon && iconPosition === 'right' && (
          <div className="input-icon input-icon-right">
            {icon}
          </div>
        )}
        
        {success && (
          <div className="input-icon input-icon-right success-icon">
            ✓
          </div>
        )}
        
        {error && (
          <div className="input-icon input-icon-right error-icon">
            ⚠
          </div>
        )}
      </div>
      
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
      
      {help && !error && (
        <div className="form-help">
          {help}
        </div>
      )}
    </div>
  );
});

// Specialized input components for medical forms
const MedicalInput = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  help,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const getMedicalIcon = (type) => {
    switch (type) {
      case 'text': return '👤';
      case 'email': return '📧';
      case 'tel': return '📞';
      case 'date': return '📅';
      case 'time': return '🕐';
      case 'number': return '🔢';
      default: return null;
    }
  };

  return (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      help={help}
      disabled={disabled}
      required={required}
      icon={getMedicalIcon(type)}
      className={`medical-input ${className}`}
      {...props}
    />
  );
};

const VitalSignsInput = ({ 
  label,
  value,
  onChange,
  unit,
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`vital-signs-input ${className}`}>
      <Input
        label={label}
        type="number"
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        className="vital-input"
        {...props}
      />
      {unit && (
        <div className="vital-unit">
          {unit}
        </div>
      )}
    </div>
  );
};

const SearchInput = ({ 
  placeholder = "Cari...",
  value,
  onChange,
  onClear,
  className = '',
  ...props 
}) => {
  return (
    <div className={`search-input-wrapper ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon="🔍"
        iconPosition="left"
        className="search-input"
        {...props}
      />
      {value && (
        <button 
          type="button" 
          className="search-clear-btn"
          onClick={onClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Export components
Input.Medical = MedicalInput;
Input.VitalSigns = VitalSignsInput;
Input.Search = SearchInput;

export default Input;
