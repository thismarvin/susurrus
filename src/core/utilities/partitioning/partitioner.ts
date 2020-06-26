// eslint-disable-next-line no-unused-vars
import { Rectangle } from "../../../lib/maths.js";
// eslint-disable-next-line no-unused-vars
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
	constructor(boundary: Rectangle) {
		this.boundary = boundary;
	}

	/**
	 * Returns a list of the identifiers of all of the IPartionable entries that are within a given boundary.
	 * @param boundary The area to check for IPartitionable entries.
	 */
	public abstract query(boundary: Rectangle): number[];

	/**
	 * Adds a given IPartitionable entry to the partitioner.
	 * @param entry The IPartitionable item to add to the partitioner.
	 */
	public abstract add(entry: T): boolean;

	/**
	 * Removes all entries that were inside the partitioner.
	 */
	public abstract clear(): void;

	public addRange(...entries: T[]) {
		for (let i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}
}
