import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { JOB_STATUSES, STATUS_META } from '../constants/jobStatuses';

const StatusDot = ({ status }) => (
  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_META[status].dot}`} aria-hidden="true" />
);

const StatusSelect = ({ id, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(JOB_STATUSES.indexOf(value), 0));
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();

  // Close when clicking outside
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(Math.max(JOB_STATUSES.indexOf(value), 0));
    setOpen(true);
  };

  const select = (status) => {
    onChange(status);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    const last = JOB_STATUSES.length - 1;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(JOB_STATUSES[activeIndex]);
        break;
      case 'Escape':
        // Close only the dropdown, not the surrounding modal
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center gap-2.5 rounded-lg border bg-white py-2 pr-3 pl-3.5 text-left text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-950 dark:text-slate-100 ${
          open
            ? 'border-indigo-500 ring-1 ring-indigo-500'
            : 'border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700'
        }`}
      >
        <StatusDot status={value} />
        <span className="flex-1 truncate">{STATUS_META[value].label}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40"
        >
          {JOB_STATUSES.map((status, index) => {
            const selected = status === value;
            const active = index === activeIndex;
            return (
              <li
                key={status}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => e.preventDefault()} // keep focus on the button
                onClick={() => select(status)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  selected
                    ? 'bg-indigo-600 font-medium text-white'
                    : active
                      ? 'bg-indigo-50 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${selected ? 'bg-white/20' : ''}`}
                >
                  <StatusDot status={status} />
                </span>
                <span className="flex-1">{STATUS_META[status].label}</span>
                {selected && <Check size={15} className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StatusSelect;
