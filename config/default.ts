import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });
export default {
  port: "",
  mongoUri: "",
  password: "",
  goCardlessAccessToken: "",
  goCardlessWebhookSecret: "",
  cypherAlgorithm: "",
  emailCypherSecret: "",
  baseUrl: "",
};
