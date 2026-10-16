import { Droppable } from '@hello-pangea/dnd';
import { STATUS_META } from '../constants/jobStatuses';
import JobCard from './JobCard';

const KanbanColumn = ({ status, jobs, onEdit, onDelete, deletingId }) => {
  const meta = STATUS_META[status];

  return (
    // Below xl: near full-width snap panels on phones, fixed-width columns on tablets; xl+: equal grid tracks
    <div
      id={`column-${status}`}
      className="flex w-[85vw] max-w-80 shrink-0 snap-start flex-col rounded-2xl bg-slate-100/70 sm:w-72 xl:w-auto xl:max-w-none xl:min-w-0 dark:bg-slate-900/60 dark:ring-1 dark:ring-slate-800"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h2 className={`text-sm font-semibold ${meta.text}`}>{meta.label}</h2>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.text}`}>
          {jobs.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          // No flex gap: the library ignores it when measuring, so cards would jump by the gap on lift/drop.
          // Each card supplies its own bottom padding instead. flex-1 + min-h keep the drop zone continuous.
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`relative flex min-h-48 flex-1 flex-col rounded-b-2xl px-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50/80 dark:bg-indigo-500/10' : ''
            }`}
          >
            {jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                deleting={deletingId === job._id}
              />
            ))}
            {provided.placeholder}
            {/* Overlay rather than a flow element, and faded rather than unmounted, so the column never resizes */}
            {jobs.length === 0 && (
              <div
                aria-hidden={snapshot.isDraggingOver}
                className={`pointer-events-none absolute inset-x-3 top-0 bottom-3 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 transition-opacity dark:border-slate-800 dark:text-slate-500 ${
                  snapshot.isDraggingOver ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Drop applications here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
