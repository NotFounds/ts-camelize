type Delimiter = "_" | "." | "-";
export type Camelize<S extends string> = S extends `${infer T}${Delimiter}${infer U}`
  ? `${Lowercase<T>}${Capitalize<Camelize<U>>}`
  : Lowercase<S>;

export type CamelizeDeep<T> = T extends string
                              ? Camelize<T>
                            : T extends Array<infer U>
                              ? Array<CamelizeDeep<U>>
                            : T extends Record<string, any>
                              ? { [K in keyof T as Camelize<K & string>]: CamelizeDeep<T[K]> }
                            : T;

export const camelize = (str: string) => {
  return str.replace(/[_.-](\w|$)/g, (_, x) => x.toUpperCase());
};

export const camelizeDeep = <T extends string | Record<string, any>>(obj: T): T extends string ? string : CamelizeDeep<T> => {
  return typeof obj === "string"
    ? camelize(obj)
  : typeof obj !== "object"
    ? obj
  : Array.isArray(obj)
    ? obj.map(camelizeDeep)
  : Object.keys(obj).reduce((acc, key) => {
    const camelizedKey = camelize(key);
    acc[camelizedKey] = camelizeDeep(obj[key]);
    return acc;
  }, {} as any);
}
