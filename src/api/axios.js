import axios from "axios";

const api = axios.create({
    baseURL: "/api"
});

/**Interceptor para agregar token
 * 
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


/**
 * Interceptor de respuesta
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            const refresh = localStorage.getItem("refreshToken");

            if (!refresh) {
                window.location = "/login";
                return;
            }

            try {
                const res = await axios.post(
                    "http://localhost:8080/api/v1/auth/refresh",
                    { refreshToken: refresh }
                );

                localStorage.setItem("token", res.data.token);

                error.config.headers.Authorization = `Bearer ${res.data.token}`;
                return api(error.config);
            } catch (e) {
                localStorage.clear();
                window.location = "/login";
            }
        }
    }
);

export default api;
