export function compare(a: number, b: number, isAsc: boolean): number;
export function compare(a: string, b: string, isAsc: boolean): number;
export function compare(a: Date, b: Date, isAsc: boolean): number;

export function compare(
  a: number | string | Date,
  b: number | string | Date,
  isAsc: boolean
): number {
  return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
}
