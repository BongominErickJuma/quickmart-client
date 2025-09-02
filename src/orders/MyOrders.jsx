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
  }, [user, isLoadingUser]);

  if (isPending) {
    return (
      <div className="min-h-screen animated-gradient flex justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/90 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-gradient flex justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        </div>
        <div className="glass-dark rounded-3xl p-8 shadow-glow text-center max-w-md border border-purple-300/20 relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to Load Orders</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-24 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-white/80">Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-dark rounded-3xl p-12 shadow-glow text-center animate-slide-in-up border border-purple-300/20">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-bounce-gentle">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-8 0V7a4 4 0 118 0v4m-8 0h8" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No Orders Yet</h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            </div>
            <Link to="/" className="btn btn-primary inline-flex items-center magnetic ripple">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-8 0V7a4 4 0 118 0v4m-8 0h8" />
              </svg>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="glass-dark rounded-3xl border border-purple-300/20 shadow-glow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-white font-semibold">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-white font-semibold">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-white font-semibold">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors duration-200 animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">#{order._id.slice(-8).toUpperCase()}</h3>
                            <p className="text-white/60 text-sm">Order ID</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div>
                          <p className="text-white font-medium">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                          <p className="text-white/60 text-sm">{format(new Date(order.createdAt), "HH:mm")}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          order.paid 
                            ? "bg-green-500/20 text-green-300 border border-green-300/30" 
                            : "bg-orange-500/20 text-orange-300 border border-orange-300/30"
                        }`}>
                          {order.paid ? "✓ Paid" : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-xl">
                          <span className="font-bold text-white text-lg">{order.products.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="font-bold text-white text-xl">${order.totalPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 hover:scale-105 magnetic"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium">View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Optional: Add pagination or load more functionality here if needed */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
