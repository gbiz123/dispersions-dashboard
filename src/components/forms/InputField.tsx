// filepath: c:\Users\thoma\Documents\git\requirements\aerscreen\src\components\forms\InputField.tsx
import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = '',
  label,
  className = '',
  min,
  max,
  step,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
  );
};

export default InputField;