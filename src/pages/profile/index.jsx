import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "moment";

import styles from "./Profile.module.css";
import axiosClient from "@/libraries/axiosClient";
import axios from "axios";
import withTokenCheckComponent from "../../../middleware/withTokenCheckComponent";
import { toast } from "react-toastify";

function Profile() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

      provinceCode: yup.number(),

      provinceName: yup
        .string()
        .max(50, "provinceName: cannot exceed 50 characters"),

      districtCode: yup.number(),

      districtName: yup
        .string()
        .max(50, "districtName: cannot exceed 50 characters"),

      wardCode: yup.string().max(500, "wardCode: cannot exceed 50 characters"),

      wardName: yup.string().max(500, "wardName: cannot exceed 50 characters"),

      address: yup.string().max(500, "address: cannot exceed 500 characters"),
    }),

    onSubmit: async (values) => {
      try {
        await axiosClient.patch("/customers", values);
        toast.success("Cập nhật thông tin thành công");
      } catch (error) {
        console.error(error);
        toast.error("Cập nhật thông tin thất bại thất bại");
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
      const url = `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${valuesProvinceCode}`;
      const token = "cfce17a8-6bfe-11ee-a59f-a260851ba65c";

      const response = await axios.get(url, {
        headers: {
          token: token,
        },
      });

      setDistricts(response.data.data || []);
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, []);

  const getWard = useCallback(async (valuesDistrictCode) => {
    try {
      const url = `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${valuesDistrictCode}`;
      const token = "cfce17a8-6bfe-11ee-a59f-a260851ba65c";

      const response = await axios.get(url, {
        headers: {
          token: token,
        },
      });

      setWards(response.data.data || []);
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
    <div>
      <form onSubmit={validation.handleSubmit}>
        <div>
          <label>
            Họ: 
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin họ"
              name="firstName"
              value={validation.values.firstName}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.firstName && validation.touched.firstName && <div>{validation.errors.firstName}</div>}

        <div>
          <label>
            Tên: 
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin tên"
              name="lastName"
              value={validation.values.lastName}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.lastName && validation.touched.lastName && <div>{validation.errors.lastName}</div>}

        <div>
          <label>
            Số điện thoại: 
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin số điện thoại"
              name="phoneNumber"
              value={validation.values.phoneNumber}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.phoneNumber && validation.touched.phoneNumber && <div>{validation.errors.phoneNumber}</div>}

        <div>
          <label>
            Ngày sinh: 
            <input
              type="date"
              placeholder="Vui lòng nhập thông tin ngày sinh"
              name="birthday"
              value={formattedDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.birthday && validation.touched.birthday && <div>{validation.errors.birthday}</div>}

        <div>
          <label>
            Tỉnh thành
            <select
              name="provinceCode"
              value={validation.values.provinceCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
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
        </div>
        {validation.errors.provinceCode && validation.touched.provinceCode && <div>{validation.errors.provinceCode}</div>}

        <div>
          <label>
            Quận
            <select
              name="districtCode"
              value={validation.values.districtCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
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
        </div>
        {validation.errors.districtCode && validation.touched.districtCode && <div>{validation.errors.districtCode}</div>}

        <div>
          <label>
            Phường
            <select
              name="wardCode"
              value={validation.values.wardCode}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
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
        </div>
        {validation.errors.wardCode && validation.touched.wardCode && <div>{validation.errors.wardCode}</div>}

        <div>
          <label>
            Địa chỉ: 
            <input
              type="text"
              placeholder="Vui lòng nhập thông tin địa chỉ"
              name="address"
              value={validation.values.address}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </label>
        </div>
        {validation.errors.address && validation.touched.address && <div>{validation.errors.address}</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default withTokenCheckComponent(Profile);
