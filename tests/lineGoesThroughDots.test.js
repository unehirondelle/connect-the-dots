const {lineGoesThroughDots} = require('../helpers');

describe('lineGoesThroughDots', () => {
    it('returns true if 45deg line', () => {
        expect(lineGoesThroughDots({x: 3, y: 3}, {x: 0, y: 0})).toStrictEqual(true);
    });
    it('returns true if horizontal line', () => {
        expect(lineGoesThroughDots({x: 3, y: 3}, {x: 0, y: 3})).toStrictEqual(true);
    });
    it('returns true if vertical line', () => {
        expect(lineGoesThroughDots({x: 0, y: 1}, {x: 0, y: 2})).toStrictEqual(true);
    });
    it('returns false if line doesnt go through dots', () => {
        expect(lineGoesThroughDots({x: 3, y: 2}, {x: 1, y: 1})).toStrictEqual(false);
    });
});
