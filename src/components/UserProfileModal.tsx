import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Calendar, Coffee, ShieldCheck, Check, Clock } from 'lucide-react';
import { UserProfile, Order } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateProfile
}: UserProfileModalProps) {
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || '123 Brew Lane, Chikmagalur Hills, Karnataka');
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic order list with local persistence and real-time status transitions
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());

  // Synchronize local state with prop updates
  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  // Load / initialize orders for the logged-in user
  useEffect(() => {
    if (user?.email && isOpen) {
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
  }, [user?.email, isOpen]);

  // Periodic clock update
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Check if any "In Progress" orders should be marked as "Delivered"
  useEffect(() => {
    if (!user?.email || orders.length === 0 || !isOpen) return;

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
  }, [now, user?.email, orders, isOpen]);

  if (!isOpen || !user) return null;

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
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Profile Card */}
      <div 
        className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Profile Sidebar */}
        <div className="w-full md:w-2/5 p-6 border-r border-white/5 bg-black/40 flex flex-col justify-between">
          <div className="text-center md:text-left">
            <div className="w-20 h-20 rounded-full border border-[#C5A059] bg-[#C5A059]/5 mx-auto md:mx-0 flex items-center justify-center text-[#C5A059] text-3xl font-serif font-bold mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-serif text-[#F5F5F0]">{user.name}</h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-1">{user.email}</span>
            
            <div className="mt-6 space-y-3 text-xs text-white/70">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Joined {user.joinedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{user.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-start space-x-2 text-left">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] mt-0.5" />
                <span className="line-clamp-2">{user.address || 'Address not set'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setName(user.name);
                setIsEditing(!isEditing);
              }}
              className="w-full py-2 border border-white/10 hover:border-[#C5A059] hover:bg-white/5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer text-white"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Account Details'}
            </button>
          </div>
        </div>

        {/* Main Panel Content */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-serif uppercase tracking-widest text-[#C5A059]">
              {isEditing ? 'Modify Profile' : 'Haven Club Lounge'}
            </h4>
            <button 
              onClick={onClose}
              className="p-1 text-white/50 hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-4 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs px-4 py-2 rounded-lg flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Your profile details have been saved successfully!</span>
            </div>
          )}

          {isEditing ? (
            /* Editing form */
            <form onSubmit={handleSave} className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-white/50">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-white/50">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-white/50">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </form>
          ) : (
            /* Standard Profile Info & Orders */
            <div className="space-y-6 flex-1">
              {/* Premium Loyalty Card */}
              <div className="bg-gradient-to-r from-[#141414] to-[#0a0a0a] border border-[#C5A059]/30 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-[30px] pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block">Club Gold Card</span>
                    <span className="text-xs text-white/60 font-mono">BH-8840291</span>
                  </div>
                  <Coffee className="w-5 h-5 text-[#C5A059] animate-pulse" />
                </div>

                <span className="block text-xs font-serif text-white mb-2">Brew Stamp Progress (3 / 5)</span>
                <p className="text-[10px] text-white/40 mb-4">Buy 5 specialty cups, get the 6th cup entirely on us!</p>

                {/* Stamp visual placeholders */}
                <div className="flex items-center space-x-3">
                  {[...Array(5)].map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-9 h-9 border rounded-full flex items-center justify-center relative transition-all duration-300 ${
                        idx < 3 
                          ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] scale-105 shadow-md shadow-[#C5A059]/10' 
                          : 'border-white/10 bg-white/[0.01] text-white/20'
                      }`}
                    >
                      <Coffee className={`w-4 h-4 ${idx < 3 ? 'fill-[#C5A059]/20' : ''}`} />
                      {idx < 3 && (
                        <div className="absolute -top-1 -right-1 bg-[#C5A059] text-black rounded-full p-0.5 border border-black shadow">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Deliveries */}
              <div>
                <h5 className="text-xs font-serif uppercase tracking-widest text-[#F5F5F0] mb-3 pb-1.5 border-b border-white/5">
                  Order History
                </h5>
                <div className="space-y-3">
                  {orders.map((order) => {
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
                        className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
                          isInProgress 
                            ? 'border-[#C5A059]/40 bg-[#C5A059]/[0.02] shadow-sm shadow-[#C5A059]/5' 
                            : 'bg-white/[0.01] border border-white/5'
                        }`}
                      >
                        <div className="flex justify-between text-[10px] font-mono text-white/50 mb-2">
                          <span>Ordered: {order.date} • {order.id}</span>
                          <span className={`font-semibold uppercase tracking-wider ${
                            isInProgress ? 'text-[#C5A059]' : 'text-emerald-400'
                          }`}>{statusText}</span>
                        </div>
                        
                        <div className="space-y-1 pl-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-white/80">{item.name} <span className="text-white/30 text-[10px]">x{item.quantity}</span></span>
                              <span className="text-white/60">₹ {item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-white/5 mt-3 pt-2 flex justify-between items-center text-xs">
                          <span className="text-white/40">Total</span>
                          <span className="text-[#C5A059] font-mono font-bold">₹ {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
