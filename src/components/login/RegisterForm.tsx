import React, { memo } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import type { TRegisterSchema } from '@/pages/login/types/register.types';

const Spinner = memo(() => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
));

interface RegisterFormProps {
  uid:            string;
  control:        Control<TRegisterSchema>;
  errors:         FieldErrors<TRegisterSchema>;
  isSubmitting:   boolean;
  regSuccess:     string;
  onSubmit:       (e: React.FormEvent) => void;
  onSwitchLogin:  () => void;
  variant:        'mobile' | 'desktop';
}

const RegisterForm: React.FC<RegisterFormProps> = memo(({
  uid, control, errors, isSubmitting, regSuccess, onSubmit, onSwitchLogin, variant,
}) => {
  const isMobile = variant === 'mobile';
  const submitBtnClass = isMobile
    ? `mt-2 w-full py-3.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-95
       text-white font-bold rounded-xl tracking-widest uppercase text-sm
       disabled:opacity-60 disabled:cursor-not-allowed
       transition-all duration-200 flex items-center justify-center gap-2`
    : `mt-2 w-full py-3.5 bg-white text-blue-700 font-black rounded-xl
       hover:bg-blue-50 active:scale-95 tracking-widest uppercase text-sm
       disabled:opacity-60 disabled:cursor-not-allowed
       transition-all duration-200 flex items-center justify-center gap-2`;

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>

      <Controller name="name" control={control} render={({ field }) => (
        <InputField
          id={`${uid}-${variant}-name`} label="Full Name"
          value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          autoComplete="name" placeholder="John Doe"
          error={errors.name?.message}
        />
      )} />

      <Controller name="regEmail" control={control} render={({ field }) => (
        <InputField
          id={`${uid}-${variant}-regemail`} label="Email" type="email"
          value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          autoComplete="email" placeholder="you@example.com"
          error={errors.regEmail?.message}
        />
      )} />

      <Controller name="regPass" control={control} render={({ field }) => (
        <InputField
          id={`${uid}-${variant}-regpass`} label="Password"
          value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          autoComplete="new-password" placeholder="Min. 8 characters" showToggle
          error={errors.regPass?.message}
        />
      )} />

      {regSuccess && (
        <div className={`flex items-center gap-2 bg-green-500/15 border border-green-400/30 text-green-300 px-4 py-3 rounded-xl ${isMobile ? 'text-sm' : 'text-xs px-3 py-2.5 rounded-lg'}`}>
          <span>✓</span> {regSuccess}
        </div>
      )}

      <Button unstyled type="submit" disabled={isSubmitting} className={submitBtnClass}>
        {isSubmitting
          ? <>{isMobile ? <Spinner /> : <span className="text-blue-600"><Spinner /></span>} Creating…</>
          : 'Create Account'
        }
      </Button>

      {isMobile && (
        <p className="text-center text-white/40 text-xs">
          Have an account?{' '}
          <Button unstyled type="button" onClick={onSwitchLogin} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Sign in
          </Button>
        </p>
      )}
    </form>
  );
});

export default RegisterForm;