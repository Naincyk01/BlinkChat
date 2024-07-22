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
  console.log('New client connected:', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
  });

  // Handle incoming messages
  socket.on('sendMessage', (message) => {
      // Broadcast the message to all participants in the group
      io.to(message.groupId).emit('message', message);
  });

  // Join a group
  socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  // Leave a group
  socket.on('leaveGroup', (groupId) => {
      socket.leave(groupId);
      console.log(`Socket ${socket.id} left group ${groupId}`);
  });
});


export { server, io };
