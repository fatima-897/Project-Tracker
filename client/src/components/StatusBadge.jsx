const CONFIG = {
  planning:    { label: 'Planning',     color: '#6366f1', bg: '#eef2ff' },
  'in-progress': { label: 'In Progress', color: '#f59e0b', bg: '#fffbeb' },
  completed:   { label: 'Completed',    color: '#10b981', bg: '#ecfdf5' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.planning;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      {cfg.label}
    </span>
  );
}
