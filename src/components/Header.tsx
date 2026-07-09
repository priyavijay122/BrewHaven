import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, LogOut } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: MenuItem[];
  currentUser: { name: string; email: string } | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Header({
  cart,
  wishlist,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onLogout,
  onScrollToSection
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full h-20 px-4 md:px-12 flex items-center justify-between z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm border-b border-white/5">
      {/* Brand Logo */}
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onScrollToSection('home')}
      >
        <div className="w-10 h-10 border-2 border-[#C5A059] flex items-center justify-center rotate-45 transition-transform duration-500 group-hover:rotate-[135deg] bg-black/40">
          <span className="-rotate-45 text-sm font-bold text-[#C5A059] group-hover:scale-110 transition-transform">BH</span>
        </div>
        <span className="text-xl md:text-2xl font-serif tracking-widest uppercase text-white group-hover:text-[#C5A059] transition-colors">
          Brew Haven
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
        <button 
          onClick={() => onScrollToSection('home')}
          className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          Home
        </button>
        <button 
          onClick={() => onScrollToSection('about')}
          className="text-[11px] uppercase tracking-[0.2em] text-white/75 hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          About
        </button>
        <button 
          onClick={() => onScrollToSection('categories')}
          className="text-[11px] uppercase tracking-[0.2em] text-white/75 hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          Categories
        </button>
        <button 
          onClick={() => onScrollToSection('menu')}
          className="text-[11px] uppercase tracking-[0.2em] text-white/75 hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          Menu
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search */}
        <div className="relative flex items-center">
          {searchOpen && (
            <input
              type="text"
              placeholder="Search coffee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/80 border border-[#C5A059]/40 text-xs text-white rounded-full px-4 py-1.5 mr-2 w-36 md:w-48 focus:outline-none focus:border-[#C5A059] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onScrollToSection('menu');
                  // Dispatch search event
                  window.dispatchEvent(new CustomEvent('search-coffee', { detail: searchQuery }));
                }
              }}
            />
          )}
          <Search 
            className={`w-5 h-5 cursor-pointer transition-colors ${searchOpen ? 'text-[#C5A059]' : 'text-white/80 hover:text-[#C5A059]'}`}
            onClick={() => setSearchOpen(!searchOpen)}
          />
        </div>

        {/* Wishlist */}
        <button 
          onClick={onOpenWishlist}
          className="relative text-white/80 hover:text-[#C5A059] transition-colors p-1 focus:outline-none cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Shopping Cart */}
        <button 
          onClick={onOpenCart}
          className="relative text-white/80 hover:text-[#C5A059] transition-colors p-1 focus:outline-none cursor-pointer"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account / Auth */}
        {currentUser ? (
          <div className="flex items-center space-x-2 border-l border-white/10 pl-4 md:pl-6">
            <button
              onClick={() => onScrollToSection('profile')}
              className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/5 flex items-center justify-center text-[#C5A059] text-xs font-bold uppercase cursor-pointer hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all"
              title={`Profile: ${currentUser.name}`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
            <button
              onClick={onLogout}
              className="text-white/60 hover:text-[#C5A059] transition-colors p-1 hidden sm:block cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-colors"
            title="Login / Sign Up"
          >
            <User className="w-4 h-4 text-white/80 hover:text-[#C5A059]" />
          </button>
        )}
      </div>
    </header>
  );
}
