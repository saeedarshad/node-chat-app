const express = require('express');
var app = express();
const {Users} = require('./users');
const {generateMessage, generateLocationMessage}= require('./message');
const {isString} = require('./validation');
const path = require('path');
const http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

var users = new Users();

io.on('connection', (socket) => {
    console.log('New user connects');

    socket.on('join',(params,callback) => {
        if (!isString(params.name) || !isString(params.room)) {
            return callback('Name and room name are required.');
          }
        
          socket.join(params.room);
          users.removeUser(socket.id);
          users.addUser(socket.id,params.name,params.room);

          io.to(params.room).emit('users',users.getUserList(params.room));

          socket.emit('newMessage',generateMessage('Admin',`welocome to the ${params.room} chat room`));
          socket.broadcast.to(params.room).emit('newMessage',
                generateMessage('Admin',`${params.name} has joined the ${params.room} chat room`)); 

          callback();
    });
    socket.on('createMessage', (message , callback) => {
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }
        callback('received');
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
            io.emit('newLocationMessage',
                generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        io.to(user.room).emit('users',users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the chat room`));
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`listening on port ${port}`));