const {checkGameOver} = require('../helpers');

describe('checkGameOver', () => {
    it('returns true if no more eligible sections possible', () => {
        const existingSections = [
            {start: {x: 1, y: 1}, end: {x: 2, y: 2}},
            {start: {x: 2, y: 2}, end: {x: 3, y: 1}},
            {start: {x: 3, y: 1}, end: {x: 3, y: 0}},
            {start: {x: 3, y: 0}, end: {x: 0, y: 0}},
            {start: {x: 0, y: 0}, end: {x: 0, y: 1}},
            {start: {x: 0, y: 1}, end: {x: 2, y: 3}},
            {start: {x: 2, y: 3}, end: {x: 3, y: 3}},
            {start: {x: 3, y: 3}, end: {x: 3, y: 2}},
            {start: {x: 1, y: 1}, end: {x: 2, y: 1}}
        ];

        const lineStart = {x: 2, y: 1};
        const lineEnd = {x: 3, y: 2};
        expect(checkGameOver(existingSections, lineStart, lineEnd)).toStrictEqual(true);
    });
    it('returns false if eligible sections exist', () => {
        const existingSections = [
            {start: {x: 1, y: 1}, end: {x: 2, y: 2}},
            {start: {x: 2, y: 2}, end: {x: 3, y: 1}},
            {start: {x: 3, y: 1}, end: {x: 3, y: 0}},
            {start: {x: 3, y: 0}, end: {x: 0, y: 0}},
            {start: {x: 0, y: 0}, end: {x: 0, y: 1}},
            {start: {x: 0, y: 1}, end: {x: 2, y: 3}},
            {start: {x: 2, y: 3}, end: {x: 3, y: 3}},
            {start: {x: 3, y: 3}, end: {x: 3, y: 2}}
        ];

        const lineStart = {x: 1, y: 1};
        const lineEnd = {x: 2, y: 1};
        expect(checkGameOver(existingSections, lineStart, lineEnd)).toStrictEqual(false);
    });
});
