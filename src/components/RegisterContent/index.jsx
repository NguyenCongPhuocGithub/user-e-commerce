import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

import InputGroup from './InputGroup';
import axiosClient from '../../libraries/axiosClient';
import { toast } from 'react-toastify';

function RegisterContent() {
  const router = useRouter();
  
    //Định nghĩa form Formik
    const validation = useFormik({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        birthday: '',
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
        .test("Kiểu Email", "Email: giá trị không hợp lệ", (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
  
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
        .test(
          "Kiểu số điện thoại",
          "Số điện thoại không hợp lệ",
          (value) => {
            const phoneRegex =
              /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

            return phoneRegex.test(value);
          }
        ),
        
        birthday: yup
        .date(),
      }),
  
      onSubmit: async(values) => {
        try {
            await axiosClient.post("/auth/register", values);
            router.push("/");
            
            toast.success("Đăng kí thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đăng kí thông tin thất bại");
        }
      },
    });
  
    return (
      <div>
        <form onSubmit={validation.handleSubmit} className="flex flex-col" >
        <InputGroup
            label="Họ"
            name="firstName"
            validation={validation}
          />

          <InputGroup
            label="Tên"
            name="lastName"
            validation={validation}
          />

          <InputGroup
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
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
}

export default RegisterContent;
