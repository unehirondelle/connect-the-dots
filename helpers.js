module.exports = {
    lineGoesThroughDots: (a, b) => {
        return Math.abs(a.x - b.x) === Math.abs(a.y - b.y) ||
            (a.x === b.x && a.y !== b.y) ||
            (a.x !== b.x && a.y === b.y);
    },
    isSameDot: (a, b) => {
        return a.x === b.x && a.y === b.y;
    },
    pointIsOnSection: (existingSections, candidate) => {
        for (let k in existingSections) {
            const section = existingSections[k];
            const a = section.start;
            const b = section.end;
            const c = candidate;
            if (Math.abs(Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2)) +
                Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2)) - Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))) === 0) {
                return true;
            }
        }
        return false;
    },
    lineWillIntersect: (existingSections, candidate) => {
        // Run through all the sections to determine if there is any intersection with line-to-be
        // line intersect math by Paul Bourke is used (http://paulbourke.net/geometry/pointlineplane/)
        for (let k in existingSections) {
            const section = existingSections[k];
            const a = section.start;
            const b = section.end;
            const c = candidate.start;
            const d = candidate.end;

            const denominator = ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y));

            const slopeA = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x));
            const slopeB = ((b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x));

            // if denominator === 0 - sections are parallel
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
                // calculate coordinates of intersection
                const x = a.x + ua * (b.x - a.x);
                const y = a.y + ua * (b.y - a.y);
                console.log(`maybe intersection: ${x},${y}`);
                // check if the intersection equals candidate.start
                if (!module.exports.isSameDot({x, y}, c)) {
                    console.log('B - true intersection');
                    return true;
                }
            }
        }
        return false;
    },
    checkGameOver: (existingSections, lineStart, lineEnd) => {
        let candidates = [];
        const givenPoints = [lineStart, lineEnd];
        const result = [];

        givenPoints.forEach((data, index) => {
            const increasedX = data.x + 1;
            const decreasedX = data.x - 1;
            const increasedY = data.y + 1;
            const decreasedY = data.y - 1;

            if ((increasedX >= 0 && increasedX <= 3) && (increasedY >= 0 && increasedY <= 3)) {
                candidates.push({x: increasedX, y: increasedY});
            }
            if ((increasedX >= 0 && increasedX <= 3) && (decreasedY >= 0 && decreasedY <= 3)) {
                candidates.push({x: increasedX, y: decreasedY});
            }
            if (increasedX >= 0 && increasedX <= 3) {
                candidates.push({x: increasedX, y: data.y});
            }
            if ((decreasedX >= 0 && decreasedX <= 3) && (increasedY >= 0 && increasedY <= 3)) {
                candidates.push({x: decreasedX, y: increasedY});
            }
            if ((decreasedX >= 0 && decreasedX <= 3) && (decreasedY >= 0 && decreasedY <= 3)) {
                candidates.push({x: decreasedX, y: decreasedY});
            }
            if (decreasedX >= 0 && decreasedX <= 3) {
                candidates.push({x: decreasedX, y: data.y});
            }
            if (increasedY >= 0 && increasedY <= 3) {
                candidates.push({x: data.x, y: increasedY});
            }
            if (decreasedY >= 0 && decreasedY <= 3) {
                candidates.push({x: data.x, y: decreasedY});
            }

            for (let k in candidates) {
                const candidate = candidates[k];
                if (module.exports.lineWillIntersect(existingSections, {start: data, end: candidate}) ||
                    module.exports.pointIsOnSection(existingSections, candidate)) {
                    result.push(true);
                } else {
                    result.push(false);
                }
            }
            candidates = [];
        });

        return !result.filter(r => r === false).length;
    }
};
