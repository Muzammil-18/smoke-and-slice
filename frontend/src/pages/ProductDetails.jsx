import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, ShieldAlert, Plus, Minus, Check } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/menu/items/${id}`);
        if (!res.ok) throw new Error('Menu item not found');
        const data = await res.json();
        setItem(data);
        
        const availableSizes = Array.isArray(data.sizes) ? data.sizes : [];
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const availableSizes = item && Array.isArray(item.sizes) ? item.sizes : [];
  const availableExtras = item && Array.isArray(item.extras) ? item.extras : [];

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) return prev.filter((e) => e.name !== extra.name);
      return [...prev, { name: extra.name, price: parseFloat(extra.price) }];
    });
  };

  const basePrice = selectedSize ? parseFloat(selectedSize.price) : (item?.price || 0);
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.price || 0), 0);
  const unitPrice = basePrice + extrasTotal;
  const lineTotal = unitPrice * quantity;

  const handleAdd = () => {
    if (!item || !item.isAvailable) return;

    const cartItem = {
      ...item,
      selectedSize,
      selectedExtras,
    };

    addToCart(cartItem, quantity);
    toast.success(`${quantity}x ${item.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-neutral-400 text-sm">Preparing details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-neutral-900 border border-neutral-800 rounded-3xl text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Item Not Found</h3>
          <p className="text-neutral-400 text-xs sm:text-sm">{error || 'The requested dish does not exist or has been removed.'}</p>
        </div>
        <Link to="/menu" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/menu" className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
              <span className="bg-red-600 text-white text-lg font-black px-6 py-3 rounded-2xl uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                {item.category?.name}
              </span>
              {!item.isAvailable && (
                <span className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider">
                  Currently Unavailable
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{item.name}</h1>
            <p className="text-2xl font-black text-primary">
              ${unitPrice.toFixed(2)}
              {(extrasTotal > 0 || selectedSize) && (
                <span className="text-sm font-normal text-neutral-400 ml-2">
                  (${basePrice.toFixed(2)} base {extrasTotal > 0 ? `+ $${extrasTotal.toFixed(2)} extras` : ''})
                </span>
              )}
            </p>
          </div>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">{item.description}</p>

          {availableSizes.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Choose Serving Size</h3>
              </div>
              <div className="space-y-2">
                {availableSizes.map((size, index) => {
                  const isSelected = selectedSize && selectedSize.name === size.name;
                  return (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-150 ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-neutral-700 hover:border-neutral-600'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-primary' : 'border-neutral-600'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                        </div>
                        <span className="text-sm font-semibold text-white">{size.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">${parseFloat(size.price).toFixed(2)}</span>
                      <input
                        type="radio"
                        name="detailsSize"
                        checked={!!isSelected}
                        onChange={() => setSelectedSize({ name: size.name, price: parseFloat(size.price) })}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {availableExtras.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Customize Your Order</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Select any extras you'd like to add:</p>
              </div>
              <div className="space-y-2">
                {availableExtras.map((extra, index) => {
                  const isSelected = selectedExtras.find((e) => e.name === extra.name);
                  return (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-150 ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-neutral-700 hover:border-neutral-600'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-neutral-600'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-semibold text-white">{extra.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">+${parseFloat(extra.price).toFixed(2)}</span>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleExtra(extra)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
              {selectedExtras.length > 0 && (
                <div className="flex justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                  <span>Extras subtotal:</span>
                  <span className="text-primary font-bold">+${extrasTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {item.isAvailable ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-neutral-800">
              <div className="flex items-center justify-between border border-neutral-800 rounded-xl bg-neutral-900 px-4 py-2 text-white sm:w-36">
                <button onClick={() => setQuantity((p) => Math.max(1, p - 1))} className="p-2 text-neutral-400 hover:text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-extrabold px-4">{quantity}</span>
                <button onClick={() => setQuantity((p) => p + 1)} className="p-2 text-neutral-400 hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-grow flex items-center justify-center space-x-2 font-bold px-8 py-4 rounded-xl transition-all duration-200 text-sm ${added ? 'bg-emerald-500 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add {quantity} to Cart — ${lineTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="pt-6 border-t border-neutral-800">
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-400 font-bold text-sm">This item is currently unavailable.</p>
                <p className="text-neutral-500 text-xs mt-1">Please check back later or explore our other dishes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;