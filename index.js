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
// kiem tra các client ket noi voi server
io.on('connection', function(socket) {
    console.log('Co nguoi ket noi' + socket.id);
    // kiem tra tung client ngắt kết nối với server
    socket.on('disconnect', function() {
        console.log(socket.id + ' da ngat ket noi');
    });
    socket.on('Client-A', function(data) {
        console.log(data);
    });
});

app.get('/', function(req, res) {
    res.render('trangchu');
});