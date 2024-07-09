import { app } from "../utils/firebase.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";

export default async function isUserExist(email) {
  const database = getDatabase(app);
  const dbRef = ref(database, "users");
  const emailQuery = query(dbRef, orderByChild("email"), equalTo(email));

  try {
    const snapshot = await get(emailQuery);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0];
      const userDetails = userData[userKey];
      if (userDetails.email === email) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error querying user data: ", error);
  }
}
