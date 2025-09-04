// There are 3 tiers: anonymous, free and pro

import { TIER } from "../type";

export const TIERS = {
    [TIER.ANONYMOUS]: {
        maxSize: 10 * 1024 * 1024,
        expiryHours: 24,
        password: false,
    },
    [TIER.FREE]: {
        maxSize: 200 * 1024 * 1024,
        expiryHours: 24,
        password: false,
    },
    [TIER.PRO]: {
        maxSize: 2 * 1024 * 1024 * 1024,
        expiryHours: 720,
        password: true,
    }
}