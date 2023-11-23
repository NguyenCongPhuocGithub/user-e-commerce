import styles from "./Header.module.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Delivery from "../Delivery";
import HeaderLogo from "../HeaderLogo";
import NavigationBar from "../NavigationBar";
import { GiToggles } from "react-icons/gi";
import PanelHeader from "../PanelHeader";
import axiosClient from "@/libraries/axiosClient";


function Header() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [customer, setCustomer] = useState({});

  const handleShowNav = () => {
    setShowNav(!showNav);
  };

  const getMe = useCallback(async () => {
    try {
      const res = await axiosClient.get("/customers");
      setCustomer(res.data?.payload || {});
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  useEffect(() => {
    getMe();
  }, [getMe, isLogin]);

  useEffect(() => {
    if (router.isReady) {
      const token = localStorage.getItem("TOKEN");
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
      //  isLogin === true set client sử dụng token
      // sử dụng !! sử dụng hai lần phủ định - sự thay đổi của token
      setIsLogin(!!token);
    }
  });


  return (
    <header className={styles.page_header}>
      <PanelHeader customer = {customer} isLogin = {isLogin}/>
      
      <div className="container mx-auto">
        <div className={styles.header_content}>
          <button
            onClick={handleShowNav}
            className="flex justify-center md:flex lg:hidden items-center"
          >
            <GiToggles size={"40px"} color="#F6F1E6" />
          </button>
          <HeaderLogo />
          <div className="hidden md:hidden lg:flex">
            <NavigationBar />
          </div>
          <Delivery customer = {customer} isLogin = {isLogin}/>
        </div>
        {/* Build toggle */}
        {showNav && (
          <>
            <div className = {`flex md:flex lg:hidden`}>
              <NavigationBar showNav={showNav} />
            </div>
          </>
        )}
        {/* End build toggle */}
      </div>
    </header>
  );
}

export default Header;
