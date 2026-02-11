
import mongoose, { Schema, Document, Model, CallbackError } from "mongoose";

// Interface for Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        overview: { type: String, required: true },
        image: { type: String, required: true },
        venue: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        mode: { type: String, required: true },
        audience: { type: String, required: true },
        agenda: { type: [String], required: true },
        organizer: { type: String, required: true },
        tags: { type: [String], required: true },
    },
    { timestamps: true }
);

// Pre-save hook: Generate slug, validate/normalize date
EventSchema.pre("save", function (next: (err?: CallbackError) => void) {
    const event = this as IEvent;

    // Generate slug if title is modified
    if (event.isModified("title")) {
        event.slug = event.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }

    // Normalize date to ISO string if modified (basic validation)
    if (event.isModified("date")) {
        const parsedDate = new Date(event.date);
        if (isNaN(parsedDate.getTime())) {
            return next(new Error("Invalid date format"));
        }
        event.date = parsedDate.toISOString();
    }

    // Validate time format (HH:MM)
    if (event.isModified("time")) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(event.time)) {
            return next(new Error("Invalid time format (HH:MM)"));
        }
    }

    next();
});

const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
