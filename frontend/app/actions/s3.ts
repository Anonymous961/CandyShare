"use server";
import prisma from "@/lib/prisma";
import { s3Client } from "@/s3config";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

interface fileType {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    name: string;
}

export async function uploadFile(file: fileType) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET!,
        Key: file.name,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        const response = await s3Client.send(command);
        let log;
        if (response.$metadata.httpStatusCode === 200) {
            log = await prisma.file.create({
                data: {
                    originalName: file.originalname,
                    uniqueName: file.name,
                    url: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            })

        }
        return { message: "uploaded", response, data: log };
    } catch (e) {
        return { error: "Upload failed", detail: e };
    }
}

export async function getFile(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET!,
        Key: key,
    });

    const response = await s3Client.send(command);
    return response;
}