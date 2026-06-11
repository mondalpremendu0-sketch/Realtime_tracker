const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. THE STATIC FIX: Serve the public folder directly next to this file
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// 2. SOCKET.IO LOGIC: All in one place
io.on("connection", socket => {
    console.log("User connected: ", socket.id);

    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

// 3. START THE SERVER
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    //console.log(`Serving static files from: ${publicPath}`);
});