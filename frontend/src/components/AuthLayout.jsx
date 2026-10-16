import { Briefcase, Loader2 } from 'lucide-react';
import PasswordInput from './PasswordInput';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-12">
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Briefcase size={22} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
    </div>
  </div>
);

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

export const FormError = ({ message }) =>
  message ? (
    <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
      {message}
    </div>
  ) : null;

export const FormSuccess = ({ message }) =>
  message ? (
    <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
      {message}
    </div>
  ) : null;

export const SubmitButton = ({ loading, children, loadingText }) => (
  <button
    type="submit"
    disabled={loading}
    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading && <Loader2 size={16} className="animate-spin" />}
    {loading ? loadingText : children}
  </button>
);

export const Field = ({ label, id, type, ...props }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {type === 'password' ? (
      <PasswordInput id={id} name={id} className={inputClass} {...props} />
    ) : (
      <input id={id} name={id} type={type} className={inputClass} {...props} />
    )}
  </div>
);

export default AuthLayout;
