import React from 'react'
import logo from '@/public/stylezone-logo.png'
import Image from 'next/image'


function BrandIcon() {
  return (
    <Image src={logo.src} width={40} height={40} alt={process.env.NEXT_PUBLIC_APP_NAME || 'SHOPIGO'} />

  )
}

export default BrandIcon
