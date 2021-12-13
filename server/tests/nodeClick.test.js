const {initialize, nodeClick, state} = require('../services');

describe('nodeClick', () => {
    describe('the very first dot on the field', () => {
        it('assigns clicked value to state.line.start and thisMoveStartDot, state.click = 2', () => {
            nodeClick({id: 1, body: {x: 0, y: 0}});
            expect(state).toMatchObject({
                player: 1,
                click: 2,
                thisMoveStartDot: {x: 0, y: 0},
                thisMoveEndDot: {x: null, y: null},
                line: {start: {x: 0, y: 0}, end: {x: null, y: null}},
                sections: []
            });
        });
        it('returns VALID_START_NODE message node when the very first dot on the field', () => {
            initialize();
            expect(nodeClick({id: 1, body: {x: 0, y: 0}})).toMatchObject({
                id: 1,
                msg: 'VALID_START_NODE',
                body: {
                    newLine: null,
                    heading: `Player ${state.player}`,
                    message: 'Select a second node to complete the line'
                }
            });
        });
    });
    describe('some sections already exist on the field', () => {
        it('returns VALID_START_NODE message node when clicked dot equals lines start', () => {
            nodeClick({id: 1, body: {x: 0, y: 0}});
            nodeClick({id: 2, body: {x: 1, y: 1}});
            expect(nodeClick({id: 3, body: {x: 0, y: 0}})).toMatchObject({
                id: 3,
                msg: 'VALID_START_NODE',
                body: {
                    newLine: null,
                    heading: `Player ${state.player}`,
                    message: 'Select a second node to complete the line'
                }
            });
        });
    });
});
