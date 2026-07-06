import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Flame, MapPin, Calendar, Clock, DollarSign } from 'lucide-react'

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        const headers = {};
        if (user && user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
        }

        const res = await fetch(`/api/orders/${id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-neutral-400 text-sm">Processing order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-neutral-900 border border-neutral-850 rounded-3xl text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
          <p className="text-neutral-455 text-xs sm:text-sm">
            Thank you for your order. We've received it and are processing it now!
          </p>
        </div>
        <Link to="/" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Order Placed Successfully!
        </h1>
        <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for choosing Smoke & Slice! Your order <span className="text-primary font-bold">#{order.id}</span> has been received and our pitmasters are already preparing it.
        </p>
        <p className="text-neutral-500 text-xs max-w-sm mx-auto">📧 A confirmation email with your invoice has been sent to <span className="text-white font-semibold">{order.email}</span></p>
      </div>

      <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-neutral-800 pb-2">
            Delivery Details
          </h3>
          <ul className="space-y-3 text-sm text-neutral-350">
            <li className="flex items-start space-x-2">
              <span className="font-bold text-white w-20 flex-shrink-0">Recipient:</span>
              <span>{order.name}</span>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{order.address}, {order.city}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-white w-20 flex-shrink-0">Phone:</span>
              <span>{order.phone}</span>
            </li>
            {order.specialInstructions && (
              <li className="flex items-start space-x-2 bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                <span className="text-xs leading-normal">
                  <span className="font-bold text-primary block mb-0.5">Instructions:</span>
                  {order.specialInstructions}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-neutral-800 pb-2">
            Order Status
          </h3>
          <ul className="space-y-3 text-sm text-neutral-350">
            <li className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Estimated Delivery: <span className="text-white font-semibold">35 - 45 mins</span></span>
            </li>
            <li className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Current Status: <span className="bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold">{order.status}</span></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-neutral-800 pb-2">
          Receipt Summary
        </h3>
        <div className="divide-y divide-neutral-850">
          {order.orderItems?.map((item) => {
            const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
            const extrasTotal = extras.reduce((s, e) => s + (parseFloat(e.price) || 0), 0);
            const lineTotal = (item.price + extrasTotal) * item.quantity;
            return (
              <div key={item.id} className="py-3 text-sm">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{item.menuItem.name}</p>
                    <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-neutral-350">${lineTotal.toFixed(2)}</span>
                </div>
                {extras.length > 0 && (
                  <div className="ml-4 mt-1.5 space-y-0.5">
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

        <div className="border-t border-neutral-800 pt-4 space-y-3 text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span className="text-white">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Sales Tax (10%)</span>
            <span className="text-white">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Delivery Fee</span>
            <span className="text-white">${order.deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
            <span>Grand Total Paid</span>
            <span className="text-primary">${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/menu" className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-xl border border-neutral-800 text-center transition-colors">
          Order Something Else
        </Link>
        <Link to="/" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl text-center transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;