const jwt = require("jsonwebtoken");

const APP_ID = process.env.JITSI_APP_ID;
const APP_SECRET = process.env.JITSI_APP_SECRET;
const DOMAIN = process.env.JITSI_DOMAIN;

exports.createRoom = async (roomName) => {
  // Jitsi'de oda otomatik oluşur, sadece isim döneriz
  return { id: roomName };
};

exports.generateToken = async (roomId, userId, role) => {
  const isModerator = role === "Instructor";

  const payload = {
    aud: APP_ID,
    iss: APP_ID,
    sub: DOMAIN,
    room: roomId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 saat geçerli

    context: {
      user: {
        id: userId,
        name: isModerator ? "Öğretmen" : "Öğrenci",
        moderator: isModerator // 🔑 Sadece öğretmen true
      }
    },

    moderator: isModerator // 🔑 Jitsi bazen bu alanı da kullanır
  };

  const token = jwt.sign(payload, APP_SECRET);

  //console.log(`🎫 Token oluşturuldu: ${isModerator ? "🧑‍🏫 Eğitmen" : "👨‍🎓 Öğrenci"}`);
  return token;
};

exports.deleteRoom = async (roomId) => {
  return true; // Jitsi otomatik siler
};
