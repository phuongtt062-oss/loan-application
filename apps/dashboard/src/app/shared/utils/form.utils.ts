export function createFormFieldId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}
