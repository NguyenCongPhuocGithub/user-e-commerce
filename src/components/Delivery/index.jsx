import React from 'react'
import styles from "./Delivery.module.css"
import Link from 'next/link'
import Image from 'next/image'

function Delivery() {
  return (
    <div className={styles.wrap_delivery}>
        <Link href={"/thuc-don/combo-ban-chay"}>
            <div className={styles.pick_up}>
                Pick up
            </div>
        </Link>
        <Image width={100} height={30}src={"https://jollibee.com.vn/media/wysiwyg/delivery-lg-rs.png"} alt="Giao hàng nhanh jollibee" />
    </div>
  )
}

export default Delivery