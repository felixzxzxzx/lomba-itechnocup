const express = require('express');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');
const { getUser, createUser, getUserById, updateUser, deleteUser } = require('../controllers/User.controller');
const router = express.Router();

router.get('/', verifyToken, requireVerified, checkRole('admin'), getUser); // GET ALL USERS
router.get('/:id', verifyToken, requireVerified, checkRole('admin'), getUserById); // GET USER BY ID / PUBLIC_ID
router.post('/create', verifyToken, requireVerified, checkRole('admin'), createUser); // CREATE USER (ADMIN)
router.put('/:id', verifyToken, requireVerified, checkRole('admin'), updateUser); // UPDATE USER BY PUBLIC_ID
router.delete('/:id', verifyToken, requireVerified, checkRole('admin'), deleteUser); // DELETE USER BY PUBLIC_ID

module.exports = router;
