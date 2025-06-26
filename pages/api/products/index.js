import { Product, Category } from '@/database/models';
import { Op } from 'sequelize';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search = '', category = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = { status: 'active' };
      
      // Tambahkan filter search jika ada
      if (search) {
        whereCondition.name = { [Op.iLike]: `%${search}%` };
      }

      // Tambahkan filter category jika ada
      if (category) {
        whereCondition.categoryId = category;
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        items: rows,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}