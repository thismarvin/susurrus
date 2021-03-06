//#region Public
/**
 * Validates whether a given value is of a given type. Throws a TypeError otherwise.
 * @param value The value that is being tested against.
 * @param {string} type The type the property is expecting.
 * @param options Optional options to apply if validation fails.
 */
export function expectType(value: any, type: string, options?: any) {
	let valid = true;

	switch (type.toLowerCase()) {
		case "array":
			valid = Array.isArray(value);
			break;
		default:
			valid = typeof value === type;
			break;
	}

	return _validateAssent(
		valid,
		options,
		`Expected value to be a(n) '${type}'.`
	);
}

/**
 * Validates whether a given value is of a given class instance. Throws a TypeError otherwise.
 * @param value The value the property is going to be set to.
 * @param instance The class instance the property is expecting.
 * @param options Optional options to apply if validation fails.
 */
export function expectInstance(value: any, instance: any, options?: any) {
	let valid = value instanceof instance;

	return _validateAssent(
		valid,
		options,
		`Expected value to be an instance of '${instance.name}'.`
	);
}
//#endregion

//#region Private
function _validateAssent(
	valid: boolean,
	options: any,
	defaultErrorMessage: string
) {
	const throwDefaultErrorMessage = () => {
		throw new TypeError(defaultErrorMessage);
	};

	// When there are no options, throw an error if 'valid' is false or return nothing if 'valid' is true.
	if (options === undefined) {
		if (!valid) {
			throwDefaultErrorMessage();
		}
		return;
	}

	// Alright so we have some sort of options. We need to process them.

	// Make sure options is even an object. If not, then just return nothing.
	if (typeof options !== "object") {
		return;
	}

	// Options is valid. Continue processing them.

	// If options contains a 'throwError' property and it is a boolean, instead of throwing errors or nothing at all, just return valid.
	if (options.throwError !== undefined) {
		if (typeof options.throwError === "boolean" && !options.throwError) {
			return valid;
		}
	}

	// At this point there is no reason to continue if valid is true.
	if (valid) {
		return;
	}

	// If options contains a 'errorMessage' property and it is a string, throw a TypeError with that error message.
	if (options.errorMessage !== undefined) {
		if (
			typeof options.errorMessage === "string" &&
			options.errorMessage.length > 0
		) {
			throw new TypeError(options.errorMessage);
		}

		throwDefaultErrorMessage();
	}

	// If options contains a 'addendum' property and it is a string, throw a TypeError with the original error message and the addendum.
	if (options.addendum !== undefined) {
		if (typeof options.addendum === "string" && options.addendum.length > 0) {
			throw new TypeError(`${defaultErrorMessage} ${options.addendum}`);
		}

		throwDefaultErrorMessage();
	}
}
//#endregion
