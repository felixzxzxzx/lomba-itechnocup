const express = require('express');
const router = express.Router();
const {
    createDonationRequest,
    getAllDonationRequests,
    getDonationRequestById,
    updateRequestStatus
} = require('../controllers/DonationRequest.controller');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');

// Protected Endpoints Permintaan Donasi
router.get('/', verifyToken, requireVerified, getAllDonationRequests);
router.get('/:id', verifyToken, requireVerified, getDonationRequestById);

// Receiver membuat request donasi makanan
router.post('/', verifyToken, requireVerified, checkRole('receiver', 'admin'), createDonationRequest);

// Admin atau Donor mengubah status request (persetujuan / penolakan / pengonfirmasian)
router.put('/:id/status', verifyToken, requireVerified, checkRole('donor', 'admin'), updateRequestStatus);

module.exports = router;
