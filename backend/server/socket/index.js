const { Server } = require("socket.io");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // sonra frontend domain ile sınırla
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    
    socket.on("REGISTER_SESSION", ({ sessionId }) => {
      if (sessionId) {
        socket.join(sessionId); // odasına kat
       // console.log("📲 Kullanıcı oturuma katıldı:", sessionId);
      }
    });

    socket.on("disconnect", () => {
     // console.log("❌ Kullanıcı çıktı:", socket.id);
    });
  });

  return io;
}

module.exports = { setupSocket };