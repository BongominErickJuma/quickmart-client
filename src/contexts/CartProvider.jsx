import React, { createContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return initialState;
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Failed to load cart from localStorage", err);
    return initialState;
  }
};

const initialState = {
  confirmOrder: false,
  cart: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingCartItemIndex = state.cart.findIndex((cartItem) => cartItem.name === action.payload.name);

      const existingCartItem = state.cart[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          count: existingCartItem.count + 1,
        };
        const updatedCartItems = [...state.cart];
        updatedCartItems[existingCartItemIndex] = updatedItem;
        return {
          ...state,
          cart: updatedCartItems,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, count: 1 }],
        };
      }
    }
    case "SUBTRACT_ITEM": {
      const existingCartItemIndex = state.cart.findIndex((cartItem) => cartItem.name === action.payload.name);
      const existingCartItem = state.cart[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          count: existingCartItem.count - 1,
        };
        const updatedCartItems = [...state.cart];
        updatedCartItems[existingCartItemIndex] = updatedItem;
        return {
          ...state,
          cart: updatedCartItems.filter((item) => item.count > 0), // Remove items with count <= 0
        };
      }
      return state;
    }
    case "REMOVE": {
      return {
        ...state,
        cart: state.cart.filter((cartItem) => cartItem.name !== action.payload.name),
      };
    }
    case "CLEAR": {
      return {
        confirmOrder: false,
        cart: [],
      };
    }
    default: {
      return state;
    }
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    // Use the initializer function to load from localStorage
    loadCartFromLocalStorage
  );

  const { confirmOrder, cart } = state;

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [state]);

  const handleAddToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const handleSubtractToCart = (item) => {
    dispatch({ type: "SUBTRACT_ITEM", payload: item });
  };

  const handleDeleteFromCart = (item) => {
    dispatch({ type: "REMOVE", payload: item });
  };

  const handleClearItemsFromCart = () => {
    dispatch({ type: "CLEAR" });
  };

  return (
    <CartContext.Provider
      value={{
        confirmOrder,
        cart,
        handleAddToCart,
        handleSubtractToCart,
        handleDeleteFromCart,
        handleClearItemsFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
