export function createId(prefix = 'item'): string {
    const randomPart = Math.random().toString(36).slice(2, 10);
    return `${prefix}-${randomPart}`;
}