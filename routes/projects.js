const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');

const router = express.Router();

// Helper — check if id is a valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ── GET /api/projects  ─────────────────────────────
// Optional query: ?status=planning|in-progress|completed
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const { status } = req.query;
    const allowed = ['planning', 'in-progress', 'completed'];
    if (status) {
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }
      filter.status = status;
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/projects/:id  ─────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid project ID' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/projects  ──────────────────────────────────
// Body: { name, stack?, status?, github_url?, description? }
router.post('/', async (req, res, next) => {
  try {
    const { name, stack, status, github_url, description } = req.body;
    const project = new Project({ name, stack, status, github_url, description });
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors });
    }
    next(err);
  }
});

// ── PUT /api/projects/:id  ────────────────────────────────────
// Partial update — only fields sent in body are changed
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid project ID' });

    const allowedFields = ['name', 'stack', 'status', 'github_url', 'description'];
    const updates = {};
    for (const key of allowedFields) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors });
    }
    next(err);
  }
});

// ── DELETE /api/projects/:id  ───────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid project ID' });
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted', id: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
