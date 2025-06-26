import { Product, Category } from "@/database/models";
import authenticate from "../../../middleware/authenticate";
import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEY_FILE,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export default authenticate(async function handler(req, res) {
  const { user } = req;

  // Cek role admin
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      const previewImage = req.files?.previewImage;
      const assetFile = req.files?.assetFile;

      // Validasi input
      if (!name || !price || !categoryId || !assetFile) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Upload preview image ke Google Drive
      let previewImageUrl = null;
      if (previewImage) {
        const previewImageResponse = await drive.files.create({
          requestBody: {
            name: `${Date.now()}_${previewImage.name}`,
            parents: [process.env.GOOGLE_DRIVE_PREVIEW_FOLDER_ID],
          },
          media: {
            mimeType: previewImage.mimetype,
            body: fs.createReadStream(previewImage.path),
          },
        });

        await drive.permissions.create({
          fileId: previewImageResponse.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        previewImageUrl = `https://drive.google.com/uc?id=${previewImageResponse.data.id}&export=download`;
      }

      // Upload asset file ke Google Drive
      const assetFileResponse = await drive.files.create({
        requestBody: {
          name: `${Date.now()}_${assetFile.name}`,
          parents: [process.env.GOOGLE_DRIVE_ASSETS_FOLDER_ID],
        },
        media: {
          mimeType: assetFile.mimetype,
          body: fs.createReadStream(assetFile.path),
        },
      });

      await drive.permissions.create({
        fileId: assetFileResponse.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const assetFileUrl = `https://drive.google.com/uc?id=${assetFileResponse.data.id}&export=download`;

      // Buat produk baru
      const product = await Product.create({
        categoryId,
        name,
        description,
        price,
        stock,
        previewImageUrl,
        driveFileId: assetFileResponse.data.id,
        status: "active",
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
});
