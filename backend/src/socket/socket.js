import { Server } from 'socket.io';
import { app } from '../app.js';
import { createServer } from 'http';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});


io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);


  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


export { server, io };
