import { memo } from "react";
import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <header className="glass sticky top-0 z-50">
      <nav className="mx-auto container flex flex-row justify-between sm:px-10 px-5 py-4">
        <Link href='/' className='logo'>
          <Image src='/icons/logo.png' alt='logo' width={24} height={24}/>
          <p>DevEvents</p>
        </Link>

        <ul className="flex flex-row items-center gap-6 list-none p-0 m-0">
          <li><Link href='/'>Home</Link></li>
          <li><Link href='/'>Events</Link></li>
          <li><Link href='/'>Create Events</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default memo(Navbar)
