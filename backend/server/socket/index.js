const { Server } = require("socket.io");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // güvenlik için bunu sonradan sınırla
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Bir kullanıcı bağlandı:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { user, socketId: socket.id });
    });

    socket.on("send-message", ({ roomId, message, user }) => {
      io.to(roomId).emit("receive-message", { user, message });
    });

    socket.on("leave-room", ({ roomId, user }) => {
      socket.to(roomId).emit("user-left", { user });
      socket.leave(roomId);
    });

    // 🎯 Öğretmenin signal verisini belirli öğrenciye gönder
    socket.on("stream-started", ({ signalData, targetSocketId }) => {
      console.log("🎥 Öğretmenden gelen sinyal iletiliyor:", targetSocketId);
      io.to(targetSocketId).emit("stream-started", {
        teacherSignal: signalData,
      });
    });

    socket.on("disconnect", () => {
      console.log("Bir kullanıcı ayrıldı:", socket.id);
    });
  });

  return io; // ✅ io'yu return et!
}

module.exports = { setupSocket };
