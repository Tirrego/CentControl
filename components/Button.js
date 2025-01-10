import React from 'react'
import Link from 'next/link'

export default function Button() {
  return (
    <div className='flex justify-center'>
      <Link href="/add"><button className='bg-[#08B70D] left-1/2  w-44 h-16 text-5xl text-white mt-10'>+</button></Link>
        
    </div>
  )
}
