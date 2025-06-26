import { where } from "sequelize";
import { Product, Category } from "../../../database/models";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        where: { status: "active" },
      });

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
