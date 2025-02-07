import { globals } from "./globals";

/**
 * @template T
 * @param {string|undefined} errorBag
 * @return {T}
 */
export function errors(errorBag = undefined) {
  const globalsObject = globals();
  // @ts-expect-error error object should be typed properly
  return (
    (errorBag ? globalsObject.errors?.[errorBag] : globalsObject.errors) ?? {}
  );
}

export function csrfToken() {
  return globals().csrfToken;
}

/** @param {string | undefined} key */
export function session(key = undefined) {
  const session = globals().session ?? {};
  return key ? session[key] : session;
}
