import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import Head from "next/head";

import axiosClient from "@/libraries/axiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import IsLoadingSmall from "@/components/IsLoadingSmall";
import useForgotPassword from "../../hooks/useForgotPassword";

function ChangeForgotPassword() {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const forgotPassword = useForgotPassword((state) => state.forgotPassword);
  const setForgotPassword = useForgotPassword(
    (state) => state.setForgotPassword
  );

  const validation = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: yup.object({
      newPassword: yup
        .string()
        .required("Mật khẩu mới: không thể bỏ trống")
        .test(
          "newPassword type",
          "Mật khẩu mới: viết hoa ký tự đầu, mật khẩu ít nhất 8 ký tự, có ký tự đặc biệt",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),

      confirmPassword: yup
        .string()
        .required("Nhập lại mật khẩu mới: không được bỏ trống")
        .test(
          "confirmPassword type",
          "Nhâp lại mật khẩu mới: viết hoa ký tự đầu, mật khẩu ít nhất 8 ký tự, có ký tự đặc biệt",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .test(
          "confirmPassword type",
          "Nhâp lại mật khẩu mới: không khớp với mật khẩu mới",
          (value, context) => {
            if (context.parent.newPassword) {
              return value === context.parent.newPassword;
            }
          }
        )
        .min(8)
        .max(20),
    }),

    onSubmit: async (values) => {
      try {
        setIsButtonDisabled(true);
        const valuesForgotPassword = {
            email: forgotPassword.email,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        };
        await axiosClient.patch(`/customers/forgotPassword`, valuesForgotPassword),
        router.push("/");
        setForgotPassword((prev) => ({
          ...prev,
          flag: true,
          email: "",
        }));
        toast.success("Cập nhật mật khẩu thành công");
      } catch (error) {
        console.error(error);
        setIsButtonDisabled(false);
        if (error.response) {
          // Lỗi trả về từ API
          const errorMessage = error.response.data.error;
          toast.error(errorMessage);
        } else {
          toast.error("Cập nhật mật khẩu thất bại");
        }
      }
    },
  });

  useEffect(() => {
    setForgotPassword((prev) => ({
      ...prev,
      flag: true,
      email: "",
    }));
    
    if (forgotPassword.flag) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Thay đổi mật khẩu</title>
        <meta name="description" content="Thay đổi mật khẩu Jollibee" />
        <meta name="viewport" content="Thay đổi mật khẩu Jollibee" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {forgotPassword.flag ? null : (
        <div
          className="flex items-center justify-center shadow-md bg-gray-100 py-8"
          style={{
            backgroundImage:
              "url('https://jollibee.com.vn/static/version1698938216/frontend/Jollibee/default/vi_VN/Levinci_Widget/images/jollibee-kid-party-bg.png')",
            backgroundSize: "cover",
          }}
        >
          <form
            onSubmit={validation.handleSubmit}
            className="max-w-xl w-3/4 mx-auto bg-white p-6 rounded-lg text-base md:text-lg lg:text-xl"
          >
            <div className="mb-4">
              <label htmlFor="newPassword" className="block font-bold mb-1">
                Mật khẩu mới:
              </label>
              <input
                type="password" // Sử dụng type="password" để ẩn mật khẩu
                id="newPassword"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Vui lòng nhập mật khẩu mới"
                name="newPassword"
                value={validation.values.newPassword}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                autoComplete="off" // Tắt gợi ý nhập
              />
            </div>
            {validation.errors.newPassword &&
              validation.touched.newPassword && (
                <div className="text-red-500 mb-4">
                  {validation.errors.newPassword}
                </div>
              )}

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-bold mb-1">
                Nhập lại mật khẩu mới:
              </label>
              <input
                type="password" // Sử dụng type="password" để ẩn mật khẩu
                id="confirmPassword"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Vui lòng nhập lại thông tin mới"
                name="confirmPassword"
                value={validation.values.confirmPassword}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                autoComplete="off" // Tắt gợi ý nhập
              />
            </div>
            {validation.errors.confirmPassword &&
              validation.touched.confirmPassword && (
                <div className="text-red-500 mb-4">
                  {validation.errors.confirmPassword}
                </div>
              )}

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded w-full"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? (
                <div className={`flex justify-center items-center gap-2`}>
                  <IsLoadingSmall />
                  <p>Thay đổi mật khẩu</p>
                </div>
              ) : (
                <p>Thay đổi mật khẩu</p>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChangeForgotPassword;
