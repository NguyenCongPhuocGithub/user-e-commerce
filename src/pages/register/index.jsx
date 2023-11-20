import RegisterContent from '@/components/RegisterContent';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

function Register() {
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
      {isLogin ? null : <RegisterContent />}
    </>
  );
}

export default Register;