import { Cart, Order, OrderItem, Product, User } from "@/database/models";
import authenticate from "../../../middleware/authenticate";
import { v4 as uuidv4 } from "uuid";

export default authenticate(async function handler(req, res) {
  const { user } = req;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Dapatkan cart items user
    const cartItems = await Cart.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Hitung total amount
    let totalAmount = 0;
    const orderItemsData = [];

    // Validasi stok dan siapkan order items
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name}`,
        });
      }

      const subtotal = item.product.price * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Mulai transaksi database
    const transaction = await Order.sequelize.transaction();

    try {
      // Buat order
      const order = await Order.create(
        {
          userId: user.id,
          orderNumber: `ORD-${uuidv4().substring(0, 8).toUpperCase()}`,
          totalAmount,
          status: "pending",
        },
        { transaction }
      );

      // Buat order items
      await OrderItem.bulkCreate(
        orderItemsData.map((item) => ({
          ...item,
          orderId: order.id,
        })),
        { transaction }
      );

      // Update stok produk
      for (const item of cartItems) {
        await Product.update(
          { stock: item.product.stock - item.quantity },
          {
            where: { id: item.productId },
            transaction,
          }
        );
      }

      // Kosongkan cart
      await Cart.destroy({
        where: { userId: user.id },
        transaction,
      });

      // Commit transaksi
      await transaction.commit();

      return res.status(201).json(order);
    } catch (error) {
      // Rollback transaksi jika ada error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
