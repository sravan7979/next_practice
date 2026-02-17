import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';
import { Event } from "@/database";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        }
        catch (e) {
            return NextResponse.json(
                { message: "Invalid form entries", error: e instanceof Error ? e.message : "Unknown" },
                { status: 400 }
            );
        }

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({message: 'Image is Required'}, {status: 400});

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, result) => {
                if(error) return reject(error);
                return resolve(result);
            }).end(buffer)
        })

        event.image = (uploadResult as {secure_url: string}).secure_url;
        const createdEvent = await Event.create(event);

        return NextResponse.json(
            { ok: true, message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    }
    catch (e) {
        console.error(e);

        return NextResponse.json(
            { message: "Unable to save the event", error: e instanceof Error ? e.message : 'Unable to save' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: "Events fetched Succesfully", events}, {status: 201});
    }
    catch (e) {
        return NextResponse.json({message: "Unable to fetch Events", error: e}, {status: 500})
    }
}