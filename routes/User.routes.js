const express = require('express');
const { verifyToken, checkRole } =  require('../middleware/Auth.middleware');
const { getUser, createUser, getUserById } =  require('../controllers/User.controller');
const router = express.Router();

// Endpoint Routes
router.get('/', verifyToken, checkRole('admin'), getUser); // GET ALL USERS
router.get('/:id', verifyToken, checkRole('admin'), getUserById); // GET USER BY ID
router.post('/', verifyToken, checkRole('admin'), createUser); // CREATE USER


module.exports = router;