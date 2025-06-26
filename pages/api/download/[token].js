import { Download, Product, Order } from "@/database/models";

export default async function handler(req, res) {
  const { token } = req.query;

  if (req.method === "GET") {
    try {
      // Cek download record
      const download = await Download.findOne({
        where: { downloadToken: token },
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: Order,
            as: "order",
          },
        ],
      });

      if (!download) {
        return res.status(404).json({ message: "Download not found" });
      }

      // Cek apakah download masih valid
      if (new Date(download.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Download link has expired" });
      }

      if (download.downloadCount >= download.maxDownloads) {
        return res.status(400).json({ message: "Maximum downloads reached" });
      }

      // Update download count
      await download.update({
        downloadCount: download.downloadCount + 1,
      });

      // Kirim data file
      return res.status(200).json({
        productName: download.product.name,
        downloadUrl: `https://drive.google.com/uc?id=${download.product.driveFileId}&export=download`,
        orderId: download.orderId,
        remainingDownloads:
          download.maxDownloads - (download.downloadCount + 1),
        expiresAt: download.expiresAt,
      });
    } catch (error) {
      console.error("Download error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
