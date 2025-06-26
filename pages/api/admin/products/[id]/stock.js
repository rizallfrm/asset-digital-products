import { Product } from "@/database/models";
import authenticate from "@/middleware/authenticate";

export default authenticate(async function handler(req, res) {
  const { user } = req;
  const { id } = req.query;

  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  if (req.method === "PATCH") {
    try {
      const { operation, value } = req.body;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (!["increment", "decrement", "set"].includes(operation)) {
        return res.status(400).json({
          message: "Invalid operation",
        });
      }

      if (typeof value !== "number " || value < 0) {
        return res.status(400).json({
          message: "Invalid value",
        });
      }

      let newStock = product.stock;

      switch (operation) {
        case "increment":
          newStock = product.stock + value;
          break;
        case "decrement":
          newStock = Math.max(0, product.stock - value);
          break;
        case "set":
          newStock = value;
          break;
      }

      await product.update({
        stock: newStock,
      });

      return res.status(200).json({
        message: "Stock updated successfully",
        product: {
          id: product.id,
          name: product.name,
          previousStock: product.stock,
          newStock,
        },
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const product = await Product.findByPk(id, {
        attributes: ["id", "name", "stock"],
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  return res.status(405).json({
    message: "Method not allowed",
  });
});
