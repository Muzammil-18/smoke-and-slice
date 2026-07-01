import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'

function Cart({ cart, onUpdateQty, onRemove }) {
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

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-12 bg-neutral-900 border border-neutral-800 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Your cart is empty</h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            Head back to the menu to explore our delicious dishes.
          </p>
        </div>
        <Link to="/menu" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-primary/20">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-wide">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6 text-center">Quantity</th>
                  <th className="py-4 px-6 text-right">Unit Price</th>
                  <th className="py-4 px-6 text-right">Subtotal</th>
                  <th className="py-4 px-6 text-center">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {cart.map((item, idx) => {
                  const unitPrice = getItemUnitPrice(item);
                  const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
                  return (
                    <tr key={idx} className="hover:bg-neutral-800/30">
                      <td className="py-5 px-6">
                        <div className="flex items-start space-x-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-neutral-800 flex-shrink-0" />
                          <div>
                            <h3 className="font-bold text-white leading-normal">
                              {item.name}
                              {item.selectedSize && <span className="text-primary text-xs ml-2 uppercase tracking-wide">({item.selectedSize.name})</span>}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">{item.category?.name}</p>
                            {extras.length > 0 && (
                              <div className="mt-1.5 space-y-0.5">
                                {extras.map((ex, i) => (
                                  <p key={i} className="text-[11px] text-amber-400/80">
                                    + {ex.name} <span className="text-neutral-500">(+${parseFloat(ex.price).toFixed(2)})</span>
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => onUpdateQty(item.id, item.quantity - 1, item.selectedSize, item.selectedExtras)} className="p-1.5 border border-neutral-700 rounded-lg hover:border-neutral-500">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold w-8 text-center text-white">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, item.quantity + 1, item.selectedSize, item.selectedExtras)} className="p-1.5 border border-neutral-700 rounded-lg hover:border-neutral-500">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right text-neutral-300">${unitPrice.toFixed(2)}</td>
                      <td className="py-5 px-6 text-right font-bold text-white">${(unitPrice * item.quantity).toFixed(2)}</td>
                      <td className="py-5 px-6 text-center">
                        <button onClick={() => onRemove(item.id, item.selectedSize, item.selectedExtras)} className="p-2 text-neutral-500 hover:text-primary rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {cart.map((item, idx) => {
              const unitPrice = getItemUnitPrice(item);
              const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
              return (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-neutral-800 flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-white text-sm">
                        {item.name}
                        {item.selectedSize && <span className="text-primary text-[10px] ml-2">({item.selectedSize.name})</span>}
                      </h3>
                      <p className="text-xs text-neutral-500">${(item.selectedSize ? item.selectedSize.price : item.price).toFixed(2)} base</p>
                      {extras.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {extras.map((ex, i) => (
                            <p key={i} className="text-[11px] text-amber-400/80">+ {ex.name} (+${parseFloat(ex.price).toFixed(2)})</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onUpdateQty(item.id, item.quantity - 1, item.selectedSize, item.selectedExtras)} className="p-1 border border-neutral-700 rounded-lg">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1, item.selectedSize, item.selectedExtras)} className="p-1 border border-neutral-700 rounded-lg">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-white">${(unitPrice * item.quantity).toFixed(2)}</span>
                    <button onClick={() => onRemove(item.id, item.selectedSize, item.selectedExtras)} className="p-1.5 text-neutral-500 hover:text-primary">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-4">Cart Summary</h2>
          <div className="space-y-4 text-sm">
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
                {deliveryCharge === 0 ? <span className="text-emerald-500">Free</span> : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            {deliveryCharge > 0 && (
              <p className="text-[11px] text-neutral-500 leading-normal">
                Spend <span className="font-bold text-primary">${(50 - subtotal).toFixed(2)}</span> more for free delivery!
              </p>
            )}
            <div className="flex justify-between text-base font-bold text-white pt-4 border-t border-neutral-800">
              <span>Grand Total</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Link to="/checkout" className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/20">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/menu" className="w-full block text-center text-xs font-bold text-neutral-400 hover:text-white py-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;