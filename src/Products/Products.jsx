import React from "react";
import AddToCartBtn from "../buttons/AddToCartBtn";
import IncrementDecrementBtn from "../buttons/IncrementDecrementBtn";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/api";
const Products = ({ product }) => {
  const { cart } = useCart();
  const targetCartItemIndex = cart.findIndex((cart) => cart.name === product.name);
  const targetCartItem = cart[targetCartItemIndex];

  const count = targetCartItem?.count || 0;

  return (
    <div className="w-full rounded-lg shadow-sm bg-forest-green">
      <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="px-5 pb-5">
        <h5 className="text-2xl text-pale-lime">{product.name}</h5>
        <p className="text-pale-lime my-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold gradient-word">${product.price}</span>
          {count > 0 ? <IncrementDecrementBtn item={product} count={count} /> : <AddToCartBtn product={product} />}
        </div>
      </div>
    </div>
  );
};

export default Products;
