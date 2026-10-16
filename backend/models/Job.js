import mongoose from 'mongoose';

export const JOB_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: { type: String, enum: JOB_STATUSES, default: 'Applied' },
    location: { type: String, trim: true },
    // Free-form so any currency/format works: '$120k', 'PKR 250k', '€85k'
    salary: { type: String, trim: true },
    jobUrl: { type: String, trim: true },
    // Which CV/resume version was sent, e.g. 'Frontend CV v3' or a link to it
    resumeUsed: { type: String, trim: true },
    notes: { type: String },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
