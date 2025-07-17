import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/api";
import { getImageUrl } from "../services/api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setIsPending(true);

    const fetchMyOrders = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        if (response.data) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.log(error);
        setError(error.message || "Something went wrong");
      } finally {
        setIsPending(false);
      }
    };

    fetchMyOrders();
  }, [orderId]);

  order && console.log(order);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green mx-auto"></div>
          <p className="mt-4 text-forest-green">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold text-burnt-sienna mb-2">Error Loading Order</h2>
          <p className="text-forest-green mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-word mb-2">Order Details</h1>
          {order && (
            <div className="flex justify-between items-center">
              <p className="text-forest-green">
                Order #{order._id.slice(-6).toUpperCase()} •
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order.paid ? "bg-pale-lime text-forest-green" : "bg-sunset-orange text-white"
                  }`}
                >
                  {order.paid ? "Paid" : "Pending"}
                </span>
              </p>
              <p className="text-forest-green font-semibold">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
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
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.products.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-4">
                      <img
                        src={getImageUrl(item.product.image)}
                        className="w-16 md:w-32 max-w-full max-h-full rounded-md"
                        alt={item.product.name}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-forest-green">
                      {item.product.name}
                      <p className="text-sm font-normal text-gray-600 mt-1">{item.product.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-bold px-3 text-forest-green">{item.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-forest-green">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-forest-green">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
