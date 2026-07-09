import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import UserProfileModal from './components/UserProfileModal';
import UserProfilePage from './components/UserProfilePage';
import ProductDetailModal from './components/ProductDetailModal';
import { MenuItem, CartItem, UserProfile } from './types';
import { MENU_ITEMS } from './data';
import { supabase } from './supabase';

export default function App() {
  // Core App States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<MenuItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [profileActive, setProfileActive] = useState(false);

  // Modal / Drawer Open States
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('brew_haven_current_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedCart = localStorage.getItem('brew_haven_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedWishlist = localStorage.getItem('brew_haven_wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (err) {
      console.error('Failed to load storage state:', err);
    }
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata;
        const profile: UserProfile = {
          name: userMeta?.name || session.user.email?.split('@')[0] || 'Member',
          email: session.user.email || '',
          phone: userMeta?.phone || '+91 98765 43210',
          address: userMeta?.address || '123 Brew Lane, Bengaluru',
          joinedDate: new Date(session.user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
        };
        setCurrentUser(profile);
        localStorage.setItem('brew_haven_current_user', JSON.stringify(profile));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('brew_haven_current_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to upsert profile to Supabase (non-blocking, silent fallback)
  const upsertProfileToSupabase = async (profile: UserProfile) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            joined_date: profile.joinedDate,
          });
        if (error) {
          console.warn('Could not upsert profile to Supabase:', error.message);
        }
      }
    } catch (e) {
      console.warn('Supabase DB profile upsert failed:', e);
    }
  };


  // Sync state to localStorage when changed
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    localStorage.setItem('brew_haven_cart', JSON.stringify(updatedCart));
  };

  const saveWishlistToStorage = (updatedWishlist: MenuItem[]) => {
    localStorage.setItem('brew_haven_wishlist', JSON.stringify(updatedWishlist));
  };

  // Add Item to Shopping Cart
  const handleAddToCart = (product: MenuItem) => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      
      if (existing) {
        updated = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prevCart, { product, quantity: 1 }];
      }

      saveCartToStorage(updated);
      return updated;
    });

    // Automatically trigger cart drawer to give immediate feedback
    setCartOpen(true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQuantity = item.quantity + delta;
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      saveCartToStorage(updated);
      return updated;
    });
  };

  // Remove item from cart entirely
  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => item.product.id !== productId);
      saveCartToStorage(updated);
      return updated;
    });
  };

  // Clear cart on successful checkout
  const handleCheckoutSuccess = (items: CartItem[], total: number) => {
    if (currentUser) {
      // Create new order
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // Randomly choose 15 mins or 30 mins (half an hour)
      const deliveryMinutes = Math.random() < 0.5 ? 15 : 30;
      
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        timestamp: Date.now(),
        deliveryMinutes,
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total,
        status: 'In Progress' as const
      };

      // Retrieve existing orders
      const userOrdersKey = `brew_haven_orders_${currentUser.email}`;
      const existingOrdersStr = localStorage.getItem(userOrdersKey);
      let existingOrders = [];
      if (existingOrdersStr) {
        existingOrders = JSON.parse(existingOrdersStr);
      } else {
        // If no orders exist yet, prepopulate with the historical ones
        existingOrders = [
          {
            id: 'ORD-98431',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            deliveryMinutes: 15,
            items: [
              { name: 'Saffron Cardamom Latte', quantity: 1, price: 299 },
              { name: 'Caramel Macchiato', quantity: 1, price: 349 }
            ],
            total: 648,
            status: 'Delivered'
          },
          {
            id: 'ORD-95123',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
            deliveryMinutes: 30,
            items: [
              { name: 'Coorg Special Cold Brew', quantity: 2, price: 259 }
            ],
            total: 518,
            status: 'Delivered'
          }
        ];
      }

      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));

      // Asynchronously insert order to Supabase (silent fallback)
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('orders').insert({
            id: orderId,
            user_id: user.id,
            date: newOrder.date,
            items: newOrder.items,
            total: newOrder.total,
            status: newOrder.status,
            delivery_minutes: newOrder.deliveryMinutes
          }).then(({ error }) => {
            if (error) {
              console.warn('Could not insert order to Supabase database (tables may not exist yet):', error.message);
            }
          });
        }
      }).catch(e => {
        console.warn('Supabase order insert failed:', e);
      });
    }
    setCart([]);
    localStorage.removeItem('brew_haven_cart');
  };

  // Toggle Item in Wishlist
  const handleToggleWishlist = (product: MenuItem) => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      let updated: MenuItem[];

      if (exists) {
        updated = prevWishlist.filter((item) => item.id !== product.id);
      } else {
        updated = [...prevWishlist, product];
      }

      saveWishlistToStorage(updated);
      return updated;
    });
  };

  // User Auth Triggers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('brew_haven_current_user', JSON.stringify(user));
    upsertProfileToSupabase(user);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase logout issue:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('brew_haven_current_user');
    setProfileOpen(false);
    setProfileActive(false);
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('brew_haven_current_user', JSON.stringify(updatedUser));
    // Also save in user profiles database key to persist edit for next logins
    localStorage.setItem(`user_${updatedUser.email}`, JSON.stringify(updatedUser));
    upsertProfileToSupabase(updatedUser);
  };

  // Scroll to targeted visual sections
  const handleScrollToSection = (sectionId: string) => {
    if (!currentUser && sectionId !== 'home') {
      setAuthOpen(true);
      return;
    }

    if (sectionId === 'profile') {
      if (currentUser) {
        setProfileActive(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAuthOpen(true);
      }
      return;
    }

    setProfileActive(false);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 40);
  };

  // Quick Order Popular Choice (Caramel Macchiato) from Bottom Bar
  const handleOrderPopular = () => {
    const popularItem = MENU_ITEMS.find((item) => item.id === 'caramel-macchiato');
    if (popularItem) {
      handleAddToCart(popularItem);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F0] min-h-screen font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Absolute background element for immersive lights */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/[0.02] rounded-full blur-[150px]"></div>
        <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-[#C5A059]/[0.02] rounded-full blur-[150px]"></div>
      </div>

      {/* Header Bar */}
      <Header
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onOpenCart={() => {
          if (currentUser) {
            setCartOpen(true);
          } else {
            setAuthOpen(true);
          }
        }}
        onOpenWishlist={() => {
          if (currentUser) {
            setWishlistOpen(true);
          } else {
            setAuthOpen(true);
          }
        }}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        onScrollToSection={handleScrollToSection}
      />

      {profileActive ? (
        <UserProfilePage
          user={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          onBackToStore={() => setProfileActive(false)}
        />
      ) : (
        <>
          {/* Cinematic Hero Section */}
          <HeroSection onOrderPopular={handleOrderPopular} />

          {/* Main Page Content Sections (About, Categories, Menu, Testimonials, Contact, Footer) */}
          <MainContent
            onSelectItem={(item) => {
              if (currentUser) {
                setSelectedProduct(item);
              } else {
                setAuthOpen(true);
              }
            }}
            onAddToCart={(item) => {
              if (currentUser) {
                handleAddToCart(item);
              } else {
                setAuthOpen(true);
              }
            }}
            onToggleWishlist={(item) => {
              if (currentUser) {
                handleToggleWishlist(item);
              } else {
                setAuthOpen(true);
              }
            }}
            wishlist={wishlist}
            currentUser={currentUser}
            onOpenAuth={() => setAuthOpen(true)}
          />
        </>
      )}

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
      />

      {/* SHOPPING CART DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => handleToggleWishlist({ id } as MenuItem)}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
