type Delimiter = "_" | "." | "-";
export type Camelize<S extends string> = S extends
  `${infer T}${Delimiter}${infer U}`
  ? `${Lowercase<T>}${Capitalize<Camelize<U>>}`
  : Lowercase<S>;

export type CamelizeDeep<T> = T extends string ? Camelize<T>
  : T extends Array<infer U> ? Array<CamelizeDeep<U>>
  : T extends Record<string, unknown>
    ? { [K in keyof T as Camelize<K & string>]: CamelizeDeep<T[K]> }
  : T;

// Determines an object is a class object or not.
const isPlainObject = (
  obj: unknown,
): obj is Record<string | symbol | number, unknown> => {
  const prototype = Object.getPrototypeOf(obj);
  return typeof obj === "object" &&
    (prototype === null || prototype.constructor === Object);
};

export const camelize = (str: string) => {
  return str.replace(/[_.-](\w|$)/g, (_, x) => x.toUpperCase());
};

export const camelizeDeep = <T extends unknown>(
  obj: T,
): T extends string ? string : CamelizeDeep<T> => {
  return Array.isArray(obj) ? obj.map(camelizeDeep) : !isPlainObject(obj) // Eliminate class instances like Date, Set, RegExp, etc.
    ? obj
    : Object.keys(obj).reduce((acc, key) => {
      const camelizedKey = camelize(key);
      acc[camelizedKey] = camelizeDeep(obj[key]);
      return acc;
      // deno-lint-ignore no-explicit-any
    }, {} as any);
};
