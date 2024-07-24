const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const PORT = 9000;

// Setup CORS
app.use(cors());

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Update this if your client is hosted elsewhere
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});


app.get((req,res)=>{

  res.send('Server is up and running!');
})

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('user-message', (message) => {
    console.log('Message received:', message);
    socket.broadcast.emit('message', message);
  });

  socket.on('user-image', (image) => {
    console.log('Image received');
    socket.broadcast.emit('image', image);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});