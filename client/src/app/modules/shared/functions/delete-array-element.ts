export function deleteArrayElement<T extends { _id: string }>(
  array: T[],
  _id: string
) {
  return array.reduce(
    (res, element) => (element._id === _id ? res : [...res, element]),
    []
  );
}
