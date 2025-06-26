import { Product } from "@/database/models";
import authenticate from "@/middleware/authenticate";
import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEY_FILE,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export default authenticate(async function handler(req, res) {
  const { user } = req;
  const { id } = req.query;

  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden",
    });
  } // GET PRODUCT DETAIL
  if (req.method === "GET") {
    try {
      const product = await Product.findByPk(id, {
        include: ["category"],
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

  // UPDATE PRODUCT
  if (req.method === "PUT") {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const { name, description, price, stock, categoryId, previewImageUrl } =
        req.body;
      const previewImage = req.files?.previewImage;

      //Upadte data dasar
      const updateData = {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        categoryId: categoryId || product.categoryId,
        status: status || product.status,
      };

      //Handle preview image update
      if (previewImage) {
        // delete file lama
        if (product.previewImageUrl) {
          const fileId = product.previewImageUrl.split("id="[1].split("&")[0]);
          try {
            await drive.files.delete({
              fileId,
            });
          } catch (error) {
            console.warn("Error deleting preview image:", error);
          }
        }

        // Update file baru
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

        updateData.previewImageUrl = `https://drive.google.com/uc?id=${previewImageResponse.data.id}&export=download`;
      }
      await product.update(updateData);
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // DELETE PRODUCT (SOFT DELETE)
  if (req.method === "DELETE") {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // soft delete dengan mengubah status
      await product.update({
        status: "inactive",
      });

      return res.status(200).json({
        message: "Product deactived Successfully!",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.statuss(500).json({
        message: "Internal server error",
      });
    }
  }
  return res.status(405).json({
    message: "Method not allowed",
  });
});
