export default class LineSegment {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	constructor(x1: number, y1: number, x2: number, y2: number);
	getIntersectionInformation(
		lineSegment: LineSegment
	): {
		t: number;
		u: number;
		intersected: boolean;
		convergence: {
			x: number;
			y: number;
		};
	} | null;
	intersects(lineSegment: LineSegment): boolean;
}
//# sourceMappingURL=lineSegment.d.ts.map
