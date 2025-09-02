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

  if (isPending) {
    return (
      <div className="min-h-screen animated-gradient flex justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/90 text-lg">Loading order details...</p>
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
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Order</h2>
          <p className="text-white/70">{error}</p>
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
      
      <div className="max-w-6xl mx-auto pt-24 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Order Details</h1>
          {order && (
            <div className="glass-dark rounded-2xl p-6 border border-purple-300/20 shadow-glow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      order.paid 
                        ? "bg-green-500/20 text-green-300 border border-green-300/30" 
                        : "bg-orange-500/20 text-orange-300 border border-orange-300/30"
                    }`}>
                      {order.paid ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-dark rounded-3xl border border-purple-300/20 shadow-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">
                    <span className="sr-only">Image</span>
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-white font-semibold">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-white font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-white font-semibold">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-white font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {order &&
                  order.products.map((item, index) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors duration-200" style={{animationDelay: `${index * 100}ms`}}>
                      <td className="px-6 py-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-medium ring-2 ring-white/10">
                          <img
                            src={getImageUrl(item.product.image)}
                            className="w-full h-full object-cover"
                            alt={item.product.name}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-6">
                        <div>
                          <h3 className="font-semibold text-white text-lg mb-1">{item.product.name}</h3>
                          <p className="text-white/60 text-sm">{item.product.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl">
                          <span className="font-bold text-white text-lg">{item.quantity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="font-semibold text-white text-lg">${item.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="font-bold text-white text-xl">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
