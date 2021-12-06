const express = require('express');
const {createServer} = require('http');
const WebsocketServer = require('ws').Server;

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
                payload = {...message};
                payload.body = {
                    newLine: null,
                    heading: 'Connect-the-dots game. Click the node to start',
                    message: 'Player 1, make your choice'
                }
                break;
            case 'NODE_CLICKED':
                payload = {...message};
                payload.msg = 'VALID_START_NODE';
                payload.body = {
                    newLine: null,
                    heading: 'Player 1',
                    message: 'Select a second node to complete the line.'
                };
                break;
            case 'UPDATE_TEXT' :
                payload = {
                    id: 0,
                    msg: 'UPDATE_TEXT',
                    body: {
                        newLine: null,
                        heading: 'Player 2',
                        message: 'Are you asleep?'
                    }
                };
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

server.listen(8081);
