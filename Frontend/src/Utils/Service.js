import axios from "axios";

const api = axios.create({
    baseURL: "https://full-stack-final-assignment.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
