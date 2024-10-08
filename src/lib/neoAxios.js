import axios from "axios";

const neoAxios = axios.create({
  baseURL: import.meta.env.VITE_NEO_BASE_URL,
});

neoAxios.interceptors.request.use(
  (config) => {
    const neoUser = localStorage.getItem("neoUser");
    const parsedNeoUser = JSON.parse(neoUser);
    config.headers["token"] = parsedNeoUser.idToken;

    return config;
  },
  (error) => Promise.reject(error)
);

neoAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.request?.status === 401) {
      localStorage.setItem("neoUser", null);
      localStorage.clear(); //clears all items in local storage.
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default neoAxios;
