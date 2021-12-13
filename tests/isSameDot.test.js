const {isSameDot} = require('../helpers');

describe('isSameDot', () => {
    it('returns true if all coordinates are the same', () => {
        expect(isSameDot({x: 3, y: 3}, {x: 3, y: 3})).toStrictEqual(true);
    });
    it('returns false if dots are different by x', () => {
        expect(isSameDot({x: 3, y: 3}, {x: 0, y: 3})).toStrictEqual(false);
    });
    it('returns false if dots are different by y', () => {
        expect(isSameDot({x: 0, y: 1}, {x: 0, y: 2})).toStrictEqual(false);
    });
});
