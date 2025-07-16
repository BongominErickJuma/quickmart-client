import React from "react";
import useCart from "../hooks/useCart";

const AddToCartBtn = ({ product }) => {
  const { handleAddToCart } = useCart();
  return (
    <button
      onClick={() => handleAddToCart(product)}
      className="cursor-pointer text-pale-lime font-medium rounded-lg text-sm px-5 py-2.5 text-center gradient-warm-sunset"
    >
      Add to cart
    </button>
  );
};

export default AddToCartBtn;
