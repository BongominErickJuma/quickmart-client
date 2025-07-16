import React, { useState } from "react";
import Number from "../assets/Number";
import Model from "../modal/Modal";
import NonEmptyCart from "./NonEmptyCart";
import EmptyCart from "./EmptyCart";
import useCart from "../hooks/useCart";
import usePerson from "../hooks/usePerson";
import ConfirmModal from "../modal/ConfirmModal";
// import useFetch from "../hooks/useFetch";

const Cart = () => {
  const { userIsLoggedIn, user } = usePerson();
  const { cart, handleClearItemsFromCart } = useCart();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOrderMade, setIsOrderMade] = useState(false);

  // const { pending, error, fetchData } = useFetch("https://jwt-server-test-bongominerickjuma.onrender.com/cart");

  const handleMakeOrder = async () => {
    // if (!userIsLoggedIn) {
    //   setIsModalOpen(true);
    //   return;
    // }

    const token = user.token;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Call fetchData and handle the response
    const response = await fetchData(options);

    if (response && response.expired) {
      // Token is expired, show the modal
      setIsModalOpen(true);
    } else if (response) {
      // Token is valid, proceed with the order
      setIsOrderMade(true);
      handleClearItemsFromCart();
    }
  };

  // const handleCloseConfirmModal = () => {
  //   setIsOrderMade(false);
  // };

  return (
    <div className="mt-24">
      {/* {cart && cart.length > 0 && (
        <button
          onClick={handleMakeOrder}
          className="px-4 py-2 mx-5 float-end rounded-md sticky top-24 cursor-pointer text-pale-lime  gradient-warm-sunset"
        >
          {!error && (pending ? "Confirming..." : "Confirm Order")}
          {error && !pending && <span className="text-pale-lime">{error}</span>}
        </button>
      )} */}

      <h3 className="uppercase text-forest-green text-xl text-center">
        Your Cart [ <Number /> ]
      </h3>

      {/* Render NonEmptyCart or EmptyCart based on cart length */}
      {cart && cart.length > 0 ? <NonEmptyCart /> : <EmptyCart />}

      {/* Render the modal if isModalOpen is true */}
      {/* {isModalOpen && <Model />}
      {isOrderMade && <ConfirmModal onClose={handleCloseConfirmModal} />} */}
    </div>
  );
};

export default Cart;
