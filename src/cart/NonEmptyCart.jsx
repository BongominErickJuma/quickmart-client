import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/api";
import ClearSvg from "../svgs/ClearSvg";
import OptimizedImage from "../components/OptimizedImage";

function NonEmptyCart() {
  const { cart, handleDeleteFromCart, handleClearItemsFromCart } = useCart();

  const total = cart.reduce((acc, curr) => acc + curr.price * curr.count, 0);

  return (
    <div className="glass-dark rounded-3xl border border-purple-300/20 shadow-glow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                <span className="sr-only">Image</span>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-white font-semibold">
                Product
              </th>
              <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                Quantity
              </th>
              <th scope="col" className="px-6 py-4 text-right text-white font-semibold">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                Remove
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {cart.map((item, ind) => (
              <tr key={ind} className="hover:bg-white/5 transition-colors duration-200 animate-slide-in-up" style={{animationDelay: `${ind * 100}ms`}}>
                <td className="px-6 py-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-medium ring-2 ring-white/10">
                    <OptimizedImage
                      src={getImageUrl(item.image)}
                      className="w-full h-full object-cover"
                      alt={item.name}
                      placeholderColor="bg-gradient-to-br from-purple-100 to-indigo-100"
                      eager={ind < 3}
                    />
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
                    <p className="text-white/60 text-sm">Premium Quality</p>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl">
                    <span className="font-bold text-white text-lg">{item.count}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div>
                    <p className="font-bold text-white text-xl">${item.price.toFixed(2)}</p>
                    <p className="text-white/60 text-sm">each</p>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <button
                    onClick={() => handleDeleteFromCart(item)}
                    className="w-12 h-12 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center transition-all duration-200 hover:scale-105 magnetic"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-white/5 border-t border-white/10">
            <tr>
              <td colSpan={2} className="px-6 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white">Cart Summary</span>
                    <button 
                      onClick={handleClearItemsFromCart} 
                      className="ml-4 text-sm text-red-400 hover:text-red-300 underline transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-6 py-8 text-center">
                <div>
                  <p className="text-sm text-white/60">Total Items</p>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-xl mt-2">
                    <span className="text-lg font-bold text-white">{cart.length}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-8 text-right">
                <div>
                  <p className="text-sm text-white/60">Total Amount</p>
                  <p className="text-3xl font-bold text-white mt-1">${total.toFixed(2)}</p>
                </div>
              </td>
              <td className="px-6 py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default NonEmptyCart;
