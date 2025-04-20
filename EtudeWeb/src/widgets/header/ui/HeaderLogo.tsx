import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/shared/assets/images/logo/logo.svg'

export const HeaderLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">

      {/*<div className="text-blue-500 text-b1 font-bold">Logo</div>*/}
      <img src={Logo} alt={'logo'} />
    </Link>
  );
};