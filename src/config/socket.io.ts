import { io } from "socket.io-client";
import envConfig from "./envConfig";


const socketIO = io(envConfig.websocketURL, {
  autoConnect: false,
  withCredentials: true, 
});

socketIO.on("connect", () => {
  console.log("✅ Socket connected:", socketIO.id);
});

socketIO.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socketIO.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

export default socketIO;