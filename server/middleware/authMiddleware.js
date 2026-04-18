import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 🔑 Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // ❗ token missing check
      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
      }

      let decoded;

      try {
        // 🔍 Verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({
          message: "Invalid or expired token",
          error: err.message,
        });
      }

      // 👤 Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // ✅ attach user to request
      req.user = user;

      next();
    } else {
      return res.status(401).json({ message: "No Token Found!" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized Access!",
      error: error.message,
    });
  }
};

// 🔐 Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only!" });
  }
};

export default protect;