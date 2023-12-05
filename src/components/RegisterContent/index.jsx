import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// import InputGroup from "./InputGroup";
import axiosClient from "../../libraries/axiosClient";
import IsLoadingSmall from "../IsLoadingSmall";

function RegisterContent() {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validation = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      // birthday: "",
    },

    validationSchema: yup.object({
      firstName: yup
        .string()
        .required("Họ: Không thể bỏ trống")
        .max(50, "Họ: Không thể vượt quá 50 ký tự"),
      lastName: yup
        .string()
        .required("Tên: Không thể bỏ trống")
        .max(50, "Tên: Không thể vượt quá 50 ký tự"),
      email: yup
        .string()
        .required("Email: Không thể bỏ trống")
        .email("Email: giá trị không hợp lệ"),
      password: yup
        .string()
        .required("Mật khẩu: Không thể bỏ trống")
        .test(
          "Kiểu mật khẩu",
          "Mật khẩu: Giá trị không hợp lệ, ít nhất 8 ký tự, viết hoa chữ cái đầu, có ký tự đặc biệt",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),
      phoneNumber: yup
        .string()
        .required("Số điện thoại: không thể bỏ trống")
        .test("Kiểu số điện thoại", "Số điện thoại không hợp lệ", (value) => {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }),
        // birthday: yup
        // .date()
        // .test("birthday type", "Ngày sinh không khả dụng", (value) => {
        //   if (value) {
        //     return value < Date.now();
        //   }else{
        //     return true;
        //   }
        // }),
    }),

    onSubmit: async (values) => {
      try {
        setIsButtonDisabled(true);
        await axiosClient.post("/auth/register", values);
        router.push("/");
        toast.success("Đăng ký thành công");
      } catch (error) {
        console.error(error);
        setIsButtonDisabled(false);
        if (error.response) {
          // Lỗi trả về từ API
          const errorMessage = error.response.data.error;
          toast.error(errorMessage);
        } else {
          toast.error("Đăng ký thông tin thất bại");
        }
      }
    },
  });

  return (
    <div 
    className="flex justify-center items-center bg-gray-100 p-10"
    style={{
      backgroundImage: "url('https://jollibee.com.vn/static/version1698938216/frontend/Jollibee/default/vi_VN/Levinci_Widget/images/jollibee-kid-party-bg.png')",
      backgroundSize: "cover"
    }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-lg md:text-lg lg:text-2xl">
        <h2 className="text-4xl font-semibold mb-6 text-center">Đăng ký</h2>
        <form onSubmit={validation.handleSubmit} className="space-y-4">
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Họ" name="firstName" validation={validation} />

            <InputGroup label="Tên" name="lastName" validation={validation} />
          </div> */}

          {/* <InputGroup
            label="Email"
            type="email"
            name="email"
            validation={validation}
          />

          <InputGroup
            label="Số điện thoại"
            name="phoneNumber"
            validation={validation}
          />

          <InputGroup
            label="Mật khẩu"
            type="password"
            name="password"
            validation={validation}
          />

          <InputGroup
            label="Ngày sinh"
            name="birthday"
            type="date"
            validation={validation}
          /> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700 font-bold">Họ</label>
              <input
                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                type="text"
                placeholder="Vui lòng nhập họ"
                name="firstName"
                value={validation.values.firstName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
              {validation.errors.firstName && validation.touched.firstName && (
                <div className="text-red-500 mt-1">
                  {validation.errors.firstName}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-bold">Tên</label>
              <input
                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                type="text"
                placeholder="Vui lòng nhập tên"
                name="lastName"
                value={validation.values.lastName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
              {validation.errors.lastName && validation.touched.lastName && (
                <div className="text-red-500 mt-1">
                  {validation.errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-bold">Email</label>
            <input
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
              type="email"
              placeholder="Vui lòng nhập email"
              name="email"
              value={validation.values.email}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.errors.email && validation.touched.email && (
              <div className="text-red-500 mt-1">{validation.errors.email}</div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-bold">Mật khẩu</label>
            <input
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              name="password"
              value={validation.values.password}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.errors.password && validation.touched.password && (
              <div className="text-red-500 mt-1">
                {validation.errors.password}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-bold">Số điện thoại</label>
            <input
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
              type="text"
              placeholder="Vui lòng nhập số điện thoại"
              name="phoneNumber"
              value={validation.values.phoneNumber}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.errors.phoneNumber && validation.touched.phoneNumber && (
              <div className="text-red-500 mt-1">
                {validation.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* <div>
            <label className="block mb-1 text-gray-700 font-bold">Ngày sinh</label>
            <input
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
              type="date"
              placeholder="Vui lòng nhập số ngày sinh"
              name="birthday"
              value={validation.values.birthday}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.errors.birthday && validation.touched.birthday && (
              <div className="text-red-500 mt-1">
                {validation.errors.birthday}
              </div>
            )}
          </div> */}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-400 text-white rounded-lg py-2 px-4 w-full"
              disabled={isButtonDisabled}
            >
            {isButtonDisabled ? (
              <div className={`flex justify-center items-center gap-2`}>
                <IsLoadingSmall />
                <p>Đăng ký</p>
              </div>
            ) : (
              <p>Đăng ký</p>
            )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterContent;
