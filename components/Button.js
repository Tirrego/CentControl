import React from 'react'
import Link from 'next/link'

export default function Button() {
  return (
    <div className='flex justify-center'>
      <Link href="/add"><button className='bg-green-600 fixed bottom-5 left-1/2 transform -translate-x-1/2 w-16 h-16 text-3xl text-white'>+</button></Link>
        
    </div>
  )
}
