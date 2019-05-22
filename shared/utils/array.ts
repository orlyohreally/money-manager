export type IdHolder = { _id: string };

export type normalizedArray<T extends IdHolder> = {
  [_id: string]: T;
};

export function normalize<T extends IdHolder>(
  array: T[]
): normalizedArray<T> {
  return array.reduce((res: normalizedArray<T>, item) => {
    res[item._id] = item;
    return res;
  }, {});
}
export function unnormalizeArray<T extends IdHolder>(
  object: normalizedArray<T>
): T[] {
  return Object.keys(object).map(key => object[key]);
}

export function orderNormalizedArrayByKey<T extends { [i: string]: number }>(key: string) {
  return (a: { key: string; value: T }, b: { key: string; value: T }) =>
    a.value[key] - b.value[key];
}
