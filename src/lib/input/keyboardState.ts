export default class KeyboardState {
	public readonly event: KeyboardEvent;
	public readonly keysPressed: Set<string>;

	constructor(event: KeyboardEvent, keysPressed: Set<string>) {
		this.event = event;
		this.keysPressed = new Set<string>(keysPressed);

		Object.defineProperty(this, "event", {
			writable: false,
		});
		Object.defineProperty(this, "keysPressed", {
			writable: false,
		});
	}
}
