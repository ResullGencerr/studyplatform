import { toast } from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";
import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../apis";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// ================ buyCourse ================
export async function buyCourse(
  token,
  coursesId,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Kurs satın alınıyor...");

  try {
    // 1. Sahte sipariş başlat (backend'de COURSE_PAYMENT_API çalışmalı)
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { coursesId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // 2. Sahte Razorpay verileri oluştur (fake id'ler)
    const fakeResponse = {
      razorpay_order_id: "FAKE_ORDER_" + Date.now(),
      razorpay_payment_id: "FAKE_PAYMENT_" + Date.now(),
      razorpay_signature: "FAKE_SIGNATURE",
    };

    // 3. Ödeme başarı maili gönder (opsiyonel)
    await sendPaymentSuccessEmail(
      fakeResponse,
      orderResponse.data.message.amount || 0,
      token
    );

    // 4. Ödemeyi doğrula → kursa kaydettir
    await verifyPayment(
      {
        ...fakeResponse,
        coursesId,
      },
      token,
      navigate,
      dispatch
    );

    toast.success("Kursa başarıyla kayıt oldunuz!");
  } catch (error) {
    console.log("FAKE PAYMENT ERROR.....", error);
    toast.error(error?.response?.data?.message || "Satın alma başarısız oldu");
  }

  toast.dismiss(toastId);
}

// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Ödeme doğrulanıyor...");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Kurs başarıyla satın alındı!");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Ödeme doğrulanamadı");
  }

  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
}
