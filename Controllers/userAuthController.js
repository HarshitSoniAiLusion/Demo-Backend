import validateEmail from "../utils/isVerifiedMail.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { app } from "../utils/firebase.js";
import { v4 as uuidv4 } from "uuid";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  set,
} from "firebase/database";
import isUserExist from "../utils/isUserExist.js";

//Mail Verification

export const verifyMail = async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(errorHandler(400, "Email is Required"));
  }

  //check user exist or not
  const check = await isUserExist(email);
  if (check) {
    return next(errorHandler(400, "User is Already Exist"));
  }
  //Verify the mail using regex
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(?!(?:[0-9]+\.)+[a-zA-Z]{2,}$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isVerified = emailRegex.test(email);

  if (!isVerified) {
    return next(errorHandler(400, "Not a Valid Email"));
  }
  const domain = email.split("@")[1];
  let isCompanyMail = false;
  if (
    domain != "gmail.com" &&
    domain != "yahoo.com" &&
    domain != "outlook.com" &&
    domain != "hotmail.com" &&
    domain != "zoho.com"
  ) {
    isCompanyMail = true;
  }
  res.status(200).json({ email: email, isCompanyMail: isCompanyMail });
};

//Sign Up User

export const SignUp = async (req, res, next) => {
  const data = req.body;
  if (!data.email) {
    return next(errorHandler(400, "Email is Required"));
  }
  const id = uuidv4();
  data.isAuthenticate = true;
  data.id = id;
  const database = getDatabase(app);
  const userRef = ref(database, "users/" + id);
  await set(userRef, data);
  const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET);
  res
    .status(200)
    .cookie("user_Token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
      secure: process.env.NODE_ENV === "production", // Set secure flag for production
      path: "/", // Make it available for the whole domain
    })
    .json(data);
};

// LogOut User

export const logOutUser = async (req, res, next) => {
  try {
    res.clearCookie("user_Token").status(200).json("Successfully SignOut");
  } catch (err) {
    next(err);
  }
};

//Cookie Checker

export const cookieValidator = async (req, res, next) => {
  try {
    if (!req.user) {
      next(errorHandler(400, "UnAutherised User"));
      return;
    }
    res.status(200).json({ msg: "AuthenticatedUser", isAuthenticate: true });
  } catch (error) {
    next(error);
    return;
  }
};

//Login User

export const Login = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is Required"));
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  const database = getDatabase(app);
  const dbRef = ref(database, "users");
  const emailQuery = query(dbRef, orderByChild("email"), equalTo(email));
  try {
    const snapshot = await get(emailQuery);
    if (snapshot.exists()) {
      // Assuming email is unique and only one record matches
      const userData = snapshot.val();
      // Extract the user key and data
      const userKey = Object.keys(userData)[0];
      const userDetails = userData[userKey];
      res
        .status(200)
        .cookie("user_Token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
          secure: process.env.NODE_ENV === "production", // Set secure flag for production
          path: "/", // Make it available for the whole domain
        })
        .json(userDetails);
    } else {
      console.log("No user found with this email");
      return next(errorHandler(400, "No user found with this email"));
    }
  } catch (error) {
    console.error("Error querying user data: ", error);
    return next(error);
  }
};

//Google Auth

export const GoogleAuth = async (req, res, next) => {
  const data = req.body;
  if (!data.email) {
    return next(errorHandler(400, "Email is Required"));
  }
  try {
    if (isUserExist(data.email)) {
      data.isAuthenticate = true;
      const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET);
      res
        .status(200)
        .cookie("user_Token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
          secure: process.env.NODE_ENV === "production", // Set secure flag for production
          path: "/", // Make it available for the whole domain
        })
        .json(data);
      return;
    } else {
      const id = uuidv4();
      data.isAuthenticate = true;
      data.id = id;
      const database = getDatabase(app);
      const userRef = ref(database, "users/" + id);
      await set(userRef, data);
      const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET);
      res
        .status(200)
        .cookie("user_Token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
          secure: process.env.NODE_ENV === "production", // Set secure flag for production
          path: "/", // Make it available for the whole domain
        })
        .json(data);
    }
  } catch (error) {
    next(error);
  }
};
