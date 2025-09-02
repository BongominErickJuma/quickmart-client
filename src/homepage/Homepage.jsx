import React, { useEffect, useState } from "react";
import Products from "../Products/Products";
import { productService } from "../services/api";
import { useSearch } from "../contexts/SearchProvider";

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
  const [allProducts, setAllProducts] = useState([]); // Store all products for search
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productCategory, setProductCategory] = useState("Electronics");
  const { searchQuery, performSearch, isSearching, searchResults, clearSearch } = useSearch();

  const fetchProducts = async (category) => {
    try {
      setIsLoading(true);
      const fetchedProducts = await productService.getAllProducts(category);
      if (fetchedProducts.data) {
        const categoryProducts = fetchedProducts.data.products;
        setProducts(categoryProducts);
        
        // Add category info to products for better search
        const productsWithCategory = categoryProducts.map(product => ({
          ...product,
          category: category
        }));
        
        // Update allProducts array (merge with existing from other categories)
        setAllProducts(prevAll => {
          const filtered = prevAll.filter(p => p.category !== category);
          return [...filtered, ...productsWithCategory];
        });
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

  // Handle search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(allProducts, searchQuery);
    }
  }, [searchQuery, allProducts, performSearch]);

  // Load all categories initially for comprehensive search
  useEffect(() => {
    const loadAllCategories = async () => {
      for (const category of categories.slice(1)) { // Skip first category as it's already loaded
        try {
          const fetchedProducts = await productService.getAllProducts(category);
          if (fetchedProducts.data) {
            const productsWithCategory = fetchedProducts.data.products.map(product => ({
              ...product,
              category: category
            }));
            
            setAllProducts(prevAll => {
              const filtered = prevAll.filter(p => p.category !== category);
              return [...filtered, ...productsWithCategory];
            });
          }
        } catch (error) {
          console.error(`Failed to load ${category}:`, error);
        }
      }
    };
    
    // Load other categories in background for search
    setTimeout(() => {
      loadAllCategories();
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Beautiful Gradient Background */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Discover Amazing
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-in-up">
            Browse through our curated collection of high-quality items across various categories
          </p>
          <button className="bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-purple-900 transform hover:scale-105 transition-all duration-300 shadow-xl">
            Start Shopping
          </button>
        </div>
      </div>

      {/* Categories Section with Light Background */}
      {!searchQuery && (
        <div className="bg-white/50 backdrop-blur-sm py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Category Tabs */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Shop by Category</h2>
              <p className="text-gray-600">Find exactly what you're looking for</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setProductCategory(category);
                    clearSearch(); // Clear search when selecting category
                  }}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    productCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-purple-400 hover:shadow-md hover:bg-purple-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white/50 backdrop-blur-sm py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              {isSearching ? 'Searching...' : `Found ${searchResults.length} ${searchResults.length === 1 ? 'product' : 'products'}`}
            </p>
            <button
              onClick={() => {
                clearSearch();
                setProductCategory("Electronics");
              }}
              className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
            >
              ← Back to categories
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin border-t-secondary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-primary mb-1">Loading products...</h3>
              <p className="text-secondary text-sm">Please wait while we fetch the latest items</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-surface p-8 rounded-2xl shadow-medium text-center max-w-md border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">Unable to Load Products</h2>
              <p className="text-secondary mb-4">{error}</p>
              <button 
                onClick={() => fetchProducts(productCategory)}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            {/* Display search results or regular products */}
            {(() => {
              const displayProducts = searchQuery ? searchResults : products;
              const isEmpty = !displayProducts || displayProducts.length === 0;
              
              if (isEmpty) {
                return (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {searchQuery ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        )}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {searchQuery ? `No results for "${searchQuery}"` : "No Products Found"}
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery 
                        ? "Try searching with different keywords or browse our categories." 
                        : `We couldn't find any products in ${productCategory}.`
                      }
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          clearSearch();
                          setProductCategory("Electronics");
                        }}
                        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Browse Categories
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {displayProducts.map((product, index) => (
                    <div 
                      key={`${product._id || product.id}-${index}`} 
                      className="animate-slide-in-up" 
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <Products product={product} />
                      {/* Show category badge for search results */}
                      {searchQuery && product.category && (
                        <div className="mt-2 text-center">
                          <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
