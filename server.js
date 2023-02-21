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
    console.log('New User connected...');
    socket.on('createUser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.currentRoom = 'globalChat';
        socket.join('globalChat');
        socket.emit('updateChat', 'INFO', 'You have joined global chat');
        io.sockets.emit('updateUsers', usernames);
        socket.emit('getAllRooms', rooms, 'globalChat');
    });
    socket.on('sendMessage', function (data) {
        io.sockets
            .to(socket.currentRoom)
            .emit('updateChat', socket.username, data);
    });
    socket.on('updateRooms', function (room) {
        socket.broadcast
            .to(socket.currentRoom)
            .emit('updateChat', 'INFO', socket.username + ' left the room ');
        socket.leave(socket.currentRoom);
        socket.currentRoom = room;
        socket.join(room);
        socket.emit('updateChat', 'INFO', 'You have joined ' + room);
        socket.broadcast
            .to(socket.currentRoom)
            .emit(
                'updateChat',
                'INFO',
                socket.username + ' has joined the room '
            );
    });
    socket.on('createRoom', (newRoom) => {
        if (newRoom !== null) {
            rooms.push({
                name: newRoom,
                creator: socket.username,
            });
            io.sockets.emit('getAllRooms', rooms, null);
        }
    });
    socket.on('disconnect', function () {
        console.log(`User ${socket.username} disconnected from the server`);
        delete usernames[socket.username];
        io.sockets
            .to(socket.currentRoom)
            .emit('updateChat', 'INFO', socket.username + ' left the room');
    });
});

server.listen(5000, function () {
    console.log('Server running at Port 5000');
});
