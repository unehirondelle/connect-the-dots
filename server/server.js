const express = require('express');
const {createServer} = require('http');
const WebsocketServer = require('ws').Server;

const app = express();
const server = createServer(app);
const wsServer = new WebsocketServer({server});

wsServer.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(`'received: ${data}`);
    });

    ws.send('something');
});

server.listen(8081);
