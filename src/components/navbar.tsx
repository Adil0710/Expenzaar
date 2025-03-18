"use client"
import React from 'react'
import LoaderLogo from './loader'
import { ModeToggle } from '@/app/components/mode-toggle'
import Link from 'next/link'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'

function Navbar() {
  return (
  <nav className=' flex justify-between items-center py-2 px-5 bg-white/20 backdrop-blur-xs text-black fixed w-full  dark:bg-black dark:text-white'>
    <LoaderLogo/>
    <div>
    <Link href='/signin' className=''>Sign In</Link>
    <ModeToggle/>
    <Button onClick={() => signOut()}>Log Out</Button>
    </div>
  </nav>
  )
}

export default Navbar