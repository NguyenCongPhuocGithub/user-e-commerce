import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import numeral from "numeral";
import "numeral/locales/vi";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
// Kiểm tra token
import { toast } from "react-toastify";
import axiosClient from "@/libraries/axiosClient";
import withTokenCheckFunction from "../../../middleware/WithTokenCheckFunction";

numeral.locale("vi");

function ModalAddToCart({ open, setOpen, products, getCart }) {
  const cancelButtonRef = useRef(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const [valueInput, setValueInput] = useState({
    quantity: 1,
  });

  const handleIncreaseQuantity = () => {
    setValueInput((prevState) => ({
      ...prevState,
      quantity: prevState.quantity + 1,
    }));
  };

  const handleDecreaseQuantity = () => {
    if (valueInput.quantity > 1) {
      setValueInput((prevState) => ({
        ...prevState,
        quantity: prevState.quantity - 1,
      }));
    }
  };

  // Hỗ trợ lấy giá trị onChange các input
  const handleInputChange = (e) => {
    const inputName = e.target.name;
    const inputValue = Number(e.target.value);
    setValueInput((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));
  };

  const handleAddToCart = async () => {
    try {
      if (valueInput.quantity >= 1) {
        const values = {
          productId: products.id,
          quantity: valueInput.quantity,
        };
        //Ngăn cản việc bấm thêm vào giỏ hàng quá nhiều lần
        setButtonDisabled(true);
        await axiosClient.post("/carts", values);
        setValueInput((prevState) => ({
          ...prevState,
          quantity: 1,
        }));

        setOpen(false);
        getCart();
        toast.success("Thêm giỏ hàng thành công");
      } else {
        toast.warning("Vui lòng số lượng");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Mỗi lần mở modal state thay đổi giá trị
  useEffect(() => {
    setValueInput((prevState) => ({
      ...prevState,
      quantity: 1,
    }));
    setButtonDisabled(false);
  }, [open]);
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          setOpen(false);
        }}
        initialFocus={cancelButtonRef}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* <div className="sm:flex sm:items-start">
              </div>
            </div>
          </div> */}
              </div>
              {/* Build form  */}
              <div className="flex items-center">
                <div className="w-1/2">
                  <img
                    src={products.media.coverImageUrl}
                    alt={products.name}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="w-1/2 p-4">
                  <h2 className="text-2xl font-bold mb-4">{products.name}</h2>
                  <div className="text-2x mb-4">{products.description}</div>
                </div>
              </div>
              {/* End build form */}
              <div className="bg-gray-50  flex-col gap-x-5">
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center gap-x-5">
                  <div className = "text-lg">
                    {numeral(valueInput.quantity * products.price).format("0,05$")}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-full focus:outline-none"
                      onClick={handleDecreaseQuantity}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      name="quantity"
                      value={valueInput.quantity}
                      onChange={handleInputChange}
                      className="w-16 py-1 text-center bg-gray-100 "
                      // readOnly
                    />
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-full focus:outline-none"
                      onClick={handleIncreaseQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="sm:flex sm:flex-row-reverse items-center pr-5 pb-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={withTokenCheckFunction(handleAddToCart)}
                    disabled={isButtonDisabled}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
export default ModalAddToCart;
