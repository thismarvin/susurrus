// eslint-disable-next-line no-unused-vars
import { Rectangle, MathExt } from "../../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import IPartionable from "./IPartitionable.js";
import Partitioner from "./partitioner.js";

interface IPoint {
	x: number;
	y: number;
}

function _constrainPoint(point: IPoint, boundary: Rectangle) {
	let xConstrained = point.x;
	let yConstrained = point.y;

	xConstrained = Math.max(boundary.left, xConstrained);
	xConstrained = Math.min(boundary.right, xConstrained);

	yConstrained = Math.max(boundary.bottom, yConstrained);
	yConstrained = Math.min(boundary.top, yConstrained);

	return {
		x: xConstrained,
		y: yConstrained,
	};
}

function _constrainRectangle(rectangle: Rectangle, boundary: Rectangle) {
	const constrainedTopLeft = _constrainPoint(
		{ x: rectangle.x, y: rectangle.y },
		boundary
	);

	const constrainedWidth = Math.min(
		rectangle.width,
		boundary.right - constrainedTopLeft.x
	);
	const constrainedHeight = Math.min(
		rectangle.height,
		constrainedTopLeft.y - boundary.bottom
	);

	return new Rectangle(
		constrainedTopLeft.x,
		constrainedTopLeft.y,
		constrainedWidth,
		constrainedHeight
	);
}

/**
 * An implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
 */
export default class Bin<T extends IPartionable> extends Partitioner<T> {
	#validatedBoundary: Rectangle;
	#powerOfTwo: number;
	#bucketSize: number;
	#columns: number;
	#rows: number;
	#buckets: Set<number>[];

	/**
	 * Creates an implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param maximumDimension The maximum expected size of any IPartionable entry inserted into the bin.
	 */
	constructor(boundary: Rectangle, maximumDimension: number) {
		super(boundary);

		this.#validatedBoundary = new Rectangle(
			MathExt.remapRange(
				this.boundary.x,
				this.boundary.left,
				this.boundary.right,
				0,
				this.boundary.width
			),
			MathExt.remapRange(
				this.boundary.y,
				this.boundary.bottom,
				this.boundary.top,
				0,
				this.boundary.height
			),
			this.boundary.width,
			this.boundary.height
		);

		this.#powerOfTwo = Math.ceil(Math.log2(maximumDimension));
		this.#bucketSize = 1 << this.#powerOfTwo;
		this.#columns = Math.ceil(this.boundary.width / 2 ** this.#powerOfTwo);
		this.#rows = Math.ceil(this.boundary.height / 2 ** this.#powerOfTwo);
		this.#buckets = new Array(this.#rows * this.#columns).fill(null);

		for (let i = 0; i < this.#buckets.length; i++) {
			this.#buckets[i] = new Set<number>();
		}
	}

	public query(boundary: Rectangle): number[] {
		const result: number[] = [];

		if (this.boundary.completelyWithin(boundary)) {
			for (let i = 0; i < this.#buckets.length; i++) {
				for (let entry of this.#buckets[i]) {
					result.push(entry);
				}
			}

			return result;
		}

		const unique = new Set<number>();
		const ids = this.getHashIDs(boundary);

		for (let id of ids) {
			for (let entry of this.#buckets[id]) {
				if (!unique.has(entry)) {
					unique.add(entry);
					result.push(entry);
				}
			}
		}

		return result;
	}

	public add(entry: T): boolean {
		if (!entry.boundary.intersects(this.boundary)) {
			return false;
		}

		const ids = this.getHashIDs(entry.boundary);

		for (let i of ids) {
			this.#buckets[i].add(entry.identifier);
		}

		return ids.size > 0;
	}

	public clear(): void {
		for (let i = 0; i < this.#buckets.length; i++) {
			this.#buckets[i].clear();
		}
	}

	private getHashIDs(boundary: Rectangle) {
		const validatedBoundary = new Rectangle(
			MathExt.remapRange(
				boundary.x,
				this.boundary.left,
				this.boundary.right,
				0,
				this.boundary.width
			),
			MathExt.remapRange(
				boundary.y,
				this.boundary.bottom,
				this.boundary.top,
				0,
				this.boundary.height
			),
			boundary.width,
			boundary.height
		);

		// Make sure that the query's bounds are within the partitioner's bounds.
		const constrainedBounds = _constrainRectangle(
			validatedBoundary,
			this.#validatedBoundary
		);

		// Hash all corners of the validated query's bounds.
		const hashes = [
			this.getHash(constrainedBounds.left, constrainedBounds.top),
			this.getHash(constrainedBounds.right, constrainedBounds.top),
			this.getHash(constrainedBounds.right, constrainedBounds.bottom),
			this.getHash(constrainedBounds.left, constrainedBounds.bottom),
		];

		/// Ideally the dimensions of the validated query's bounds will be less than the partitioner's bucket size.
		/// However, this is not always the case. In order to handle all dimensions, we have to carefully divide the query bounds into smaller
		/// subsections. Each subsection needs to be the same size as the partitioner's bucket size for optimal guaranteed coverage.
		if (
			constrainedBounds.width > this.#bucketSize ||
			constrainedBounds.height > this.#bucketSize
		) {
			const totalRows = Math.ceil(constrainedBounds.height / this.#bucketSize);
			const totalColumns = Math.ceil(
				constrainedBounds.width / this.#bucketSize
			);

			for (let y = 0; y <= totalRows; y++) {
				for (let x = 0; x <= totalColumns; x++) {
					hashes.push(
						this.getHash(
							validatedBoundary.x + x * this.#bucketSize,
							validatedBoundary.y - y * this.#bucketSize
						)
					);
				}
			}
		}

		return new Set<number>(hashes.filter((value) => value >= 0));
	}

	private getHash(x: number, y: number) {
		const position = _constrainPoint({ x: x, y: y }, this.#validatedBoundary);

		// I just want to note that position is almost certainly a float, but the bitwise shifts just automatically truncate the operand into an integer.
		const row = position.x >> this.#powerOfTwo;
		const column = position.y >> this.#powerOfTwo;

		if (column < 0 || column >= this.#columns || row < 0 || row >= this.#rows) {
			return -1;
		}

		return this.#columns * column + row;
	}
}
