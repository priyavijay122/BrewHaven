import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { MenuItem, UserProfile } from '../types';
import { MENU_ITEMS, TESTIMONIALS, CATEGORIES } from '../data';

interface MainContentProps {
  onSelectItem: (product: MenuItem) => void;
  onAddToCart: (product: MenuItem) => void;
  onToggleWishlist: (product: MenuItem) => void;
  wishlist: MenuItem[];
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export default function MainContent({
  onSelectItem,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  currentUser,
  onOpenAuth
}: MainContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom reviews states
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('brew_haven_custom_reviews');
      const custom = saved ? JSON.parse(saved) : [];
      return [...TESTIMONIALS, ...custom];
    } catch (e) {
      return TESTIMONIALS;
    }
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Prefill review name if current user is logged in
  useEffect(() => {
    if (currentUser) {
      setReviewName(currentUser.name);
    } else {
      setReviewName('');
    }
  }, [currentUser]);
  
  // Handle global search event triggered from Header
  useEffect(() => {
    const handleSearchEvent = (event: Event) => {
      const query = (event as CustomEvent).detail || '';
      setSearchQuery(query);
    };
    window.addEventListener('search-coffee', handleSearchEvent);
    return () => window.removeEventListener('search-coffee', handleSearchEvent);
  }, []);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isItemWishlisted = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    const finalName = reviewName.trim() || (currentUser ? currentUser.name : 'Guest Critic');
    const finalRole = reviewRole.trim() || 'Verified Coffee Lover';
    
    const newReview = {
      id: `rev-${Date.now()}`,
      name: finalName,
      role: finalRole,
      comment: reviewComment,
      rating: reviewRating,
      avatar: currentUser 
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=C5A059&color=000`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    // Save custom reviews separately in localStorage
    try {
      const saved = localStorage.getItem('brew_haven_custom_reviews');
      const custom = saved ? JSON.parse(saved) : [];
      custom.push(newReview);
      localStorage.setItem('brew_haven_custom_reviews', JSON.stringify(custom));
    } catch (err) {
      console.error('Failed to save review:', err);
    }

    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2500);
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F0] relative z-20">
      
      {/* 1. ABOUT SECTION */}
      <section id="about" className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Info */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
              Our Legacy & Heritage
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light leading-tight text-white">
              Cultivating Pure Golden <br />
              <span className="italic text-[#C5A059] font-normal">Arabica Excellence</span>
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-xl">
              Nestled high inside the mist-kissed slopes of Coorg and the lush foothills of Chikmagalur, Brew Haven partners directly with multi-generational estates to curate the finest, single-origin shade-grown Arabica beans. 
            </p>
            <p className="text-sm text-white/70 leading-relaxed max-w-xl">
              Every bean is hand-harvested at the peak of ripeness, sun-dried on dynamic natural brick patios, and micro-roasted to perfection. We celebrate the sensory art of brewing, weaving cardamom, saffron, and natural vanilla infusions into classical barista foundations.
            </p>
            
            {/* Elegant highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-serif text-[#C5A059]">18hr</span>
                <span className="block text-[9px] uppercase tracking-wider text-white/40 mt-1">Slow Steeped Cold Brew</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif text-[#C5A059]">100%</span>
                <span className="block text-[9px] uppercase tracking-wider text-white/40 mt-1">Single Origin Arabica</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif text-[#C5A059]">4.9★</span>
                <span className="block text-[9px] uppercase tracking-wider text-white/40 mt-1">Rating from Critics</span>
              </div>
            </div>
          </div>

          {/* Aesthetic Review Image Display */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#C5A059]/10 rounded-3xl blur-3xl pointer-events-none"></div>
            
            {/* Frame for review image */}
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-[#C5A059]/20 shadow-2xl shadow-black/80 group bg-black/45">
              <img 
                src="review image.jpeg" 
                alt="Brew Haven Signature Coffee" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to high-quality unsplash coffee cup if image fails to load in some environments
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section id="categories" className="py-20 bg-gradient-to-b from-[#050505] to-[#080808] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
            Flavor Exploration
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-white">
            Curated Coffee Collections
          </h2>
          <p className="text-xs text-white/40 max-w-md mx-auto uppercase tracking-widest">
            Handcrafted beverages suited for every sensory preference
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10">
            {[
              { title: 'Signatures', desc: 'Saffron, Gold leaf, Cardamom, Cream', icon: '✨' },
              { title: 'Espresso Core', desc: 'Bold cremas, intense extractions', icon: '☕' },
              { title: 'Lattes', desc: 'Madagascar vanilla, velvet froth', icon: '🥛' },
              { title: 'Cold Brews', desc: '18h slow steep, chilled crystal ice', icon: '❄️' }
            ].map((cat, idx) => (
              <div 
                key={idx}
                className="bg-[#0b0b0b] border border-white/5 hover:border-[#C5A059]/30 rounded-2xl p-6 flex flex-col justify-between items-center text-center transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  const targetCat = cat.title === 'Signatures' ? 'Signature' : cat.title === 'Espresso Core' ? 'Espresso' : cat.title === 'Lattes' ? 'Lattes' : 'Cold Brews';
                  setSelectedCategory(targetCat);
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div>
                  <h4 className="text-sm font-serif text-white group-hover:text-[#C5A059] transition-colors">{cat.title}</h4>
                  <p className="text-[10px] text-white/40 mt-1 leading-normal">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MENU SECTION */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-6 sm:px-12 relative border-t border-white/5">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
              The Roast Journal
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-1">
              Explore Our <span className="italic text-[#C5A059] font-normal">Gold Menu</span>
            </h2>
          </div>

          {/* Category Filter Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                    : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time feedback for searches */}
        {searchQuery && (
          <div className="mb-8 flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3">
            <span className="text-xs text-white/60">
              Showing results for "<span className="text-[#C5A059] font-semibold">{searchQuery}</span>" ({filteredItems.length} found)
            </span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] uppercase text-[#C5A059] hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-4 animate-spin" />
            <h4 className="text-sm font-serif text-white/70">No Specialty Roast Found</h4>
            <p className="text-[11px] text-white/40 mt-1 uppercase tracking-widest">Try resetting your filters or searches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const wishlisted = isItemWishlisted(item.id);
              return (
                <div 
                  key={item.id}
                  className="bg-[#090909] border border-white/5 hover:border-[#C5A059]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-lg"
                >
                  {/* Card Image Wrapper */}
                  <div className="h-52 relative overflow-hidden bg-black cursor-pointer" onClick={() => onSelectItem(item)}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Origin Badge overlay */}
                    <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/15 rounded px-2 py-0.5 text-[8px] uppercase tracking-wider text-white/80">
                      {item.region}
                    </span>

                    {/* Bookmark Heart Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(item);
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-full border bg-black/60 backdrop-blur-md transition-colors cursor-pointer ${
                        wishlisted 
                          ? 'border-[#C5A059] text-[#C5A059]' 
                          : 'border-white/10 text-white/60 hover:text-[#C5A059]'
                      }`}
                      title={wishlisted ? 'Remove Bookmark' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Info Wrapper */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectItem(item)}>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] uppercase tracking-wider text-[#C5A059] font-medium">
                          {item.category}
                        </span>
                        <div className="flex items-center space-x-1 text-[#C5A059]">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span className="text-[9px] font-mono">{item.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-base font-serif text-white group-hover:text-[#C5A059] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Action row */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-[#C5A059] font-mono text-sm font-semibold">
                        ₹ {item.price.toFixed(2)}
                      </span>
                      
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#A6864A] text-black text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. TESTIMONIALS & REVIEWS SECTION */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-[#050505] to-[#080808] border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[#C5A059]/[0.01] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
              Critiques & Reviews
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white">
              Voices of <span className="italic text-[#C5A059] font-normal">Brew Haven</span>
            </h2>
            <p className="text-xs text-white/40 max-w-sm mx-auto uppercase tracking-widest">
              Experiencing coffee as an elevated culinary discipline
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {reviews.map((test) => (
              <div 
                key={test.id}
                className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg hover:border-white/10 transition-colors"
              >
                {/* Visual quote accent */}
                <span className="absolute top-4 right-6 text-6xl text-white/[0.02] font-serif leading-none select-none pointer-events-none">“</span>

                <div>
                  <div className="flex text-[#C5A059] mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed mb-6 font-light italic">
                    "{test.comment}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-white/10 object-cover bg-black"
                  />
                  <div>
                    <h5 className="text-xs font-serif text-white font-semibold">{test.name}</h5>
                    <span className="text-[9px] text-white/40 uppercase tracking-wider block mt-0.5">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add a Review Trigger & Form */}
          <div className="max-w-2xl mx-auto bg-[#080808] border border-white/15 rounded-3xl p-6 sm:p-8 relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-[30px] pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-serif text-[#F5F5F0]">
                  Share Your Experience
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Your critique guides our roasting craftsmanship</p>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    setShowReviewForm(!showReviewForm);
                  }
                }}
                className="px-4 py-2 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              >
                {showReviewForm ? 'Close Form' : 'Write A Critique'}
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 border border-[#C5A059] flex items-center justify-center rotate-45 mx-auto bg-[#C5A059]/10">
                  <span className="-rotate-45 text-lg text-[#C5A059]">✓</span>
                </div>
                <h4 className="text-sm font-serif text-white">Critique Submitted</h4>
                <p className="text-xs text-white/60">Thank you for sharing your thoughts! Your review has been saved and published in the lounge.</p>
              </div>
            ) : showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {currentUser ? (
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-lg p-3 text-[11px] text-[#C5A059]">
                    Writing as <span className="font-bold">{currentUser.name}</span> (Haven Club Member)
                  </div>
                ) : (
                  <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 text-[11px] text-white/40">
                    You are posting as a guest. Your name will be used to generate your avatar.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanjali"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50">Your Profession/Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Coffee Aficionado, Designer"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-white/50 block">Your Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= reviewRating 
                              ? 'text-[#C5A059] fill-[#C5A059]' 
                              : 'text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-white/50">Your Critique / Comment</label>
                  <textarea
                    placeholder="Share your detailed coffee experience..."
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Critique</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-white/60">Have you tried our Coorg single-origin brews or spiced lattes? Tell us about your journey.</p>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuth();
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer border border-white/10"
                >
                  Write A Critique
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 px-6 sm:px-12 border-t border-white/5 text-center text-xs text-white/30 space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border border-[#C5A059]/40 flex items-center justify-center rotate-45">
            <span className="-rotate-45 text-[8px] font-bold text-[#C5A059]">BH</span>
          </div>
          <span className="text-sm font-serif tracking-widest uppercase text-white/80">Brew Haven</span>
        </div>
        <p className="max-w-md mx-auto leading-normal">
          A luxury shade-grown Indian Arabica micro-roastery. Combining authentic heritage estates with classical barista craftsmanship.
        </p>
        <div className="text-[10px] uppercase tracking-widest text-white/20 pt-4">
          © {new Date().getFullYear()} Brew Haven India. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
