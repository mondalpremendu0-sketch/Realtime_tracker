const { Server } = require("socket.io");

async function startSocketServer(httpServer) {
    const io = new Server(httpServer, {
        /* options */
    });

    io.on("connection", socket => {
        console.log("user connected: ", socket.id);

        socket.on("disconnect", () => {
            console.log("user disconnected",socket.id); // undefined
        });
        socket.on('send-location', (data) => {
            io.emit('receive-location', { id: socket.id, ...data });
        });
    });
}

module.exports = startSocketServer;
