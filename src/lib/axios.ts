"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

fetcher.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (config.headers && session) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

fetcher.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (error.response.status === 401) {
      await signOut();
    }

    throw error;
  },
);
