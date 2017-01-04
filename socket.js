var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userCount = 0;
var userMap = {};

app.use('/', express.static('public'));

io.on('connection', function (socket) {
    var sId = socket.id;
    console.log('Socket #' + socket.id);
    userCount++;
    userMap[sId] = userCount;

    socket.on('getUserName', function () {
        console.log('Message from user #' + socket.id);
        io.emit('takeUserName', socket.id);
    });

    socket.on('toServer', function (msg) {
        console.log('Message from user #' + socket.id);
        io.emit('fromServer', msg);
    });

    socket.on('disconnect', function () {
        userCount--;
        console.log('User disconnected. Total users :: ' + userCount);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});