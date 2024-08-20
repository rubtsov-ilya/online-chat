import { Outlet } from 'react-router-dom';

import { FC } from 'react';

import Header from './header/Header.tsx';

const Layout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
