import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET,
};
export const config = Object.freeze(_config);
