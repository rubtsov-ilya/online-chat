import { Outlet } from "react-router-dom";
import Header from "./header/Header.tsx";
import { FC } from "react";

const Layout: FC = () => {
  return (
    <>
      <Header />
        <Outlet />
    </>
  )
}

export default Layout