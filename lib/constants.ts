export type Event = {
  title: string
  image: string
  slug: string
  location: string
  date: string
  time: string
}

export const events: Event[] = [
  {
    title: 'React Summit 2026 — Amsterdam',
    image: '/images/event1.png',
    slug: 'react-summit-amsterdam-2026',
    location: 'Amsterdam, Netherlands',
    date: '2026-04-17',
    time: '09:00',
  },
  {
    title: 'Google I/O Extended 2026 — Community Meetup',
    image: '/images/event2.png',
    slug: 'google-io-extended-2026-community-meetup',
    location: 'San Francisco, CA',
    date: '2026-05-13',
    time: '18:30',
  },
  {
    title: 'JSConf EU 2026 — Berlin',
    image: '/images/event3.png',
    slug: 'jsconf-eu-2026-berlin',
    location: 'Berlin, Germany',
    date: '2026-06-20',
    time: '10:00',
  },
  {
    title: 'PyCon US 2026 — Pittsburgh',
    image: '/images/event4.png',
    slug: 'pycon-us-2026-pittsburgh',
    location: 'Pittsburgh, PA',
    date: '2026-05-01',
    time: '09:00',
  },
  {
    title: 'Hack the Future 2026 (48-hour Hackathon)',
    image: '/images/event5.png',
    slug: 'hack-the-future-2026',
    location: 'Austin, TX',
    date: '2026-03-07',
    time: '10:00',
  },
  {
    title: 'Kubernetes Community Day 2026',
    image: '/images/event6.png',
    slug: 'kubernetes-community-day-2026',
    location: 'Bengaluru, India',
    date: '2026-08-22',
    time: '09:30',
  },
]
