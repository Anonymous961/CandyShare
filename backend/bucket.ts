import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const clientParams = getClientParams();
const client = new S3Client(clientParams);

export function getClientParams() {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY must be set");
    }

    return {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    };
}

export async function getObjectUrl(key: string): Promise<string> {
    if (!process.env.AWS_BUCKET_NAME) {
        throw new Error("AWS_BUCKET_NAME must be set");
    }

    const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
}


export async function getSignedUrlFromBucket(key: string, type: string): Promise<string> {
    if (!process.env.AWS_BUCKET_NAME) {
        throw new Error("AWS_BUCKET_NAME must be set");
    }

    const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: type
    };

    const command = new PutObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
}