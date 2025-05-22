import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import socket from "../socket/socket";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  VERIFY_SESSION_API,
} = endpoints;

// ================ send Otp ================
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Yükleniyor...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      navigate("/verify-email");
      toast.success("Doğrulama kodu gönderildi.");
    } catch (error) {
      console.log("SENDOTP API ERROR --> ", error);
      toast.error(error.response.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ================ sign Up ================
export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Yükleniyor...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Kayıt işlemi başarılı.");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR --> ", error);
      toast.error("Geçersiz doğrulama kodu.");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ================ Login ================
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Yükleniyor...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const token = response.data.token;

      toast.success("Giriş başarılı.");
      dispatch(setToken(token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }));

      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR.......", error);
      toast.error(error.response?.data?.message || "Giriş başarısız.");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ================ get Password Reset Token ================
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Yükleniyor...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Şifre sıfırlama bağlantısı gönderildi.");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASS TOKEN ERROR............", error);
      toast.error(error.response?.data?.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// ================ reset Password ================
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Yükleniyor...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Şifreniz başarıyla sıfırlandı.");
      navigate("/login");
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error);
      toast.error(error.response?.data?.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// ================ Logout ================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Çıkış yapıldı.");
    if (navigate) navigate("/");
  };
}

// ================ Check Session ================
export async function checkSessionValid(token) {
  try {
    const response = await apiConnector(
      "GET",
      VERIFY_SESSION_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response?.data?.success === true;
  } catch (error) {
    console.log("OTURUM DOĞRULAMA HATASI:", error?.response?.data?.message);
    return false;
  }
}
