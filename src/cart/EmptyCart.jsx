import { Link } from "react-router-dom";
import EmptyCartSvg from "../svgs/EmptyCartSvg";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <div className="text-center">
        {/* Empty Cart Icon */}
        <EmptyCartSvg />
        {/* Empty Cart Message */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="mt-2 text-forest-green">Looks like you haven't added anything to your cart yet.</p>
        {/* Button to Redirect to Homepage */}
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 gradient-warm-sunset border border-transparent rounded-md font-semibold text-pale-lime transition-all"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
