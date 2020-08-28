import { Rectangle } from "../../../lib/maths.js";
import IPartionable from "./IPartitionable.js";
import Partitioner from "./partitioner.js";
/**
 * An implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
 */
export default class Bin<T extends IPartionable> extends Partitioner<T> {
	#private;
	/**
	 * Creates an implementation of a Partitioner that uses a hashing algorithm to store and retrieve IPartitionable entries.
	 * @param boundary The area that the partitioner will cover.
	 * @param maximumDimension The maximum expected size of any IPartionable entry inserted into the bin.
	 */
	constructor(boundary: Rectangle, maximumDimension: number);
	query(boundary: Rectangle): number[];
	add(entry: T): boolean;
	clear(): void;
	private getHashIDs;
	private getHash;
}
//# sourceMappingURL=bin.d.ts.map
