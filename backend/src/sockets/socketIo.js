const { Server } = require("socket.io");

function startSocketServer(httpServer) {
    const io = new Server(httpServer, {
        /* options */
    });

    io.on("connection", socket => {
        console.log("User connected: ", socket.id);

        // 1. Receive movement and broadcast to everyone
        socket.on('send-location', (data) => {
            io.emit('receive-location', { id: socket.id, ...data });
        });

        // 2. Handle disconnection
        socket.on("disconnect", (reason) => {
            console.log(`User disconnected: ${socket.id}. Reason: ${reason}`); 
            
            // YOU NEED THIS LINE: Tell all frontends to delete this user's marker
            io.emit('user-disconnected', socket.id); 
        });
    });
}

module.exports = startSocketServer;