import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database/event.model';
import { events } from '@/lib/constants'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {

  const response = await fetch(`${BASE_URL}/api/events`);

  const {events} = await response.json();

  return (
    <section className="mx-auto max-w-6xl max-h-auto">
      <h1 className='text-center'>The Hub for every Dev <br /> Event you cannot miss</h1>
      <p className='text-center mt-5'>Hackactons, Meetups, and Conferences all at one Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none p-0 m-0">
          {events && events.length > 0 && events.map((event: IEvent) => {
            return (
              <li key={event.title}>
                <EventCard {...event}/>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Home