import axios from "axios";
import { store } from "../main"; // index.js veya main.jsx dosyan hangi isimdeyse
import { logout } from "../services/operations/authAPI";
import { toast } from "react-hot-toast";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "Bu oturum geçersiz. Başka bir cihazdan giriş yapıldı."
    ) {
      toast.error("Başka bir cihazdan giriş yapıldı. Oturum kapatılıyor...");
      store.dispatch(logout(() => {
        window.location.href = "/";
      }));
    }

    return Promise.reject(error);
  }
);
