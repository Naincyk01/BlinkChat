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

const activeUsers = {}; // Store active users and their statuses.Initializes an empty object to keep track of active users and their statuses. Each entry will have a socket ID as the key and an object with room and status as properties.

io.on('connection', socket => {
  // Notify all users in the room about a new user's status
  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    activeUsers[socket.id] = { room, status: 'online' };

    // Emit current statuses to the new user
    const statuses = Object.entries(activeUsers)
      .filter(([id, user]) => user.room === room && id !== socket.id)
      .map(([id, user]) => ({ socketId: id, status: user.status }));
    socket.emit('currentStatuses', statuses);

    // Notify other users in the room about the new user
    socket.to(room).emit('statusUpdate', { socketId: socket.id, status: 'online' });
  });

  socket.on('message', message => {
    const { room } = activeUsers[socket.id] || {};
    if (room) {
      socket.to(room).emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    const { room } = activeUsers[socket.id] || {};
    if (room) {
      delete activeUsers[socket.id];
      // Notify all users in the room that the user has disconnected
      socket.to(room).emit('statusUpdate', { socketId: socket.id, status: 'offline' });
    }
  });

  socket.on('error', error => {
    console.error(`Socket error: ${error.message}`);
  });
});

export { server, io };
