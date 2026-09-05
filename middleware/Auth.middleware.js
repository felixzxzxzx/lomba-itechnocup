const jwt = require('jsonwebtoken');

/**
 * 1. Middleware untuk Verifikasi Token JWT / Auth Header
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
            });
        }

        const secretKey = process.env.JWT_SECRET || 'supersecretkey123';
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Token tidak valid atau sudah kadaluwarsa.'
        });
    }
};

/**
 * 2. Middleware untuk mengecek role user
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses dilarang. Informasi user tidak ditemukan.'
            });
        }

        const userRoles = Array.isArray(req.user.roles)
            ? req.user.roles
            : (req.user.role ? [req.user.role] : []);

        const hasAccess = allowedRoles.some(role => userRoles.includes(role));

        if (!hasAccess) {
            return res.status(403).json({
                status: 'error',
                message: `Akses dilarang. Fitur ini hanya untuk role: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};

/**
 * 3. Middleware untuk mengecek apakah status akun user sudah terverifikasi (is_verified = true)
 */
const requireVerified = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses ditolak. Silakan login terlebih dahulu.'
        });
    }

    // Jika is_verified di req.user sudah bernilai true / 1
    if (req.user.is_verified === true || req.user.is_verified === 1) {
        return next();
    }

    // Cek langsung ke database untuk memastikan status terkini
    try {
        const userIdentifier = req.user.public_id || req.user.id;
        const [users] = await pool.query('SELECT is_verified FROM users WHERE public_id = ? OR id = ?', [userIdentifier, userIdentifier]);
        
        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan.'
            });
        }

        const isVerified = Boolean(users[0].is_verified);
        if (!isVerified) {
            return res.status(403).json({
                status: 'error',
                is_verified: false,
                message: 'Akun Anda belum terverifikasi. Silakan lakukan verifikasi kode OTP terlebih dahulu.'
            });
        }

        req.user.is_verified = true;
        next();
    } catch (error) {
        console.error('Error requireVerified middleware:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat verifikasi akun.'
        });
    }
};

module.exports = {
    verifyToken,
    checkRole,
    requireVerified
};
