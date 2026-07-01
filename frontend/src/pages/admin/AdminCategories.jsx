import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'

function AdminCategories({ user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/menu/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setName('');
    setImage('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditMode(true);
    setCurrentId(cat.id);
    setName(cat.name);
    setImage(cat.image);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      const url = editMode ? `/api/menu/categories/${currentId}` : '/api/menu/categories';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      await fetchCategories();
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All linked menu items will be deleted.')) {
      return;
    }

    try {
      const res = await fetch(`/api/menu/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }

      await fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Manage Categories</h1>
          <p className="text-xs text-neutral-400 mt-1">Configure food categories and upload icons.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden md:block bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-450 uppercase tracking-wider bg-neutral-900/50">
                  <th className="py-4 px-6">Preview</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6 text-center">Connected Dishes</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-sm">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-900/40">
                    <td className="py-4 px-6">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-850" />
                    </td>
                    <td className="py-4 px-6 font-bold text-white">{cat.name}</td>
                    <td className="py-4 px-6 text-center text-neutral-350">{cat._count?.menuItems || 0}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="inline-flex p-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="inline-flex p-2 bg-neutral-850 hover:bg-primary/20 text-neutral-400 hover:text-primary rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                  <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-xl object-cover border border-neutral-850" />
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{cat._count?.menuItems || 0} items linked</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-750"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 bg-neutral-850 text-neutral-450 hover:text-primary rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <ImageIcon className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No categories configured</h3>
          <p className="text-neutral-400 text-xs leading-normal">
            Get started by adding your first food category (e.g. Burgers, Starters, BBQ).
          </p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white">
                {editMode ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-xs text-neutral-450 mt-1">Specify name and high-quality image URL.</p>
            </div>

            {error && (
              <div className="bg-primary/10 border border-primary/30 text-primary text-xs p-4 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Burgers"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 bg-neutral-800 hover:bg-neutral-750 text-neutral-350 font-bold py-3.5 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex justify-center items-center"
                >
                  {submitLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
