
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Event, Booking } from "@/database";

export async function GET() {
    try {
        await dbConnect();

        // 1. Create a valid event
        const eventData = {
            title: "Test Event " + Date.now(),
            description: "A test event description",
            overview: "Overview of test event",
            image: "/test-image.jpg",
            venue: "Test Venue",
            location: "San Francisco, CA",
            date: "2026-12-25",
            time: "18:00",
            mode: "Offline",
            audience: "Developers",
            agenda: ["Registration", "Keynote"],
            organizer: "Test Organizer",
            tags: ["test", "db"],
        };

        const newEvent = await Event.create(eventData);

        // 2. Create a booking for this event
        const bookingData = {
            eventId: newEvent._id,
            email: "test@example.com",
        };

        const newBooking = await Booking.create(bookingData);

        // 3. Test Invalid Booking (Non-existent Event)
        let invalidBookingError = null;
        try {
            await Booking.create({
                eventId: "67aaa541116d469d878793fb", // Random ObjectId
                email: "fail@example.com",
            });
        } catch (err: any) {
            invalidBookingError = err.message;
        }

        // 4. Test Invalid Email
        let invalidEmailError = null;
        try {
            await Booking.create({
                eventId: newEvent._id,
                email: "invalid-email",
            });
        } catch (err: any) {
            invalidEmailError = err.message;
        }

        // 5. Cleanup
        await Booking.deleteMany({ _id: newBooking._id });
        await Event.deleteMany({ _id: newEvent._id });

        return NextResponse.json({
            success: true,
            createdEvent: {
                title: newEvent.title,
                slug: newEvent.slug, // Verify slug generation
                date: newEvent.date, // Verify date normalization
            },
            createdBooking: newBooking,
            invalidBookingTest: invalidBookingError === "Event does not exist" ? "passed" : `failed (${invalidBookingError})`,
            invalidEmailTest: invalidEmailError === "Invalid email format" ? "passed" : `failed (${invalidEmailError})`,
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
