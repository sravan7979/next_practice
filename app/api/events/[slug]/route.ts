import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import { Event } from '@/database';
import type { IEvent } from '@/database/event.model';

type RouteContext = {
  params: {
    slug?: string;
  };
};

type ApiErrorResponse = {
  ok: false;
  message: string;
};

type EventResponse = {
  _id: string;
  title: IEvent['title'];
  slug: IEvent['slug'];
  description: IEvent['description'];
  overview: IEvent['overview'];
  image: IEvent['image'];
  venue: IEvent['venue'];
  location: IEvent['location'];
  date: IEvent['date'];
  time: IEvent['time'];
  mode: IEvent['mode'];
  audience: IEvent['audience'];
  agenda: IEvent['agenda'];
  organizer: IEvent['organizer'];
  tags: IEvent['tags'];
  createdAt: string;
  updatedAt: string;
};

type ApiSuccessResponse = {
  ok: true;
  message: string;
  event: EventResponse;
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MAX_LENGTH = 120;

function decodeAndValidateSlug(rawSlug: unknown): { ok: true; slug: string } | { ok: false; message: string } {
  if (typeof rawSlug !== 'string') {
    return { ok: false, message: 'Missing slug parameter.' };
  }

  // Route params are URL-encoded; decode safely to avoid throwing.
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    return { ok: false, message: 'Invalid slug encoding.' };
  }

  const slug = decoded.trim().toLowerCase();

  if (!slug) {
    return { ok: false, message: 'Slug is required.' };
  }

  if (slug.length > SLUG_MAX_LENGTH) {
    return { ok: false, message: `Slug is too long (max ${SLUG_MAX_LENGTH} characters).` };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.',
    };
  }

  return { ok: true, slug };
}

/**
 * GET /api/events/[slug]
 * Fetch a single event by its unique slug.
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  const parsed = decodeAndValidateSlug(context?.params?.slug);
  if (!parsed.ok) {
    return NextResponse.json<ApiErrorResponse>({ ok: false, message: parsed.message }, { status: 400 });
  }

  try {
    await dbConnect();

    // Use `.exec()` for better typing and predictable behavior.
    const eventDoc = await Event.findOne({ slug: parsed.slug }).exec();

    if (!eventDoc) {
      return NextResponse.json<ApiErrorResponse>(
        { ok: false, message: 'Event not found.' },
        { status: 404 }
      );
    }

    // Build a JSON-safe, stable response shape (ObjectId/Date -> string).
    const event: EventResponse = {
      _id: eventDoc._id.toString(),
      title: eventDoc.title,
      slug: eventDoc.slug,
      description: eventDoc.description,
      overview: eventDoc.overview,
      image: eventDoc.image,
      venue: eventDoc.venue,
      location: eventDoc.location,
      date: eventDoc.date,
      time: eventDoc.time,
      mode: eventDoc.mode,
      audience: eventDoc.audience,
      agenda: eventDoc.agenda,
      organizer: eventDoc.organizer,
      tags: eventDoc.tags,
      createdAt: eventDoc.createdAt.toISOString(),
      updatedAt: eventDoc.updatedAt.toISOString(),
    };

    return NextResponse.json<ApiSuccessResponse>(
      { ok: true, message: 'Event fetched successfully.', event },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Avoid leaking internals; keep logs server-side.
    console.error('GET /api/events/[slug] failed:', error);

    // Handle common Mongoose errors explicitly (validation/cast, etc.).
    if (error instanceof Error) {
      const name = (error as { name?: string }).name;
      if (name === 'ValidationError' || name === 'CastError') {
        return NextResponse.json<ApiErrorResponse>(
          { ok: false, message: 'Invalid request.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json<ApiErrorResponse>(
      { ok: false, message: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
