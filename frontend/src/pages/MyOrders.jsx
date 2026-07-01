import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/my', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Preparing':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Ready':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-750';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-neutral-400 text-sm">Fetching order logs...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-12 bg-neutral-900 border border-neutral-850 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">No orders placed yet</h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            You haven't ordered anything from us yet. Once you place an order, it will appear here.
          </p>
        </div>
        <Link to="/menu" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary/20">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide font-sans">My Orders</h1>
        <p className="text-xs text-neutral-450 mt-1">Review your smokehouse purchases and live status updates.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          return (
            <div
              key={order.id}
              className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden hover:border-neutral-800 transition-colors"
            >
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center text-primary font-bold">
                    #{order.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-neutral-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-neutral-850 sm:border-0 pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-neutral-500">Total Charged</p>
                    <p className="text-base font-extrabold text-primary mt-0.5">${order.grandTotal.toFixed(2)}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-neutral-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-6 border-t border-neutral-850 bg-neutral-900/40 divide-y divide-neutral-850 animate-fadeIn">
                  <div className="py-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Items Ordered</p>
                    {order.orderItems.map((item) => {
                      const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
                      const extrasTotal = extras.reduce((s, e) => s + (parseFloat(e.price) || 0), 0);
                      const lineTotal = (item.price + extrasTotal) * item.quantity;
                      return (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-300">
                              {item.menuItem.name} 
                              {item.selectedSize && <span className="text-primary text-[10px] ml-1">({item.selectedSize.name})</span>}
                              <span className="text-neutral-500 font-medium ml-1">x {item.quantity}</span>
                            </span>
                            <span className="font-semibold text-neutral-400">${lineTotal.toFixed(2)}</span>
                          </div>
                          {extras.length > 0 && (
                            <div className="ml-4 mt-1 space-y-0.5">
                              {extras.map((ex, ei) => (
                                <p key={ei} className="text-[11px] text-amber-400/80">
                                  + {ex.name} <span className="text-neutral-500">(+${parseFloat(ex.price).toFixed(2)})</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="py-4 space-y-2 text-sm text-neutral-400">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Delivery Summary</p>
                    <p><span className="font-bold text-white">Recipient:</span> {order.name}</p>
                    <p><span className="font-bold text-white">Address:</span> {order.address}, {order.city}</p>
                    <p><span className="font-bold text-white">Phone:</span> {order.phone}</p>
                    {order.specialInstructions && (
                      <p className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-850 mt-2 text-xs leading-normal">
                        <span className="font-bold text-primary block mb-0.5">Instructions:</span>
                        {order.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;