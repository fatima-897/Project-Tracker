// models/Project.js — Mongoose schema & model
const mongoose = require('mongoose');

const URL_REGEX = /^https?:\/\/.+/i;

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Name must be 100 characters or fewer'],
    },
    stack: {
      type: String,
      trim: true,
      maxlength: [200, 'Stack must be 200 characters or fewer'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['planning', 'in-progress', 'completed'],
        message: 'Status must be planning, in-progress, or completed',
      },
      default: 'planning',
    },
    github_url: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator(v) {
          return !v || URL_REGEX.test(v);
        },
        message: 'github_url must be a valid URL starting with http:// or https://',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be 1000 characters or fewer'],
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
    versionKey: false,
  }
);

module.exports = mongoose.model('Project', projectSchema);
