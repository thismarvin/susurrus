export default class ResourceHandler<T> {
	#private;
	get length(): number;
	get entries(): () => IterableIterator<[string, T]>;
	constructor();
	register(name: string, entry: T): void;
	get(name: string): T | undefined;
	remove(name: string): void;
}
//# sourceMappingURL=resourceHandler.d.ts.map
