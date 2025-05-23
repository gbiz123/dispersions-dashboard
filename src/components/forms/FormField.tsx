import React from 'react';
import Tooltip from '../Tooltip';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormFieldProps {
  label: string;
  name: string;
  type: 'number' | 'text' | 'select';
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
  maxLength?: number;
  tooltip?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  onBlur,
  maxLength,
  required = false,
  className = '',
  disabled = false,
  min,
  max,
  step,
  error,
  tooltip,
}) => {
  /* ── wheel handler for number inputs ─────────────── */
  const wheelNumber = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget;
    if (document.activeElement !== el) el.focus();

    const dir = e.deltaY < 0 ? 1 : -1;          // up = +, down = –
    const stepAttr = el.getAttribute('step');

    if (stepAttr && stepAttr !== 'any') {
      // browser can handle it
      dir > 0 ? el.stepUp() : el.stepDown();
    } else {
      // fallback: adjust value ourselves
      const s   = step ?? 1;
      const cur = parseFloat(el.value || '0') || 0;
      let next  = cur + dir * s;

      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);

      el.value = String(next);
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
  };

  /* ── common props used by <input> ─────────────────── */
  const commonProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...(type === 'number' && { onWheel: wheelNumber }),
  };

  const fieldContent = (
    <>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className="block w-full border rounded px-2 py-1"
        >
          {options?.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...commonProps}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          step={type === 'number' ? step : undefined /* use supplied step */}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className="block w-full border rounded px-2 py-1"
        />
      )}
    </>
  );

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {tooltip ? (
        <Tooltip content={tooltip}>
          {fieldContent}
        </Tooltip>
      ) : (
        fieldContent
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;