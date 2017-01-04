
var socket = io();
$('form').submit(function () {
    socket.emit('toServer', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('fromServer', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
