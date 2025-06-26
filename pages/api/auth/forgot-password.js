import { User } from '@/database/models';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../../../services/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Untuk keamanan, tetap return 200 meski email tidak ditemukan
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Buat token reset password (expire dalam 1 jam)
    const resetToken = jwt.sign(
      { id: user.id, action: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Simpan token di database (bisa juga menggunakan tabel terpisah untuk reset tokens)
    await user.update({ resetPasswordToken: resetToken });

    // Kirim email
    const resetUrl = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    return res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}