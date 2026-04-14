const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['password', 'card', 'document', 'note', 'identity', 'apikey'],
    required: true
  },
  name: { type: String, required: true, trim: true },
  username: { type: String, trim: true },
  encryptedData: { type: String, required: true },
  iv: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  filePath: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

vaultSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vault', vaultSchema);
