import axios from "axios";

const api = axios.create({
  baseURL:
    "https://mass-messenger-l4m3-eqgli97zs-deepanshisaini110s-projects.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;