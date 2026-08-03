import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../databases/mysql.js';


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email dan password wajib diisi!'
            });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Email atau password salah'
            });
        }

        const user = users[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Email atau password salah'
            });
        }

        const secretKey = process.env.JWT_SECRET || 'supersecretkey123';
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            secretKey,
            { expiresIn: '1d' } // Token berlaku selama 1 hari
        );

        return res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Error login:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal melakukan login',
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            message: 'Logout berhasil. Token dihapus di sisi client.'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Gagal melakukan logout'
        });
    }
};