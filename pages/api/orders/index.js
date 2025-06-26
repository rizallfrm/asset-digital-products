import { Order, OrderItem, Product, User } from "@/database/models";
import authenticate from "../../../middleware/authenticate";

export default authenticate(async function handler(req, res) {
  const { user } = req;

  if (req.method === "GET") {
    try {
      const orders = await Order.findAll({
        where: { userId: user.id },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "previewImageUrl"],
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
});
