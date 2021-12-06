let state = {
    player: 1,
    click: 1,
    startNode: {x: null, y: null},
    endNode: {x: null, y: null},
    firstLine: {start: {x: null, y: null}, end: {x: null, y: null}},
    secondLine: {start: {x: null, y: null}, end: {x: null, y: null}},
};

module.exports = {
    initialize: () => {
        state = {
            player: 1,
            click: 1,
            startNode: {x: null, y: null},
            endNode: {x: null, y: null},
            firstLine: {start: {x: null, y: null}, end: {x: null, y: null}},
            secondLine: {start: {x: null, y: null}, end: {x: null, y: null}},
        };
    },
    nodeClick: ({id, body}) => {
        const {x, y} = body;
        let payload;

        if (state.click === 1) {
            //VALID_START_NODE or IN-VALID_START_NODE
            payload = {
                msg: 'VALID_START_NODE',
                body: {
                    newLine: null,
                    heading: `Player ${state.player}`,
                    message: 'Select a second node to complete the line'
                }
            };
            if (state.startNode.x === null) {
                state.startNode = body;
                state.click = 2;
            } else {
                payload = {
                    msg: 'INVALID_START_NODE', body: {
                        newLine: null, heading: `Player ${state.player}`, message: 'Not a valid starting position.'
                    }
                };
            }
        } else { // second click case since only two clocks are possible
            // VALID_END_NODE , INVALID_END_NODE
            payload = {
                msg: 'VALID_END_NODE', body: {
                    newLine: {
                        start: state.startNode, end: state.endNode
                    }, heading: `Player ${state.player}`, message: `Player ${state.player}, make your choice`
                }
            };

            if (state.endNode.x === null) {
                state.endNode = body;
                payload.body.newLine.end = state.endNode;
                state.click = 1;
                state.player = state.player === 1 ? 2 : 1;
            } else {
                payload = {
                    msg: 'INVALID_END_NODE', body: {
                        newLine: null,
                        heading: `Player ${state.player}`,
                        message: 'Invalid move! The line should be straight and not intersect with existing lines.'
                    }
                };
            }
        }
        payload['id'] = id;
        return payload;
    }
};
