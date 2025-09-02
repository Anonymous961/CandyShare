import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/app/actions/s3"; // adjust path if needed
import { generateFileName } from "@/lib/uniqueName";

export async function GET() {
    return NextResponse.json({ message: "test" })
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uniqueName = generateFileName(file.name);

    const uploadPayload = {
        fieldname: "file",
        originalname: file.name,
        encoding: "7bit",
        mimetype: file.type,
        buffer,
        size: file.size,
        name: uniqueName
    };

    const result = await uploadFile(uploadPayload);

    return NextResponse.json(result);
}