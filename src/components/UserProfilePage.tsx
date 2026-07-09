import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Coffee, ShieldCheck, ShoppingBag, ArrowLeft, LogOut, Award, Clock, Check } from 'lucide-react';
import { UserProfile, Order } from '../types';

interface UserProfilePageProps {
  user: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

export default function UserProfilePage({
  user,
  onUpdateProfile,
  onLogout,
  onBackToStore
}: UserProfilePageProps) {
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || '123 Brew Lane, Chikmagalur Hills, Karnataka');
  const [name, setName] = useState(user?.name || '');
  const [favCoffee, setFavCoffee] = useState('Saffron Cardamom Latte');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic order list with local persistence and real-time status transitions
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());

  // Synchronize state if the user object changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  // Load / initialize orders for the logged-in user
  useEffect(() => {
    if (user?.email) {
      const userOrdersKey = `brew_haven_orders_${user.email}`;
      const storedOrders = localStorage.getItem(userOrdersKey);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const initialOrders: Order[] = [
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
          },
          {
            id: 'ORD-91042',
            date: new Date(Date.now() - 5 * 60 * 1000).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            timestamp: Date.now() - 5 * 60 * 1000,
            deliveryMinutes: 15,
            items: [
              { name: 'Irish Cream Cold Brew', quantity: 1, price: 329 }
            ],
            total: 329,
            status: 'In Progress'
          }
        ];
        setOrders(initialOrders);
        localStorage.setItem(userOrdersKey, JSON.stringify(initialOrders));
      }
    }
  }, [user?.email]);

  // Periodic clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Check if any "In Progress" orders should be marked as "Delivered"
  useEffect(() => {
    if (!user?.email || orders.length === 0) return;

    const needsTransition = orders.some(order => 
      order.status === 'In Progress' && 
      order.timestamp && 
      order.deliveryMinutes && 
      ((Date.now() - order.timestamp) / 60000) >= order.deliveryMinutes
    );

    if (needsTransition) {
      setOrders(prevOrders => {
        const updated = prevOrders.map(order => {
          if (order.status === 'In Progress' && order.timestamp && order.deliveryMinutes) {
            const elapsedMinutes = (Date.now() - order.timestamp) / 60000;
            if (elapsedMinutes >= order.deliveryMinutes) {
              return { ...order, status: 'Delivered' as const };
            }
          }
          return order;
        });
        localStorage.setItem(`brew_haven_orders_${user.email}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [now, user?.email, orders]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-white/20">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Access Denied</h2>
        <p className="text-xs text-white/40 max-w-sm mb-6">Please log in or sign up to access your customer profile page.</p>
        <button
          onClick={onBackToStore}
          className="px-6 py-2.5 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer hover:bg-[#A6864A]"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const ordersList = orders;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: name || user.name,
      phone,
      address
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] pt-28 pb-24 px-6 sm:px-12 relative">
      
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/[0.02] rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C5A059]/[0.02] rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation / Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToStore}
              className="p-2 border border-white/10 hover:border-[#C5A059] rounded-xl hover:bg-white/5 transition-all text-white/75 hover:text-[#C5A059] cursor-pointer"
              title="Back to Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Haven Lounge Account</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-light text-white mt-1">
                Welcome back, <span className="italic text-[#C5A059] font-normal">{user.name}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToStore}
              className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-white cursor-pointer"
            >
              Browse Menu
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
            <ShieldCheck className="w-5 h-5" />
            <span>Your customer profile has been saved and synced. Welcome back to the roastery!</span>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Loyalty & Profile Details (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* VIP Loyalty Card */}
            <div className="bg-gradient-to-r from-[#141414] to-[#0a0a0a] border border-[#C5A059]/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-[30px] pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-1.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-2 py-0.5 rounded-full w-max text-[8px] uppercase tracking-widest font-bold mb-1.5">
                    <Award className="w-3 h-3" />
                    <span>Gold Roast Tier</span>
                  </div>
                  <span className="text-xs text-white/40 font-mono">BH-884-0291-GOLD</span>
                </div>
                <Coffee className="w-6 h-6 text-[#C5A059] animate-pulse" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="block text-xs font-serif text-white/80">Brew Stamps</span>
                  <span className="text-xs font-mono text-[#C5A059] font-bold">3 of 5 Steeps</span>
                </div>
                
                {/* Visual stamps */}
                <div className="grid grid-cols-5 gap-3">
                  {[...Array(5)].map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-11 w-11 border rounded-full flex items-center justify-center relative transition-all duration-300 ${
                        idx < 3 
                          ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#C5A059] scale-105 shadow-md shadow-[#C5A059]/15' 
                          : 'border-white/5 bg-white/[0.01] text-white/10'
                      }`}
                    >
                      <Coffee className={`w-5 h-5 ${idx < 3 ? 'fill-[#C5A059]/20' : ''}`} />
                      {idx < 3 && (
                        <div className="absolute -top-1 -right-1 bg-[#C5A059] text-black rounded-full p-0.5 border border-black shadow">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-white/40 pt-2 text-center">
                  Collect 5 stamps on Indian specialty roasts, and your 6th cup is completely on us!
                </p>

                <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-white/50">Club Coffee Points:</span>
                  <span className="text-white font-mono font-bold text-sm text-[#C5A059]">450 pts</span>
                </div>
              </div>
            </div>

            {/* Profile Editing Form Card */}
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="text-xs font-serif uppercase tracking-widest text-white flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>Personal Details</span>
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] hover:text-[#A6864A] transition-colors cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit Info'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 block">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 block">Contact Mobile</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 block">Favorite Roast Blend</label>
                    <select
                      value={favCoffee}
                      onChange={(e) => setFavCoffee(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option className="bg-[#090909]">Saffron Cardamom Latte</option>
                      <option className="bg-[#090909]">Caramel Macchiato</option>
                      <option className="bg-[#090909]">Coorg Special Cold Brew</option>
                      <option className="bg-[#090909]">Hazelnut Praline Latte</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 block">Default Delivery Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#C5A059] hover:bg-[#A6864A] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Email Address:</span>
                    <span className="text-white/80 font-mono">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Mobile:</span>
                    <span className="text-white/80">{phone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Loyalty Joined:</span>
                    <span className="text-white/80 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059] mr-1" />
                      <span>{user.joinedDate}</span>
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Favorite Blend:</span>
                    <span className="text-[#C5A059] font-serif">{favCoffee}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Delivery Address:</span>
                    <span className="text-white/70 block bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">{address}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT PANEL: Live / Past Order History (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-base font-serif uppercase tracking-wider text-white pb-4 border-b border-white/5 flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <span>Your Order Log</span>
              </h3>

              <div className="mt-6 space-y-4">
                {ordersList.map((order) => {
                  const isInProgress = order.status === 'In Progress';
                  let statusText = order.status;
                  
                  if (isInProgress && order.timestamp && order.deliveryMinutes) {
                    const elapsedMs = now - order.timestamp;
                    const totalMs = order.deliveryMinutes * 60 * 1000;
                    const remainingMs = Math.max(0, totalMs - elapsedMs);
                    const remainingMins = Math.floor(remainingMs / 60000);
                    const remainingSecs = Math.floor((remainingMs % 60000) / 1000);
                    statusText = `Arriving in ${remainingMins}m ${remainingSecs}s`;
                  }

                  return (
                    <div 
                      key={order.id}
                      className={`border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                        isInProgress 
                          ? 'border-[#C5A059]/40 bg-[#C5A059]/[0.02] shadow-md shadow-[#C5A059]/5' 
                          : 'border-white/5 bg-white/[0.01]'
                      }`}
                    >
                      {/* Order top line */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono mb-3 border-b border-white/5 pb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className={`w-3.5 h-3.5 ${isInProgress ? 'text-[#C5A059] animate-spin' : 'text-white/30'}`} />
                          <span className="text-white/60">Ordered: {order.date} • {order.id}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          isInProgress 
                            ? 'bg-[#C5A059]/20 text-[#C5A059]' 
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {statusText}
                        </span>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2 pl-1 my-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-white/80">
                              {item.name} <span className="text-[#C5A059] text-[10px] ml-1.5 font-mono">x{item.quantity}</span>
                            </span>
                            <span className="text-white/60 font-mono">₹ {item.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary line */}
                      <div className="border-t border-white/5 mt-3 pt-3 flex justify-between items-center text-xs">
                        <span className="text-white/40">GST (18%) & Delivery Included</span>
                        <div className="text-right">
                          <span className="text-white/40 mr-2 text-[10px]">Grand Total</span>
                          <span className="text-base font-mono font-bold text-[#C5A059]">₹ {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
