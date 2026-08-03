const express = require('express');
const { login, logout } =  require('../controllers/Auth.controller');
const router = express.Router();

// Endpoint Routes
router.post('/login', login); // Login
router.post('/logout', logout); // Logout


module.exports = router;