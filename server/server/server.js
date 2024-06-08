import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
  });

  app.use(cors());
  
  let userConnections = [];

  io.on('connection', (socket) => {
      console.log('a user connected', socket.id);
  
      socket.on('newUser', (socketid) => {
          userConnections.push(socketid);
          console.log('new user connected', socketid);
          socket.broadcast.emit('newUserConnected', socketid);
      });
  
      socket.on('disconnect', () => {
          console.log('user disconnected', socket.id);
          userConnections = userConnections.filter(id => id !== socket.id);
          socket.broadcast.emit('user disconnected', socket.id);
      });
  
      socket.on('room', (room, msg, socketid) => {
          io.to(room).emit('message', msg, socketid);
      });
  
      socket.on('join', (room) => {
          socket.join(room);
          io.to(room).emit('join', room, socket.id);
      });
  
      socket.on('leave', (room) => {
          console.log('leave room: ' + room);
          socket.leave(room);
          io.to(room).emit('leave', room);
      });
  });
  
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
