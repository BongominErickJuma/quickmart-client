import React from "react";
import useCart from "../hooks/useCart";

const Number = () => {
  const { cart } = useCart();
  return <span className="text-sunset-orange">{cart.length}</span>;
};

export default Number;
