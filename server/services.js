let state = {
    player: 1,
    click: 1,
    thisMoveStartDot: {x: null, y: null},
    thisMoveEndDot: {x: null, y: null},
    line: {start: {x: null, y: null}, end: {x: null, y: null}},
    lines: []
};

module.exports = {
    initialize: () => {
        state = {
            player: 1,
            click: 1,
            thisMoveStartDot: {x: null, y: null},
            thisMoveEndDot: {x: null, y: null},
            line: {start: {x: null, y: null}, end: {x: null, y: null}},
            lines: []
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

        const lineGoesThroughDots = (a, b) => {
            return Math.abs(a.x - b.x) === Math.abs(a.y - b.y) ||
                (a.x === b.x && a.y !== b.y) ||
                (a.x !== b.x && a.y === b.y);
        };

        const isSameDot = (a, b) => {
            return a.x === b.x && a.y === b.y;
        };

        const lineWillIntersect = (lines, startNode, endNode) => {
            for (let i = 0; i < lines.length; i++) {
                const x1 = lines[i].start.x;
                const y1 = lines[i].start.y;
                const x2 = lines[i].end.x;
                const y2 = lines[i].end.y;

                const x3 = startNode.x;
                const y3 = startNode.y;
                const x4 = endNode.x;
                const y4 = endNode.y;

                // Check if none of the lines are of length 0
                if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
                    return false;
                }

                const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

                // Lines are parallel
                if (denominator === 0) {
                    return false
                }

                let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
                let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

                // Return a object with the x and y coordinates of the intersection
                let x = x1 + ua * (x2 - x1);
                let y = y1 + ua * (y2 - y1);

                return {x, y};
            }
        };

        console.log(`state: ${JSON.stringify(state)}`);
        console.log(`body: ${JSON.stringify(dotFromUi)}`);

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
                console.log('very first dot on the field')
                state.thisMoveStartDot = dotFromUi;
                state.line.start = dotFromUi;
                state.click = 2;
            } else if (isSameDot(state.line.start, dotFromUi) || isSameDot(state.line.end, dotFromUi)) {
                console.log('either end of line')
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
            const intersection = lineWillIntersect(state.lines, state.thisMoveStartDot, dotFromUi);

            if (!lineGoesThroughDots(state.thisMoveStartDot, dotFromUi)) {
                payload = error('Line should go through the dots.');
            } else if (isSameDot(dotFromUi, state.line.start) || isSameDot(dotFromUi, state.line.end)) {
                payload = error('Line should not close');
            } else if (!!intersection && !isSameDot(intersection, state.thisMoveStartDot)) {
                payload = error('Line should not intersect.');
            } else {
                state.thisMoveEndDot = dotFromUi;
                state.line.end = dotFromUi; //{"x": 2,"y": 2}
                state.click = 1;
                state.player = state.player === 1 ? 2 : 1;
                state.lines.push({start: state.thisMoveStartDot, end: state.thisMoveEndDot});
                payload = {
                    msg: 'VALID_END_NODE', body: {
                        newLine: {
                            start: state.thisMoveStartDot, end: state.thisMoveEndDot
                        }, heading: `Player ${state.player}`, message: `Player ${state.player}, make your choice`
                    }
                };
                state.thisMoveStartDot = {x: null, y: null};
                state.thisMoveEndDot = {x: null, y: null};
            }
        }
        payload['id'] = id;
        return payload;
    }
};
