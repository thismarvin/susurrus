export default class SmartGamepad {
	#private;
	readonly playerIndex: number;
	get connected(): boolean;
	get description(): string;
	get leftStickAxes(): {
		x: number;
		y: number;
	};
	get rightStickAxes(): {
		x: number;
		y: number;
	};
	get buttons(): readonly number[] | GamepadButton[];
	constructor(playerIndex: number);
	pressed(button: string): boolean;
	pressing(button: string): boolean;
	update(): void;
}
//# sourceMappingURL=smartGamepad.d.ts.map
