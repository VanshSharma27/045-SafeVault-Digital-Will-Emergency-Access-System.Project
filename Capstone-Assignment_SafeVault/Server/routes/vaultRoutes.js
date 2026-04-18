const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Vault = require('../models/Vault');
const { protect } = require('../middleware/authMiddleware');
const { encrypt, decrypt } = require('../utils/encryption');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/vault — get all vault items for user
router.get('/', protect, async (req, res) => {
  try {
    const items = await Vault.find({ user: req.user.id }).sort({ updatedAt: -1 });
    const decrypted = items.map(item => {
      const plain = decrypt(item.encryptedData, item.iv);
      return { ...item.toObject(), secret: plain };
    });
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/vault — create vault item
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { type, name, username, secret, tags, expiresAt } = req.body;
    const { encryptedData, iv } = encrypt(secret || '');
    const item = await Vault.create({
      user: req.user.id,
      type, name, username,
      encryptedData, iv,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      filePath: req.file ? req.file.filename : null,
      expiresAt: expiresAt || null
    });
    res.status(201).json({ ...item.toObject(), secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/vault/:id — update vault item
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Vault.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const { name, username, secret, tags, expiresAt } = req.body;
    if (secret) {
      const { encryptedData, iv } = encrypt(secret);
      item.encryptedData = encryptedData;
      item.iv = iv;
    }
    if (name) item.name = name;
    if (username !== undefined) item.username = username;
    if (tags) item.tags = tags.split(',').map(t => t.trim());
    if (expiresAt) item.expiresAt = expiresAt;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/vault/:id — delete vault item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Vault.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
