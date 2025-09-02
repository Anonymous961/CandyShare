import { randomUUID } from "crypto";
import path from "path";

export function generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext).replace(/\s+/g, "-").toLowerCase();
    const unique = randomUUID();
    return `${base}-${unique}${ext}`;
}