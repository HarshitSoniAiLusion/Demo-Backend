import express from "express";
import {
  SignUp,
  verifyMail,
  logOutUser,
  cookieValidator,
  Login,
  GoogleAuth,
} from "../Controllers/userAuthController.js";

import { verifyToken } from "../utils/verifyCookie.js";

const route = express.Router();

route.post("/verifyMail", verifyMail);
route.post("/addUser", SignUp);
route.post("/LogOut", logOutUser);
route.get("/checkCooke", verifyToken, cookieValidator);
route.post("/LogIn", Login);
route.post("/googleAuth", GoogleAuth);

export default route;
