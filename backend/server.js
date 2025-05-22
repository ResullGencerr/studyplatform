const express = require("express");
const app = express();
const http = require("http"); // HTTP server oluşturmak için
const { setupSocket } = require("./server/socket/index"); // Socket setup
require("dotenv").config();

// packages
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// connection to DB and cloudinary
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// DB ve Cloud bağlantılarını başlat
connectDB();
cloudinaryConnect();

// route mount
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// default route
app.get("/", (req, res) => {
  res.send(`<div>
    This is Default Route
    <p>Everything is OK</p>
    </div>`);
});

// HTTP server ve Socket başlat
const server = http.createServer(app); // <- BU önemli
const io = setupSocket(server); // ✅ io burada geliyor!// <- SOCKET buraya bağlanıyor
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
