import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    Authorization: Bearer ${API_CONFIG.apiKey},
  },
});

export default apiClient;
