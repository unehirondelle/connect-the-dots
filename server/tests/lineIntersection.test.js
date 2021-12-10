const methods = require('../pointBelongsToSection');

const isSameDot = (a, b) => {
    return a.x === b.x && a.y === b.y;
};
const exSec = [
    {start: {x: 0, y: 0}, end: {x: 0, y: 3}},
    {start: {x: 0, y: 3}, end: {x: 2, y: 1}},
    {start: {x: 2, y: 1}, end: {x: 1, y: 0}}
];

describe('lineWillIntersect', () => {
    it('returns false if no intersection', () => {
        expect(methods.lineWillIntersect(exSec, {start: {x: 1, y: 0}, end: {x: 3, y: 0}})).toStrictEqual(false);
    });
    it('returns true if intersection', () => {
        expect(methods.lineWillIntersect(exSec, {start: {x: 1, y: 0}, end: {x: 1, y: 3}})).toStrictEqual(true);
    });
    it('returns false if no intersection, starting from other end', () => {
        expect(methods.lineWillIntersect(exSec, {start: {x: 0, y: 0}, end: {x: 1, y: 1}})).toStrictEqual(false);
    });
});
