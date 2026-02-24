import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const EventDetailsPage = async ({params} :{params: Promise<{slug: string}>}) => {

  const {slug} = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {event} = await request.json();

  if(!event) return notFound();


  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{event.description}</p>
      </div>

      <div className="details">

        {/* Left Side - Event Content */}

        <div className="content">
          <Image src={event.image} alt="Event Banner" height={800} width={800} className="banner"/>
        </div>

        <div className="flex-col-gap-2">
          <h2>Overview</h2>
          <p>{event.overview}</p>
        </div>

        <div className="flex-col-gap-2">
          <h2>Event Deatils</h2>
        </div>

        {/* Right Side - Event Booking */}

        <aside className="Booking">
          <p className="text-lg font-semibold">Book Event</p>
        </aside>
      </div>
    </section>
  )
}

export default EventDetailsPage
