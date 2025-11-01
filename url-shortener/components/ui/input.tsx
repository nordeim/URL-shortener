// components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          className={`input input-bordered w-full ${
            error ? 'input-error' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label">
            <span className="label-text-alt">{helperText}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
