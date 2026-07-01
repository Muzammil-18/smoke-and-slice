import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Star, ShieldCheck, Truck, ChefHat, ArrowRight } from 'lucide-react'
import FoodCard from '../components/FoodCard'

function Home({ addToCart }) {
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/menu/categories');
        const itemRes = await fetch('/api/menu/items');
        
        if (catRes.ok && itemRes.ok) {
          const catData = await catRes.json();
          const itemData = await itemRes.json();
          setCategories(catData.slice(0, 6));
          setFeaturedItems(itemData.slice(3, 7));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const reviews = [
    { name: 'Marcus Sterling', role: 'BBQ Connoisseur', review: 'The Smoked Texas Brisket is absolutely legendary. The bark, the smoke ring, the tenderness—easily the best in town!', rating: 5 },
    { name: 'Sarah Jenkins', role: 'Food Blogger', review: 'Double Pepperoni Pizza has a perfect wood-fired crust. Ordering online as a guest was so fast and convenient.', rating: 5 },
    { name: 'David Cho', role: 'Local Guide', review: 'BBQ Bacon Smokehouse Burger was massive and loaded with flavor. The onion rings are highly recommended.', rating: 5 },
  ];

  return (
    <div className="space-y-24 pb-20">
      <section className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "linear-gradient(to bottom, rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.95)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80')" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10 py-16">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/45 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-primary animate-bounce">
            <Flame className="w-4 h-4" />
            <span>Slow-Smoked Masterpieces</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Where Smoke Meets <br />
            <span className="text-primary">Culinary Perfection</span>
          </h1>

          <p className="max-w-2xl mx-auto text-neutral-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed">
            Indulge in authentic low-and-slow Texas BBQ, wood-fired pizzas, and handcrafted burgers cooked to sizzling perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/menu" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-primary/25 text-center">
              Order Online Now
            </Link>
            <Link to="/about" className="w-full sm:w-auto bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-xl border border-neutral-800 transition-all duration-200 text-base text-center">
              Explore Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Categories</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Explore Our Smokehouse Menu</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/menu?category=${cat.id}`)}
                className="bg-neutral-900 border border-neutral-850 hover:border-primary rounded-2xl p-5 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300 group shadow-md"
              >
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-4 border border-neutral-850 group-hover:border-primary transition-colors">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-4">
          <div className="space-y-4 text-left">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Best Sellers</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Our Popular Dishes</p>
          </div>
          <Link to="/menu" className="flex items-center space-x-2 text-sm font-bold text-primary hover:text-white transition-colors">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <FoodCard key={item.id} item={item} addToCart={addToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-neutral-900 border-y border-neutral-850 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-neutral-850">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
                alt="Chef preparing BBQ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 bg-neutral-950/85 backdrop-blur-md p-6 rounded-2xl border border-neutral-800 max-w-xs">
                <p className="text-3xl font-black text-primary">15+</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">Years of Slow-Smoking Legacy</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Our Story</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">We Infuse Smoke & Slice with Pure Passion</h3>
              </div>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Founded in the heart of Texas, Smoke & Slice was born from a desire to combine the wood-fired smokehouse tradition with artisanal pizza making and premium burgers. We source only AAA-grade cuts of meat, smoke them for up to 16 hours over seasoned hickory wood, and craft our dough fresh daily.
              </p>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Our kitchen represents a culinary crossroads, where traditional pits meet high-heat stone ovens. No shortcuts, no compromises.
              </p>
              <div className="pt-2">
                <Link to="/about" className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-6 py-3 rounded-xl border border-neutral-750 transition-colors">
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Why Us</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">The Smokehouse Experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Pitmaster Standard</h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Every cut of brisket, pork, and rib is rubbed with local spices and monitored continuously by our certified pitmasters.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Fresh Premium Ingredients</h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              We cook with 100% grass-fed beef, organic garden herbs, real mozzarella cheese, and smoke-dried spices.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Steaming Hot Delivery</h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              All delivery orders are packaged in thermal insulated bags to ensure they arrive at your door fresh and hot.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 border-y border-neutral-850 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Reviews</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">What Our Customers Say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div key={index} className="bg-neutral-950 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-400 text-sm italic leading-relaxed">
                    "{rev.review}"
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-850 mt-6">
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">Ready to Try the Best BBQ in Town?</h2>
            <p className="max-w-xl mx-auto text-neutral-400 text-sm sm:text-base leading-relaxed">
              Order directly as a guest or create an account to start earning smoke points on every order. Free delivery on orders over $50!
            </p>
          </div>

          <div className="flex justify-center relative z-10 pt-2">
            <Link to="/menu" className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-primary/20">
              Browse Our Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
