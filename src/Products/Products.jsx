import React from "react";
import AddToCartBtn from "../buttons/AddToCartBtn";
import IncrementDecrementBtn from "../buttons/IncrementDecrementBtn";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/api";
import OptimizedImage from "../components/OptimizedImage";
const Products = ({ product }) => {
  const { cart } = useCart();
  const targetCartItemIndex = cart.findIndex((cart) => cart.name === product.name);
  const targetCartItem = cart[targetCartItemIndex];

  const count = targetCartItem?.count || 0;

  return (
    <div className="group w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300">
      <div className="relative overflow-hidden aspect-square">
        <OptimizedImage 
          src={getImageUrl(product.image)} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          placeholderColor="bg-gradient-to-br from-purple-50 to-indigo-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Price badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h5 className="text-lg font-semibold text-primary mb-1 line-clamp-1">{product.name}</h5>
        <p className="text-secondary text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="space-y-3">
          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-secondary line-through">${product.originalPrice}</span>
            )}
          </div>
          
          {/* Button Section */}
          {count > 0 ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
              <span className="text-sm font-medium text-primary">Quantity:</span>
              <IncrementDecrementBtn item={product} count={count} />
            </div>
          ) : (
            <AddToCartBtn product={product} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
