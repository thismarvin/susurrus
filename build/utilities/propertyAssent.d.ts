/**
 * Validates whether a given value is of a given type. Throws a TypeError otherwise.
 * @param value The value that is being tested against.
 * @param {string} type The type the property is expecting.
 * @param options Optional options to apply if validation fails.
 */
export declare function expectType(
	value: any,
	type: string,
	options?: any
): boolean | undefined;
/**
 * Validates whether a given value is of a given class instance. Throws a TypeError otherwise.
 * @param value The value the property is going to be set to.
 * @param instance The class instance the property is expecting.
 * @param options Optional options to apply if validation fails.
 */
export declare function expectInstance(
	value: any,
	instance: any,
	options?: any
): boolean | undefined;
