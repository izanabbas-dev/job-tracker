// Horizontal on phones (one per row) and desktops; stacked icon-over-text in the narrow 3-up tablet layout
const StatCard = ({ icon: Icon, label, value, hint, accent }) => (
  <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-col sm:items-start sm:gap-3 sm:p-5 lg:flex-row lg:items-center lg:gap-4 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${accent}`}>
      <Icon size={22} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
      {hint && <p className="truncate text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  </div>
);

export default StatCard;
