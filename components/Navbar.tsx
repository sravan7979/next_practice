'use client'

import { memo } from "react";
import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"

const Navbar = () => {
  const handleNavLinkClick = (linkName: string, linkHref: string) => {
    posthog.capture('nav_link_clicked', {
      link_name: linkName,
      link_href: linkHref,
      nav_location: 'header',
    });
  };

  return (
    <header className="glass sticky top-0 z-50">
      <nav className="mx-auto container flex flex-row justify-between sm:px-10 px-5 py-4">
        <Link href='/' className='logo' onClick={() => handleNavLinkClick('Logo', '/')}>
          <Image src='/icons/logo.png' alt='logo' width={24} height={24}/>
          <p>DevEvents</p>
        </Link>

        <ul className="flex flex-row items-center gap-6 list-none p-0 m-0">
          <li><Link href='/' onClick={() => handleNavLinkClick('Home', '/')}>Home</Link></li>
          <li><Link href='/' onClick={() => handleNavLinkClick('Events', '/')}>Events</Link></li>
          <li><Link href='/' onClick={() => handleNavLinkClick('Create Events', '/')}>Create Events</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default memo(Navbar)
