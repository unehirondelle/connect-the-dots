module.exports = {
    lineGoesThroughDots: (a, b) => {
        return Math.abs(a.x - b.x) === Math.abs(a.y - b.y) ||
            (a.x === b.x && a.y !== b.y) ||
            (a.x !== b.x && a.y === b.y);
    },
    isSameDot: (a, b) => {
        return a.x === b.x && a.y === b.y;
    },
    collinearLines: (a, b, c) => {
        const slope = (point1, point2) => {
            return (point2.y - point1.y) / (point2.x - point1.x);
        };
        return slope(a, b) === slope(b, c) && slope(b, c) === slope(c, a);
    },
    pointBelongsToSection: (a, b, c) => {
        // return !!(c.y - a.y) * (b.x - a.x) === (b.y - a.y) * (c.x - a.x);
        return Math.abs(Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2)) +
            Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2)) - Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))) === 0;
    },
    lineWillIntersect: (sections, startNode, endNode, state) => {
        // Run through all the sections to determine if there is any intersection with line-to-be
        // line intersect math by Paul Bourke is used (http://paulbourke.net/geometry/pointlineplane/)
        return sections.map(section => {
            const x1 = section.start.x;
            const y1 = section.start.y;
            const x2 = section.end.x;
            const y2 = section.end.y;

            const x3 = startNode.x;
            const y3 = startNode.y;
            const x4 = endNode.x;
            const y4 = endNode.y;

            const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

            const slopeA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
            const slopeB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3));

            // Sections are parallel
            if (denominator === 0) {
                // Sections overlapping
                // line duplicate
                if ((module.exports.isSameDot(section.end, startNode) && module.exports.isSameDot(section.start, endNode)) ||
                    // same length line in other direction
                    (/*!!module.exports.collinearLines(section.start, startNode, endNode) && */!module.exports.pointBelongsToSection(endNode, section.start, section.end))
                ) {
                    return true;
                } else {
                    return false;
                }
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
            if (!module.exports.isSameDot({x, y}, state.thisMoveStartDot)) {
                return {x, y};
            } else {
                return false;
            }
        });
    },
    checkGameOver: (sections, lineStart, lineEnd, state) => {
        let candidates = [];
        let intersections = [];
        const givenPoints = [lineStart, lineEnd];

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

            const checkResult = candidates.map((point, i) => ({[i]: []}));

            candidates.forEach((point, i) => {
                module.exports.lineWillIntersect(sections, data, point, state)
                    .forEach((el) => {
                        checkResult[i][i].push(el);
                    });
            });

            checkResult.forEach((el, i) => {
                intersections.push(el[i].find(v => typeof v === 'object' || v === true));
            });

            candidates = [];
        });
        // only one intersection found and it's the start Dot of the last move
        // return !!(intersections.filter(v => typeof v === 'undefined').length === 1 && okPoints.find(o => module.exports.isSameDot(o, state.thisMoveStartDot)));
        console.log(`INTERSECTIONS ${JSON.stringify(intersections)}`);
        return !intersections.filter(v => typeof v === 'undefined').length/* && okPoints[1].length === 1*/;
    },
    isValidMove: () => {

    }
};
