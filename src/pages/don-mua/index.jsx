import axiosClient from "@/libraries/axiosClient";
import React, { useCallback, useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";
import "numeral/locales/vi";

numeral.locale("vi");

function PurchaseOrder() {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);

  const [pagination, setPagination] = useState({
    total: 0,
    count: 0,
    page: 1,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);

  const statusMapping = {
    PLACED: "Đã đặt hàng",
    PREPARED: "Chuẩn bị xong",
    DELIVERING: "Đang vận chuyển",
    COMPLETED: "Hoàn thành",
    CANCELED: "Cửa hàng hủy",
    REJECTED: "Hủy đơn",
    FLAKER: "Boom hàng",
  };

  const cancelButtonRef = useRef(null);

  const getOrderMe = useCallback(async () => {
    try {
      const response = await axiosClient.get(
        `/orders?page=${pagination.page}&pageSize=${pagination.pageSize}`
      );
      setOrders(response.data?.payload || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data?.total || 0,
        count: response.data?.count || 0,
      }));
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  }, [pagination.page, pagination.pageSize]);

  const onChangePrevious = () => {
    setPagination((prev) => ({
      ...prev,
      page: pagination.page - 1,
    }));
  };

  const onChangeNext = () => {
    if (pagination.page < Math.ceil(pagination.total / pagination.pageSize)) {
      setPagination((prev) => ({
        ...prev,
        page: pagination.page + 1,
      }));
    }
  };

  const handleChangeStatus = (order) => {
    setOrderDetail(order);
    setOpen(!open);
  };

  const handleCancelOrderDetail = async (order) => {
    const shouldCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (shouldCancel) {
      try {
        await axiosClient.patch(`/orders/status/${order._id}?status=REJECTED`);
        getOrderMe();
      } catch (error) {
        console.log("««««« error »»»»»", error);
      }
    }
  };

  useEffect(() => {
    getOrderMe();
  }, [getOrderMe]);

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-center">
        Thông tin đơn hàng
      </h3>
      <div className="overflow-x-auto text-center">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 p-2">Stt</th>
              <th className="border-b-2 border-gray-300 p-2">Mã đơn hàng</th>
              <th className="border-b-2 border-gray-300 p-2">Trạng thái</th>
              <th className="border-b-2 border-gray-300 p-2">Hủy đơn hàng</th>
              <th className="border-b-2 border-gray-300 p-2">Loại đơn</th>
              <th className="border-b-2 border-gray-300 p-2">Thanh toán</th>
              <th className="border-b-2 border-gray-300 p-2">Ngày tạo đơn</th>
              <th className="border-b-2 border-gray-300 p-2">
                Ngày dự kiến giao hàng
              </th>
              {/* Thêm tiêu đề cho các cột khác của đơn hàng */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td className="border-b border-gray-300 p-2">
                  <span>
                    {index + 1 + pagination.pageSize * (pagination.page - 1)}
                  </span>
                </td>
                <td className="border-b border-gray-300 p-2">
                  <Link href="" onClick={() => handleChangeStatus(order)}>
                    {order._id}
                  </Link>
                </td>
                <td className="border-b border-gray-300 p-2">
                  <span>{statusMapping[order.status]}</span>
                </td>
                <td className="border-b border-gray-300 p-2 ">
                  {order.status === "PLACED" || order.status === "PREPARING" ? (
                    <button
                      className="flex-col justify-center"
                      onClick={() => handleCancelOrderDetail(order)}
                    >
                      <CiTrash size="20px" />
                    </button>
                  ) : null}
                </td>
                <td className="border-b border-gray-300 p-2">
                  <td className="border-gray-300 p-2">
                    {order.isOnline && order.isOnline === true ? (
                      <span>Trực tuyến</span>
                    ) : (
                      <span>Mua tại cửa hàng</span>
                    )}
                  </td>
                </td>
                <td className="border-b border-gray-300 p-2">
                  <span>{`${numeral(
                    order.productList.reduce(
                      (acc, product) =>
                        acc +
                        product.price *
                          product.quantity *
                          (1 - product.discount / 100),
                      0
                    ) + order.totalFee
                  ).format("0,05$")}`}</span>
                </td>
                <td className="border-b border-gray-300 p-2">
                  <span>{`${new Date(
                    order.createdDate
                  ).toLocaleDateString()}`}</span>
                </td>
                {order.status === "COMPLETED" ? (
                  <td className="border-b border-gray-300 p-2">
                    <span>{`${new Date(
                      order.updatedAt
                    ).toLocaleDateString()}`}</span>
                  </td>
                ) : order.status === "REJECTED" || order.status === "FLAKER" ? (
                  <td className="border-b border-gray-300 p-2">_____</td>
                ) : (
                  <td className="border-b border-gray-300 p-2">
                    <span>{`${new Date(
                      order.shippedDate
                    ).toLocaleDateString()}`}</span>
                  </td>
                )}

                {/* {order.shippedDate ? (
                  <td className="border-b border-gray-300 p-2">
                    <span>{`${new Date(
                      order.shippedDate
                    ).toLocaleDateString()}`}</span>
                  </td>
                ) : (
                  <td className="border-b border-gray-300 p-2"></td>
                )} */}

                {/* Hiển thị các thông tin khác của đơn hàng */}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Build UI pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {/* Previous button */}
                <button
                  onClick={onChangePrevious}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2  bg-slate-300 text-gray-500 `}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Previous button */}
                <span className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset bg-indigo-600 text-white focus:outline-offset-0">
                  {pagination.page}
                </span>

                {/* Page numbers */}
                <button
                  onClick={onChangeNext}
                  disabled={pagination.count < pagination.pageSize}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2  bg-slate-300 text-gray-500`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
        {/* End build UI panigation */}
      </div>
      {/* Build modal cập nhật status đơn hàng */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex justify-center">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Thông tin chi tiết đơn hàng
                        </Dialog.Title>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>Trạng thái: {statusMapping[orderDetail.status]}</p>
                    <div>
                      <h3 className="text-2x font-bold mb-4 text-center">
                        Chi tiết sản phẩm đặt hàng
                      </h3>
                      {orderDetail &&
                      orderDetail.productList &&
                      Array.isArray(orderDetail.productList) &&
                      orderDetail.productList.length > 0 ? (
                        <div>
                          <table>
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Giảm giá</th>
                                <th>Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetail.productList.map((item) => (
                                <tr key={item.productId}>
                                  <td>
                                    <div>
                                      <Image
                                        src={item.imageProduct}
                                        width={110}
                                        height={110}
                                      />
                                    </div>
                                    <div>{item.name}</div>
                                  </td>
                                  <td>{item.quantity}</td>
                                  <td>{numeral(item.price).format("0,05$")}</td>
                                  <td>
                                    {numeral(
                                      (item.price *
                                        item.discount *
                                        item.quantity) /
                                        100
                                    ).format("0,05$")}
                                  </td>
                                  <td>
                                    {numeral(
                                      item.price *
                                        item.quantity *
                                        (1 - item.discount / 100)
                                    ).format("0,05$")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div>
                            <div>
                              Tổng tiền:
                              <span>
                                {`${numeral(
                                  orderDetail.productList.reduce(
                                    (acc, product) =>
                                      acc + product.price * product.quantity,
                                    0
                                  )
                                ).format("0,05$")}`}
                              </span>
                            </div>
                            <div>
                              Giảm giá:
                              <span>
                                {`${numeral(
                                  orderDetail.productList.reduce(
                                    (acc, product) =>
                                      acc +
                                      (product.price *
                                        product.quantity *
                                        product.discount) /
                                        100,
                                    0
                                  )
                                ).format("0,05$")}`}
                              </span>
                            </div>
                            <div>
                              Phí vận chuyển:
                              <span>
                                {numeral(orderDetail.totalFee).format("0,05$")}
                              </span>
                            </div>
                            <div>
                              Thanh toán:
                              <span>
                                {`${numeral(
                                  orderDetail.productList.reduce(
                                    (acc, product) =>
                                      acc +
                                      product.price *
                                        product.quantity *
                                        (1 - product.discount / 100),
                                    0
                                  ) + orderDetail.totalFee
                                ).format("0,05$")}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>Danh sách sản phẩm trống</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Xác nhận
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* End build modal status đơn hàng */}
    </div>
  );
}

export default PurchaseOrder;
