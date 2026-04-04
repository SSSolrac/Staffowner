const logs = [
  'Staff added new customer',
  'Customer redeemed reward',
  'Owner updated settings',
];

export const ActivityLogPage = () => (
  <div className="rounded-lg border bg-white dark:bg-slate-800 p-4">
    <h2 className="text-xl font-semibold mb-3">Owner Activity Log</h2>
    <ul className="list-disc pl-5 space-y-1">{logs.map((log) => <li key={log}>{log}</li>)}</ul>
  </div>
);
