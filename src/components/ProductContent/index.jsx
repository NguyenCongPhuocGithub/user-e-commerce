import React from "react";
import {useState } from 'react'

import styles from "./ProductContent.module.css";
import Image from "next/image";
import ModalAddToCart from "./modalAddToCart";
import numeral from "numeral";
import "numeral/locales/vi";
numeral.locale("vi");

function ProductContent({ products, getCart }) {

  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    setOpen(!open);
  };

  return (
    <>
      <li className={styles.product_item}>
        <div className={styles.product_item_info}>
          <div className={styles.product_image_container}>
            <div className={styles.product_image_wrapper}>
              <Image
                width={200}
                height={200}
                src={products.media.coverImageUrl}
              />
            </div>
            <div className={styles.product_item_details}>
              <strong className={styles.product_item_name}>
                {products.name}
              </strong>
              <div className={styles.price_final_price}>
                <span>{`${numeral(products.price).format("0,05$")}`}</span>
                {products.discount !== 0 && products.discount ? (<div><span>{products.discount} %</span></div>) : null}
              </div>

              <div className={styles.product_item_inner}>
                <div className={styles.product_item_actions}>
                  <div className={styles.actions_primary}>
                    <button
                      type="submit"
                      title="Đặt hàng"
                      class="action_tocart"
                      onClick={handleAddToCart}
                    >
                      <span>Đặt hàng</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <ModalAddToCart open={open} setOpen={setOpen} products={products} getCart = {getCart}/>
    </>
  );
}

export default ProductContent;
