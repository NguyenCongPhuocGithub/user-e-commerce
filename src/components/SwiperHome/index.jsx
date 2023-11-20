import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function SwiperHome() {
  const imageCount = 10; // Số lần lặp lại hình ảnh
  const imageUrl =
    "https://jollibee.com.vn/media/mageplaza/bannerslider/banner/image/w/e/web-06.jpg";
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      navigation
      // pagination={{ clickable: true }}
      loop={true}
    >
      {[...Array(imageCount)].map((_, index) => (
        <SwiperSlide key={index}>
          <Image width={1440} height={549.67} src={imageUrl} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperHome;
