import React, { useState, useEffect } from 'react'
import { Eye, X, ChevronDown, ShoppingBag } from 'lucide-react'

const STATUS_COLORS = {
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Preparing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Ready: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Rejected'];

function AdminOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
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

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = filterStatus === 'All' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Manage Orders</h1>
          <p className="text-xs text-neutral-400 mt-1">View, filter, and update customer orders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${filterStatus === s ? 'bg-primary text-white border-primary' : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No orders found</h3>
          <p className="text-neutral-400 text-xs">Try changing the filter or check back later.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Order #</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Items</th>
                  <th className="py-4 px-5 text-right">Total</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-center">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/30">
                    <td className="py-4 px-5 font-bold text-white">#{order.id}</td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{order.name}</div>
                      <div className="text-xs text-neutral-500">{order.email}</div>
                    </td>
                    <td className="py-4 px-5 text-neutral-300">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</td>
                    <td className="py-4 px-5 text-right font-bold text-white">${order.grandTotal.toFixed(2)}</td>
                    <td className="py-4 px-5 text-center">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus[order.id]}
                          className={`appearance-none text-xs font-bold px-3 py-1.5 pr-7 rounded-full border cursor-pointer transition-all focus:outline-none ${STATUS_COLORS[order.status] || 'bg-neutral-800 text-neutral-400 border-neutral-700'} bg-transparent`}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-4 px-5 text-neutral-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-center">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-white">#{order.id}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{order.name}</p>
                    <p className="text-[11px] text-neutral-500">{order.email}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    <span className="font-black text-white text-sm">${order.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingStatus[order.id]}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-neutral-800 text-neutral-300 rounded-xl">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-extrabold text-white">Order #{selectedOrder.id}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[selectedOrder.status]}`}>{selectedOrder.status}</span>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-neutral-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2 text-xs">
                  <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] mb-3">Customer</p>
                  <p className="text-white font-bold">{selectedOrder.name}</p>
                  <p className="text-neutral-400">{selectedOrder.email}</p>
                  <p className="text-neutral-400">{selectedOrder.phone}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2 text-xs">
                  <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] mb-3">Delivery Address</p>
                  <p className="text-white font-bold">{selectedOrder.address}</p>
                  <p className="text-neutral-400">{selectedOrder.city}</p>
                  {selectedOrder.specialInstructions && (
                    <p className="text-amber-400/80 italic">"{selectedOrder.specialInstructions}"</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((oi, index) => {
                    const extras = Array.isArray(oi.selectedExtras) ? oi.selectedExtras : [];
                    const extrasTotal = extras.reduce((s, e) => s + (parseFloat(e.price) || 0), 0);
                    const lineTotal = (oi.price + extrasTotal) * oi.quantity;
                    return (
                      <div key={index} className="flex items-start justify-between bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 gap-4">
                        <div className="flex items-start space-x-3">
                          {oi.menuItem?.image && (
                            <img src={oi.menuItem.image} alt={oi.menuItem.name} className="w-12 h-12 rounded-lg object-cover border border-neutral-800 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-white font-bold text-sm">
                              {oi.menuItem?.name || 'Item'}
                              {oi.selectedSize && <span className="text-primary text-[10px] ml-2">({oi.selectedSize.name})</span>}
                            </p>
                            <p className="text-neutral-500 text-xs">Qty: {oi.quantity} × ${oi.price.toFixed(2)}</p>
                            {extras.length > 0 && (
                              <div className="mt-1.5 space-y-0.5">
                                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Extras:</p>
                                {extras.map((ex, ei) => (
                                  <p key={ei} className="text-[11px] text-amber-400/80">
                                    + {ex.name} <span className="text-neutral-500">(+${parseFloat(ex.price).toFixed(2)})</span>
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-white text-sm">${lineTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span><span className="text-white">${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax (10%)</span><span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Fee</span><span className="text-white">${selectedOrder.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-neutral-800 mt-2">
                  <span>Grand Total</span><span className="text-primary">${selectedOrder.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Update Status</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      disabled={updatingStatus[selectedOrder.id] || selectedOrder.status === s}
                      className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all duration-200 ${selectedOrder.status === s ? `${STATUS_COLORS[s]} opacity-100` : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;