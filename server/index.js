import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connect", socket => {
    console.log("Client connected");

    // evento que escucha lo que llega del lado del cliente
    socket.on("message", (data) => {
        // socket.broadcast hace que se envie el mensaje recibido al cliente,
        // se va a enviar a todos los clientes menos al que envio el mensaje
        socket.broadcast.emit("message", {
            body: data,
            from: socket.id.slice(0, 6)
        });
    })
})

server.listen(3001)
console.log("server on port", 3001)