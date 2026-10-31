import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://mahesh-qr-service.onrender.com/api",
});

export default API;
