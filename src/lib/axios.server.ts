import { auth } from "@/auth";
import axios from "axios";

export const serverFetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

serverFetcher.interceptors.request.use(async (config) => {
  const session = await auth();
  if (config.headers && session) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});
