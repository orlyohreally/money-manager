export type normalizedArray<IdHolder extends { _id: string }> = {
  [_id: string]: IdHolder;
};

export function normalize<IdHolder extends { _id: string }>(
  array: IdHolder[]
): normalizedArray<IdHolder> {
  return array.reduce((res, item) => {
    res[item._id] = item;
    return res;
  }, {});
}
export function unnormalizeArray<IdHolder extends { _id: string }>(
  object: normalizedArray<IdHolder>
): IdHolder[] {
  return Object.keys(object).map(key => object[key]);
}

export function groupBy<T extends { [key: string]: any }>(
  array: Array<T>,
  key: string
): { [key: string]: T[] } {
  return array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
}

export function orderNormalizedArrayByKey<T>(key: string) {
  return (a: { key: string; value: T }, b: { key: string; value: T }) =>
    a.value[key] - b.value[key];
}
