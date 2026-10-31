import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.31.222:8080/api",
});

export default API;
