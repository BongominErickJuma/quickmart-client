import useCart from "../hooks/useCart";
import MinusSvg from "../svgs/MinusSvg";
import PlusSvg from "../svgs/PlusSvg";

function IncrementDecrementBtn({ item, count }) {
  const { handleAddToCart, handleSubtractToCart } = useCart();

  return (
    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
      <button
        className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg shadow-soft hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-gray-200"
        onClick={(e) => {
          e.preventDefault();
          handleSubtractToCart(item);
        }}
      >
        <MinusSvg />
      </button>
      <span className="px-4 py-1 text-lg font-semibold text-primary min-w-[3rem] text-center">{count}</span>
      <button
        className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg shadow-soft hover:bg-green-50 hover:text-green-600 transition-all duration-200 border border-gray-200"
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(item);
        }}
      >
        <PlusSvg />
      </button>
    </div>
  );
}

export default IncrementDecrementBtn;
