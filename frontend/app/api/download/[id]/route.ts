import { getFile } from "@/app/actions/s3";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const fileId = url.pathname.split("/").pop(); // extracts `id` from /api/download/[id]


    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })
    if (!file) {
        return new NextResponse("File not found", { status: 404 });
    }

    const s3Response = await getFile(file.uniqueName);

    const stream = s3Response.Body as ReadableStream;

    return new NextResponse(stream, {
        status: 200,
        headers: {
            "Content-Type": file.mimetype,
            "Content-Disposition": `attachment; filename="${file.originalName}"`,
        },
    });
}