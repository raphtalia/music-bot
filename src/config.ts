import { config } from "dotenv";

// .env config
config({
  path: ".env",
});

const env = process.env;

export const BOT_ID = env.BOT_ID as string;
export const BOT_TOKEN = env.BOT_TOKEN as string;

export const IS_DEV = env.IS_DEV === "true";
export const DEV_SERVER_ID = env.DEV_SERVER_ID as string;

// Hard-coded config
export const ALLOWED_HOSTS = ["www.youtube.com", "youtu.be", "music.youtube.com"];
