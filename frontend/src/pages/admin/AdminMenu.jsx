import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Utensils, ToggleLeft, ToggleRight, PlusCircle, MinusCircle } from 'lucide-react'

function AdminMenu({ user }) {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState([]);
  
  const [hasExtras, setHasExtras] = useState(false);
  const [extras, setExtras] = useState([]);

  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    try {
      const itemsRes = await fetch('/api/menu/items');
      const catsRes = await fetch('/api/menu/categories');
      if (itemsRes.ok && catsRes.ok) {
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        setMenuItems(itemsData);
        setCategories(catsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setName(''); setDescription(''); setPrice(''); setImage('');
    setCategoryId(categories.length > 0 ? categories[0].id.toString() : '');
    setHasSizes(false); setSizes([]);
    setHasExtras(false); setExtras([]); 
    setError('');
  };

  const handleOpenAddModal = () => {
    setEditMode(false); setCurrentId(null);
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditMode(true); setCurrentId(item.id);
    setName(item.name); setDescription(item.description);
    setPrice(item.price.toString()); setImage(item.image);
    setCategoryId(item.categoryId.toString());
    
    const itemSizes = Array.isArray(item.sizes) ? item.sizes : [];
    setHasSizes(itemSizes.length > 0);
    setSizes(itemSizes.length > 0 ? itemSizes : []);

    const itemExtras = Array.isArray(item.extras) ? item.extras : [];
    setHasExtras(itemExtras.length > 0);
    setExtras(itemExtras.length > 0 ? itemExtras : []);
    
    setError('');
    setModalOpen(true);
  };

  // Sizes Handlers
  const addSizeRow = () => setSizes((prev) => [...prev, { name: '', price: '' }]);
  const removeSizeRow = (index) => setSizes((prev) => prev.filter((_, i) => i !== index));
  const updateSize = (index, field, value) => {
    setSizes((prev) => prev.map((sz, i) => i === index ? { ...sz, [field]: value } : sz));
  };
  const handleHasSizesChange = (checked) => {
    setHasSizes(checked);
    if (checked && sizes.length === 0) setSizes([{ name: '', price: '' }]);
    if (!checked) setSizes([]);
  };

  // Extras Handlers
  const addExtraRow = () => setExtras((prev) => [...prev, { name: '', price: '' }]);
  const removeExtraRow = (index) => setExtras((prev) => prev.filter((_, i) => i !== index));
  const updateExtra = (index, field, value) => {
    setExtras((prev) => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };
  const handleHasExtrasChange = (checked) => {
    setHasExtras(checked);
    if (checked && extras.length === 0) setExtras([{ name: '', price: '' }]);
    if (!checked) setExtras([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitLoading(true);

    const validSizes = hasSizes
      ? sizes.filter(sz => sz.name.trim() && sz.price !== '').map(sz => ({ name: sz.name.trim(), price: parseFloat(sz.price) }))
      : [];

    const validExtras = hasExtras
      ? extras.filter(ex => ex.name.trim() && ex.price !== '').map(ex => ({ name: ex.name.trim(), price: parseFloat(ex.price) }))
      : [];

    // If item has sizes, the base price from the input might just be a display/starting price
    // But we still require it for standard fallback
    const payload = {
      name, description,
      price: parseFloat(price),
      image,
      categoryId: parseInt(categoryId),
      sizes: validSizes,
      extras: validExtras,
    };

    try {
      const url = editMode ? `/api/menu/items/${currentId}` : '/api/menu/items';
      const method = editMode ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await fetch(`/api/menu/items/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Toggle failed');
      }
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Manage Menu</h1>
          <p className="text-xs text-neutral-400 mt-1">Configure menu items, prices, sizes, and availability.</p>
        </div>
        <button onClick={handleOpenAddModal} className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : menuItems.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Image</th>
                  <th className="py-4 px-5">Dish</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5 text-center">Options</th>
                  <th className="py-4 px-5 text-right">Base Price</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {menuItems.map((item) => {
                  const itemSizes = Array.isArray(item.sizes) ? item.sizes : [];
                  const itemExtras = Array.isArray(item.extras) ? item.extras : [];
                  return (
                    <tr key={item.id} className={`hover:bg-neutral-800/30 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                      <td className="py-4 px-5">
                        <div className="relative w-14 h-14">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-neutral-800" />
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[11px] text-neutral-500 max-w-xs truncate mt-0.5">{item.description}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="bg-neutral-800 text-neutral-300 text-xs font-semibold px-2.5 py-1 rounded-md">{item.category?.name}</span>
                      </td>
                      <td className="py-4 px-5 text-center space-y-1">
                        {itemSizes.length > 0 && (
                          <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mr-1">
                            {itemSizes.length} Sizes
                          </div>
                        )}
                        {itemExtras.length > 0 && (
                          <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                            {itemExtras.length} Extras
                          </div>
                        )}
                        {itemSizes.length === 0 && itemExtras.length === 0 && <span className="text-neutral-600 text-xs">—</span>}
                      </td>
                      <td className="py-4 px-5 text-right font-black text-white">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-5 text-center">
                        <button onClick={() => handleToggleAvailability(item.id)} className={`flex items-center justify-center mx-auto space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 ${item.isAvailable ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}>
                          {item.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button onClick={() => handleOpenEditModal(item)} className="inline-flex p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="inline-flex p-2 bg-neutral-800 hover:bg-primary/20 text-neutral-400 hover:text-primary rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-md ${!item.isAvailable ? 'opacity-70' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-neutral-800" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-[10px] text-neutral-500 bg-neutral-800 w-max px-2 py-0.5 rounded-md mt-1">{item.category?.name}</p>
                    <p className="text-sm font-extrabold text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 gap-2">
                  <button onClick={() => handleToggleAvailability(item.id)} className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${item.isAvailable ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {item.isAvailable ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                  </button>
                  <button onClick={() => handleOpenEditModal(item)} className="p-2 bg-neutral-800 text-neutral-300 rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-neutral-800 text-neutral-400 hover:text-primary rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <Utensils className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No dishes in the menu</h3>
          <p className="text-neutral-400 text-xs leading-normal">Start by adding items to your menu to publish them online.</p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{editMode ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <p className="text-xs text-neutral-400 mt-1">Configure dish details, sizes, and extras.</p>
            </div>
            {error && <div className="bg-primary/10 border border-primary/30 text-primary text-xs p-4 rounded-lg">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Dish Title</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Classic Cheeseburger" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Base Price ($)</label>
                  <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="12.99" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Image URL</label>
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://images.unsplash.com/photo-..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" placeholder="Fresh hand-ground patty topped with..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm resize-none" />
              </div>

              {/* SIZES SECTION */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-4 bg-neutral-950/40">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={hasSizes} onChange={(e) => handleHasSizesChange(e.target.checked)} className="sr-only" />
                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${hasSizes ? 'bg-primary' : 'bg-neutral-700'}`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${hasSizes ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">This item has different sizes</span>
                    <p className="text-xs text-neutral-500 mt-0.5">e.g. Small, Medium, Large (overrides base price)</p>
                  </div>
                </label>

                {hasSizes && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
                      <div className="col-span-3">Size Name</div>
                      <div className="col-span-1">Price ($)</div>
                      <div></div>
                    </div>
                    {sizes.map((sz, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center">
                        <input
                          type="text" value={sz.name} onChange={(e) => updateSize(index, 'name', e.target.value)}
                          placeholder="Large" className="col-span-3 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs"
                        />
                        <input
                          type="number" step="0.01" min="0" value={sz.price} onChange={(e) => updateSize(index, 'price', e.target.value)}
                          placeholder="14.99" className="col-span-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs"
                        />
                        <button type="button" onClick={() => removeSizeRow(index)} className="flex items-center justify-center text-neutral-500 hover:text-primary transition-colors">
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addSizeRow} className="flex items-center space-x-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-1">
                      <PlusCircle className="w-4 h-4" /><span>Add Size Option</span>
                    </button>
                  </div>
                )}
              </div>

              {/* EXTRAS SECTION */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-4 bg-neutral-950/40">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={hasExtras} onChange={(e) => handleHasExtrasChange(e.target.checked)} className="sr-only" />
                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${hasExtras ? 'bg-primary' : 'bg-neutral-700'}`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${hasExtras ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">This item has extras / add-ons</span>
                    <p className="text-xs text-neutral-500 mt-0.5">e.g. Extra Cheese, Extra Patty</p>
                  </div>
                </label>

                {hasExtras && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
                      <div className="col-span-3">Extra Name</div>
                      <div className="col-span-1">Price ($)</div>
                      <div></div>
                    </div>
                    {extras.map((ex, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center">
                        <input
                          type="text" value={ex.name} onChange={(e) => updateExtra(index, 'name', e.target.value)}
                          placeholder="Extra Cheese" className="col-span-3 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs"
                        />
                        <input
                          type="number" step="0.01" min="0" value={ex.price} onChange={(e) => updateExtra(index, 'price', e.target.value)}
                          placeholder="1.50" className="col-span-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs"
                        />
                        <button type="button" onClick={() => removeExtraRow(index)} className="flex items-center justify-center text-neutral-500 hover:text-primary transition-colors">
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addExtraRow} className="flex items-center space-x-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-1">
                      <PlusCircle className="w-4 h-4" /><span>Add Extra Option</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex space-x-3 sticky bottom-0 bg-neutral-900 py-2">
                <button type="button" onClick={() => setModalOpen(false)} className="w-1/2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3.5 rounded-xl text-xs transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitLoading} className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex justify-center items-center">
                  {submitLoading ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;