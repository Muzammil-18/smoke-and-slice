import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Flame } from 'lucide-react'
import FoodCard from '../components/FoodCard'

function Menu({ addToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/menu/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        let url = '/api/menu/items';
        const params = [];
        if (selectedCategory !== 'all') {
          params.push(`category=${selectedCategory}`);
        }
        if (search) {
          params.push(`search=${encodeURIComponent(search)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMenuItems();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, search]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-wide">
          Our Hot & Fresh Menu
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Order slow smoked brisket, craft burgers, artisanal pizza, and cold drinks. Freshly cooked, piping hot.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex overflow-x-auto pb-3 md:pb-0 gap-3 no-scrollbar scroll-smooth flex-nowrap md:flex-wrap">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id.toString())}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id.toString()
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search our delicious dishes..."
            className="w-full bg-neutral-900 border border-neutral-850 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm"
          />
          <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-neutral-400 text-sm">Firing up the pits...</p>
        </div>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {menuItems.map((item) => (
            <FoodCard key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-primary">
            <Flame className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              We couldn't find any dishes matching your criteria. Try adjusting your search query or switching categories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
