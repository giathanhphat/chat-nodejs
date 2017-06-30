//io.sockets.emit => gui tat ca (ke ca nguoi gui cung duoc nhan lai)
//socket.emit => gui den chinh no
//socket.broadcast.emit => gui den cac client khac (ngoai tru nguoi da gui)
var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(4000);
var UserArray = [];
var RoomArray = [];

function User(username, socketid) {
    this.name = username;
    this.id = socketid;
}

function Room(roomname, socketidArray) {
    this.name = roomname;
    this.socketidArray = socketidArray;
}
// kiem tra các client ket noi voi server
io.on('connection', function(socket) {
    var socketidArray = new Array;
    console.log('Co nguoi ket noi' + socket.id);
    // kiem tra tung client ngắt kết nối với server
    socket.on('disconnect', function() {
        console.log(socket.id + ' da ngat ket noi');
    });
    socket.on('client-send-name', function(data) {
        var exist_username = false;
        for (var i = 0; i < UserArray.length; i++) {
            if (UserArray[i].name == data) {
                socket.emit('server-send-failure');
                exist_username = true;
                break;
            }
        }
        if (exist_username == false) {
            socket.name = data;
            var user = new User(data, socket.id);
            UserArray.push(user);
            socket.emit('server-send-success', data);
            io.sockets.emit('server-send-usersList', UserArray);
        }
        // if (UserArray.indexOf(data) >= 0) {
        //     socket.emit('server-send-failure');
        // } else {

        //     // UserArray.push(data);
        //     // IdArray.push(socket.id);
        //     user = new User(data, socket.id);
        //     UserArray.push(user);
        //     // console.log(UserArray);
        //     // socket.username = data;
        //     socket.emit('server-send-success', data);
        //     io.sockets.emit('server-send-usersList', UserArray);
        // }
    });
    //co user logout
    socket.on('logout', function() {
        var user;
        UserArray.forEach(function(element) {
            if (element.name == socket.name) {
                user = element;
                return;
            }
        });

        UserArray.splice(UserArray.indexOf(user), 1);
        socket.broadcast.emit('server-send-usersList', UserArray);
    });

    socket.on('user-send-message', function(data) {
        io.sockets.emit('server-send-message', { un: socket.name, nd: data });
    });
    //server-send-connect-chat 11-success
    socket.on('user-connect-chat11-success', function(data) {
        var username = '';
        UserArray.forEach(function(element) {
            if (element.id == data) {
                username = element.name;
            }
        });
        socket.emit('server-send-chat11-success', username);
    });
    //gửi message chat 11 form server
    socket.on('user-send-message-chat11', function(data) {
        var id;
        UserArray.forEach(function(element) {
            if (element.name == data.toun) {
                id = element.id;
                return;
            }
        });

        if (data.toun == socket.name) {
            socket.emit('server-send-message-chat11-success', { un: socket.name, nd: data.content, nhan: 1 });
        } else {
            socket.emit('server-send-message-chat11-success', { un: socket.name, nd: data.content, nhan: 1 });
            io.to(id).emit('server-send-message-chat11-success', { un: socket.name, nd: data.content, nhan: 2 });
        }

    });

    //server send room khi user yêu cầu
    socket.on('user-require-get-rooms', function() {
        socket.emit('server-send-room', RoomArray);
    });

    //nhận create-room và gửi success
    socket.on('user-send-create-room', function(data) {
        var exist_roomname = false;
        if (RoomArray.length > 0) {
            for (var i = 0; i < RoomArray.length; i++) {
                if (RoomArray[i].name == data) {
                    exist_roomname = true;
                    break;
                }
            }
        } else {
            exist_roomname = false;
        }
        if (exist_roomname == true) {
            socket.emit('server-send-create-room-error');
        } else {
            socketidArray.push(socket.id)
            var room_name = new Room(data, socketidArray);
            RoomArray.push(room_name);
            socket.join(data);
            console.log(data);
            // console.log(RoomArray);
            socket.emit('server-send-create-room-success', data);
            io.sockets.emit('server-send-room', RoomArray);
        }

    });

    //server nhận message room và gửi lại
    socket.on('user-send-message-nhom', function(data) {
        io.sockets.in(data.toroom).emit('server-send-message-in-room', { un: socket.name, nd: data.content });
    });
});

app.get('/', function(req, res) {
    res.render('trangchu');
});