// import React, { useState } from 'react';
//
// const NAV = ['menu', 'checkout', 'track'];
//
// export default function App() {
//   const [tab, setTab] = useState('menu');
//   const [cart, setCart] = useState([]);
//   const [lastOrderId, setLastOrderId] = useState(null);
//
//   const addToCart = (item) => {
//     setCart(prev => {
//       const existing = prev.find(c => c.id === item.id);
//       if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };
//
//   const updateQty = (id, delta) => {
//     setCart(prev => prev
//       .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
//       .filter(c => c.qty > 0));
//   };
//
//   const cartCount = cart.reduce((s, c) => s + c.qty, 0);
//
//   return (
//     <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
//       {/* Header */}
//       <header style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '24px 0 20px', borderBottom: '1px solid var(--border)', marginBottom: 32
//       }}>
//         <div>
//           <h1 style={{ fontSize: 28, color: 'var(--amber)', letterSpacing: '-0.5px' }}>
//             🍽 FoodRush
//           </h1>
//           <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
//             Fresh. Fast. Delivered.
//           </p>
//         </div>
//         <nav style={{ display: 'flex', gap: 8 }}>
//           {[
//             { id: 'menu', label: 'Menu' },
//             { id: 'checkout', label: `Cart ${cartCount > 0 ? `(${cartCount})` : ''}` },
//             { id: 'track', label: 'Track Order' }
//           ].map(n => (
//             <button key={n.id} onClick={() => setTab(n.id)} style={{
//               padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
//               background: tab === n.id ? 'var(--amber)' : 'var(--surface)',
//               color: tab === n.id ? '#0f0e0c' : 'var(--text-muted)',
//               border: '1px solid ' + (tab === n.id ? 'var(--amber)' : 'var(--border)')
//             }}>{n.label}</button>
//           ))}
//         </nav>
//       </header>
//
//       {/* Views */}
//       {tab === 'menu' && <MenuView addToCart={addToCart} cart={cart} />}
//       {tab === 'checkout' && (
//         <CheckoutView
//           cart={cart}
//           updateQty={updateQty}
//           setCart={setCart}
//           onOrderPlaced={(id) => { setLastOrderId(id); setTab('track'); }}
//         />
//       )}
//       {tab === 'track' && <TrackView initialOrderId={lastOrderId} />}
//     </div>
//   );
// }
//
// // ─── MENU VIEW ───────────────────────────────────────────────
// import { menuAPI } from './api/apiClient';
// import { useEffect } from 'react';
//
// function MenuView({ addToCart, cart }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('All');
//
//   useEffect(() => {
//     menuAPI.getAll()
//       .then(r => { setItems(r.data); setLoading(false); })
//       .catch(() => { setError('Could not load menu. Is the backend running?'); setLoading(false); });
//   }, []);
//
//   const categories = ['All', ...new Set(items.map(i => i.category))];
//   const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
//
//   const cartQty = (id) => cart.find(c => c.id === id)?.qty || 0;
//
//   if (loading) return <LoadingSpinner text="Loading menu..." />;
//   if (error) return <ErrorBox message={error} />;
//
//   return (
//     <div>
//       {/* Category Tabs */}
//       <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
//         {categories.map(cat => (
//           <button key={cat} onClick={() => setFilter(cat)} style={{
//             padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
//             background: filter === cat ? 'var(--amber)' : 'var(--surface2)',
//             color: filter === cat ? '#0f0e0c' : 'var(--text-muted)',
//             border: '1px solid ' + (filter === cat ? 'var(--amber)' : 'var(--border)')
//           }}>{cat}</button>
//         ))}
//       </div>
//
//       {/* Grid */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
//         gap: 16
//       }}>
//         {filtered.map(item => (
//           <div key={item.id} style={{
//             background: 'var(--surface)', border: '1px solid var(--border)',
//             borderRadius: 'var(--radius)', padding: 20,
//             transition: 'border-color 0.2s',
//           }}>
//             <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>
//               {item.imageUrl || '🍽'}
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
//               <h3 style={{ fontSize: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
//                 {item.name}
//               </h3>
//               <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', marginLeft: 8 }}>
//                 ₹{item.price}
//               </span>
//             </div>
//             <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
//               {item.description}
//             </p>
//             <button
//               onClick={() => addToCart(item)}
//               style={{
//                 width: '100%', padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
//                 background: cartQty(item.id) > 0 ? 'var(--amber-dark)' : 'var(--amber)',
//                 color: '#0f0e0c'
//               }}
//             >
//               {cartQty(item.id) > 0 ? `In Cart (${cartQty(item.id)}) + Add` : '+ Add to Cart'}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// // ─── CHECKOUT VIEW ────────────────────────────────────────────
// function CheckoutView({ cart, updateQty, setCart, onOrderPlaced }) {
//   const [form, setForm] = useState({
//     customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: ''
//   });
//   const [paymentMethod, setPaymentMethod] = useState('CARD');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [step, setStep] = useState('cart'); // cart → details → paying → done
//
//   const total = cart.reduce((s, c) => s + (parseFloat(c.price) * c.qty), 0);
//
//   const { orderAPI } = require('./api/apiClient');
//
//   const handlePlaceOrder = async () => {
//     if (!form.customerName || !form.customerEmail || !form.deliveryAddress) {
//       setError('Please fill in all required fields.'); return;
//     }
//     setLoading(true); setError(null);
//     try {
//       const orderData = {
//         customerName: form.customerName,
//         customerEmail: form.customerEmail,
//         customerPhone: form.customerPhone,
//         deliveryAddress: form.deliveryAddress,
//         items: cart.map(c => ({
//           menuItemId: c.id,
//           itemName: c.name,
//           quantity: c.qty,
//           unitPrice: c.price
//         }))
//       };
//       const { data: order } = await orderAPI.create(orderData);
//       setStep('paying');
//
//       // Process payment
//       await orderAPI.pay(order.id, paymentMethod);
//       setCart([]);
//       onOrderPlaced(order.id);
//     } catch (e) {
//       setError(e.response?.data?.message || 'Order failed. Please try again.');
//       setLoading(false); setStep('details');
//     }
//   };
//
//   if (cart.length === 0 && step !== 'done') {
//     return (
//       <div style={{ textAlign: 'center', padding: '80px 20px' }}>
//         <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
//         <h2 style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Your cart is empty</h2>
//         <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Browse the menu and add some items!</p>
//       </div>
//     );
//   }
//
//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
//       {/* Left: Cart Items */}
//       <div>
//         <h2 style={{ marginBottom: 20, fontSize: 22 }}>Your Order</h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
//           {cart.map(item => (
//             <div key={item.id} style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               background: 'var(--surface)', border: '1px solid var(--border)',
//               borderRadius: 10, padding: '14px 16px'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                 <span style={{ fontSize: 28 }}>{item.imageUrl || '🍽'}</span>
//                 <div>
//                   <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
//                   <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>₹{item.price} each</div>
//                 </div>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <button onClick={() => updateQty(item.id, -1)} style={{
//                   width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)',
//                   color: 'var(--text)', fontSize: 16, border: '1px solid var(--border)'
//                 }}>−</button>
//                 <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
//                 <button onClick={() => updateQty(item.id, 1)} style={{
//                   width: 28, height: 28, borderRadius: 6, background: 'var(--amber)',
//                   color: '#0f0e0c', fontSize: 16, border: 'none'
//                 }}>+</button>
//                 <span style={{ color: 'var(--amber)', fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
//                   ₹{(parseFloat(item.price) * item.qty).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//
//       {/* Right: Form + Total */}
//       <div style={{
//         background: 'var(--surface)', border: '1px solid var(--border)',
//         borderRadius: 'var(--radius)', padding: 24, position: 'sticky', top: 20
//       }}>
//         <h3 style={{ marginBottom: 20, fontSize: 18 }}>Delivery Details</h3>
//
//         {[
//           { key: 'customerName', label: 'Full Name *', type: 'text', placeholder: 'John Doe' },
//           { key: 'customerEmail', label: 'Email *', type: 'email', placeholder: 'john@example.com' },
//           { key: 'customerPhone', label: 'Phone', type: 'tel', placeholder: '+91 9876543210' },
//           { key: 'deliveryAddress', label: 'Delivery Address *', type: 'text', placeholder: '123 Main St, City' },
//         ].map(f => (
//           <div key={f.key} style={{ marginBottom: 14 }}>
//             <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500 }}>
//               {f.label}
//             </label>
//             <input type={f.type} placeholder={f.placeholder}
//               value={form[f.key]}
//               onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
//           </div>
//         ))}
//
//         <div style={{ marginBottom: 20 }}>
//           <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500 }}>
//             Payment Method
//           </label>
//           <div style={{ display: 'flex', gap: 8 }}>
//             {['CARD', 'UPI', 'CASH'].map(m => (
//               <button key={m} onClick={() => setPaymentMethod(m)} style={{
//                 flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
//                 background: paymentMethod === m ? 'var(--amber)' : 'var(--surface2)',
//                 color: paymentMethod === m ? '#0f0e0c' : 'var(--text-muted)',
//                 border: '1px solid ' + (paymentMethod === m ? 'var(--amber)' : 'var(--border)')
//               }}>{m}</button>
//             ))}
//           </div>
//         </div>
//
//         <div style={{
//           borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16
//         }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
//             <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
//             <span>Delivery fee</span><span>₹29.00</span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
//             <span>Total</span>
//             <span style={{ color: 'var(--amber)' }}>₹{(total + 29).toFixed(2)}</span>
//           </div>
//         </div>
//
//         {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, padding: '10px', background: 'rgba(224,90,58,0.1)', borderRadius: 8 }}>{error}</div>}
//
//         <button onClick={handlePlaceOrder} disabled={loading} style={{
//           width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700,
//           background: 'var(--amber)', color: '#0f0e0c'
//         }}>
//           {loading ? (step === 'paying' ? '💳 Processing Payment...' : '⏳ Placing Order...') : '🍔 Place Order & Pay'}
//         </button>
//       </div>
//     </div>
//   );
// }
//
// // ─── TRACK VIEW ───────────────────────────────────────────────
// function TrackView({ initialOrderId }) {
//   const [orderId, setOrderId] = useState(initialOrderId || '');
//   const [order, setOrder] = useState(null);
//   const [payment, setPayment] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//
//   const { orderAPI, paymentAPI } = require('./api/apiClient');
//
//   useEffect(() => {
//     if (initialOrderId) fetchOrder(initialOrderId);
//   }, [initialOrderId]);
//
//   const fetchOrder = async (id) => {
//     setLoading(true); setError(null); setOrder(null); setPayment(null);
//     try {
//       const { data } = await orderAPI.getById(id);
//       setOrder(data);
//       try {
//         const { data: p } = await paymentAPI.getByOrderId(id);
//         setPayment(p);
//       } catch {}
//       setLoading(false);
//     } catch {
//       setError('Order not found. Please check the order ID.'); setLoading(false);
//     }
//   };
//
//   const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];
//   const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;
//
//   return (
//     <div style={{ maxWidth: 700, margin: '0 auto' }}>
//       <h2 style={{ marginBottom: 24, fontSize: 22 }}>Track Your Order</h2>
//
//       <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
//         <input
//           type="number"
//           placeholder="Enter Order ID (e.g. 1)"
//           value={orderId}
//           onChange={e => setOrderId(e.target.value)}
//           style={{ flex: 1 }}
//         />
//         <button onClick={() => fetchOrder(orderId)} disabled={!orderId || loading} style={{
//           padding: '10px 20px', borderRadius: 8, background: 'var(--amber)',
//           color: '#0f0e0c', fontWeight: 700, fontSize: 14
//         }}>
//           {loading ? '...' : 'Track'}
//         </button>
//       </div>
//
//       {error && <ErrorBox message={error} />}
//
//       {order && (
//         <div>
//           {/* Status bar */}
//           <div style={{
//             background: 'var(--surface)', border: '1px solid var(--border)',
//             borderRadius: 'var(--radius)', padding: 24, marginBottom: 16
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <div>
//                 <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Order #{order.id}</div>
//                 <h3 style={{ fontSize: 18 }}>{order.customerName}</h3>
//               </div>
//               <StatusBadge status={order.status} />
//             </div>
//
//             {!['CANCELLED', 'PAYMENT_FAILED'].includes(order.status) && (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
//                 {STATUS_STEPS.map((step, i) => {
//                   const done = i <= currentStep;
//                   const active = i === currentStep;
//                   return (
//                     <React.Fragment key={step}>
//                       <div style={{ textAlign: 'center', flex: 1 }}>
//                         <div style={{
//                           width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           background: done ? (active ? 'var(--amber)' : 'var(--amber-dark)') : 'var(--surface2)',
//                           border: '2px solid ' + (done ? 'var(--amber)' : 'var(--border)'),
//                           fontSize: 14, fontWeight: 700,
//                           color: done ? '#0f0e0c' : 'var(--text-dim)'
//                         }}>
//                           {done && !active ? '✓' : i + 1}
//                         </div>
//                         <div style={{ fontSize: 10, color: done ? 'var(--text)' : 'var(--text-dim)', fontWeight: done ? 600 : 400 }}>
//                           {step}
//                         </div>
//                       </div>
//                       {i < STATUS_STEPS.length - 1 && (
//                         <div style={{
//                           height: 2, flex: 1, marginBottom: 22,
//                           background: i < currentStep ? 'var(--amber-dark)' : 'var(--border)'
//                         }} />
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//
//           {/* Order items */}
//           <div style={{
//             background: 'var(--surface)', border: '1px solid var(--border)',
//             borderRadius: 'var(--radius)', padding: 20, marginBottom: 16
//           }}>
//             <h4 style={{ marginBottom: 14, fontSize: 15, color: 'var(--text-muted)' }}>ORDER ITEMS</h4>
//             {order.items?.map(item => (
//               <div key={item.id} style={{
//                 display: 'flex', justifyContent: 'space-between',
//                 padding: '8px 0', borderBottom: '1px solid var(--border)'
//               }}>
//                 <span style={{ fontSize: 14 }}>{item.itemName} × {item.quantity}</span>
//                 <span style={{ fontSize: 14, color: 'var(--amber)' }}>₹{item.subtotal}</span>
//               </div>
//             ))}
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700, fontSize: 16 }}>
//               <span>Total</span>
//               <span style={{ color: 'var(--amber)' }}>₹{order.totalAmount}</span>
//             </div>
//             <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>
//               📍 {order.deliveryAddress}
//             </div>
//           </div>
//
//           {/* Payment info */}
//           {payment && (
//             <div style={{
//               background: 'var(--surface)', border: '1px solid var(--border)',
//               borderRadius: 'var(--radius)', padding: 20
//             }}>
//               <h4 style={{ marginBottom: 12, fontSize: 15, color: 'var(--text-muted)' }}>PAYMENT</h4>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
//                 <span style={{ color: 'var(--text-muted)' }}>Method</span>
//                 <span>{payment.paymentMethod}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
//                 <span style={{ color: 'var(--text-muted)' }}>Status</span>
//                 <StatusBadge status={payment.status} />
//               </div>
//               {payment.transactionId && (
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
//                   <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
//                   <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--green)' }}>
//                     {payment.transactionId}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
//
// // ─── SHARED COMPONENTS ────────────────────────────────────────
// function StatusBadge({ status }) {
//   return (
//     <span className={`badge badge-${status?.toLowerCase()}`}>
//       {status?.replace('_', ' ')}
//     </span>
//   );
// }
//
// function LoadingSpinner({ text }) {
//   return (
//     <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
//       <div style={{ fontSize: 36, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⏳</div>
//       <p>{text || 'Loading...'}</p>
//     </div>
//   );
// }
//
// function ErrorBox({ message }) {
//   return (
//     <div style={{
//       background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)',
//       borderRadius: 10, padding: 16, color: 'var(--red)', fontSize: 14
//     }}>
//       ⚠️ {message}
//     </div>
//   );
// }

import { useState } from 'react';
import MenuView from './components/MenuView';
import CheckoutView from './components/CheckoutView';
import TrackView from './components/TrackView';

export default function App() {
  const [tab, setTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter(c => c.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleOrderPlaced = (orderId) => {
    setLastOrderId(orderId);
    setTab('track');
  };

  const navItems = [
    { id: 'menu',     label: 'Menu' },
    { id: 'checkout', label: cartCount > 0 ? `Cart (${cartCount})` : 'Cart' },
    { id: 'track',    label: 'Track Order' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 0 20px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 32,
      }}>
        <div>
          <h1 style={{ fontSize: 28, color: 'var(--amber)', letterSpacing: '-0.5px' }}>
            🍽 FoodRush
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Fresh. Fast. Delivered.
          </p>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          {navItems.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: tab === n.id ? 'var(--amber)' : 'var(--surface)',
                color: tab === n.id ? '#0f0e0c' : 'var(--text-muted)',
                border: '1px solid ' + (tab === n.id ? 'var(--amber)' : 'var(--border)'),
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'menu' && <MenuView addToCart={addToCart} cart={cart} />}
      {tab === 'checkout' && (
        <CheckoutView cart={cart} updateQty={updateQty} setCart={setCart} onOrderPlaced={handleOrderPlaced} />
      )}
      {tab === 'track' && <TrackView initialOrderId={lastOrderId} />}
    </div>
  );
}