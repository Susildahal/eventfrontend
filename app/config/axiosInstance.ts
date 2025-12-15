"use client";

import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || " https://eventsbackend-drzr.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  
});


axiosInstance.interceptors.request.use(
  (config) => {
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      if (token) {
        if (!config.headers) config.headers = {} as AxiosRequestHeaders;
        config.headers.Authorization = `Bearer ${token}`;

      }

    }
    return config;
  },
  (error: AxiosError) => {
    toast.error("Failed to send request.");
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    // 👉 Show success toast only for create/update/delete
    const method = response.config.method;

    if (method && method !== "get") {
      toast.success("Success!");
    }

    return response;
  },

  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Something went wrong.";

    toast.error(message);

    // OPTIONAL: Auto-redirect to login on 401
    if (error.response?.status === 401 || error.response?.status === 429   && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;