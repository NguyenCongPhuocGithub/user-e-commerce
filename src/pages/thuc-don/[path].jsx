import { useCallback, useEffect, useState } from "react";
import React from "react";
import Head from "next/head";
import slugify from "slugify";
import { BsCart4 } from "react-icons/bs";
// import PropTypes from 'prop-types';

import axiosClient from "@/libraries/axiosClient";
import ProductContent from "@/components/ProductContent";
import styles from "../styles/thuc-don.module.css";
import ModalCart from "@/components/ModalCart";
import withTokenCheckFunction from "../../../middleware/WithTokenCheckFunction";

function ProductList(props) {
  const { products } = props;

  const [open, setOpen] = useState(false);

  const [cart, setCart] = useState({});

  const getCart = useCallback(async () => {
    try {
      const res = await axiosClient.get("/carts");
      setCart(res.data?.payload || {});
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleGetCart = () => {
    setOpen(!open);
  };

  // const getCartCheckToken = withTokenCheckFunction(getCart);

  useEffect(() => {
    // Gọi hàm getCart trong phạm vi của function component
    getCart();
  }, [getCart]);

  return (
    <>
      <Head>
        <title>Jollibee gà rán thơm ngon</title>
        <meta name="description" content="" />
        <meta name="viewport" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {products && (
        <main>
          <div className={`container mx-auto`}>
            <div className={`${styles.product_wrapper} `}>
              <ul className={`${styles.product_list}`}>
                {products.map((item) => (
                  <ProductContent key={item._id} products={item} getCart = {getCart}/>
                ))}
              </ul>
            </div>
            <div className={styles.minicart_wrapper}>
              <div className={styles.minicart_content_trigger}>
                <button
                  className={styles.minicart_icon}
                  onClick={handleGetCart}
                >
                  <BsCart4 size="3rem" />
                </button>
                <span className={styles.subtotal}>
                <span className={styles.productLength}>{cart.products && cart.products.length}</span>
                </span>
              </div>
            </div>
            <ModalCart
              open={open}
              setOpen={setOpen}
              products={products}
              cart={cart}
              setCart={setCart}
              getCart={getCart}
            />
          </div>
        </main>
      )}
    </>
  );
}

ProductList.defaultProps = {
  post: {},
};

export default ProductList;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(req) {
  try {
    //Lấy params.path để lấy được path dynamic được định nghĩa
    const { params } = req;

    const categoriesResponse = await axiosClient.get("/categories/all");
    const categories = categoriesResponse.data?.payload || [];

    const convertToEnglishAndSlug = (name) => {
      const slug = slugify(name, {
        lower: true,
        strict: true,
        remove: /[^A-Za-z0-9-\s]+/g,
        replacement: "-",
      });

      return slug;
    };

    //Thêm path cho mỗi category được covert slug
    const categoriesConvert = categories?.map((item) => ({
      ...item,
      path: `${convertToEnglishAndSlug(item.name)}`,
    }));

    //Trả về category đã được có matching với path
    const matchedCategory = categoriesConvert.filter(
      (category) => category.path === params.path
    );

    const categoryId =
      matchedCategory.length > 0 ? matchedCategory[0].id : null;

    const productsResponse = await axiosClient.get(
      `/filters/product?page=1&pageSize=1000&categoryId=${categoryId}`
    );

    const products = productsResponse.data.payload;

    return {
      props: {
        products: products,
      },

      revalidate: 60 * 60 * 24 * 30,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
