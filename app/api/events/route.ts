import dbConnect from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";


export async function POST(req: NextRequest) {
    try {
        await dbConnect();

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