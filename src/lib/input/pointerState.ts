export default class PointerState {
	public readonly event: PointerEvent;

	constructor(event: PointerEvent) {
		this.event = event;

		Object.defineProperty(this, "event", {
			writable: false,
		});
	}
}
