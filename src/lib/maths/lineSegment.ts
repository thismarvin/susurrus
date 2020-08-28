function _intersectionPoint(lineSegment: LineSegment, t: number) {
	return {
		x: lineSegment.x1 + t * (lineSegment.x2 - lineSegment.x1),
		y: lineSegment.y1 + t * (lineSegment.y2 - lineSegment.y1),
	};
}

export default class LineSegment {
	public x1: number;
	public y1: number;
	public x2: number;
	public y2: number;

	constructor(x1: number, y1: number, x2: number, y2: number) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	public getIntersectionInformation(lineSegment: LineSegment) {
		const x3 = lineSegment.x1;
		const y3 = lineSegment.y1;
		const x4 = lineSegment.x2;
		const y4 = lineSegment.y2;

		const denominator =
			(this.x1 - this.x2) * (y3 - y4) - (this.y1 - this.y2) * (x3 - x4);

		if (denominator === 0) {
			return null;
		}

		let numerator = (this.x1 - x3) * (y3 - y4) - (this.y1 - y3) * (x3 - x4);
		const t = numerator / denominator;

		numerator =
			(this.x1 - this.x2) * (this.y1 - y3) -
			(this.y1 - this.y2) * (this.x1 - x3);
		const u = -numerator / denominator;

		return {
			t: t,
			u: u,
			intersected: 0 <= t && t <= 1 && 0 <= u && u <= 1,
			convergence: _intersectionPoint(this, t),
		};
	}

	public intersects(lineSegment: LineSegment) {
		const result = this.getIntersectionInformation(lineSegment);

		return result === null ? false : result.intersected;
	}
}
