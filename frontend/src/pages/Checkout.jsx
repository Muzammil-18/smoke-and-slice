import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Flame, CreditCard, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'

function Checkout({ user, cart, onClearCart }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const getItemUnitPrice = (item) => {
    const basePrice = item.selectedSize ? parseFloat(item.selectedSize.price) : item.price;
    const extrasTotal = Array.isArray(item.selectedExtras)
      ? item.selectedExtras.reduce((sum, e) => sum + (parseFloat(e.price) || 0), 0)
      : 0;
    return basePrice + extrasTotal;
  };

  const subtotal = cart.reduce((total, item) => total + getItemUnitPrice(item) * item.quantity, 0);
  const tax = subtotal * 0.1;
  const deliveryCharge = subtotal > 50 ? 0.0 : 5.0;
  const grandTotal = subtotal + tax + deliveryCharge;

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center px-4">
        <ShoppingBag className="w-16 h-16 text-neutral-500 mx-auto" />
        <h2 className="text-2xl font-extrabold text-white">Nothing to checkout</h2>
        <p className="text-neutral-400 text-sm">Your cart is empty. Add some dishes first.</p>
        <button onClick={() => navigate('/menu')} className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-primary-dark transition-colors">
          Browse Menu
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = cart.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize || null,
      selectedExtras: Array.isArray(item.selectedExtras) ? item.selectedExtras : [],
    }));

    const orderData = { 
      name, 
      email, 
      phone, 
      address, 
      city, 
      specialInstructions: `${specialInstructions} [Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}]`.trim(), 
      items: orderItems 
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order placement failed');
      
      onClearCart();
      toast.success('Order placed successfully! 🍕');
      navigate(`/order-success/${data.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-colors placeholder-neutral-600';
  const labelClass = 'block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-wide">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8">
            
            {/* Delivery Details Section */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-4">1. Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="John Smith" />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="john@email.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Austin, TX" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Delivery Address</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="123 Main Street, Apt 4B" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Special Instructions <span className="text-neutral-600 lowercase normal-case font-normal">(optional)</span></label>
                  <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows="2" className={`${inputClass} resize-none`} placeholder="Allergy notes, delivery instructions, etc." />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-4">2. Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-primary/5 border-primary/50' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center space-x-2 text-white font-bold">
                      <Banknote className="w-4 h-4 text-emerald-500" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Pay with cash at your doorstep.</p>
                  </div>
                </label>

                <label className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-primary/5 border-primary/50' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1"
                    disabled
                  />
                  <div>
                    <div className="flex items-center space-x-2 text-neutral-400 font-bold">
                      <CreditCard className="w-4 h-4" />
                      <span>Credit / Debit Card</span>
                    </div>
                    <p className="text-xs text-primary mt-1 font-semibold">Coming Soon</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-primary/20">
                <Flame className="w-4 h-4" />
                <span>{loading ? 'Processing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}</span>
              </button>
              <p className="text-[11px] text-neutral-500 text-center mt-3">
                🔒 Secure checkout. An order confirmation email will be sent to you.
              </p>
            </div>
          </form>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-4">Order Summary</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {cart.map((item, i) => {
              const unitPrice = getItemUnitPrice(item);
              const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
              return (
                <div key={i} className="flex justify-between items-start gap-3 text-sm">
                  <div>
                    <p className="text-white font-semibold leading-normal">
                      {item.name} {item.selectedSize && <span className="text-primary text-[10px]">({item.selectedSize.name})</span>} <span className="text-neutral-500">x{item.quantity}</span>
                    </p>
                    {extras.length > 0 && (
                      <div className="space-y-0.5 mt-0.5">
                        {extras.map((ex, j) => (
                          <p key={j} className="text-[11px] text-amber-400/80">+ {ex.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-white font-bold flex-shrink-0">${(unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="space-y-3 text-xs border-t border-neutral-800 pt-4">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Sales Tax (10%)</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Delivery Fee</span>
              <span className="text-white">
                {deliveryCharge === 0 ? <span className="text-emerald-500">Free!</span> : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-neutral-800">
              <span>Grand Total</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;