import { Link } from "react-router-dom";
import EmptyCartSvg from "../svgs/EmptyCartSvg";

function EmptyCart() {
  return (
    <div className="glass-dark rounded-3xl shadow-glow border border-purple-300/20 py-20 animate-slide-in-up">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Empty Cart Icon */}
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-glow">
          <EmptyCartSvg />
        </div>
        
        {/* Empty Cart Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-white/80 leading-relaxed mb-8">
          Discover amazing products and add them to your cart to get started with your shopping journey.
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <p className="text-xs text-white/70">Quality Products</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32M7 13v6a2 2 0 002 2h9a2 2 0 002-2v-6" />
              </svg>
            </div>
            <p className="text-xs text-white/70">Fast Delivery</p>
          </div>
        </div>
        
        {/* Button to Redirect to Homepage */}
        <Link
          to="/"
          className="btn btn-primary px-8 py-3 inline-flex items-center space-x-2 magnetic ripple"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Start Shopping</span>
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
