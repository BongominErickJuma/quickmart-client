import React, { useState } from "react";
import Number from "../assets/Number";
import NonEmptyCart from "./NonEmptyCart";
import EmptyCart from "./EmptyCart";
import useCart from "../hooks/useCart";
import usePerson from "../hooks/usePerson";
import { orderService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside the component
const stripePromise = loadStripe(
  "pk_test_51RlUifR1lLQ5wtU061Hek4gTzoPozqsad1nTHeQfzr9e6Fk9izEnoyGi7Cf2D28wnsHVTxRCgFh7c7qLQndNrqt200HpMq2USU"
);

const Cart = () => {
  const { user } = usePerson();
  const { cart, handleClearItemsFromCart } = useCart();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleMakeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setIsPending(true);

      // Map the cart to only include product_id and quantity
      const items = cart.map((item) => ({
        product_id: item._id || item.id,
        quantity: item.count || 1,
      }));

      // 1) Get checkout session from your backend
      const session = await orderService.getCheckoutSession(items);

      if (session) {
        // cear cart after session
        handleClearItemsFromCart();
      }

      // 2) Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-6xl mx-auto pt-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-white/80">You have</span>
            <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-glow">
              <Number />
            </span>
            <span className="text-white/80">{cart?.length === 1 ? "item" : "items"} in your cart</span>
          </div>
        </div>

        {/* Sticky Checkout Button */}
        {cart && cart.length > 0 && (
          <div className="sticky top-20 z-10 mb-8">
            <div className="glass-dark backdrop-blur-md border border-purple-300/20 rounded-2xl shadow-glow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/70">Ready to checkout?</p>
                  <p className="font-semibold text-white text-xl">
                    Total: ${cart.reduce((acc, curr) => acc + curr.price * curr.count, 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleMakeOrder}
                  disabled={isPending}
                  className={`btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{user ? "Proceed to Checkout" : "Signin to Checkout"}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-300/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cart Content */}
        {cart && cart.length > 0 ? <NonEmptyCart /> : <EmptyCart />}
      </div>
    </div>
  );
};

export default Cart;
