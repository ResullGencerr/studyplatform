const jwt = require("jsonwebtoken");

function generateJitsiJWT(user, roomName, isModerator = false) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const displayName = fullName || user.email || "Kullanıcı";

  const payload = {
    aud: "jitsi",
    iss: "studyplatform",
    sub: "resulgencer.infy.uk",
    room: roomName,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    context: {
      user: {
        name: displayName,
        email: user.email,
        id: user._id,
        moderator: isModerator,
      },
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

module.exports = generateJitsiJWT;
