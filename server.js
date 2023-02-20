const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const usernames = {};
const rooms = [
    { name: 'globalChat', creator: 'anonymous' },
    { name: 'chess', creator: 'anonymous' },
    { name: 'javascript', creator: 'anonymous' },
];

io.on('connection', function (socket) {
    socket.on('createUser', function (username) {
        socket.usernames = username;
        usernames[username] = username;
        socket.currentRoom = 'globalChat';

        socket.join('globalChat');
        socket.emit('updateChat', 'INFO', 'You have joined global chat');
    });
});

server.listen(5000, function () {
    console.log('Server running at Port 5000');
});
