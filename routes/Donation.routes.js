const express = require('express');
const router = express.Router();
const {
    createFoodDonation,
    getAllFoodDonations,
    getFoodDonationById,
    updateFoodDonation,
    deleteFoodDonation,
    createMoneyDonation,
    getAllMoneyDonations,
    getMoneyDonationById
} = require('../controllers/Donation.controller');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');

// Public List / Read Endpoints
router.get('/food', getAllFoodDonations);
router.get('/food/:id', getFoodDonationById);

router.get('/money', getAllMoneyDonations);
router.get('/money/:id', getMoneyDonationById);

// Protected Donatur / Admin Endpoints (Menambah / Mengedit Donasi)
router.post('/food', verifyToken, requireVerified, checkRole('donor', 'admin'), createFoodDonation);
router.put('/food/:id', verifyToken, requireVerified, checkRole('donor', 'admin'), updateFoodDonation);
router.delete('/food/:id', verifyToken, requireVerified, checkRole('donor', 'admin'), deleteFoodDonation);

router.post('/money', verifyToken, requireVerified, checkRole('donor', 'admin'), createMoneyDonation);

module.exports = router;
