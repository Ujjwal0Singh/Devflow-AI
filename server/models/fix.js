const mongoose = require('mongoose');

const FixSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  issueTitle: String,
  repoName: String,
  filePath: String,
  originalCode: String,
  fixedCode: String,
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Fix', FixSchema);
