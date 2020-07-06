import { Rectangle } from "../../../lib/maths.js";
import IPartionable from "./IPartitionable.js";
import Partitioner from "./partitioner.js";
/**
 * An implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
 */
export default class Quadtree<T extends IPartionable> extends Partitioner<T> {
	#private;
	/**
	 * Creates an implementation of a Partitioner that uses a recursive tree structure to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param capacity The total amount of entries that exist in a node before overflowing into a new tree.
	 */
	constructor(boundary: Rectangle, capacity: number);
	query(boundary: Rectangle): number[];
	add(entry: T): boolean;
	clear(): void;
	private subdivide;
}
//# sourceMappingURL=quadtree.d.ts.map
