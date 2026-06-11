const { Server } = require("socket.io");

async function startSocketServer(httpServer) {
    const io = new Server(httpServer, {
        /* options */
    });

    io.on("connection", socket => {
        console.log("user connected: ", socket.id);
    });
}


module.exports = startSocketServer;