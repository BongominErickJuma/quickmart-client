import useCart from "../hooks/useCart";
import MinusSvg from "../svgs/MinusSvg";
import PlusSvg from "../svgs/PlusSvg";

function IncrementDecrementBtn({ item, count }) {
  const { handleAddToCart, handleSubtractToCart } = useCart();

  return (
    <article className="roundedflex items-center">
      <button
        className="p-2 gradient-warm-sunset rounded text-pale-lime cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          handleSubtractToCart(item);
        }}
      >
        <MinusSvg />
      </button>
      <span className="px-4 text-lg text-pale-lime">{count}</span>
      <button
        className="p-2 gradient-warm-sunset rounded text-pale-lime cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(item);
        }}
      >
        <PlusSvg />
      </button>
    </article>
  );
}

export default IncrementDecrementBtn;
