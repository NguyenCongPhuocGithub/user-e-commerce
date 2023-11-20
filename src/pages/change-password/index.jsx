import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";

import axiosClient from "@/libraries/axiosClient";
import { toast } from "react-toastify";

function ChangePassword() {
  const validation = useFormik({
    initialValues: {
      passwordOld: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: yup.object({
      passwordOld: yup
        .string()
        .required("Mật khẩu cũ: không thể bỏ trống ")
        .test(
          "passwordOld type",
          "Mật khẩu cũ: giá trị nhập vào không hợp lệ",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),

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
        .test(
          "newPassword type",
          "Mật khẩu mới: không khớp với mật khẩu cũ",
          (value, context) => {
            if(context.parent.passwordOld){
              return value !== context.parent.passwordOld;
            };
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
            if(context.parent.newPassword){
              return value === context.parent.newPassword;
            };
          }
        )
        .min(8)
        .max(20),
    }),

    onSubmit: async (values) => {
      try {
          await axiosClient.patch(`/customers/changePassword`, values),
          toast.success("Cập nhật mật khẩu thành công")  
      } catch (error) {
          console.error(error);
          toast.error("Cập nhật mật khẩu thất bại");
      }
    },
  });

  return (
    <div>
      <form onSubmit={validation.handleSubmit}>
        <div>
          <label>
            Nhập mật khẩu cũ:
            <input
              type="text"
              placeholder="Vui lòng nhập mật khẩu cũ"
              name="passwordOld"
              value={validation.values.passwordOld}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.passwordOld && validation.touched.passwordOld && (
          <div>{validation.errors.passwordOld}</div>
        )}

        <div>
          <label>
            Mật khẩu mới:
            <input
              type="text"
              placeholder="Vui lòng nhập mật khẩu mới"
              name="newPassword"
              value={validation.values.newPassword}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.newPassword && validation.touched.newPassword && (
          <div>{validation.errors.newPassword}</div>
        )}

        <div>
          <label>
            Nhập lại mật khẩu mới:
            <input
              type="text"
              placeholder="Vui lòng nhập lại thông tin mới"
              name="confirmPassword"
              value={validation.values.confirmPassword}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.confirmPassword &&
          validation.touched.confirmPassword && (
            <div>{validation.errors.confirmPassword}</div>
          )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ChangePassword;
