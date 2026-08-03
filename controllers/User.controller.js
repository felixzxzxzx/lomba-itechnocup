import bcrypt from 'bcrypt';
import { pool } from "../databases/mysql.js";
import { hasPublicId } from '../traits/HasPublicId.js';

/**
 * Mendapatkan semua data murid
 */
export const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
        return res.status(200).json({
            status: "success",
            total: rows.length,
            data: rows
        });
    } catch (error) {
        console.error("Error getMurid:", error.message);        
        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Validasi input wajib
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, email, dan password wajib diisi!'
            });
        }

        // Cek apakah email sudah terdaftar
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Email sudah terdaftar!'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const public_id = 'id_' + hasPublicId();

        const userRole = role || 'receiver';

        const [result] = await pool.query(
            'INSERT INTO users (public_id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [public_id, name, email, hashedPassword, phone || null, userRole]
        );

        return res.status(201).json({
            status: 'success',
            message: 'User berhasil dibuat',
            data: {
                id: public_id,
                name,
                email,
                phone,
                role: userRole
            }
        });

    } catch (error) {
        console.error('Error createUser:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal menambahkan user',
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            "SELECT public_id AS id, name, email, phone, role, created_at FROM users WHERE public_id = ?",
            [id]
        );
        return res.status(200).json({
            status: "success",
            data: rows[0]
        });
    } catch (error) {
        console.error("Error getMuridById:", error.message);        
        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, role } = req.body;

        // Cek apakah user dengan ID tersebut ada
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan'
            });
        }

        // Jika email diubah, pastikan email baru belum dipakai user lain
        if (email) {
            const [emailCheck] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, id]
            );
            if (emailCheck.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email sudah digunakan oleh user lain'
                });
            }
        }

        // Bangun query UPDATE secara dinamis berdasarkan data yang dikirim di body
        const updateFields = [];
        const queryParams = [];

        if (name) {
            updateFields.push('name = ?');
            queryParams.push(name);
        }
        if (email) {
            updateFields.push('email = ?');
            queryParams.push(email);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            queryParams.push(phone);
        }
        if (role) {
            updateFields.push('role = ?');
            queryParams.push(role);
        }
        // Jika password diisi/diubah, hash ulang
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            queryParams.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Tidak ada data yang dikirim untuk diubah'
            });
        }

        // Gabungkan query
        queryParams.push(id);
        const sqlQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

        await pool.query(sqlQuery, queryParams);

        return res.status(200).json({
            status: 'success',
            message: `Data user dengan ID ${id} berhasil diperbarui`
        });

    } catch (error) {
        console.error('Error updateUser:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal memperbarui user',
            error: error.message
        });
    }
};