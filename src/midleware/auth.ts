import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // BACA token dari cookie ATAU header Authorization
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.token || req.session?.token;
  console.log("📦 Token yang diterima:", token);

  if (!token) {
    res.status(401).json({ message: "Silakan login terlebih dahulu" });

    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
    return;
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
    return;
  }
}