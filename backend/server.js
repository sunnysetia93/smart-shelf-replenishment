const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

var zmq = require('zmq')
var py_socket_mod1 = zmq.socket('sub')
var py_socket_mod2 = zmq.socket('sub')

py_socket_mod1.subscribe('');
py_socket_mod1.connect('tcp://localhost:9000')

py_socket_mod2.subscribe('');
py_socket_mod2.connect('tcp://localhost:9001')

const server = app.listen(8000,()=>{
    console.log('app running on port 8000');
})

const io = require('socket.io')(server);

io.on('connection',(client)=>{
    console.log('Client connected');

    py_socket_mod1.on('message', function(message){
        client.emit('cam1',message.toString())
      });
    py_socket_mod2.on('message', function(message){
    client.emit('cam2',message.toString())
    });
})

app.use('/api',require('./api'));
