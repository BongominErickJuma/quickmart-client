import React from "react";
import useCart from "../hooks/useCart";

const AddToCartBtn = ({ product }) => {
  const { handleAddToCart } = useCart();
  return (
    <button
      onClick={() => handleAddToCart(product)}
      className="w-full bg-secondary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-accent transition-colors duration-200 flex items-center justify-center"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32M7 13v6a2 2 0 002 2h9a2 2 0 002-2v-6" />
      </svg>
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
