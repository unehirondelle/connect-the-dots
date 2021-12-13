const express = require('express');
const {createServer} = require('http');
const WebsocketServer = require('ws').Server;
const {initialize, nodeClick} = require('./services');

const app = express();
const server = createServer(app);
const wsServer = new WebsocketServer({server});

wsServer.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(`request: ${data}`);
        const message = JSON.parse(data);
        let payload;
        switch (message.msg) {
            case 'INITIALIZE':
                initialize();
                payload = {...message};
                payload.body = {
                    newLine: null,
                    heading: 'Connect-the-dots game. Click the node to start',
                    message: 'Player 1, make your choice'
                }
                break;
            case 'NODE_CLICKED':
                payload = nodeClick({...message});
                break;
            case 'ERROR':
                console.error(`ERROR: ${message.body}`);
                break;
            default:
                break;
        }
        console.log(`response: ${JSON.stringify(payload)}`);
        ws.send(JSON.stringify(payload));
    });


});

const PORT = process.env.PORT || 8081;
server.listen(PORT);
