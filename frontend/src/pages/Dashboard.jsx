import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Award, Briefcase, Loader2, MessagesSquare, Plus, X } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { JOB_STATUSES, STATUS_META, resolveStatus } from '../constants/jobStatuses';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import KanbanColumn from '../components/KanbanColumn';
import AddJobModal from '../components/AddJobModal';

const groupByStatus = (jobs) => {
  const columns = Object.fromEntries(JOB_STATUSES.map((status) => [status, []]));

  jobs.forEach((job) => {
    // Unknown/mismatched statuses land in the first column instead of disappearing
    const status = resolveStatus(job.status) ?? JOB_STATUSES[0];
    columns[status].push({ ...job, status });
  });
  return columns;
};

// Case-insensitive column count; always returns a number, never undefined
const getCount = (columns, statusName) => {
  const status = resolveStatus(statusName);
  if (!status) return 0;
  const key = Object.keys(columns).find((k) => k.toLowerCase() === status.toLowerCase());
  return key ? columns[key]?.length ?? 0 : 0;
};

const Dashboard = () => {
  const { logout } = useAuth();
  const [columns, setColumns] = useState(() => groupByStatus([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [snapPaused, setSnapPaused] = useState(false);
  const boardRef = useRef(null);

  const handleRequestError = useCallback(
    (err, fallback) => {
      if (err?.response?.status === 401) {
        logout();
        return;
      }
      setError(getErrorMessage(err, fallback));
    },
    [logout]
  );

  const fetchJobs = useCallback(
    () =>
      api
        .get('/jobs')
        .then(({ data }) => {
          setColumns(groupByStatus(data));
          setError('');
        })
        .catch((err) => handleRequestError(err, 'Could not load applications'))
        .finally(() => setLoading(false)),
    [handleRequestError]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Previously used resume names, offered as suggestions in the Add Application modal
  const resumeOptions = useMemo(() => {
    const names = Object.values(columns)
      .flat()
      .map((job) => job.resumeUsed?.trim())
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [columns]);

  const stats = useMemo(() => {
    const total = Object.values(columns).reduce((sum, jobs) => sum + (jobs?.length ?? 0), 0);
    const interviews = getCount(columns, 'interviewing');
    const offers = getCount(columns, 'offer');
    const accepted = getCount(columns, 'accepted');

    return {
      total,
      interviews,
      offers: offers + accepted,
      accepted,
    };
  }, [columns]);

  const scrollToColumn = (status) =>
    document
      .getElementById(`column-${status}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

  // Turning mandatory snap back on mid-column makes the browser jump to a snap point. Glide to the
  // nearest column first, then re-enable snap once we're already resting on its snap position.
  const settleBoard = () => {
    const board = boardRef.current;
    const maxScroll = board ? board.scrollWidth - board.clientWidth : 0;
    if (maxScroll <= 0) {
      setSnapPaused(false); // xl grid: nothing scrolls
      return;
    }

    const boardLeft = board.getBoundingClientRect().left;
    const padding = parseFloat(getComputedStyle(board).scrollPaddingLeft) || 0;
    const target = [...board.children]
      .map((col) => {
        const left = board.scrollLeft + col.getBoundingClientRect().left - boardLeft - padding;
        return Math.min(Math.max(left, 0), maxScroll);
      })
      .reduce((best, left) =>
        Math.abs(left - board.scrollLeft) < Math.abs(best - board.scrollLeft) ? left : best
      );

    if (Math.abs(target - board.scrollLeft) < 1) {
      setSnapPaused(false);
      return;
    }

    let done = false;
    const resume = () => {
      if (done) return;
      done = true;
      board.removeEventListener('scrollend', resume);
      setSnapPaused(false);
    };
    board.addEventListener('scrollend', resume);
    setTimeout(resume, 600); // fallback for browsers without scrollend
    board.scrollTo({ left: target, behavior: 'smooth' });
  };

  const onDragEnd = async ({ source, destination, draggableId }) => {
    settleBoard();
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const previous = columns;
    const sourceList = [...(columns[source.droppableId] || [])];
    const [moved] = sourceList.splice(source.index, 1);
    const newStatus = destination.droppableId;

    // Optimistic UI update
    const next = { ...columns, [source.droppableId]: sourceList };
    if (source.droppableId === destination.droppableId) {
      sourceList.splice(destination.index, 0, moved);
    } else {
      const destList = [...(columns[newStatus] || [])];
      destList.splice(destination.index, 0, { ...moved, status: newStatus });
      next[newStatus] = destList;
    }
    setColumns(next);

    if (source.droppableId === newStatus) return;

    try {
      await api.put(`/jobs/${draggableId}`, { status: newStatus });
    } catch (err) {
      setColumns(previous);
      handleRequestError(err, 'Could not update status. Change reverted.');
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete your application to ${job.company}?`)) return;

    setDeletingId(job._id);
    try {
      await api.delete(`/jobs/${job._id}`);
      setColumns((cols) => ({
        ...cols,
        [job.status]: (cols[job.status] || []).filter((j) => j._id !== job._id),
      }));
    } catch (err) {
      handleRequestError(err, 'Could not delete application');
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEditModal = useCallback((job) => {
    setEditingJob(job);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingJob(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl tracking-tight text-slate-900 dark:text-slate-100">Your Job Applications</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track job applications across remote, hybrid, and global markets. Drag cards across columns to update status.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add Application
          </button>
        </div>

        <section className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
          <StatCard
            icon={Briefcase}
            label="Total Applied"
            value={stats.total}
            hint="All tracked applications"
            accent="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          />
          <StatCard
            icon={MessagesSquare}
            label="Active Interviews"
            value={stats.interviews}
            hint="Currently in interview round"
            accent="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          />
          <StatCard
            icon={Award}
            label="Offers Received"
            value={stats.offers}
            hint={`${stats.accepted} accepted`}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          />
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 dark:text-slate-500">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <DragDropContext onDragStart={() => setSnapPaused(true)} onDragEnd={onDragEnd}>
            {/* Quick column switcher for the horizontally scrolling board below xl */}
            <nav aria-label="Jump to column" className="-mx-4 mb-3 flex gap-2 overflow-x-auto scrollbar-none px-4 sm:-mx-6 sm:px-6 xl:hidden">
              {JOB_STATUSES.map((status) => {
                const meta = STATUS_META[status];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => scrollToColumn(status)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-slate-100"
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {meta.label}
                    <span className="text-slate-400 dark:text-slate-500">{columns[status]?.length ?? 0}</span>
                  </button>
                );
              })}
            </nav>

            {/* Snap is paused mid-drag so it doesn't fight the library's edge auto-scroll (see settleBoard) */}
            <div
              ref={boardRef}
              className={`-mx-4 flex scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0 ${
                snapPaused ? '' : 'snap-x snap-mandatory'
              }`}
            >
              {JOB_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  jobs={columns[status] || []}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </main>

      {/* Mounted per open so the form always starts from the selected job (or blank) */}
      <AddJobModal
        key={modalOpen ? editingJob?._id ?? 'new' : 'closed'}
        open={modalOpen}
        job={editingJob}
        onClose={closeModal}
        onSaved={fetchJobs}
        resumeOptions={resumeOptions}
      />
    </div>
  );
};

export default Dashboard;
