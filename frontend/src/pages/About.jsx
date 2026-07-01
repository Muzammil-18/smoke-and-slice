import React from 'react'
import { Link } from 'react-router-dom'
import { Flame, Clock, Users, Trophy } from 'lucide-react'

function About() {
  return (
    <div className="pb-24">
      <section className="relative py-24 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.95)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop')" }}>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-wide">Our Story</h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Slow fires, seasoned hickory wood, and a commitment to culinary craft since 2011.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">From Pits to Plates</h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              At Smoke & Slice, we believe that true BBQ cannot be rushed. That is why our pits run 24 hours a day, burning seasoned Texas oak and hickory woods. We select only the finest cuts of brisket and pork, seasoning them with our proprietary dry rub before slow smoking them for up to 16 hours.
            </p>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              But we did not stop there. We wondered what would happen if we married the smoky depth of Texas pit cooking with the high-heat blister of authentic Italian pizza ovens. The result? A menu where smokey pulled pork sits on gourmet crusts, and smoked brisket makes for the ultimate premium burger.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-850 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"
              alt="Kitchen food preparation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white">16 Hours</h3>
            <p className="text-neutral-400 text-xs sm:text-sm">Slow smoking times for our signature AAA brisket cuts.</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white">100% Fresh</h3>
            <p className="text-neutral-400 text-xs sm:text-sm">Dough prepared fresh every morning and rested for 24 hours.</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white">50k+</h3>
            <p className="text-neutral-400 text-xs sm:text-sm">Happy customers served and counting in Austin.</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white">12 Awards</h3>
            <p className="text-neutral-400 text-xs sm:text-sm">Voted top BBQ burger joint in state culinary reviews.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-8 sm:p-16 text-center space-y-8">
          <h2 className="text-3xl font-black text-white">Experience it yourself today</h2>
          <p className="max-w-xl mx-auto text-neutral-400 text-sm sm:text-base leading-relaxed">
            Whether you want a table reservation or fresh delivery at your doorstep, we have you covered.
          </p>
          <div className="flex justify-center pt-2">
            <Link to="/menu" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
