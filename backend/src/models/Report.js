const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claim: String,
  status: String,
  explanation: String,
  correct_fact: String,
  source: String,
});

const reportSchema = new mongoose.Schema(
  {
    filename: String,
    total_claims: Number,
    verified: Number,
    inaccurate: Number,
    false_count: Number,
    processed_at: Date,
    claims: [claimSchema],
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
