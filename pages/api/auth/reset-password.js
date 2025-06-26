import { User } from '@/database/models'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.action !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Cek user dan token di database
    const user = await User.findOne({ 
      where: { 
        id: decoded.id,
        resetPasswordToken: token
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan clear token
    await user.update({
      passwordHash: hashedPassword,
      resetPasswordToken: null
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token' });
    }
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}