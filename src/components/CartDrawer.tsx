import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, QrCode, Building2, Truck, CheckCircle } from 'lucide-react';
import { CartItem, MenuItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutSuccess: (items: CartItem[], total: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'completed'>('review');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [codOption, setCodOption] = useState('cash');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const gst = (subtotal - discountAmount) * 0.18; // 18% GST on Coffee
  const delivery = subtotal > 0 ? 49 : 0; // ₹49 Delivery
  const total = subtotal - discountAmount + gst + delivery;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.toUpperCase() === 'HAVEN10') {
      setDiscountPercent(10);
      setPromoSuccess('10% discount applied!');
    } else if (promoCode.toUpperCase() === 'BREW20') {
      setDiscountPercent(20);
      setPromoSuccess('20% discount applied!');
    } else {
      setPromoError('Invalid promo code. Try HAVEN10 or BREW20.');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutStep('completed');
    }, 2000);
  };

  const handleFinishCheckout = () => {
    onCheckoutSuccess(cart, total);
    setCheckoutStep('review');
    onClose();
  };

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
            <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-base font-serif uppercase tracking-widest text-white">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:text-[#C5A059] text-white/50 transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkoutStep === 'completed' ? (
          /* Checkout Completed Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="w-20 h-20 border-2 border-[#C5A059] rounded-full flex items-center justify-center rotate-45 mb-8 bg-[#C5A059]/10 shadow-lg shadow-[#C5A059]/10 animate-pulse">
              <span className="-rotate-45 text-3xl text-[#C5A059]">✓</span>
            </div>
            <h3 className="text-2xl font-serif text-[#F5F5F0] mb-2">Order Confirmed</h3>
            <p className="text-xs text-white/40 mb-6 uppercase tracking-widest">Est. Preparation Time: 15 Mins</p>
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-5 mb-8 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2 text-white/40">
                <span>ORDER ID</span>
                <span className="text-[#C5A059]">#BH-{(Math.random() * 100000).toFixed(0)}</span>
              </div>
              <div className="space-y-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-white">
                <span>TOTAL PAID</span>
                <span className="text-[#C5A059]">₹ {total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleFinishCheckout}
              className="w-full py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        ) : checkoutStep === 'payment' ? (
          /* Payment Screen */
          <div className="flex-1 flex flex-col relative z-10 overflow-y-auto p-6">
            <h3 className="text-sm font-serif uppercase tracking-widest text-white mb-4 border-b border-white/5 pb-2">
              Select Payment Option
            </h3>

            {/* Payment Methods Selection Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[8px] uppercase tracking-wider font-bold">Card</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[8px] uppercase tracking-wider font-bold">UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[8px] uppercase tracking-wider font-bold">NetBank</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-[8px] uppercase tracking-wider font-bold">COD</span>
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 flex-1">
              <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-3 mb-4 text-xs space-y-0.5 text-center text-white/80">
                <span className="block text-[10px] text-white/40 uppercase tracking-widest font-semibold">Total Amount Payable</span>
                <span className="block text-lg font-mono text-[#C5A059] font-bold">₹ {total.toFixed(2)}</span>
              </div>

              {/* DYNAMIC PAYMENT METHOD DETAILS */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider text-white/50">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider text-white/50">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="bg-[#121212] border border-white/10 rounded-xl p-4 flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white rounded-lg relative">
                    {/* Simulated QR Code structure */}
                    <div className="w-24 h-24 grid grid-cols-5 gap-1 bg-white text-black p-1">
                      <div className="bg-black"></div>
                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>
                      <div className="bg-black"></div>

                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>

                      <div className="bg-white"></div>
                      <div className="bg-black"></div>
                      <div className="bg-black flex items-center justify-center text-[8px] font-bold font-sans">BH</div>
                      <div className="bg-black"></div>
                      <div className="bg-white"></div>

                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>

                      <div className="bg-black"></div>
                      <div className="bg-black"></div>
                      <div className="bg-white"></div>
                      <div className="bg-black"></div>
                      <div className="bg-black"></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50 text-center font-semibold">Scan to pay ₹ {total.toFixed(2)} via any UPI App</span>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-wider text-white/50">Select Bank Partner</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option className="bg-[#090909]">HDFC Bank</option>
                    <option className="bg-[#090909]">ICICI Bank</option>
                    <option className="bg-[#090909]">State Bank of India</option>
                    <option className="bg-[#090909]">Axis Bank</option>
                    <option className="bg-[#090909]">Kotak Mahindra Bank</option>
                  </select>
                  <p className="text-[10px] text-white/40 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                    Upon clicking, you will be redirected to the secure page of {selectedBank} to complete your transaction securely.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-start space-x-3 text-white/75 text-xs leading-relaxed">
                    <Truck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">Cash or Doorstep UPI</span>
                      <span className="block text-white/40 mt-1">Settle your invoice at your doorstep via cash or scanning the delivery personnel's QR code.</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <label className="block text-[9px] uppercase tracking-wider text-white/40">Doorstep Option</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCodOption('cash')}
                        className={`py-2 border rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all text-center cursor-pointer ${
                          codOption === 'cash'
                            ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                            : 'border-white/5 bg-black/40 text-white/40 hover:text-white'
                        }`}
                      >
                        Cash Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodOption('upi')}
                        className={`py-2 border rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all text-center cursor-pointer ${
                          codOption === 'upi'
                            ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                            : 'border-white/5 bg-black/40 text-white/40 hover:text-white'
                        }`}
                      >
                        UPI On Doorstep
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={checkingOut}
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  {checkingOut ? (
                    paymentMethod === 'card' ? 'Authorizing Card...' :
                    paymentMethod === 'upi' ? 'Verifying UPI...' :
                    paymentMethod === 'netbanking' ? 'Connecting Bank...' :
                    'Confirming Order...'
                  ) : (
                    paymentMethod === 'cod' ? `Confirm Order (₹ ${total.toFixed(2)})` : `Pay ₹ ${total.toFixed(2)}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('review')}
                  className="w-full py-2.5 border border-white/10 hover:bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Back to Review
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Standard Cart Review Screen */
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 border border-white/15 rounded-full flex items-center justify-center mb-6 text-white/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif text-white/80 mb-2">Cart is Empty</h3>
                  <p className="text-xs text-white/40 max-w-[200px]">Brew some ideas, add a cup of heaven to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex items-center space-x-4 bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif text-white truncate font-medium">{item.product.name}</h4>
                        <span className="text-[10px] text-[#C5A059] font-mono block mt-0.5">₹ {item.product.price}</span>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block mt-0.5">{item.product.region}</span>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {/* Quantity controls */}
                        <div className="flex items-center space-x-1.5 bg-black/40 rounded-full border border-white/10 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-white/50 hover:text-[#C5A059] transition-colors focus:outline-none cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-white font-mono w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-white/50 hover:text-[#C5A059] transition-colors focus:outline-none cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              /* Footer Calculations */
              <div className="p-6 border-t border-white/5 bg-black/60 relative z-10 space-y-4">
                {/* Calculation List */}
                <div className="space-y-1.5 text-xs font-mono pt-1">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({discountPercent}%)</span>
                      <span>- ₹ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/60">
                    <span>GST (18%)</span>
                    <span>₹ {gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Delivery Charge</span>
                    <span>₹ {delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#F5F5F0] font-bold text-sm border-t border-white/5 pt-2">
                    <span>Total</span>
                    <span className="text-[#C5A059]">₹ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-all transform hover:-translate-y-0.5 mt-2 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
