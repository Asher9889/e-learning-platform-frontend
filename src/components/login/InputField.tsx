import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';

const EyeIcon = memo(({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
);

export interface InputFieldProps {
  id:            string;
  label:         string;
  type?:         string;
  value:         string;
  onChange:      (v: string) => void;
  onBlur?:       () => void;
  autoComplete?: string;
  placeholder?:  string;
  showToggle?:   boolean;
  error?:        string;
}

const InputField: React.FC<InputFieldProps> = memo(({
  id, label, type = 'text', value, onChange, onBlur,
  autoComplete, placeholder, showToggle, error,
}) => {
  const [visible, setVisible] = useState(false);
  const inputType     = showToggle ? (visible ? 'text' : 'password') : type;
  const toggleVisible = useCallback(() => setVisible((v) => !v), []);
  const handleChange  = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-xs font-medium text-white/70 tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`
            w-full bg-white/10 px-4 py-3 rounded-xl text-white text-sm
            border placeholder-white/40
            outline-none focus:bg-white/15
            transition-all duration-200 pr-10
            ${error
              ? 'border-red-400/60 focus:border-red-400'
              : 'border-white/20 focus:border-white/60'
            }
          `}
        />
        {showToggle && (
          <Button
            unstyled
            type="button"
            onClick={toggleVisible}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={visible} />
          </Button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-0.5 pl-1">{error}</p>}
    </div>
  );
});

export default InputField;