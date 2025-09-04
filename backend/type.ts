export type File = {
    originalName: string,
    uniqueName: string,
    url: string, // or construct full S3 URL if you prefer
    mimetype: string,
    size: number,
    uploadedAt: Date,
    expiresAt: Date,
    status: STATUS,
    userId: string | null,
    tier: TIER,
    password: string | null,
    downloadCount: number,
    lastDownloadedAt: Date | null
}

export enum STATUS {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    DELETED = "DELETED"
}

export enum TIER {
    ANONYMOUS = "anonymous",
    FREE = "free",
    PRO = "pro"
}