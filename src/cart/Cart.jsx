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

      // if (error) {
      //   setError(error.message);
      // } else {
      //   // Only clear cart if you want to after successful payment
      //   handleClearItemsFromCart();
      // }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mt-24">
      {/* Sticky Checkout Button */}
      {cart && cart.length > 0 && (
        <div className="sticky top-20 z-10 py-3 shadow-sm">
          <div className="container mx-auto flex justify-end px-5">
            <button
              onClick={handleMakeOrder}
              disabled={isPending}
              className={`mt-6 inline-flex items-center px-4 py-2 gradient-warm-sunset cursor-pointer border border-transparent rounded-md font-semibold text-pale-lime transition-all ${
                isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Processing..." : user ? "Proceed to Checkout →" : "Login to Checkout →"}
              {error && <span className="block text-xs mt-1 text-pale-lime">{error}</span>}
            </button>
          </div>
        </div>
      )}

      <h3 className="uppercase text-forest-green text-xl text-center mt-4">
        Your Cart [ <Number /> ]
      </h3>

      {/* Render NonEmptyCart or EmptyCart based on cart length */}
      {cart && cart.length > 0 ? <NonEmptyCart /> : <EmptyCart />}
    </div>
  );
};

export default Cart;
