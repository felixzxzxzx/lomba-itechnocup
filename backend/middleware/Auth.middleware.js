import jwt from 'jsonwebtoken';

/**
 * 1. Middleware untuk Verifikasi Token JWT / Auth Header
 */
export const verifyToken = (req, res, next) => {
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

export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user didapat dari middleware verifyToken sebelumnya
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Akses dilarang. Fitur ini hanya untuk role: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};