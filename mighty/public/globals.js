/** @typedef {{csrfToken?: string | null | undefined, errors?: Record<string, unknown>, session?: Record<string, unknown>}} MightyGlobals */

/** @type {MightyGlobals} */
let mightyGlobals;

/**
 * @param {MightyGlobals} newGlobals
 */
export function setGlobals(newGlobals) {
  mightyGlobals = newGlobals;
}

export function globals() {
  return mightyGlobals;
}
