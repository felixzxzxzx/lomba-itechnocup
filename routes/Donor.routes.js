const express = require('express');
const router = express.Router();
const { upsertProfile, getMyProfile, getAllDonors, verifyDonor } = require('../controllers/Donor.controller');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');

// Endpoint Profil Donatur (Protected)
router.get('/profile', verifyToken, requireVerified, getMyProfile);
router.post('/profile', verifyToken, requireVerified, checkRole('donor', 'admin'), upsertProfile);
router.put('/profile', verifyToken, requireVerified, checkRole('donor', 'admin'), upsertProfile);

// Admin Routes untuk Manajemen & Verifikasi Donatur
router.get('/', verifyToken, requireVerified, checkRole('admin'), getAllDonors);
router.put('/:id/verify', verifyToken, requireVerified, checkRole('admin'), verifyDonor);

module.exports = router;
