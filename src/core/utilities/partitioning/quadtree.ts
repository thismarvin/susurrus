// eslint-disable-next-line no-unused-vars
import { Rectangle } from "../../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
import IPartionable from "./IPartitionable.js";
import Partitioner from "./partitioner.js";

/**
 * An implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
 */
export default class Quadtree<T extends IPartionable> extends Partitioner<T> {
	#capacity: number;
	#divided: boolean;
	#insertionIndex: number;
	#entries: T[];

	#topLeft: Quadtree<T> | null;
	#topRight: Quadtree<T> | null;
	#bottomRight: Quadtree<T> | null;
	#bottomLeft: Quadtree<T> | null;

	/**
	 * Creates an implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param capacity The total amount of entries that exist in a node before overflowing into a new tree.
	 */
	constructor(boundary: Rectangle, capacity: number) {
		super(boundary);

		this.#capacity = capacity;
		this.#divided = false;
		this.#insertionIndex = 0;
		//@ts-ignore
		this.#entries = new Array(this.#capacity).fill(null);
		this.#topLeft = null;
		this.#topRight = null;
		this.#bottomRight = null;
		this.#bottomLeft = null;
	}

	public query(boundary: Rectangle): number[] {
		const result: number[] = [];

		if (this.boundary.completelyWithin(boundary)) {
			for (let i = 0; i < this.#entries.length; i++) {
				if (this.#entries[i] === null) {
					continue;
				}

				result.push(this.#entries[i].identifier);
			}
		} else {
			for (let i = 0; i < this.#entries.length; i++) {
				if (this.#entries[i] === null) {
					continue;
				}

				if (boundary.intersects(this.#entries[i].boundary)) {
					result.push(this.#entries[i].identifier);
				}
			}
		}

		if (!this.#divided) {
			return result;
		}

		//@ts-ignore
		result.push(...this.#topLeft.query(boundary));
		//@ts-ignore
		result.push(...this.#topRight.query(boundary));
		//@ts-ignore
		result.push(...this.#bottomRight.query(boundary));
		//@ts-ignore
		result.push(...this.#bottomLeft.query(boundary));

		return result;
	}

	public add(entry: T): boolean {
		if (!entry.boundary.intersects(this.boundary)) {
			return false;
		}

		if (this.#insertionIndex < this.#capacity) {
			this.#entries[this.#insertionIndex++] = entry;
			return true;
		} else {
			if (!this.#divided) {
				this.subdivide();
			}

			if (
				//@ts-ignore
				this.#topLeft.insert(entry) ||
				//@ts-ignore
				this.#topRight.insert(entry) ||
				//@ts-ignore
				this.#bottomRight.insert(entry) ||
				//@ts-ignore
				this.#bottomLeft.insert(entry)
			) {
				return true;
			}
		}

		return false;
	}

	public clear(): void {
		if (this.#divided) {
			//@ts-ignore
			this.#topLeft.clear();
			//@ts-ignore
			this.#topRight.clear();
			//@ts-ignore
			this.#bottomRight.clear();
			//@ts-ignore
			this.#bottomLeft.clear();

			this.#topLeft = null;
			this.#topRight = null;
			this.#bottomRight = null;
			this.#bottomLeft = null;
		}

		this.#divided = false;
		this.#insertionIndex = 0;

		//@ts-ignore
		this.#entries.fill(null);
	}

	private subdivide() {
		const width = this.boundary.width * 0.5;
		const height = this.boundary.height * 0.5;

		this.#topLeft = new Quadtree<T>(
			new Rectangle(this.boundary.x, this.boundary.y, width, height),
			this.#capacity
		);
		this.#topRight = new Quadtree<T>(
			new Rectangle(this.boundary.x + width, this.boundary.y, width, height),
			this.#capacity
		);
		this.#bottomRight = new Quadtree<T>(
			new Rectangle(
				this.boundary.x + width,
				this.boundary.y - height,
				width,
				height
			),
			this.#capacity
		);
		this.#bottomLeft = new Quadtree<T>(
			new Rectangle(this.boundary.x, this.boundary.y - height, width, height),
			this.#capacity
		);

		this.#divided = true;
	}
}
