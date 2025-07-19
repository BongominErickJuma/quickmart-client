import React, { useEffect, useState } from "react";
import usePerson from "../hooks/usePerson";
import { orderService } from "../services/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const MyOrders = () => {
  const { user, isLoadingUser } = usePerson();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || isLoadingUser) return; // Wait until user is available

    setIsPending(true);

    const fetchMyOrders = async () => {
      try {
        const response = await orderService.getMyOrders(user.id);
        if (response.data) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setIsPending(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green mx-auto"></div>
          <p className="mt-4 text-forest-green">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold text-burnt-sienna mb-2">Error Loading Orders</h2>
          <p className="text-forest-green mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sunset-orange text-white rounded-md hover:bg-burnt-sienna transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#e7fbb4]/20 to-[#638c6d]/10 p-6">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-6 gradient-word">My Orders</h1>

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-sunset-orange">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-6 py-4 font-semibold text-forest-green">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-forest-green">
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 text-forest-green">{order.products.length}</td>
                  <td className="px-6 py-4 font-semibold text-forest-green">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.paid ? "bg-pale-lime text-forest-green" : "bg-sunset-orange text-white"
                      }`}
                    >
                      {order.paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="font-medium text-forest-green hover:text-burnt-sienna transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center mt-6">
            <h2 className="text-xl font-bold text-burnt-sienna mb-2">No Orders Found</h2>
            <p className="text-forest-green">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
