"use client"
import React from 'react'
import LoaderLogo from './loader'
import { ModeToggle } from '@/app/components/mode-toggle'
import Link from 'next/link'

function Navbar() {
  return (
  <nav className=' flex justify-between items-center py-2 px-5 bg-white text-black fixed w-full  dark:bg-black dark:text-white'>
    <LoaderLogo/>
    <div>
    <Link href='/signin' className=''>Sign In</Link>
    <ModeToggle/>
    </div>
  </nav>
  )
}

export default Navbar