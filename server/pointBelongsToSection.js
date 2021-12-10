module.exports.pointBelongsToSection = (a, b, c) => {
    // return !!(c.y - a.y) * (b.x - a.x) === (b.y - a.y) * (c.x - a.x);

    return Math.abs(Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2)) +
        Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2)) - Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))) === 0;
};

// same as start
// console.log(pointBelongsToSection({x: 0, y: 0}, {x: 0, y: 4}, {x: 0, y: 0}) === true);
// // same as end
// console.log(pointBelongsToSection({x: 0, y: 0}, {x: 0, y: 4}, {x: 0, y: 4}) === true);
// // between start & end
// console.log(pointBelongsToSection({x: 0, y: 0}, {x: 0, y: 4}, {x: 0, y: 2}) === true);
// // not on a section
// console.log(pointBelongsToSection({x: 0, y: 0}, {x: 0, y: 4}, {x: 1, y: 1}) === false);
//
// console.log(pointBelongsToSection({x: 0, y: 0}, {x: 0, y: 4}, {x: 0, y: 5}) === false);

const isSameDot = (a, b) => {
    return a.x === b.x && a.y === b.y;
};

module.exports = {
    lineWillIntersect: (existingSections, candidate) => {
        for (let k in existingSections) {
            let section = existingSections[k];
            const a = section.start;
            const b = section.end;
            const c = candidate.start;
            const d = candidate.end;

            const denominator = ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y));

            const slopeA = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x));
            const slopeB = ((b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x));

            if (denominator !== 0) {
                const ua = slopeA / denominator;
                const ub = slopeB / denominator;
                // is the intersection along the segments
                const res = ua < 0 || ua > 1 || ub < 0 || ub > 1;
                console.log(`no intersection? ${JSON.stringify(section)} - ${JSON.stringify(candidate)}`, res);
                if (res) {
                    console.log('A - no intersection');
                    continue;
                }
                const x = a.x + ua * (b.x - a.x);
                const y = a.y + ua * (b.y - a.y);
                console.log(`maybe intersection: ${x},${y}`);
                if (!isSameDot({x, y}, c)) {
                    console.log('B - true intersection');
                    return true;
                }
            }
        }
        return false;
    }
};

const exSec = [
    {start: {x: 0, y: 0}, end: {x: 0, y: 3}},
    {start: {x: 0, y: 3}, end: {x: 2, y: 1}},
    {start: {x: 2, y: 1}, end: {x: 1, y: 0}}
];



