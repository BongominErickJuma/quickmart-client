import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000/api/v1/qm",
  baseURL: "https://quickmart-server.onrender.com/api/v1/qm",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor to handle errors

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const message = error.response?.data.message || "An Error occured";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.log(error);
      return Promise.reject(new Error("Network Error. No response from the server"));
    }
  }
);

export const getImageUrl = (relativePath) => {
  if (!relativePath) return "";
  // return `http://localhost:3000/${relativePath}`;
  return `https://quickmart-server.onrender.com/${relativePath}`;
};

export const authService = {
  login: async (credentials) => {
    return await api.post("/users/login", credentials);
  },
  logout: async () => {
    return await api.get("/users/logout");
  },
  signup: async (userData) => {
    return await api.post("/users/signup", userData);
  },
  updatePassword: async (credentials) => {
    return await api.patch("/users/update-password", credentials);
  },

  updateMe: async (userData) => {
    return await api.patch("/users/update-me", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  forgotPassword: async (email) => {
    return await api.post("/users/forgot-password", { email });
  },
  resetPassword: async (credentials, token) => {
    return await api.patch(`/users/reset-password/${token}`, credentials);
  },
};

export const userService = {
  getMe: async () => {
    return await api.get("/users/me");
  },
};

export const productService = {
  getAllProducts: async (category) => {
    return await api.get(`/products?category=${category}`);
  },
};

export const orderService = {
  getCheckoutSession: async (items) => {
    return await api.post("/orders/checkout-session", { items });
  },
};
