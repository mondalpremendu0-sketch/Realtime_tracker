const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

// client-side
socket.on("connect", () => {
    console.log("user connected: ", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id); // undefined
});
socket.on("msg",(data) => {
  console.log("data received: ",data);
})
