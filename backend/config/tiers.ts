// There are 3 tiers: anonymous, free and pro

import { TIER } from "../type";

export const TIERS = {
    [TIER.ANONYMOUS]: {
        maxSize: 10 * 1024 * 1024,
        expiryHours: 24,
        password: false,
        customExpiry: false, // Cannot set custom expiry
        minExpiryHours: 24,
        maxExpiryHours: 24,
    },
    [TIER.FREE]: {
        maxSize: 200 * 1024 * 1024,
        expiryHours: 168, // 7 days
        password: false,
        customExpiry: false, // Cannot set custom expiry
        minExpiryHours: 168,
        maxExpiryHours: 168,
    },
    [TIER.PRO]: {
        maxSize: 2 * 1024 * 1024 * 1024,
        expiryHours: 720, // 30 days default
        password: true,
        customExpiry: true, // Pro users can set custom expiry
        minExpiryHours: 1, // Minimum 1 hour
        maxExpiryHours: 720, // Maximum 30 days (720 hours)
    }
}