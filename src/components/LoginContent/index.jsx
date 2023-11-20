import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import InputGroup from "./InputGroup";
import axiosClient from "../../libraries/axiosClient";
import { toast } from "react-toastify";

function LoginContent() {
  const router = useRouter();

    //Định nghĩa form Formik
    const validation = useFormik({
      initialValues: {
        email: "",
        password: "",
      },

      validationSchema: yup.object({
        email: yup
          .string()
          .required("Email: Không thể bỏ trống")
          .test("Kiểu Email", "Email: giá trị không hợp lệ", (value) => {
            const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value);
          }),

        password: yup.string().required("Mật khẩu: Không thể bỏ trống"),
      }),

      onSubmit: async (values) => {
        try {
          const res = await axiosClient.post("/auth/login", values);
          const { token, refreshToken } = res.data;

          window.localStorage.setItem("TOKEN", token);
          window.localStorage.setItem("REFRESH_TOKEN", refreshToken);
          axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
          if (token) {
            router.push("/");
            toast.success("Đăng nhập thành công");
          }
        } catch (error) {
            console.error(error);
            toast.error("Thông tin đăng nhập không chính xác. Vui lòng thử lại.");
        }
      },
    });

    return (
      <div>
        <form onSubmit={validation.handleSubmit} className="flex flex-col">
          <InputGroup
            label="Email"
            type="email"
            name="email"
            validation={validation}
          />

          <InputGroup
            label="Mật khẩu"
            type="password"
            name="password"
            validation={validation}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    );
}

export default LoginContent;
