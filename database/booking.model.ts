
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Event from "./event.model";

// Interface for Booking document
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
        email: { type: String, required: true },
    },
    { timestamps: true }
);

// Pre-save hook: Validation
BookingSchema.pre("save", async function () {
    const booking = this as IBooking;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(booking.email)) {
        throw new Error("Invalid email format");
    }

    // Verify event existence
    const eventExists = await Event.exists({ _id: booking.eventId });
    if (!eventExists) {
        throw new Error("Event does not exist");
    }
});

const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
