import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.sh3na.com/api/v1",
  withCredentials: true,
});
