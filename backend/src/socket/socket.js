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

const activeUsers = {};

io.on('connection', socket => {
  console.log('User connected', socket.id);


   socket.on('joinRoom', (room) => {
    socket.join(room);
    activeUsers[socket.id] = room; 
    console.log(`User ${socket.id} joined room ${room}`);
  });


   socket.on('message', (message) => {
    const room = activeUsers[socket.id];
    if (room) {
      // Broadcast message to all clients in the same room
      socket.to(room).emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    const room = activeUsers[socket.id];
    delete activeUsers[socket.id];
    console.log(`User disconnected ${socket.id}`);
    if (room) {
      io.to(room).emit('userLeft', socket.id); 
    }
  });

  socket.on('error', error => {
    console.error(`Socket error: ${error.message}`);
  });
});


export { server, io };
