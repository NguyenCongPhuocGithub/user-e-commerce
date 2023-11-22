import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import LoginContent from "@/components/LoginContent";

function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      setIsLogin(true);
      router.push("/");
    }
  }, [router]);

  return (
    <>
      {isLogin ? null : <LoginContent />}
    </>
  );
}

export default Login;