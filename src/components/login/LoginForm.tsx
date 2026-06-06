import React, { memo } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import type { TLoginSchema } from '@/pages/login/types/login.types';

const Spinner = memo(() => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
));

interface LoginFormProps {
  uid:             string;
  control:         Control<TLoginSchema>;
  errors:          FieldErrors<TLoginSchema>;
  isSubmitting:    boolean;
  apiError:        string;
  onSubmit:        (e: React.FormEvent) => void;
  onSwitchSignUp:  () => void;
  variant:         'mobile' | 'desktop';  // mobile/desktop styling fark
}

const LoginForm: React.FC<LoginFormProps> = memo(({
  uid, control, errors, isSubmitting, apiError, onSubmit, onSwitchSignUp, variant,
}) => {
  const isMobile  = variant === 'mobile';
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
    <form
      className="flex flex-col gap-5"
      onSubmit={onSubmit}
      noValidate
      {...(isMobile ? { key: 'login-mobile' } : {})}
    >
      <Controller name="email" control={control} render={({ field }) => (
        <InputField
          id={`${uid}-${variant}-email`} label="Email" type="email"
          value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          autoComplete="email" placeholder="you@example.com"
          error={errors.email?.message}
        />
      )} />

      <Controller name="password" control={control} render={({ field }) => (
        <InputField
          id={`${uid}-${variant}-pass`} label="Password"
          value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          autoComplete="current-password" placeholder="••••••••" showToggle
          error={errors.password?.message}
        />
      )} />

      {apiError && (
        <div className={`shake flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl ${isMobile ? 'text-sm' : 'text-xs px-3 py-2.5 rounded-lg'}`}>
          <span>⚠</span> {apiError}
        </div>
      )}

      <Button unstyled type="submit" disabled={isSubmitting} className={submitBtnClass}>
        {isSubmitting
          ? <>{isMobile ? <Spinner /> : <span className="text-blue-600"><Spinner /></span>} Signing in…</>
          : 'Login'
        }
      </Button>

      {isMobile && (
        <p className="text-center text-white/40 text-xs">
          No account?{' '}
          <Button unstyled type="button" onClick={onSwitchSignUp} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Register here
          </Button>
        </p>
      )}
    </form>
  );
});

export default LoginForm;