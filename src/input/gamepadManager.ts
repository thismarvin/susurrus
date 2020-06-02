const _gamepads = new Map<number, Gamepad>();

//@ts-ignore
window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
	_gamepads.set(event.gamepad.index, event.gamepad);
	console.log(event.gamepad.id);
});
//@ts-ignore
window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
	_gamepads.delete(event.gamepad.index);
});

export function getGamepad(playerIndex: number) {
	if (!_gamepads.has(playerIndex)) {
		return null;
	}

	return _gamepads.get(playerIndex);
}

export const XINPUT_BUTTONS = {
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	LEFT_BUMPER: 4,
	RIGHT_BUMPER: 5,
	LEFT_TRIGGER: 6,
	RIGHT_TRIGGER: 7,
	BACK: 8,
	START: 9,
	LEFT_STICK: 10,
	RIGHT_STICK: 11,
	DPAD_UP: 12,
	DPAD_DOWN: 13,
	DPAD_LEFT: 14,
	DPAD_RIGHT: 15,
};
