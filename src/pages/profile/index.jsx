import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "moment";

import styles from "../styles/Profile.module.css";
import axiosClient from "@/libraries/axiosClient";
import axios from "axios";
import withTokenCheckComponent from "../../../middleware/withTokenCheckComponent";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validation = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthday: "",
      provinceCode: 0,
      provinceName: "",
      districtCode: 0,
      districtName: "",
      wardCode: "",
      wardName: "",
      address: "",
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

      phoneNumber: yup
        .string()
        .required("Số điện thoại: không thể bỏ trống")
        .test("Kiểu số điện thoại", "Số điện thoại không hợp lệ", (value) => {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

      birthday: yup.date().nullable(),

      provinceCode: yup.number().required("Tỉnh: Không thể bỏ trống"),

      provinceName: yup
        .string()
        .max(50, "provinceName: cannot exceed 50 characters"),

      districtCode: yup
        .number()
        .required("Quận: Không thể bỏ trống")
        .test(
          "districtCode type",
          "Mã quận: vui lòng chọn mã tỉnh trước",
          (value, context) => {
            if (context.parent.provinceCode) {
              return true;
            }
          }
        ),

      districtName: yup
        .string()
        .max(50, "districtName: cannot exceed 50 characters"),

      wardCode: yup
        .string()
        .max(500, "wardCode: cannot exceed 50 characters")
        .required("Phường: Không thể bỏ trống")
        .test(
          "wardCode type",
          "Mã phường: vui lòng chọn mã quận trước",
          (value, context) => {
            if (context.parent.districtCode) {
              return true;
            }
          }
        ),

      wardName: yup.string().max(500, "wardName: cannot exceed 50 characters"),

      address: yup.string().max(500, "address: cannot exceed 500 characters"),
    }),

    onSubmit: async (values) => {
      try {
        setIsButtonDisabled(true);
        await axiosClient.patch("/customers", values);
        router.push("/");
        toast.success("Cập nhật thông tin thành công");
      } catch (error) {
        console.error(error);
        toast.error("Cập nhật thông tin thất bại thất bại");
        setIsButtonDisabled(false);
      }
    },
  });

  const getProvince = useCallback(async () => {
    try {
      const url =
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
      const token = "cfce17a8-6bfe-11ee-a59f-a260851ba65c";

      const response = await axios.get(url, {
        headers: {
          token: token,
        },
      });

      setProvinces(response.data.data || []);
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  const getDistrict = useCallback(async (valuesProvinceCode) => {
    try {
      if (valuesProvinceCode !== 0) {
        const url = `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${valuesProvinceCode}`;
        const token = "cfce17a8-6bfe-11ee-a59f-a260851ba65c";

        const response = await axios.get(url, {
          headers: {
            token: token,
          },
        });

        setDistricts(response.data.data || []);
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  const getWard = useCallback(async (valuesDistrictCode) => {
    try {
      if (valuesDistrictCode !== 0) {
        const url = `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${valuesDistrictCode}`;
        const token = "cfce17a8-6bfe-11ee-a59f-a260851ba65c";

        const response = await axios.get(url, {
          headers: {
            token: token,
          },
        });

        setWards(response.data.data || []);
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const res = await axiosClient.get("/customers");
      validation.setValues(res.data.payload);
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  // Tạo một đối tượng Moment từ một ngày
  const birthday = moment(validation.values.birthday);

  // Định dạng ngày theo chuẩn ISO 8601
  const formattedDate = birthday.format("YYYY-MM-DD");

  useEffect(() => {
    getMe();
    getProvince();
  }, []);

  useEffect(() => {
    getDistrict(validation.values.provinceCode);

    const selectedProvince = provinces.find(
      (province) => province.ProvinceID == validation.values.provinceCode
    );

    validation.setValues((prev) => ({
      ...prev,
      provinceName: selectedProvince ? selectedProvince.ProvinceName : "",
    }));
  }, [validation.values.provinceCode]);

  useEffect(() => {
    getWard(validation.values.districtCode);
    const selectedDistrict = districts.find(
      (district) => district.DistrictID == validation.values.districtCode
    );

    validation.setValues((prev) => ({
      ...prev,
      districtName: selectedDistrict ? selectedDistrict.DistrictName : "",
    }));
  }, [validation.values.districtCode]);

  useEffect(() => {
    const selectedWard = wards.find(
      (ward) => ward.WardCode == validation.values.wardCode
    );

    validation.setValues((prev) => ({
      ...prev,
      wardName: selectedWard ? selectedWard.WardName : "",
    }));
  }, [validation.values.wardCode]);

  return (
    <div 
    className="flex items-center justify-center shadow-md bg-gray-100 py-8" 
    style={{
      backgroundImage: "url('https://jollibee.com.vn/static/version1698938216/frontend/Jollibee/default/vi_VN/Levinci_Widget/images/jollibee-kid-party-bg.png')",
      backgroundSize: "cover"
    }}
    >
      <form onSubmit={validation.handleSubmit} className="w-full max-w-sm px-4 bg-white p-6 rounded-lg">
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Họ:
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin họ"
              name="firstName"
              value={validation.values.firstName}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.firstName && validation.touched.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
          </label>
          {validation.errors.firstName && validation.touched.firstName && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.firstName}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tên:
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin tên"
              name="lastName"
              value={validation.values.lastName}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.lastName && validation.touched.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
          </label>
          {validation.errors.lastName && validation.touched.lastName && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.lastName}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Số điện thoại:
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin số điện thoại"
              name="phoneNumber"
              value={validation.values.phoneNumber}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.phoneNumber && validation.touched.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
          </label>
          {validation.errors.phoneNumber && validation.touched.phoneNumber && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.phoneNumber}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="birthday"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ngày sinh:
            <input
              type="date"
              placeholder="Vui lòng nhập thông tin ngày sinh"
              name="birthday"
              value={formattedDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.birthday && validation.touched.birthday
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
          </label>
          {validation.errors.birthday && validation.touched.birthday && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.birthday}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="provinceCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tỉnh thành
            <select
              name="provinceCode"
              value={validation.values.provinceCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.provinceCode &&
                validation.touched.provinceCode
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="" label="Vui lòng chọn tỉnh thành"></option>
              {provinces &&
                provinces.map((province) => {
                  return (
                    <option
                      value={province.ProvinceID}
                      label={province.ProvinceName}
                    >
                      {province.ProvinceName}
                    </option>
                  );
                })}
            </select>
          </label>
          {validation.errors.provinceCode &&
            validation.touched.provinceCode && (
              <div className="text-red-500 text-xs italic">
                {validation.errors.provinceCode}
              </div>
            )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="districtCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Quận
            <select
              name="districtCode"
              value={validation.values.districtCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.districtCode &&
                validation.touched.districtCode
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="" label="Vui lòng chọn quận "></option>
              {districts &&
                districts.map((district) => {
                  return (
                    <option
                      value={district.DistrictID}
                      label={district.DistrictName}
                    >
                      {district.DistrictName}
                    </option>
                  );
                })}
            </select>
          </label>
          {validation.errors.districtCode &&
            validation.touched.districtCode && (
              <div className="text-red-500 text-xs italic">
                {validation.errors.districtCode}
              </div>
            )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="wardCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phường
            <select
              name="wardCode"
              value={validation.values.wardCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.wardCode && validation.touched.wardCode
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="" label="Vui lòng chọn phường "></option>
              {wards &&
                wards.map((ward) => {
                  return (
                    <option value={ward.WardCode} label={ward.WardName}>
                      {ward.WardName}
                    </option>
                  );
                })}
            </select>
          </label>
          {validation.errors.wardCode && validation.touched.wardCode && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.wardCode}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Địa chỉ:
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin địa chỉ"
              name="address"
              value={validation.values.address}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className={`${
                validation.errors.address && validation.touched.address
                  ? "border-red-500"
                  : "border-gray-300"
              } appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
          </label>
          {validation.errors.address && validation.touched.address && (
            <div className="text-red-500 text-xs italic">
              {validation.errors.address}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded w-full"
          disabled={isButtonDisabled}
        >
          Cập nhật thông tin
        </button>
      </form>
    </div>
  );
}

export default withTokenCheckComponent(Profile);
