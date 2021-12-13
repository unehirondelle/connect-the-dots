const {pointIsOnSection} = require('../helpers');

const existingSections = [{start:{x: 0, y: 0}, end:{x: 0, y: 4}}];

describe('pointIsOnSection', () => {
    it('returns true if same as start', () => {
        expect(pointIsOnSection(existingSections, {x: 0, y: 0})).toStrictEqual(true);
    });
    it('returns true if same as end', () => {
        expect(pointIsOnSection(existingSections, {x: 0, y: 4})).toStrictEqual(true);
    });
    it('returns true if between start and end', () => {
        expect(pointIsOnSection(existingSections, {x: 0, y: 2})).toStrictEqual(true);
    });
    it('returns false if not on section', () => {
        expect(pointIsOnSection(existingSections, {x: 1, y: 1})).toStrictEqual(false);
    });
    it('returns false if not on section but can be on the same line', () => {
        expect(pointIsOnSection(existingSections, {x: 0, y: 5})).toStrictEqual(false);
    });
});
