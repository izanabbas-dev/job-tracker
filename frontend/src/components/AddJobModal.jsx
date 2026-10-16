import { useEffect, useState } from 'react';
import {
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  FileUser,
  Globe,
  Loader2,
  MapPin,
  X,
} from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import StatusSelect from './StatusSelect';

const EMPTY_FORM = {
  company: '',
  position: '',
  status: 'Applied',
  location: '',
  salary: '',
  jobUrl: '',
  resumeUsed: '',
  notes: '',
};

const toForm = (job) =>
  job
    ? Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, job[key] ?? EMPTY_FORM[key]]))
    : EMPTY_FORM;

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500';

const Label = ({ htmlFor, children, required, optional }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
    {children}
    {required && <span className="ml-0.5 text-rose-500 dark:text-rose-400">*</span>}
    {optional && <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">(optional)</span>}
  </label>
);

const IconInput = ({ icon: Icon, label, id, required, optional, className = '', ...props }) => (
  <div className={className}>
    <Label htmlFor={id} required={required} optional={optional}>
      {label}
    </Label>
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input id={id} name={id} required={required} className={fieldClass} {...props} />
    </div>
  </div>
);

// Pass `job` to edit an existing application; omit it to add a new one.
const AddJobModal = ({ open, job = null, onClose, onSaved, resumeOptions = [] }) => {
  const isEdit = Boolean(job);
  const [form, setForm] = useState(() => toForm(job));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setError('');
    onClose();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        setForm(EMPTY_FORM);
        setError('');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, submitting, onClose]);

  if (!open) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value.trim()])
      );
      if (isEdit) {
        await api.put(`/jobs/${job._id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      setForm(EMPTY_FORM);
      await onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, isEdit ? 'Could not update application' : 'Could not create application'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-md dark:bg-slate-950/80 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-title"
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-2xl sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
          <div>
            <h2 id="add-job-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isEdit ? 'Edit Application' : 'Add Application'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEdit ? `Update your application to ${job.company}.` : 'Track a new role anywhere in the world.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 p-5 sm:p-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {error}
            </div>
          )}

          <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <IconInput
              icon={Building2}
              id="company"
              label="Company Name"
              required
              autoFocus
              value={form.company}
              onChange={handleChange}
              placeholder="Acme Inc."
            />
            <IconInput
              icon={Briefcase}
              id="position"
              label="Position"
              required
              value={form.position}
              onChange={handleChange}
              placeholder="Frontend Engineer"
            />

            <div>
              <Label htmlFor="status">Status</Label>
              <StatusSelect
                id="status"
                value={form.status}
                onChange={(status) => setForm((f) => ({ ...f, status }))}
              />
            </div>
            <IconInput
              icon={MapPin}
              id="location"
              label="Location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Remote (Worldwide), London (UK), Dubai (UAE), Lahore (PK)"
              title="e.g. Remote (Worldwide), London (UK), Dubai (UAE), Lahore (PK)"
            />

            <IconInput
              icon={DollarSign}
              id="salary"
              label="Salary / Compensation"
              optional
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. $120k, PKR 250k, €85k"
            />
            <IconInput
              icon={Globe}
              id="jobUrl"
              label="Job URL"
              optional
              type="url"
              value={form.jobUrl}
              onChange={handleChange}
              placeholder="https://company.com/careers/123"
            />

            <div className="sm:col-span-2">
              <IconInput
                icon={FileUser}
                id="resumeUsed"
                label="Resume / CV Version Used"
                optional
                list="resume-options"
                autoComplete="off"
                value={form.resumeUsed}
                onChange={handleChange}
                placeholder="e.g. Frontend Resume v2, FullStack Resume 2026, or a link"
              />
              <datalist id="resume-options">
                {resumeOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="notes" optional>
                Notes
              </Label>
              <div className="relative">
                <FileText size={15} className="pointer-events-none absolute top-2.5 left-3 text-slate-400 dark:text-slate-500" />
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Recruiter name, interview stages, next steps…"
                  className={`${fieldClass} block resize-none`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
