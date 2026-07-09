import React from 'react';
import { X, Heart, ShoppingBag, Star, MapPin, Award } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductDetailModalProps {
  product: MenuItem | null;
  onClose: () => void;
  onAddToCart: (product: MenuItem) => void;
  onToggleWishlist: (product: MenuItem) => void;
  isWishlisted: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductDetailModalProps) {
  if (!product) return null;

  // Curated premium pairing recommendations matching the coffee category
  const getPairings = (category: string, productId: string) => {
    if (category === 'Signature' || productId.includes('saffron') || productId.includes('macchiato')) {
      return [
        {
          id: 'almond-cardamom-biscotti',
          name: 'Almond Cardamom Biscotti',
          description: 'Twice-baked biscotti, delicately spiced with cardamom and premium almonds.',
          price: 120,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop',
          rating: 4.8,
          reviews: 42,
          ingredients: ['Almonds', 'Cardamom', 'Flour', 'Organic Sugar'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Cardamom notes echo our Saffron/Caramel signature accents perfectly.'
        },
        {
          id: 'pistachio-rose-shortbread',
          name: 'Pistachio Rose Shortbread',
          description: 'Melt-in-your-mouth shortbread dipped in organic rose white chocolate & crushed pistachios.',
          price: 140,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
          rating: 4.9,
          reviews: 29,
          ingredients: ['Pistachios', 'Rose Water', 'Butter', 'White Chocolate'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Delicate floral rose pairs wonderfully with rich signature espresso notes.'
        }
      ];
    } else if (category === 'Espresso') {
      return [
        {
          id: 'dark-chocolate-fudge-cookie',
          name: 'Dark Chocolate Fudge Cookie',
          description: 'Decadent, ultra-rich double chocolate cookie with a soft, fudgy center and sea salt.',
          price: 110,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=400&auto=format&fit=crop',
          rating: 4.9,
          reviews: 67,
          ingredients: ['Premium Cocoa', 'Callebaut Chocolate Chips', 'Sea Salt', 'Butter'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Cuts through the deep, bold intensity of dark espresso shots beautifully.'
        },
        {
          id: 'classic-tiramisu-slice',
          name: 'Classic Tiramisu Slice',
          description: 'Traditional tiramisu layered with espresso ladyfingers and whipped mascarpone.',
          price: 180,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop',
          rating: 4.9,
          reviews: 84,
          ingredients: ['Mascarpone', 'Ladyfingers', 'Espresso', 'Cocoa Powder'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Creamy, cloud-like texture that echoes the rich coffee notes in your cup.'
        }
      ];
    } else if (category === 'Cold Brews') {
      return [
        {
          id: 'citrus-lemon-cake',
          name: 'Citrus Lemon Drizzle Cake',
          description: 'Moist, refreshing lemon sponge cake glazed with sweet & tangy lemon syrup.',
          price: 140,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=400&auto=format&fit=crop',
          rating: 4.7,
          reviews: 33,
          ingredients: ['Fresh Lemon Zest', 'Organic Eggs', 'Spelt Flour', 'Glaze'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Bright citrus acidity contrasts elegantly with the smooth, low-acid cold brew.'
        },
        {
          id: 'sea-salt-caramel-macaron',
          name: 'Sea Salt Caramel Macaron Duo',
          description: 'Two delicate French macaron shells filled with house-made salted butter caramel.',
          price: 160,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=400&auto=format&fit=crop',
          rating: 4.8,
          reviews: 51,
          ingredients: ['Almond Flour', 'Egg Whites', 'Salted Caramel', 'Fleur de Sel'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Elevates the crisp, clean notes of our slow-steeped cold brew.'
        }
      ];
    } else {
      return [
        {
          id: 'hazelnut-pecan-croissant',
          name: 'Toasted Hazelnut Croissant',
          description: 'Flaky, house-baked butter croissant filled with a rich hazelnut praline cream.',
          price: 150,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop',
          rating: 4.8,
          reviews: 59,
          ingredients: ['Butter', 'Flour', 'Hazelnut Cream', 'Toasted Almonds'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Flaky layers expand the smooth, milky finish of your latte.'
        },
        {
          id: 'cinnamon-sugar-bun',
          name: 'Cinnamon Sugar Bun',
          description: 'Swedish brioche dough rolled with premium Ceylon cinnamon & pearl sugar.',
          price: 130,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
          rating: 4.8,
          reviews: 45,
          ingredients: ['Brioche', 'Ceylon Cinnamon', 'Pearl Sugar', 'Cardamom'],
          region: 'Haven Bakery',
          roast: 'Medium' as const,
          harmonyNote: 'Spicy cinnamon warmth complements any hot, velvety latte beautifully.'
        }
      ];
    }
  };

  const pairings = getPairings(product.category, product.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Background Click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Modal Card */}
      <div 
        className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient light glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[50px] pointer-events-none"></div>

        {/* Product Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover border-r border-white/5"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#090909]"></div>
          
          {/* Close button on image for mobile */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/60 rounded-full text-white hover:text-[#C5A059] md:hidden transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between relative z-10 overflow-y-auto">
          
          {/* Desktop Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-1 text-white/50 hover:text-[#C5A059] transition-colors hidden md:block cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              {product.category}
            </span>
            <h3 className="text-xl md:text-2xl font-serif text-[#F5F5F0] mt-1 mb-2">
              {product.name}
            </h3>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/60 font-mono">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Coffee Specs */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <div>
                  <span className="block text-[7px] uppercase tracking-wider text-white/40">Region</span>
                  <span className="text-white/80 font-serif font-medium">{product.region}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <div>
                  <span className="block text-[7px] uppercase tracking-wider text-white/40">Roast Profile</span>
                  <span className="text-white/80 font-serif font-medium">{product.roast}</span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <span className="block text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2">Composition</span>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span 
                    key={ing}
                    className="text-[9px] px-2.5 py-1 bg-white/[0.02] border border-white/10 rounded-full text-white/80"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Pairings */}
            <div className="mb-6 border-t border-white/5 pt-4">
              <span className="block text-[8px] uppercase tracking-[0.2em] text-[#C5A059] mb-3 font-semibold">
                Recommended Pairings
              </span>
              <div className="space-y-3.5">
                {pairings.map((pairing) => (
                  <div 
                    key={pairing.id}
                    className="flex items-center space-x-3 bg-white/[0.01] border border-white/5 hover:border-white/10 p-2.5 rounded-xl transition-all"
                  >
                    <img 
                      src={pairing.image} 
                      alt={pairing.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-serif font-medium text-white truncate">
                          {pairing.name}
                        </h4>
                        <span className="text-xs font-mono text-[#C5A059] font-semibold whitespace-nowrap pl-2">
                          ₹ {pairing.price}
                        </span>
                      </div>
                      <p className="text-[9px] text-white/50 line-clamp-1 mt-0.5">
                        {pairing.description}
                      </p>
                      <p className="text-[8px] text-[#C5A059]/90 font-mono italic mt-0.5 leading-tight flex items-center">
                        <span className="inline-block mr-1">✨</span> {pairing.harmonyNote}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddToCart(pairing)}
                      className="p-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059] text-[#C5A059] hover:text-black rounded-lg transition-all cursor-pointer self-center flex-shrink-0 hover:scale-105 active:scale-95"
                      title="Add pairing to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Price & Action Footer */}
          <div className="border-t border-white/5 pt-5 flex items-center justify-between">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-white/40">Price</span>
              <span className="text-[#C5A059] font-mono text-xl font-bold">₹ {product.price.toFixed(2)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 border rounded-full transition-all cursor-pointer ${
                  isWishlisted 
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' 
                    : 'border-white/15 hover:border-[#C5A059]/40 text-white/60 hover:text-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => onAddToCart(product)}
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-full flex items-center space-x-2 transition-colors transform hover:-translate-y-0.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
