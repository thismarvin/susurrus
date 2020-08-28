import InputProfile from "./inputProfile.js";
export default class InputHandler {
	#private;
	readonly playerIndex: number;
	get lastInputType(): string;
	get pointerPosition(): {
		x: number;
		y: number;
	};
	constructor(element: HTMLElement, playerIndex: number);
	loadProfile(profile: InputProfile): this;
	pressed(name: string): boolean;
	pressing(name: string): boolean;
	update(): void;
}
//# sourceMappingURL=inputHandler.d.ts.map
