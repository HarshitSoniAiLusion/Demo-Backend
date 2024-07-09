import express from "express";
import userAuthRoute from "./Routers/userAuthRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(8080, () => {
  console.log("App is listening at port 8080");
});

app.use("/api/user", userAuthRoute);

app.get('/', (req, res) => {
  res.send('Everything is fine');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
