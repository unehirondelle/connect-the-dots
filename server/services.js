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

        const lineGoesThroughDots = (a, b) => {
            return Math.abs(a.x - b.x) === Math.abs(a.y - b.y) ||
                (a.x === b.x && a.y !== b.y) ||
                (a.x !== b.x && a.y === b.y);
        };

        const isSameDot = (a, b) => {
            return a.x === b.x && a.y === b.y;
        };

        const lineWillIntersect = (sections, startNode, endNode) => {
            // Run through all the sections to determine if there is any intersection with line-to-be
            // line intercept math by Paul Bourke is used (http://paulbourke.net/geometry/pointlineplane/)
            return sections.map(line => {
                const x1 = line.start.x;
                const y1 = line.start.y;
                const x2 = line.end.x;
                const y2 = line.end.y;

                const x3 = startNode.x;
                const y3 = startNode.y;
                const x4 = endNode.x;
                const y4 = endNode.y;

                const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

                const slopeA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
                const slopeB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3));

                // Sections overlapping
                if (slopeA === slopeB) {
                    return ((x1 - x3) * (y1 - y4) - (x1 - x4) * (y1 - y3) === 0 || (x2 - x3) * (y2 - y4) - (x2 - x4) * (y2 - y3) === 0);
                }

                // Sections are parallel
                if (denominator === 0 && slopeA !== slopeB) {
                    return false;
                }

                const ua = slopeA / denominator;
                const ub = slopeB / denominator;

                // is the intersection along the segments
                if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
                    return false;
                }

                // Return an object with the x and y coordinates of the intersection
                const x = x1 + ua * (x2 - x1);
                const y = y1 + ua * (y2 - y1);

                // Check if intersection coordinates match with thisMoveStartDot
                if (!isSameDot({x, y}, state.thisMoveStartDot)) {
                    return {x, y};
                } else {
                    return false;
                }
            });
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
            const intersection = lineWillIntersect(state.sections, state.thisMoveStartDot, dotFromUi);
            const doubleDots = intersection.map(dot => isSameDot(dot, state.thisMoveStartDot));
            doubleDots.pop(); // remove first/last line & thisMoveStartDot intersection

            if (!lineGoesThroughDots(state.thisMoveStartDot, dotFromUi)) {
                payload = error('Line should go through the dots.');
            } else if (isSameDot(dotFromUi, state.line.start) || isSameDot(dotFromUi, state.line.end)) {
                payload = error('Line should not close');
            } else if (intersection.length && !!intersection.find(el => !!el)) {
                payload = error('Line should not intersect.');
            } else {
                state.thisMoveEndDot = dotFromUi;
                state.line.end = dotFromUi;
                state.click = 1;
                state.player = state.player === 1 ? 2 : 1;
                state.sections.push({start: state.thisMoveStartDot, end: state.thisMoveEndDot});
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
