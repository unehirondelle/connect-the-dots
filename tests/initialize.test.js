const {initialize, state} = require('../services');

describe('initialize', () => {
    it('updates the state to its initial value', () => {
        initialize();
        expect(state).toMatchObject({
            player: 1,
            click: 1,
            thisMoveStartDot: {x: null, y: null},
            thisMoveEndDot: {x: null, y: null},
            line: {start: {x: null, y: null}, end: {x: null, y: null}},
            sections: []
        });
    });
});
