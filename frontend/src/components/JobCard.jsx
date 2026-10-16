import { Draggable } from '@hello-pangea/dnd';
import { Banknote, CalendarDays, ExternalLink, FileUser, MapPin, Pencil, Trash2 } from 'lucide-react';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

const isLink = (value) => /^https?:\/\//i.test(value);

const resumeTagClass =
  'inline-flex max-w-full items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300';

const JobCard = ({ job, index, onEdit, onDelete, deleting }) => (
  <Draggable draggableId={job._id} index={index}>
    {(provided, snapshot) => (
      // Outer node belongs to the dnd library: it owns this element's transform, so no transitions,
      // rotation or margins here. Spacing is padding (counted in measurements, unlike flex gap).
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="group pb-3 outline-none"
      >
        <div
          className={`min-w-0 rounded-xl border bg-white p-3.5 transition-[border-color,box-shadow,opacity] group-focus-visible:ring-2 group-focus-visible:ring-indigo-500/40 sm:p-4 dark:bg-slate-900 ${
            snapshot.isDragging
              ? 'rotate-1 border-indigo-300 shadow-xl ring-2 ring-indigo-500/20 dark:border-indigo-500/60'
              : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:shadow-none dark:hover:border-slate-700'
          } ${deleting ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100" title={job.company}>
                {job.company}
              </h3>
              <p className="truncate text-sm text-slate-600 dark:text-slate-400" title={job.position}>
                {job.position}
              </p>
            </div>
            {/* Always visible on touch screens; revealed on hover/focus only with a mouse */}
            <div className="-mt-1 -mr-1 flex shrink-0 items-center transition pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100">
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-slate-400 pointer-fine:p-1.5 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  aria-label={`Open job posting for ${job.position}`}
                >
                  <ExternalLink size={15} />
                </a>
              )}
              <button
                type="button"
                onClick={() => onEdit(job)}
                className="rounded-md p-2 text-slate-400 pointer-fine:p-1.5 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                aria-label={`Edit ${job.company} application`}
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(job)}
                className="rounded-md p-2 text-slate-400 pointer-fine:p-1.5 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                aria-label={`Delete ${job.company} application`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {job.location && (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
            )}
            {job.salary && (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Banknote size={12} className="shrink-0" />
                <span className="truncate">{job.salary}</span>
              </span>
            )}
            {job.resumeUsed &&
              (isLink(job.resumeUsed) ? (
                <a
                  href={job.resumeUsed}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${resumeTagClass} underline-offset-2 hover:bg-violet-100 hover:underline dark:hover:bg-violet-500/20`}
                  title={`Open resume: ${job.resumeUsed}`}
                >
                  <FileUser size={12} className="shrink-0" />
                  <span className="truncate">{job.resumeUsed}</span>
                  <ExternalLink size={11} className="shrink-0" />
                </a>
              ) : (
                <span className={resumeTagClass} title={`Resume: ${job.resumeUsed}`}>
                  <FileUser size={12} className="shrink-0" />
                  <span className="truncate">{job.resumeUsed}</span>
                </span>
              ))}
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-slate-500 dark:text-slate-400">
              <CalendarDays size={12} />
              {formatDate(job.appliedDate)}
            </span>
          </div>

          {job.notes && <p className="mt-2 line-clamp-2 break-words text-xs text-slate-500 dark:text-slate-400">{job.notes}</p>}
        </div>
      </div>
    )}
  </Draggable>
);

export default JobCard;
