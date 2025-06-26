import { User } from "@/database/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { where } from "sequelize";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    //Validasi input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name,email,and password are required!" });
    }

    //Check email registered
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists!",
      });
    }

    //Hash pass
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: "customer",
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error", error)
    return res.status(500).jsom({
        message: "Internal Server error"
    })
  }
}
