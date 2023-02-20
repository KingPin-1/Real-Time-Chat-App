var socket = io();

var userList = document.getElementById('active_users_list');
var roomList = document.getElementById('active_room_list');
var message = document.getElementById('messageInput');
var sendMessageBtn = document.getElementById('send_message_btm');
var roomInput = document.getElementById('roomInput');
var createRoomBtn = document.getElementById('room_add_icon_holder');
var chatDisplay = document.getElementById('chat');

var currentRoom = 'globalChat';
var myUsername = '';

socket.on('connect', function () {
    myUsername = prompt('Enter name');
    socket.emit('createUser', myUsername);
});

socket.on('updateChat', function (username, data) {
    if (username === 'INFO') {
        chatDisplay.innerHTML = `<div class = 'announcement'><span>${data}</span></div>`;
    }
});
