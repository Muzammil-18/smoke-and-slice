import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

function FoodCard({ item, addToCart }) {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [added, setAdded] = useState(false);

  const availableSizes = Array.isArray(item.sizes) ? item.sizes : [];
  const availableExtras = Array.isArray(item.extras) ? item.extras : [];

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) return prev.filter((e) => e.name !== extra.name);
      return [...prev, { name: extra.name, price: parseFloat(extra.price) }];
    });
  };

  const basePrice = selectedSize ? selectedSize.price : item.price;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.price || 0), 0);
  const currentTotal = basePrice + extrasTotal;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isAvailable) return;

    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]); // Select first size by default
      setShowSizeModal(true);
    } else if (availableExtras.length > 0) {
      setSelectedExtras([]);
      setShowExtrasModal(true);
    } else {
      addToCart({ ...item, selectedSize: null, selectedExtras: [] }, 1);
      flashAdded();
    }
  };

  const handleSizeNext = () => {
    setShowSizeModal(false);
    if (availableExtras.length > 0) {
      setSelectedExtras([]);
      setShowExtrasModal(true);
    } else {
      addToCart({ ...item, selectedSize, selectedExtras: [] }, 1);
      flashAdded();
    }
  };

  const handleConfirmExtras = () => {
    addToCart({ ...item, selectedSize, selectedExtras }, 1);
    setShowExtrasModal(false);
    flashAdded();
  };

  const handleSkipExtras = () => {
    addToCart({ ...item, selectedSize, selectedExtras: [] }, 1);
    setShowExtrasModal(false);
    flashAdded();
  };

  const flashAdded = () => {
    toast.success(`${item.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className={`bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group h-full shadow-lg ${item.isAvailable ? 'border-neutral-800 hover:border-primary/50' : 'border-neutral-800 opacity-75'}`}>
        <Link to={`/menu/${item.id}`} className="relative block overflow-hidden aspect-[4/3] flex-shrink-0 bg-neutral-950">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${item.isAvailable ? 'group-hover:scale-110' : ''}`}
            loading="lazy"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                Sold Out
              </span>
            </div>
          )}
          <div className={`absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 text-xs font-bold ${item.isAvailable ? 'text-primary' : 'text-neutral-500'}`}>
            {item.category?.name || 'Dish'}
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-grow">
          <Link to={`/menu/${item.id}`} className={`block mb-2 transition-colors ${item.isAvailable ? 'group-hover:text-primary' : ''}`}>
            <h3 className="text-lg font-bold text-white tracking-wide line-clamp-1">{item.name}</h3>
          </Link>
          <p className="text-neutral-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">{item.description}</p>

          <div className="flex gap-2 flex-wrap mb-3">
            {availableSizes.length > 0 && (
              <p className="bg-neutral-800 border border-neutral-700 text-white px-2 py-1 rounded text-[10px] uppercase font-bold">
                {availableSizes.length} Sizes
              </p>
            )}
            {availableExtras.length > 0 && (
              <p className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-1 rounded text-[10px] uppercase font-bold">
                {availableExtras.length} Extras
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800">
            <span className="text-xl font-black text-white">
              {availableSizes.length > 0 ? (
                <span className="text-sm font-semibold text-neutral-400">from </span>
              ) : null}
              ${item.price.toFixed(2)}
            </span>
            {item.isAvailable ? (
              <button
                onClick={handleAdd}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${added ? 'bg-emerald-500 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs font-bold text-neutral-500 px-4 py-2 border border-neutral-700 rounded-xl cursor-not-allowed">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>

      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowSizeModal(false)}>
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Select Size</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Choose serving size for {item.name}</p>
              </div>
              <button onClick={() => setShowSizeModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
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
                      name="sizeSelection"
                      checked={!!isSelected}
                      onChange={() => setSelectedSize({ name: size.name, price: parseFloat(size.price) })}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleSizeNext}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex justify-center items-center"
            >
              {availableExtras.length > 0 ? 'Next: Choose Extras' : `Add to Cart — $${currentTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {showExtrasModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowExtrasModal(false)}>
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Customize Your {item.name}</h3>
                {selectedSize && <p className="text-xs font-bold text-primary mt-1">Size: {selectedSize.name}</p>}
                <p className="text-xs text-neutral-400 mt-0.5">Would you like any extras?</p>
              </div>
              <button onClick={() => setShowExtrasModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
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

            <div className="flex justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800">
              <span>Item total:</span>
              <span className="text-white font-bold">${currentTotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSkipExtras}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Skip Extras
              </button>
              <button
                onClick={handleConfirmExtras}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FoodCard;