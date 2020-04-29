export function updateArrayElement<T extends { _id: string }>(
  array: T[],
  updatedElement: T
) {
  return array.map(element =>
    element._id === updatedElement._id ? updatedElement : element
  );
}
