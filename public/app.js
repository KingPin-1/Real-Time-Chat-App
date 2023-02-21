var socket = io();

var userList = document.getElementById('active_users_list');
var roomList = document.getElementById('active_rooms_list');
var message = document.getElementById('messageInput');
var sendMessageBtn = document.getElementById('send_message_btn');
var roomInput = document.getElementById('roomInput');
var createRoomBtn = document.getElementById('room_add_icon_holder');
var chatDisplay = document.getElementById('chat');

var currentRoom = 'globalChat';
var myUsername = '';

socket.on('connect', function () {
    myUsername = prompt('Enter name');
    socket.emit('createUser', myUsername);
});

sendMessageBtn.addEventListener('click', function () {
    socket.emit('sendMessage', message.value);
    message.value = '';
});

message.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendMessageBtn.click();
    }
});

createRoomBtn.addEventListener('click', function () {
    let roomName = roomInput.value.trim();
    if (roomName !== '') {
        socket.emit('createRoom', roomName);
        roomInput.value = '';
    }
});

socket.on('updateChat', function (username, data) {
    if (username === 'INFO') {
        chatDisplay.innerHTML += `<div class = 'announcement'><span>${data}</span></div>`;
    } else {
        chatDisplay.innerHTML += `<div class = 'message_holder ${
            username === myUsername ? 'me' : ''
        }'>
            <div class = 'pic'></div>
            <div class = 'message_box'>
                <div id = 'message' class = 'message'>
                    <span class = 'message_name'>${username}</span>
                    <span class = 'message_text'>${data}</span>
                </div>
            </div>
        </div>`;
    }
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

socket.on('updateUsers', (names) => {
    userList.innerHTML = '';
    console.log(names);
    for (let user in names) {
        if (user === null) {
            continue;
        }
        userList.innerHTML += `<div class = 'user_card'>
            <div class = 'pic'>
                <span>${user}</span>
            </div>
        </div>`;
    }
});

socket.on('getAllRooms', function (rooms, newRoom) {
    roomList.innerHTML = '';
    console.log(rooms);
    for (var index in rooms) {
        roomList.innerHTML += `<div class="room_card" id="${rooms[index].name}"
        onclick="changeRoom('${rooms[index].name}')">
        <div class="room_item_content">
            <div class="pic"></div>
            <div class="roomInfo">
            <span class="room_name">#${rooms[index].name}</span>
            <span class="room_author">${rooms[index].creator}</span>
            </div>
        </div>
    </div>`;
    }
    document.getElementById(currentRoom).classList.add('active_item');
});

function changeRoom(room) {
    if (room !== currentRoom) {
        socket.emit('updateRooms', room);
        document.getElementById(currentRoom).classList.remove('active_item');
        currentRoom = room;
        document.getElementById(currentRoom).classList.add('active_item');
    }
}
