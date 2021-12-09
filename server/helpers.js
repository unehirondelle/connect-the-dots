module.exports = {
    lineGoesThroughDots: (a, b) => {
        return Math.abs(a.x - b.x) === Math.abs(a.y - b.y) ||
            (a.x === b.x && a.y !== b.y) ||
            (a.x !== b.x && a.y === b.y);
    },
    isSameDot: (a, b) => {
        return a.x === b.x && a.y === b.y;
    },
    lineWillIntersect: (sections, startNode, endNode, state) => {
        // Run through all the sections to determine if there is any intersection with line-to-be
        // line intercept math by Paul Bourke is used (http://paulbourke.net/geometry/pointlineplane/)
        return sections.map(line => {
            const x1 = line.start.x;
            const y1 = line.start.y;
            const x2 = line.end.x;
            const y2 = line.end.y;

            const x3 = startNode.x;
            const y3 = startNode.y;
            const x4 = endNode.x;
            const y4 = endNode.y;

            const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

            const slopeA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
            const slopeB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3));

            // Sections overlapping
            if (slopeA === slopeB) {
                return ((x1 - x3) * (y1 - y4) - (x1 - x4) * (y1 - y3) === 0 || (x2 - x3) * (y2 - y4) - (x2 - x4) * (y2 - y3) === 0);
            }

            // Sections are parallel
            if (denominator === 0 && slopeA !== slopeB) {
                return false;
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
        let sectionsToCheck = [];
        let intersections = [];
        const givenPoints = [lineStart, lineEnd];

        givenPoints.forEach(data => {
            const increasedX = data.x + 1;
            const decreasedX = data.x - 1;
            const increasedY = data.y + 1;
            const decreasedY = data.y - 1;

            if ((increasedX >= 0 && increasedX <= 3) && (increasedY >= 0 && increasedY <= 3)) {
                sectionsToCheck.push({x: increasedX, y: increasedY});
            }
            if ((increasedX >= 0 && increasedX <= 3) && (decreasedY >= 0 && decreasedY <= 3)) {
                sectionsToCheck.push({x: increasedX, y: decreasedY});
            }
            if (increasedX >= 0 && increasedX <= 3) {
                sectionsToCheck.push({x: increasedX, y: data.y});
            }
            if ((decreasedX >= 0 && decreasedX <= 3) && (increasedY >= 0 && increasedY <= 3)) {
                sectionsToCheck.push({x: decreasedX, y: increasedY});
            }
            if ((decreasedX >= 0 && decreasedX <= 3) && (decreasedY >= 0 && decreasedY <= 3)) {
                sectionsToCheck.push({x: decreasedX, y: decreasedY});
            }
            if (decreasedX >= 0 && decreasedX <= 3) {
                sectionsToCheck.push({x: decreasedX, y: data.y});
            }
            if (increasedY >= 0 && increasedY <= 3) {
                sectionsToCheck.push({x: data.x, y: increasedY});
            }
            if (decreasedY >= 0 && decreasedY <= 3) {
                sectionsToCheck.push({x: data.x, y: decreasedY});
            }

            sectionsToCheck.forEach(point => {
                intersections.push(module.exports.lineWillIntersect(sections, data, point, state).find(r => r === false));
            });

            sectionsToCheck = [];
        });

        return !!intersections.find(r => r === false);
    }
};
