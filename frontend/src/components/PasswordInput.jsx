import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ className = '', disabled, ...props }) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input {...props} disabled={disabled} type={visible ? 'text' : 'password'} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        title={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-300"
      >
        <Icon size={18} />
      </button>
    </div>
  );
};

export default PasswordInput;
