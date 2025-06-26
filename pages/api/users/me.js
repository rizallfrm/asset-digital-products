import { User } from '@/database/models';
import authenticate from '../../../middleware/authenticate';

export default authenticate(async function handler(req, res) {
  const { user } = req;

  if (req.method === 'GET') {
    try {
      // Return data user tanpa password
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, currentPassword, newPassword } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      
      // Handle email change
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        updateData.email = email;
      }

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.passwordHash = hashedPassword;
      }

      await user.update(updateData);

      // Return data user yang sudah diupdate
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
});