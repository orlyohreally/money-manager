export function findById<T extends { _id: string }>(array: T[], id: string): T {
  return array.filter(object => object._id === id)[0];
}
