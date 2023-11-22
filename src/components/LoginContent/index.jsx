// import React, { useState } from "react";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { useRouter } from "next/router";

// import InputGroup from "./InputGroup";
// import axiosClient from "../../libraries/axiosClient";
// import { toast } from "react-toastify";

// function LoginContent() {
//   const router = useRouter();

//   //Định nghĩa form Formik
//   const validation = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },

//     validationSchema: yup.object({
//       email: yup
//         .string()
//         .required("Email: Không thể bỏ trống")
//         .test("Kiểu Email", "Email: giá trị không hợp lệ", (value) => {
//           const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//           return emailRegex.test(value);
//         }),

//       password: yup.string().required("Mật khẩu: Không thể bỏ trống"),
//     }),

//     onSubmit: async (values) => {
//       try {
//         const res = await axiosClient.post("/auth/login", values);
//         const { token, refreshToken } = res.data;

//         window.localStorage.setItem("TOKEN", token);
//         window.localStorage.setItem("REFRESH_TOKEN", refreshToken);
//         axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
//         if (token) {
//           router.push("/");
//           toast.success("Đăng nhập thành công");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Thông tin đăng nhập không chính xác. Vui lòng thử lại.");
//       }
//     },
//   });

//   return (
//     <div className="container mx-auto">
//       <form
//         onSubmit={validation.handleSubmit}
//         className="flex flex-col gap-y-3 items-center p-3"
//       >
//         <div className = "flex flex-col gap-2 w-2/4">
//           <InputGroup
//             label="Email"
//             type="email"
//             name="email"
//             validation={validation}
//           />

//           <InputGroup
//             label="Mật khẩu"
//             type="password"
//             name="password"
//             validation={validation}
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default LoginContent;

import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import InputGroup from "./InputGroup";
import axiosClient from "../../libraries/axiosClient";

function LoginContent() {
  const router = useRouter();

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: yup.object({
      email: yup
        .string()
        .required("Email: Không thể bỏ trống")
        .email("Email: giá trị không hợp lệ"),

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
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={validation.handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-400 text-white rounded-lg py-2 px-4 w-full"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginContent;