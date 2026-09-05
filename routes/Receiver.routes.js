const express = require('express');
const router = express.Router();
const { upsertProfile, getMyProfile, getAllReceivers, verifyReceiver } = require('../controllers/Receiver.controller');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');

// Endpoint Profil Penerima Manfaat (Protected)
router.get('/profile', verifyToken, requireVerified, getMyProfile);
router.post('/profile', verifyToken, requireVerified, checkRole('receiver', 'admin'), upsertProfile);
router.put('/profile', verifyToken, requireVerified, checkRole('receiver', 'admin'), upsertProfile);

// Admin Routes untuk Manajemen & Verifikasi Penerima
router.get('/', verifyToken, requireVerified, checkRole('admin'), getAllReceivers);
router.put('/:id/verify', verifyToken, requireVerified, checkRole('admin'), verifyReceiver);

module.exports = router;
