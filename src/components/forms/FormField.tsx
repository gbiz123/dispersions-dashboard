import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: 'number' | 'text' | 'select';
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  onBlur,
  required = false,
  className = '',
  disabled = false,
}) => {
  if (type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">
          {label}{required && ' *'}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="block w-full border rounded px-2 py-1"
        >
          {options?.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={type === 'number' ? 'any' : undefined}
        required={required}
        disabled={disabled}
        className="block w-full border rounded px-2 py-1"
      />
    </div>
  );
};

export default FormField;