import axiosClient from "@/libraries/axiosClient";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import decodeToken from "@/libraries/tokenDecoding";

const withTokenCheckFunction = (func, redirectPage) => {
  const router = useRouter();

  return async (...args) => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem("TOKEN");
      const refreshToken = localStorage.getItem("REFRESH_TOKEN");

      if (!token) {
        if (redirectPage) {
          router.push(redirectPage);
        } else {
          router.push("/login");
        }
        toast.error("Vui lòng đăng nhập");
      } else {
        const decodedPayloadToken = decodeToken(token);
        if (decodedPayloadToken.exp < Date.now() / 1000) {
          if (!refreshToken) {
            if (redirectPage) {
              router.push(redirectPage);
            } else {
              router.push("/login");
            }
            toast.error("Vui lòng đăng nhập");
            return;
          }
          const decodedPayloadRefreshToken = decodeToken(refreshToken);
          if (decodedPayloadRefreshToken.exp >= Date.now() / 1000) {
            try {
              const res = await axiosClient.post("/auth/refresh-token", {
                refreshToken,
              });

              const newToken = res.data.token;
              localStorage.setItem("TOKEN", newToken);
              axiosClient.defaults.headers.Authorization = `Bearer ${newToken}`;
            } catch (error) {
              console.error("Error refreshing token:", error);
            }
          } else {
            if (redirectPage) {
              router.push(redirectPage);
            } else {
              router.push("/login");
            }
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
          }
        } else {
          axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
        }
      }

      useEffect(() => {
        checkAndRefreshToken();
      }, [redirectPage]);

    };

    // Thực hiện hàm được bọc nếu có token
    return await func(...args);
  };
};

export default withTokenCheckFunction;


