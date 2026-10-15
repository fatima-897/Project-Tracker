import ProjectCard from './ProjectCard.jsx';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Planning', value: 'planning' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

export default function ProjectList({ projects, filter, onFilterChange, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading projects…</p>
      </div>
    );
  }

  return (
    <section>
      {/* Filter tabs */}
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-tab ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <p>No projects yet.</p>
          <p className="empty-sub">Click <strong>+ Add Project</strong> to get started.</p>
        </div>
      ) : (
        <div className="card-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
