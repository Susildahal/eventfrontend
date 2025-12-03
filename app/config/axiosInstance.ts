import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token at request time (safe for SSR/Next.js)
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken")
            if (token) {
                if (!config.headers) config.headers = {}
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Redirect to /login on 401 responses
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error?.response?.status === 401) {
//             // Optional: clear stored auth state
//             try {
//                 localStorage.removeItem("authToken");
//             } catch (e) {
//                 // ignore
//             }
//             // Navigate to login page
//             if (typeof window !== "undefined") {
//                 window.location.href = "/login";
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;