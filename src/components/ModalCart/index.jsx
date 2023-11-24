import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import numeral from "numeral";
import "numeral/locales/vi";

import axiosClient from "@/libraries/axiosClient";
import styles from "./ModalCart.module.css";
import { FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import withTokenCheckFunction from "../../../middleware/WithTokenCheckFunction";
import { useRouter } from "next/router";

numeral.locale("vi");

function ModalCart({ open, setOpen, getCart, cart, setCart }) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const handleIncreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((product) => {
        if (product.productId === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      return {
        ...prevCart,
        products: updatedProducts,
      };
    });
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((product) => {
        if (product.productId === productId && product.quantity > 1) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      return {
        ...prevCart,
        products: updatedProducts,
      };
    });
  };

  const handleInputChange = (e, productId) => {
    const inputValue = Number(e.target.value);

    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((product) => {
        if (product.productId === productId) {
          return {
            ...product,
            quantity: inputValue,
          };
        }
        return product;
      });

      return {
        ...prevCart,
        products: updatedProducts,
      };
    });
  };

  const handleSave = withTokenCheckFunction(async () => {
    try {
      await axiosClient.patch("/carts/update", cart);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  });

  const handleCreateOrder = withTokenCheckFunction(async () => {
    try {
      const res = await axiosClient.get("/customers");
      const getMe = res.data.payload;

      if (!getMe.provinceCode || !getMe.districtCode || !getMe.wardCode) {
        router.push("/profile");
        toast.warning("Vui lòng cập nhật địa chỉ");
        return;
      }

      if (getMe.provinceCode !== 203) {
        router.push("/profile");
        toast.warning("Địa chỉ không nằm trong khu vực giao hàng");
        return;
      }

      if (
        getMe &&
        (getMe.provinceCode || getMe.districtCode || getMe.wardCode) &&
        getMe.provinceCode === 203
      ) {
        if (cart.products.length > 0) {
          const shouldCreateOrder = window.confirm(
            "Vui lòng xác nhận đặt hàng"
          );
          if (shouldCreateOrder) {
            const value = {
              totalFee: 20000,
              productList: cart.products,
            };
            setButtonDisabled(true);
            await axiosClient.post("/orders/createFromCart", value);
            toast.success("Tạo đơn hàng thành công");
          }
        }
        setOpen(false);
        getCart();
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo đơn hàng thất bại");
    }
  });

  const handleRemove = async (values) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
    );
    if (confirmed) {
      try {
        await axiosClient.patch("/carts/delete", values);
        getCart();
        toast.success("Xóa sản phẩm trong giỏ hàng thành công");
      } catch (error) {
        console.error(error);
      }
    }
  };

  //Mỗi lần mở modal state thay đổi giá trị
  useEffect(() => {
    setButtonDisabled(false);
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          if ((cart.products && cart.products.length === 0) || !cart.product) {
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-10"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-10"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className={`${styles.minicart_content_wrapper} font-sans`}>
                  <div className={`${styles.block_title} flex justify-center`}>
                    <Dialog.Title
                      as="h3"
                      className="text-xl py-5 font-bold text-gray-900"
                    >
                      Phần ăn đã chọn
                    </Dialog.Title>
                  </div>
                  {cart.products && cart.products.length > 0 ? (
                    <>
                      <div className={styles.block_content}>
                        <div
                          className={`${styles.minicart_items_wrapper} text-center`}
                        >
                          <table
                            className={`${styles.minicart_items} text-base`}
                          >
                            <thead>
                              <tr>
                                <th className="border-b-2 border-gray-300 px-4 py-2">
                                  Sản phẩm
                                </th>
                                <th className="border-b-2 border-gray-300 px-4 py-2">
                                  Số lượng
                                </th>
                                <th className="border-b-2 border-gray-300 px-4 py-2">
                                  Giá
                                </th>
                                <th className="border-b-2 border-gray-300 px-4 py-2">
                                  Xóa
                                </th>
                                {/* Thêm tiêu đề cho các cột khác của đơn hàng */}
                              </tr>
                            </thead>
                            <tbody>
                              {cart.products &&
                                cart.products.map((item) => {
                                  return (
                                    <tr
                                      key={item.productId}
                                      className={`${styles.product_item}`}
                                    >
                                      <td
                                        className={`${styles.product}`}
                                      >
                                        <div className={`${styles.product_item_details} flex items-center gap-x-3 p-2`}>
                                            <img
                                              src={item.coverImageUrl}
                                              alt={item.name}
                                              className= "w-1/3 h-auto"
                                            />
                                          <p
                                            className={`${styles.product_item_name} text-sm`}
                                          >
                                            {item.name}
                                          </p>
                                        </div>
                                      </td>

                                      <td className={`${styles.quantity}`}>
                                        <div className="flex items-center justify-center h-8">
                                          <button
                                            type="button"
                                            className="bg-gray-200 text-gray-700 hover:bg-gray-400 px-3 py-1 h-full rounded-l-full focus:outline-none flex items-center justify-center"
                                            onClick={() =>
                                              handleDecreaseQuantity(
                                                item.productId
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            type="text"
                                            name="quantity"
                                            className="w-1/3 px-3 p-2 h-full text-center bg-gray-100"
                                            value={item.quantity}
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                item.productId
                                              )
                                            }
                                          />
                                          <button
                                            type="button"
                                            className="bg-gray-200 text-gray-700 hover:bg-gray-400 px-3 py-1 h-full rounded-r-full focus:outline-none flex items-center justify-center"
                                            onClick={() =>
                                              handleIncreaseQuantity(
                                                item.productId
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </td>

                                      <td className={`${styles.price} w-1/4`}>
                                        <div
                                          className={`${styles.price_wrapper} w-full`}
                                        >
                                          <div
                                            className={`${styles.minicart_price} flex justify-center items-end font-bold text-lg`}
                                          >
                                            {numeral(
                                              item.price * item.quantity -
                                                (item.price *
                                                  item.quantity *
                                                  item.discount) /
                                                  100
                                            ).format("0,05$")}
                                          </div>
                                        </div>
                                      </td>

                                      <td className={`${styles.actions} w-1/8`}>
                                        <div
                                          className={`${styles.product_actions} w-full flex justify-center items-center`}
                                        >
                                          <button
                                            className={`${styles.remove_actions} hover:bg-gray-400 rounded-md`}
                                            onClick={() => handleRemove(item)}
                                          >
                                            <FiTrash size={"20px"} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className={`flex flex-row-reverse`}>
                        <div
                          className={`${styles.block_total} flex flex-col gap-y-2 font-sans w-3/5 items-end px-4 py-3`}
                        >
                          <div
                            className={`${styles.total} flex w-full items-center justify-end`}
                          >
                            <p className={`font-bold text-lg w-1/2 text-right`}>Tổng tiền:</p>
                            <div className = {`text-right w-1/2 `}>
                              {`${numeral(
                                cart.products?.reduce(
                                  (acc, productItemCart) =>
                                    acc +
                                    productItemCart.price *
                                      productItemCart.quantity *
                                      (1 - productItemCart.discount / 100),
                                  0
                                )
                              ).format("0,05$")}`}
                            </div>
                          </div>

                          <div
                            className={`${styles.total_ship} flex w-full items-center justify-end`}
                          >
                            <p className={`font-bold text-lg w-1/2 text-right`}>
                              Phí vận chuyển:
                            </p>
                            <div className = {`text-right w-1/2 `}>{numeral(20000).format("0,05$")}</div>
                          </div>

                          <div
                            className={`${styles.total_pay} flex w-full items-center justify-end`}
                          >
                            <p className={`font-bold text-lg w-1/2 text-right`}>Thanh toán:</p>
                            <span className = {`font-bold w-1/2  text-right text-red-600 text-md md:text-lg lg:text-lg`}>
                              {`${numeral(
                                cart.products?.reduce(
                                  (acc, productItemCart) =>
                                    acc +
                                    productItemCart.price *
                                      productItemCart.quantity *
                                      (1 - productItemCart.discount / 100),
                                  0
                                ) + 20000
                              ).format("0,05$")}`}
                            </span>
                          </div>

                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center pb-5">
                      Giỏ hàng hiện chưa có sản phẩm
                    </div>
                  )}
                </div>
                {cart.products && cart.products.length > 0 ? (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
                      onClick={handleCreateOrder}
                      disabled={isButtonDisabled}
                    >
                      Thanh toán
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-400 sm:mt-0 sm:w-auto"
                      onClick={handleSave}
                      ref={cancelButtonRef}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ModalCart;
