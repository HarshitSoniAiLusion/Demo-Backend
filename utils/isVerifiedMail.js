// emailValidator.js
import validator from "validator";
import axios from "axios";
import dns from "dns";

async function isValidEmailFormat(email) {
  return validator.isEmail(email);
}

async function verifyDomain(email) {
  const domain = email.split("@")[1];
  return await new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        return resolve(false);
      }
      resolve(true);
    });
  });
}

async function verifyWithHunter(email, apiKey) {
  try {
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier`,
      {
        params: {
          email: email,
          api_key: apiKey,
        },
      }
    );
    return response.data.data.status === "valid";
  } catch (error) {
    return false;
  }
}

export default async function validateEmail(email, hunterApiKey) {
  if (!(await isValidEmailFormat(email))) {
    return false;
  }

  if (!(await verifyDomain(email))) {
    return false;
  }

  if (hunterApiKey) {
    return await verifyWithHunter(email, hunterApiKey);
  }

  return true;
}
