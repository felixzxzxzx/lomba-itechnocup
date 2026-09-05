const express = require('express');
const { verifyToken, requireVerified, checkRole } = require('../middleware/Auth.middleware');
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require('../controllers/Role.controller');

const router = express.Router();

// Seluruh endpoint role memerlukan autentikasi token & verifikasi akun
router.use(verifyToken);
router.use(requireVerified);

// GET ALL ROLES (Admin)
router.get('/', checkRole('admin'), getRoles);

// GET ROLE BY ID (Admin)
router.get('/:id', checkRole('admin'), getRoleById);

// CREATE ROLE BARU (Admin)
router.post('/create', checkRole('admin'), createRole);

// UPDATE ROLE (Admin)
router.put('/:id', checkRole('admin'), updateRole);

// DELETE ROLE (Admin)
router.delete('/:id', checkRole('admin'), deleteRole);

module.exports = router;
