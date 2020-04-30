/**
 * Validates whether a given value is of a given type. Throws a TypeError otherwise.
 * @param {String} property The property that is going to be modified.
 * @param value The value the property is going to be set to.
 * @param {String} type The type the property is expecting.
 */
export function expectType(property, value, type) {
    if (typeof value !== type) {
        throw new TypeError(`Expected value to be a(n) ${type}; could not modify '${property}' property.`);
    }
}

/**
 * Validates whether a given value is of a given class instance. Throws a TypeError otherwise.
 * @param {String} property The property that is going to be modified.
 * @param value The value the property is going to be set to.
 * @param instance The class instance the property is expecting.
 */
export function expectInstance(property, value, instance) {
    if (!(value instanceof instance)) {
        throw new TypeError(`Expected value to be an instance of '${instance.name}'; could not modify '${property}' property.`);
    }
}