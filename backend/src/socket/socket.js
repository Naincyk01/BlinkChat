import { Server } from "socket.io";
import { app } from "../app.js";
import { createServer } from "node:http"

const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    }
  });
    io.on('connection', socket => {
    console.log('connected', socket.id);

    });

export { server, io }