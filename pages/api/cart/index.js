import { Cart, Product } from "@/database/models";
import authenticate from "../../../middleware/authenthicate";

export default authenticate(async function handler(req, res) {
  const { user } = req;
  //GET ALL
  if (req.method === "GET") {
    try {
      const cartItems = await Cart.findall({
        where: {
          userId: user.id,
        },
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });

      return res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;

      //validasi input
      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: "Product id and quantity are required" });
      }

      // Cek Produk ada
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      //cek stok
      if (product.stock < quantity) {
        return res.status(400).json({
          message: "Product stock is not enough",
        });
      }

      //Cek produk di cart
      const existingCartItem = await Cart.findOne({
        where: {
          userId: user.id,
          productId,
        },
      });

      if (existingCartItem) {
        // Update quantity jika ada
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return res.status(200).json(existingCartItem);
      } else {
        // buat cart item baru
        const cartItem = await Cart.create({
          userId: user.id,
          productId,
          quantity,
        });
        return res.status(201).json(cartItem);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
});
