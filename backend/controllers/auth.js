const User = require('./../models/user');
const Profile = require('./../models/profile');
const optGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'Bu e-posta zaten kayıtlı. Lütfen giriş yapın.',
      });
    }

    const otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
    await mailSender(email, 'Doğrulama Kodu', otpTemplate(otp, name));
    await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      otp,
      message: 'Doğrulama kodu başarıyla gönderildi.',
    });
  } catch (error) {
    console.log('Doğrulama kodu gönderilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Doğrulama kodu oluşturulurken hata oluştu.',
      error: error.message,
    });
  }
};

// ================ SIGNUP ================
exports.signup = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, confirmPassword,
      accountType, contactNumber, otp
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp) {
      return res.status(401).json({
        success: false,
        message: 'Tüm alanların doldurulması zorunludur.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifre ve şifre tekrarı uyuşmuyor. Lütfen tekrar deneyin.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta ile zaten kayıt olunmuş. Lütfen giriş yapın.',
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya bulunamayan doğrulama kodu.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null, dateOfBirth: null, about: null, contactNumber: null,
    });

    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    await User.create({
      firstName, lastName, email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
      approved,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    res.status(200).json({
      success: true,
      message: 'Kayıt işlemi başarıyla tamamlandı.',
    });
  } catch (error) {
    console.log('Kayıt olurken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      error: error.message,
    });
  }
};

// ================ LOGIN ================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Tüm alanlar zorunludur." });
    }

    let user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({ success: false, message: "Böyle bir kullanıcı bulunamadı." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Şifreniz yanlış. Lütfen tekrar deneyin." });
    }

    const sessionId = uuidv4();
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
        sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const io = req.app.get("io");
    if (user.currentSessionId) {
      io.to(user.currentSessionId).emit("FORCE_LOGOUT");
    }

    user.token = token;
    user.currentSessionId = sessionId;
    await user.save();

    user = user.toObject();
    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "Giriş başarılı.",
        user,
        token,
      });
  } catch (error) {
    console.error("Giriş işlemi sırasında hata:", error);
    return res.status(500).json({ success: false, message: "Sunucu hatası oluştu. Lütfen tekrar deneyin." });
  }
};

// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: 'Tüm alanların doldurulması zorunludur.',
      });
    }

    const userDetails = await User.findById(req.user.id);
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Mevcut şifreniz yanlış. Lütfen doğru şifreyi girin.",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: 'Yeni şifre ve şifre tekrarı uyuşmuyor.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );

    try {
      await mailSender(
        updatedUserDetails.email,
        'Şifreniz güncellendi',
        passwordUpdated(
          updatedUserDetails.email,
          `Merhaba ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}, şifreniz başarıyla güncellendi.`
        )
      );
    } catch (error) {
      console.error("E-posta gönderilirken hata oluştu:", error);
      return res.status(500).json({
        success: false,
        message: "Şifre güncellendi ancak e-posta gönderilemedi.",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi.',
    });
  } catch (error) {
    console.log('Şifre değiştirme sırasında hata:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre değiştirme sırasında bir hata oluştu.',
      error: error.message,
    });
  }
};

// ================ VERIFY SESSION ================
exports.verifySession = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Oturum geçerli.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Oturum doğrulama başarısız oldu.",
      error: error.message,
    });
  }
};
