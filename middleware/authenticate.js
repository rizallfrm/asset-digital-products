import jwt from "jsonwebtoken";
import { User } from "@/database/models";

export default function authenticate(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cek user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Tambahkan user ke request
      req.user = user;

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}