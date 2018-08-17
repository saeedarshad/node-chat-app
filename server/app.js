const express = require('express');
var app = express();
const {generateMessage, generateLocationMessage}= require('./message');
const path = require('path');
const http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user connects');

    socket.emit('newMessage',generateMessage('Admin','welocome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','User has joined the chat room')); 

    socket.on('createMessage', (message , callback) => {
        console.log('create Message', message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('received');
    });

    socket.on('createLocationMessage', (coords) => {
        console.log('Location', coords);
        io.emit('newLocationMessage',generateLocationMessage(coords.from,coords.latitude,coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('Disconnecetd from server');
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`listening on port ${port}`));