// Must match JOB_STATUSES in backend/models/Job.js
export const JOB_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

const normalize = (value) => String(value ?? '').trim().toLowerCase();

/**
 * Map any status string to its canonical JOB_STATUSES key, case-insensitively.
 * Matches either the key ('Interview', 'interview') or its display label
 * ('Interviewing', 'interviewing'). Returns null when nothing matches.
 */
export const resolveStatus = (value) => {
  const needle = normalize(value);
  if (!needle) return null;
  return (
    JOB_STATUSES.find(
      (status) => normalize(status) === needle || normalize(STATUS_META[status]?.label) === needle
    ) ?? null
  );
};

export const STATUS_META = {
  Applied: {
    label: 'Applied',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  Interview: {
    label: 'Interviewing',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  Offer: {
    label: 'Offer',
    dot: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  Rejected: {
    label: 'Rejected',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  Accepted: {
    label: 'Accepted',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
};
