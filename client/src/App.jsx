import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from './api/projects.js';
import ProjectList from './components/ProjectList.jsx';
import ProjectForm from './components/ProjectForm.jsx';

export default function App() {
  const [projects, setProjects]     = useState([]);
  const [filter, setFilter]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null); // project edited 
  const [toast, setToast]           = useState(null); // { msg, type }

  // ── Notifications ───────────────────────
  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Load projects ─────────────────────────
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProjects(filter);
      setProjects(data);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, notify]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // ── Create ────────────────────────────────────
  async function handleCreate(form) {
    setSaving(true);
    try {
      const created = await createProject(form);
      setProjects((prev) => [created, ...prev]);
      setShowForm(false);
      notify('Project added!');
    } finally {
      setSaving(false);
    }
  }

  // ── Update ─────────────────────────────────────
  async function handleUpdate(form) {
    setSaving(true);
    try {
      const updated = await updateProject(editTarget._id, form);
      setProjects((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setEditTarget(null);
      notify('Project updated!');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      notify('Project deleted.');
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  // ── Stats ───────────────────────────────────────
  const counts = {
    total:       projects.length,
    planning:    projects.filter((p) => p.status === 'planning').length,
    inProgress:  projects.filter((p) => p.status === 'in-progress').length,
    completed:   projects.filter((p) => p.status === 'completed').length,
  };

  // When filter active, counts reflect filtered list, it'd show total always
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="logo">Project Tracker</span> 
          </h1>
          <p className="app-subtitle">My dev projects — all in one place</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
          + Add Project
        </button>
      </header>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="stat"><span className="stat-num">{counts.total}</span><span className="stat-label">Total</span></div>
        <div className="stat planning"><span className="stat-num">{counts.planning}</span><span className="stat-label">Planning</span></div>
        <div className="stat in-progress"><span className="stat-num">{counts.inProgress}</span><span className="stat-label">InProgress</span></div>
        <div className="stat completed"><span className="stat-num">{counts.completed}</span><span className="stat-label">Completed</span></div>
      </div>

      {/* ── Main content ── */}
      <main className="app-main">
        <ProjectList
          projects={projects}
          filter={filter}
          onFilterChange={setFilter}
          onEdit={(p) => { setEditTarget(p); setShowForm(false); }}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>

      {/* ── Create modal ── */}
      {showForm && (
        <ProjectForm
          initial={null}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}

      {/* ── Edit modal ── */}
      {editTarget && (
        <ProjectForm
          initial={editTarget}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          loading={saving}
        />
      )}

      {/* ── Toast notifications ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'error' ? 'Error' : 'Done'} {toast.msg}
        </div>
      )}
    </div>
  );
}
