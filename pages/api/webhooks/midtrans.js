import {
  Order,
  Download,
  Product,
  User,
  EmailNotification,
} from "../../../database/models";
import { sendAssetEmail } from "../../../services/email";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  // Verifikasi signature Midtrans (penting untuk keamanan)
  const crypto = require("crypto");
  const signatureKey = crypto
    .createHash("sha512")
    .update(
      req.body.order_id +
        req.body.status_code +
        req.body.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
    )
    .digest("hex");

  if (signatureKey !== req.body.signature_key) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const { order_id, transaction_status, fraud_status } = req.body;

  try {
    // Cari order berdasarkan order_number (dari Midtrans)
    const order = await Order.findOne({
      where: { order_number: order_id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Product,
          as: "products",
          through: { attributes: [] }, // Untuk order items
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Proses berdasarkan status transaksi
    switch (transaction_status) {
      case "capture":
      case "settlement":
        if (fraud_status === "accept") {
          // Update status order
          await order.update({ status: "paid" });

          // Buat download token untuk setiap produk
          for (const product of order.products) {
            const downloadToken = uuidv4();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // Expire dalam 7 hari

            await Download.create({
              userId: order.userId,
              productId: product.id,
              orderId: order.id,
              downloadToken,
              expiresAt,
              maxDownloads: 3,
            });

            // Kirim email ke user
            await EmailNotification.create({
              userId: order.userId,
              orderId: order.id,
              emailTo: order.user.email,
              subject: `Asset Download: ${product.name}`,
              body: `You can download your asset here: ${process.env.BASE_URL}/api/downloads/${downloadToken}`,
              status: "pending",
            });

            // Proses pengiriman email (bisa menggunakan queue)
            await sendAssetEmail(
              order.user.email,
              product.name,
              `${process.env.BASE_URL}/api/downloads/${downloadToken}`,
              order.order_number
            );
          }
        }
        break;

      case "deny":
      case "cancel":
      case "expire":
        await order.update({ status: "cancelled" });
        break;

      case "pending":
        await order.update({ status: "pending" });
        break;
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
