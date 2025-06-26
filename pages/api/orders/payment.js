import { Order, Payment } from "@/database/models";
import authenticate from "../../../middleware/authenticate";
import midtransClient from "midtrans-client";

export default authenticate(async function handler(req, res) {
  const { user } = req;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { orderId, paymentMethod } = req.body;

    // Validasi input
    if (!orderId || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Order ID and payment method are required" });
    }

    // Cek order
    const order = await Order.findOne({
      where: { id: orderId, userId: user.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order is already processed" });
    }

    // Initialize Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    // Buat parameter transaksi
    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name.split(" ")[0],
        last_name: user.name.split(" ")[1] || "",
        email: user.email,
      },
    };

    // Buat transaksi di Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Simpan data payment
    await Payment.create({
      orderId: order.id,
      midtransTransactionId: transaction.token,
      paymentType: paymentMethod,
      amount: order.totalAmount,
      status: "pending",
    });

    return res.status(200).json({
      paymentUrl: transaction.redirect_url,
      token: transaction.token,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
