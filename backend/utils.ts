export function isValidUserId(userId: string): boolean {
    // CUID format: 25 characters, starts with 'c', contains alphanumeric characters
    return userId.length === 25 && userId.startsWith('c') && /^[0-9a-zA-Z]+$/.test(userId);
}