import axios from "axios";

const username = "islom";
const password = "islom";
const credentials = btoa(username + ":" + password);

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Authorization: `Basic ${credentials}`,
  },
});
