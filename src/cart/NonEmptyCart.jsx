import useCart from "../hooks/useCart";
import { getImageUrl } from "../services/api";
import ClearSvg from "../svgs/ClearSvg";

function NonEmptyCart() {
  const { cart, handleDeleteFromCart, handleClearItemsFromCart } = useCart();

  const total = cart.reduce((acc, curr) => acc + curr.price * curr.count, 0);

  return (
    <div className="mx-4 my-6 overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right ">
        <thead className="text-xs uppercase">
          <tr>
            <th scope="col" className="px-16 py-3">
              <span className="sr-only">Image</span>
            </th>
            <th scope="col" className="px-6 py-3 text-sunset-orange">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-sunset-orange">
              Qty
            </th>
            <th scope="col" className="px-6 py-3 text-sunset-orange">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-sunset-orange">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, ind) => (
            <tr key={ind} className="border-b cursor-pointer">
              <td className="p-4">
                <img
                  src={getImageUrl(item.image)}
                  className="w-16 md:w-32 max-w-full max-h-full rounded-md"
                  alt={item.name}
                />
              </td>
              <td className="px-6 py-4 font-semibold text-forest-green">{item.name}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <span className=" font-bold px-3 text-forest-green">{item.count}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-forest-green">${item.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDeleteFromCart(item)}
                  className="font-medium text-xl cursor-pointer text-forest-green"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <th scope="row" className="px-6 py-3 text-base text-sunset-orange">
              Total
            </th>
            <td className="px-6 py-3 text-forest-green">Items</td>
            <td className="px-6 py-3">
              <div className="flex items-center">
                <span className=" font-bold px-3 text-forest-green">{cart.length}</span>
              </div>
            </td>
            <td className="px-6 py-3 text-forest-green">${total.toFixed(2)}</td>
            <td className="px-6 py-3">
              <div className="relative group">
                <button onClick={handleClearItemsFromCart} className=" cursor-pointer text-forest-green">
                  <ClearSvg />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white gradient-warm-sunset rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Clear Cart
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default NonEmptyCart;
