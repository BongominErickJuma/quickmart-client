import React, { useEffect, useState } from "react";
import Products from "../Products/Products";
import { productService } from "../services/api";

const categories = [
  "Electronics",
  "Appliances",
  "Furniture",
  "Home & Kitchen",
  "Fitness",
  "Fashion",
  "Home Automation",
  "Accessories",
  "Home & Storage",
  "Home & Office",
];

const Homepage = () => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productCategory, setProductCategory] = useState("Electronics");

  const fetchProducts = async (category) => {
    try {
      setIsLoading(true);
      const fetchedProducts = await productService.getAllProducts(category);
      if (fetchedProducts.data) {
        setProducts(fetchedProducts.data.products);
      }
      setError(null);
    } catch (error) {
      setError(error?.message || "An error occurred while fetching products.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(productCategory);
  }, [productCategory]);

  return (
    <div className="px-4 mt-10 py-2">
      <>
        <h1 className="text-center uppercase text-forest-green text-2xl my-3">Items in store</h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setProductCategory(category)}
              className={`px-3 py-1 rounded-full border text-sm font-medium ${
                productCategory === category
                  ? "bg-forest-green text-white"
                  : "bg-white text-forest-green border-forest-green hover:bg-forest-green hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green mx-auto"></div>
              <p className="mt-4 text-forest-green">Loading Products...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
              <h2 className="text-xl font-bold text-burnt-sienna mb-2">Error Loading Products</h2>
              <p className="text-forest-green mb-4">{error.message}</p>
            </div>
          </div>
        )}
      </>

      <div className="flex flex-col justify-center items-center">
        {products?.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-500 my-4">
            No products found in <span className="font-semibold">{productCategory}</span>.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products && products.map((product, ind) => <Products key={ind} product={product} />)}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
