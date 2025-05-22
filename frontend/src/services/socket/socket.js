import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // örnek: http://localhost:5000

export default socket;
