export default class InputMapping {
	#private;
	readonly name: string;
	get keys(): string;
	get gamepadButtons(): string;
	get mouseButtons(): string;
	constructor(
		name: string,
		keys?: string,
		gamepadButtons?: string,
		mouseButtons?: string
	);
	remapKeys(keys: string): void;
	remapGamepadButtons(buttons: string): void;
	remapMouseButtons(buttons: string): void;
}
//# sourceMappingURL=inputMapping.d.ts.map
