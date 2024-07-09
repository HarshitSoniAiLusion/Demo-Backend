import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.user_Token;
  if (!token) {
    next(errorHandler(400, "Unauthorized User"));
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      next(errorHandler(400, "Unauthorized User"));
      return;
    }
    req.user = user;
    next();
  });
};
