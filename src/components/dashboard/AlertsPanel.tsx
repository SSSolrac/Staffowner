import type { DashboardAlert } from '@/types/dashboard';

const toneClasses = {
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  danger: 'border-rose-400 bg-rose-100 text-rose-900',
};

export const AlertsPanel = ({ alerts }: { alerts: DashboardAlert[] }) => (
  <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
    <h3 className="font-medium">Alerts & Status</h3>
    <div className="space-y-3">
      {(['danger', 'warning', 'info'] as const).map((tone) => {
        const grouped = alerts.filter((alert) => alert.tone === tone);
        if (grouped.length === 0) return null;
        return (
          <div key={tone} className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {tone === 'danger' ? 'Immediate Action' : tone === 'warning' ? 'Monitor Closely' : 'Informational'}
            </p>
            {grouped.map((alert) => (
              <article key={alert.id} className={`border rounded p-3 ${toneClasses[alert.tone]}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <span className="text-[11px] uppercase tracking-wide font-semibold">{tone === 'danger' ? 'Action needed' : tone}</span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </article>
            ))}
          </div>
        );
      })}
    </div>
  </section>
);
