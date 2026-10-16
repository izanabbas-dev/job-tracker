import mongoose from 'mongoose';
import Job from '../models/Job.js';

const UPDATABLE_FIELDS = ['company', 'position', 'status', 'location', 'salary', 'jobUrl', 'notes', 'resumeUsed', 'appliedDate'];

const pick = (source, fields) =>
  Object.fromEntries(fields.filter((f) => source?.[f] !== undefined).map((f) => [f, source[f]]));

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

// GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    handleError(res, error);
  }
};

// POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...pick(req.body, UPDATABLE_FIELDS), user: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job id' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      pick(req.body, UPDATABLE_FIELDS),
      { returnDocument: 'after', runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job id' });
    }

    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted', id: job._id });
  } catch (error) {
    handleError(res, error);
  }
};
