import InputMapping from "./inputMapping.js";
export default class InputProfile {
	#private;
	name: string;
	constructor(name: string);
	createMapping(
		name: string,
		keys: string,
		gamepadButtons?: string,
		mouseButtons?: string
	): this;
	getMapping(name: string): InputMapping | undefined;
	remapKeys(name: string, keys: string): void;
	remapGamepadButtons(name: string, buttons: string): void;
	remapMouseButtons(name: string, buttons: string): void;
	removeMapping(name: string): this;
}
//# sourceMappingURL=inputProfile.d.ts.map
