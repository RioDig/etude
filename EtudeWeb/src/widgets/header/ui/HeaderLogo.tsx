import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/shared/assets/images/logo/logo.svg'

export const HeaderLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src={Logo} alt={'logo'} />
    </Link>
  )
}
