const express = require('express');
const { register, verifyOTP, resendOTP, login, logout } = require('../controllers/Auth.controller');
const router = express.Router();

// Endpoint Routes (Public)
router.post('/register', register);     // Registrasi User Baru (Kirim OTP)
router.post('/verify-otp', verifyOTP);  // Verifikasi Kode OTP
router.post('/resend-otp', resendOTP);  // Kirim Ulang OTP (Manual trigger via button Frontend)
router.post('/login', login);            // Login
router.post('/logout', logout);          // Logout

module.exports = router;