export function IsNullOrEmpty(str: string): boolean {
  return str == null || str.trim().length === 0;
}
