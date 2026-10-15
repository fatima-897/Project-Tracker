import { useState, useEffect } from 'react';

const EMPTY = { name: '', stack: '', status: 'planning', github_url: '', description: '' };

export default function ProjectForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);

  // Pre-fill form when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        stack: initial.stack || '',
        status: initial.status || 'planning',
        github_url: initial.github_url || '',
        description: initial.description || '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors([]);
  }, [initial]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors(err.message ? err.message.split(', ') : ['Unexpected error']);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? 'Edit Project' : 'Add New Project'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {errors.length > 0 && (
          <div className="error-box">
            {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stack">Stack <span className="hint">(comma-separated)</span></label>
            <input
              id="stack"
              name="stack"
              type="text"
              value={form.stack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="github_url">GitHub URL</label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="A short summary of what this project does..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : initial ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
