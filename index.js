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
server.listen(3000);
var UserArray = [];

function User(username, id) {
    this.name = username;
    this.id = id;
}
// kiem tra các client ket noi voi server
io.on('connection', function(socket) {
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
            }
        });

        UserArray.splice(UserArray.indexOf(user), 1);
        socket.broadcast.emit('server-send-usersList', UserArray);
    });

    socket.on('user-send-message', function(data) {
        io.sockets.emit('server-send-message', { un: socket.name, nd: data });
    });
    //chat 11
    socket.on('user-connect-chat11-success', function(data){
        var username = '';
        UserArray.forEach(function(element){
            if(element.id == data)
            {
                username = element.name;
            }
        });
        socket.emit('server-send-chat11-success', username);
    });
    //gửi message chat 11 form server
    socket.on('user-send-message-chat11', function(data){
         var id;
        UserArray.forEach(function(element){
            if(element.name == data.toun)
            {
                id = element.id;
            }
        });
        io.to(id).emit('server-send-message-chat11-success', {un: socket.name, nd: data.content});
    });

});

app.get('/', function(req, res) {
    res.render('trangchu');
});