import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: MenuItem[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: MenuItem) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      {/* Backdrop tap to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-[#080808] border-l border-white/10 h-full flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Ambient Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Drawer Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 relative z-10">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-[#C5A059] fill-[#C5A059]/10" />
            <h2 className="text-base font-serif uppercase tracking-widest text-white">Your Wishlist</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:text-[#C5A059] text-white/50 transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 border border-white/15 rounded-full flex items-center justify-center mb-6 text-white/20">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif text-white/80 mb-2">Wishlist is Empty</h3>
              <p className="text-xs text-white/40 max-w-[220px]">
                Bookmark your favorite luxury coffees to order them later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 bg-white/[0.01] border border-white/5 rounded-xl p-3 hover:border-[#C5A059]/20 transition-colors"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-serif text-white truncate font-medium">{item.name}</h4>
                    <span className="text-[10px] text-[#C5A059] font-mono block mt-0.5">₹ {item.price}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[7px] border border-white/15 rounded px-1.5 py-0.5 text-white/40 uppercase font-mono">
                        {item.roast}
                      </span>
                      <span className="text-[7px] border border-white/15 rounded px-1.5 py-0.5 text-white/40 uppercase font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveFromWishlist(item.id);
                      }}
                      className="p-1.5 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-1.5 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/40 text-center relative z-10">
          <span className="text-[10px] text-white/35 uppercase tracking-wider block">
            Saved on your device with local storage
          </span>
        </div>

      </div>
    </div>
  );
}
