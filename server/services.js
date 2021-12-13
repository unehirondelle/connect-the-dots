const {lineGoesThroughDots, isSameDot, lineWillIntersect, checkGameOver, pointIsOnSection} = require('./helpers');

let state = {
    player: 1,
    click: 1,
    thisMoveStartDot: {x: null, y: null},
    thisMoveEndDot: {x: null, y: null},
    line: {start: {x: null, y: null}, end: {x: null, y: null}},
    sections: []
};

module.exports = {
    initialize: () => {
        state = {
            player: 1,
            click: 1,
            thisMoveStartDot: {x: null, y: null},
            thisMoveEndDot: {x: null, y: null},
            line: {start: {x: null, y: null}, end: {x: null, y: null}},
            sections: []
        };
    },
    nodeClick: ({id, body: dotFromUi}) => {
        let payload;

        const error = (cause) => {
            return {
                msg: 'INVALID_END_NODE', body: {
                    newLine: null,
                    heading: `Player ${state.player}`,
                    message: `Invalid move! ${cause}`
                }
            };
        };

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

            if (state.line.start.x === null) {
                console.log('very first dot on the field');
                state.thisMoveStartDot = dotFromUi;
                state.line.start = dotFromUi;
                state.click = 2;
            } else if (isSameDot(state.line.start, dotFromUi)) {
                console.log('start of line');
                const oldStart = state.line.start;
                const oldEnd = state.line.end;
                state.line.end = oldStart;
                state.line.start = oldEnd;
                state.thisMoveStartDot = dotFromUi;
                state.click = 2;
            } else if (isSameDot(state.line.end, dotFromUi)) {
                console.log('end of line');
                state.thisMoveStartDot = dotFromUi;
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
            if (!lineGoesThroughDots(state.thisMoveStartDot, dotFromUi)) {
                payload = error('Line should go through the dots.');
            } else if (isSameDot(dotFromUi, state.line.start) || isSameDot(dotFromUi, state.line.end)) {
                payload = error('Line should not close');
            } else if (lineWillIntersect(state.sections, {start: state.thisMoveStartDot, end: dotFromUi})) {
                payload = error('Line should not intersect.');
            } else if (pointIsOnSection(state.sections, dotFromUi)) {
                payload = error('New should not belong to existing sections.');
            } else {
                state.thisMoveEndDot = dotFromUi;
                state.line.end = dotFromUi;
                state.player = state.player === 1 ? 2 : 1;
                state.sections.push({start: state.thisMoveStartDot, end: state.thisMoveEndDot});
                // if (checkGameOver(state.sections, state.line.start, state.line.end, state)) {
                //     payload = {
                //         msg: 'GAME_OVER',
                //         body: {
                //             newLine: {start: state.thisMoveStartDot, end: state.thisMoveEndDot},
                //             heading: 'Game Over',
                //             message: `Player ${state.player} Wins!`
                //         }
                //     };
                // } else {
                payload = {
                    msg: 'VALID_END_NODE',
                    body: {
                        newLine: {start: state.thisMoveStartDot, end: state.thisMoveEndDot},
                        heading: `Player ${state.player}`,
                        message: `Player ${state.player}, make your choice`
                    }
                };
                // }
            }
            // No matter if a user picker eligible second dot -0 they need to start from the first dot
            if (payload.msg !== 'GAME_OVER') {
                state.click = 1;
                state.thisMoveStartDot = {x: null, y: null};
                state.thisMoveEndDot = {x: null, y: null};
            }
            console.log('LINE START', state.line.start, 'LINE END', state.line.end);
        }

        payload['id'] = id;
        return payload;
    }
};
