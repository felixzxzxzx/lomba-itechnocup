const nodemailer = require('nodemailer');

// Membuat transporter Nodemailer berdasarkan environment variables
const createTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    // Jika menggunakan Gmail, gunakan service 'gmail' secara otomatis untuk keandalan maksimal
    if (host.includes('gmail.com')) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: (user && pass) ? { user, pass } : undefined,
        tls: {
            rejectUnauthorized: false
        }
    });
};

/**
 * Mengirimkan email OTP ke pengguna
 * @param {string} toEmail - Email penerima
 * @param {string} otpCode - Kode OTP 6 digit
 * @param {number} expireMinutes - Durasi kadaluwarsa OTP dalam menit
 */
const sendOTPEmail = async (toEmail, otpCode, expireMinutes = 10) => {
    const from = process.env.EMAIL_FROM || '"Verifikasi Akun" <no-reply@sdg11.com>';
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2c3e50; text-align: center;">Verifikasi Kode OTP</h2>
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar. Silakan gunakan kode OTP di bawah ini untuk memverifikasi akun Anda:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #27ae60; background: #eef9f2; padding: 10px 25px; border-radius: 8px; border: 1px dashed #27ae60;">
                    ${otpCode}
                </span>
            </div>
            <p style="color: #e74c3c; font-size: 14px; text-align: center;">
                ⏰ Kode OTP ini berlaku selama <strong>${expireMinutes} menit</strong>.
            </p>
            <p style="color: #7f8c8d; font-size: 13px; margin-top: 30px;">
                Jika Anda tidak melakukan permintaan ini, silakan abaikan email ini.
            </p>
        </div>
    `;

    console.log(`📩 [EMAIL OTP LOG] Ke: ${toEmail} | Kode: ${otpCode} | Berlaku: ${expireMinutes} menit`);

    try {
        const user = process.env.SMTP_USER;
        if (!user || user === 'your_email@gmail.com') {
            console.log('⚠️ SMTP_USER belum dikonfigurasi dengan akun asli di .env. Menggunakan log console untuk OTP.');
            return { success: true, isSimulated: true };
        }

        const transporter = createTransporter();
        const mailOptions = {
            from,
            to: toEmail,
            subject: `Kode OTP Verifikasi Akun Anda: ${otpCode}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email OTP berhasil dikirim ke ${toEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Gagal mengirim email OTP ke ${toEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail
};
