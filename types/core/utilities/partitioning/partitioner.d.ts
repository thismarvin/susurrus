import { Rectangle } from "../../../lib/maths.js";
import IPartionable from "./IPartitionable.js";
/**
 * An abstraction of a class that implements spatial partitioning capabilities.
 */
export default abstract class Partitioner<T extends IPartionable> {
	protected boundary: Rectangle;
	/**
	 * Creates An abstraction of a class that implements spatial partitioning capabilities.
	 * @param boundary The area that the partitioner will cover.
	 */
	constructor(boundary: Rectangle);
	/**
	 * Returns a list of the identifiers of all of the IPartionable entries that are within a given boundary.
	 * @param boundary The area to check for IPartitionable entries.
	 */
	abstract query(boundary: Rectangle): number[];
	/**
	 * Adds a given IPartitionable entry to the partitioner.
	 * @param entry The IPartitionable item to add to the partitioner.
	 */
	abstract add(entry: T): boolean;
	/**
	 * Removes all entries that were inside the partitioner.
	 */
	abstract clear(): void;
	/**
	 * Adds a list of IPartitionable entries to the partitioner.
	 * @param entries The list of IPartitionable entries to add to the partitioner.
	 */
	addRange(entries: T[]): void;
}
//# sourceMappingURL=partitioner.d.ts.map
