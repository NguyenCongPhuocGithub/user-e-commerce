import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

import axiosClient from "../../libraries/axiosClient";
import IsLoadingSmall from "../IsLoadingSmall";
import useForgotPassword from "../../hooks/useForgotPassword";

function ForgotPasswordContent() {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState({
    sendVerificationCode: false,
    resendVerificationCode: false,
    confirmVerificationCode: false,
  });

  const [openModal, setOpenModal] = useState(false);
  const forgotPassword = useForgotPassword((state) => state.forgotPassword);
  const setForgotPassword = useForgotPassword(
    (state) => state.setForgotPassword
  );

  const validation = useFormik({
    initialValues: {
      email: "",
      confirmVerificationCode: "",
    },

    validationSchema: yup.object({
      email: yup
        .string()
        .required("Email: Không thể bỏ trống")
        .email("Email: giá trị không hợp lệ"),

      confirmVerificationCode: yup.string(),
    }),

    onSubmit: async (values) => {
      try {
        setIsButtonDisabled((prev) => ({
          ...prev,
          sendVerificationCode: true,
        }));

        const valuesGetVerifiCode = {
          email: values.email,
          typeAPI: "ForgotPassword",
        };

        const getVerificode = await axiosClient.post(
          "/verifications/verificationMail",
          valuesGetVerifiCode
        );

        if (getVerificode.status === 201) {
          toast.success("Vui lòng truy cập gmail lấy mã xác thực");
          setOpenModal(true);
          setIsButtonDisabled((prev) => ({
            ...prev,
            sendVerificationCode: false,
          }));
          return;
        }
      } catch (error) {
        setIsButtonDisabled(false);
        if (error.response) {
          // Lỗi trả về từ API
          const errorMessage = error.response.data.error;
          toast.error(errorMessage);
          if (error.response.data.expirationTime) {
            // set confirmVerificationCode bằng rỗng để thực hiện truyền dữ gọi lại API lấy mã
            validation.setValues((prev) => ({
              ...prev,
              confirmVerificationCode: "",
            }));
          }
        } else {
          toast.error("Đăng ký thông tin thất bại");
        }
      }
    },
  });

  const handleVerifiCode = async (values) => {
    try {
      setIsButtonDisabled((prev) => ({
        ...prev,
        confirmVerificationCode: true,
      }));

      if (openModal && !values.confirmVerificationCode) {
        toast.warning("Vui lòng nhập mã xác thực");
        setIsButtonDisabled(false);
        return;
      }

      const valuesGetVerifiCode = {
        email: values.email,
        confirmVerificationCode: values.confirmVerificationCode,
        typeAPI: "ForgotPassword",
      };

      const getVerificode = await axiosClient.post(
        "/verifications/verificationMail",
        valuesGetVerifiCode
      );

      if (getVerificode.status === 200) {
        toast.success(getVerificode.data.message);
        setForgotPassword(() => ({
          email: values.email,
          flag: false
        }));

        router.push("/change-forgot-password");
        setIsButtonDisabled((prev) => ({
          ...prev,
          confirmVerificationCode: false,
        }));
        setOpenModal(false);
        setIsButtonDisabled((prev) => ({
          ...prev,
          resendVerificationCode: false,
        }));
      }
    } catch (error) {
      setIsButtonDisabled((prev) => ({
        ...prev,
        confirmVerificationCode: false,
      }));
      if (error.response) {
        // Lỗi trả về từ API
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        if (error.response.data.expirationTime) {
          // set confirmVerificationCode bằng rỗng để thực hiện truyền dữ gọi lại API lấy mã
          validation.setValues((prev) => ({
            ...prev,
            confirmVerificationCode: "",
          }));

          setIsButtonDisabled((prev) => ({
            ...prev,
            resendVerificationCode: true,
          }));
        }
      } else {
        toast.error("Lấy lại mật khẩu thất bại");
      }
    }
  };

  const handleResendVerifiCode = async (values) => {
    try {

      const valuesGetVerifiCode = {
        email: values.email,
        typeAPI: "ForgotPassword",
      };

      const getVerificode = await axiosClient.post(
        "/verifications/verificationMail",
        valuesGetVerifiCode
      );

      if (getVerificode.status === 201) {
        setIsButtonDisabled((prev) => ({
          ...prev,
          resendVerificationCode: false,
        }));
        toast.success("Lấy lại mã xác thực thành công");
        setOpenModal(true);
        return;
      }

    } catch (error) {
      if (error.response) {
        // Lỗi trả về từ API
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        if (error.response.data.expirationTime) {
          // set confirmVerificationCode bằng rỗng để thực hiện truyền dữ gọi lại API lấy mã
          validation.setValues((prev) => ({
            ...prev,
            confirmVerificationCode: "",
          }));

          setIsButtonDisabled((prev) => ({
            ...prev,
            resendVerificationCode: true,
          }));
        }
      } else {
        toast.error("Lấy lại thông tin mã thất bại");
      }
    }
  };

  useEffect(() => {
    validation.setValues((prev) => ({
      ...prev,
      confirmVerificationCode: "",
    }));
  }, [openModal]);

  return (
    <div
      className="flex justify-center items-center bg-gray-100 p-10"
      style={{
        backgroundImage:
          "url('https://jollibee.com.vn/static/version1698938216/frontend/Jollibee/default/vi_VN/Levinci_Widget/images/jollibee-kid-party-bg.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-lg md:text-lg lg:text-2xl">
        <h2 className="text-4xl font-semibold mb-6 text-center">
          Lấy lại mật khẩu
        </h2>
        <form onSubmit={validation.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-bold">Email:</label>
            <input
              type="email"
              placeholder="Vui lòng nhập email"
              name="email"
              value={validation.values.email}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
            />
            {validation.errors.email && validation.touched.email && (
              <div className="text-red-500 mt-1">{validation.errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-400 text-white rounded-lg py-2 px-4 w-full"
            disabled={isButtonDisabled.sendVerificationCode}
          >
            {isButtonDisabled.sendVerificationCode ? (
              <div className={`flex justify-center items-center gap-2`}>
                <IsLoadingSmall />
                {!validation.confirmVerificationCode ? (
                  <p>Gửi mã xác thực Email</p>
                ) : (
                  <p>Xác thực Email</p>
                )}
              </div>
            ) : (
              <p>Xác thực Email</p>
            )}
          </button>
        </form>
      </div>

      <Transition show={openModal} as={React.Fragment}>
        <Dialog
          onClose={() => setOpenModal(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:opacity-100"
              enterTo="opacity-100 translate-y-0 sm:opacity-100 sm:translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:opacity-100 sm:translate-y-0"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <Dialog.Title
                  className="text-lg text-center font-medium text-gray-900 mb-4"
                  style={{ fontSize: "35px" }}
                >
                  Xác thực email
                </Dialog.Title>
                <div className="mb-4 text-lg md:text-lg lg:text-xl flex flex-col gap-y-2">
                  <p style={{ fontSize: "30px" }}>
                    Nhập mã xác thực{" "}
                    <strong className="text-yellow-500">
                      {validation.values.email}
                    </strong>
                  </p>
                  <div>
                    <input
                      type="text"
                      placeholder="Vui lòng nhập mã xác thực"
                      name="confirmVerificationCode"
                      value={validation.values.confirmVerificationCode}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
                    />
                    {validation.errors.confirmVerificationCode &&
                      validation.touched.confirmVerificationCode && (
                        <div className="text-red-500 mt-1">
                          {validation.errors.confirmVerificationCode}
                        </div>
                      )}
                  </div>
                  {isButtonDisabled.resendVerificationCode ? (
                    <div className="flex justify-start gap-x-1">
                      <p>Gửi lại mã </p>
                      <button onClick={() => handleResendVerifiCode(validation.values)} className="text-blue-500">tại đây</button>
                    </div>
                  ) : null}
                </div>
                <div className="text-center text-lg md:text-lg lg:text-2xl">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-400 text-white rounded-lg py-2 px-4 w-full"
                    disabled={isButtonDisabled.confirmVerificationCode}
                    onClick= {() => handleVerifiCode(validation.values)}
                  >
                    {isButtonDisabled.confirmVerificationCode ? (
                      <div className={`flex justify-center items-center gap-2`}>
                        <IsLoadingSmall />
                        {isButtonDisabled.confirmVerificationCode ? (
                          <p>Đang xác thực</p>
                        ) : (
                          <p>Xác thực Email</p>
                        )}
                      </div>
                    ) : (
                      <p>Xác thực Email</p>
                    )}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default ForgotPasswordContent;
