const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app.js");
const startSocketServer = require("./src/sockets/socketIo.js");

const httpServer = createServer(app);

startSocketServer(httpServer);

httpServer.listen(3000, () => {
    console.log("Server is running in port 3000");
});
