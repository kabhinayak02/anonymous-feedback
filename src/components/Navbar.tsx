'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  /*
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">Secret Message</a>
        {
          session ? (
            <>
              <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
              <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className='w-full md:w-auto'>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
  */

  return (
    <nav className='bg-[#212A31]/95 backdrop-blur-sm border-b border-[#748D92]/10 p-4 md:p-6 shadow-lg shadow-black/10 sticky top-0 z-50'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a 
          className="text-xl font-bold mb-4 md:mb-0 text-[#D3D9D4] hover:text-[#124E66] 
          transition-colors duration-200 flex items-center space-x-2" 
          href="#"
        >
          {/* You can add an icon here */}
          <span>Secret Message</span>
        </a>
        
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <span className='text-[#D3D9D4] bg-[#2E3944] py-2 px-4 rounded-lg border border-[#748D92]/20'>
              Welcome, {user?.username || user?.email}
            </span>
            <Button 
              className='w-full md:w-auto bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] 
              transition-all duration-200 shadow-md hover:shadow-[#124E66]/20 
              border border-[#748D92]/20 hover:border-[#124E66]
              px-6 py-2 rounded-lg font-medium' 
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in" className="w-full md:w-auto">
            <Button 
              className='w-full md:w-auto bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] 
              transition-all duration-200 shadow-md hover:shadow-[#124E66]/20 
              border border-[#748D92]/20 hover:border-[#124E66]
              px-6 py-2 rounded-lg font-medium'
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar