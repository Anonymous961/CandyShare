export function isValidUserId(userId: string): boolean {
    return userId.length === 24 && /^[0-9a-fA-F]+$/.test(userId);
}