const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// ================ AUTH ================
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token eksik. Lütfen tekrar giriş yapın.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // ✅ SessionId kontrolü
      const user = await User.findById(decoded.id);
      if (!user || user.currentSessionId !== decoded.sessionId) {
        return res.status(401).json({
          success: false,
          message:
            "Bu oturum geçersiz. Hesabınıza başka bir cihazdan giriş yapılmış olabilir.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token. Lütfen tekrar giriş yapın.",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    });
  }
};

// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
  try {
    if (req.user?.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Bu sayfa sadece öğrencilere özeldir.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Öğrenci kontrolü sırasında bir hata oluştu.",
    });
  }
};

// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
  try {
    if (req.user?.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Bu sayfaya sadece eğitmenler erişebilir.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Eğitmen kontrolü sırasında bir hata oluştu.",
    });
  }
};

// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user?.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Bu sayfa yalnızca yöneticilere (admin) açıktır.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Yönetici kontrolü sırasında bir hata oluştu.",
    });
  }
};
