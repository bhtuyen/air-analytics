import axios from "axios";
import { SERVICE_URL } from "../constants/config"; 
import LocalStorageService from "./LocalStorage";

const instance = axios.create({
  baseURL: SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    console.log(err);
    const originalConfig = err.config;
    if (originalConfig.url !== (SERVICE_URL + "/login") && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        localStorage.clear();
        window.location = '/';
        return instance(originalConfig);
      }
    }
    return Promise.reject(err);
  }
);
export default instance;