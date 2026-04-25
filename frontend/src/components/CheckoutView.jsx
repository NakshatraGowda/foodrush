import { useState } from 'react';
import { orderAPI } from '../api/apiClient';
import { ErrorBox } from './Shared';

export default function CheckoutView({ cart, updateQty, setCart, onOrderPlaced }) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('cart');
  const [error, setError] = useState(null);

  const total = cart.reduce((s, c) => s + parseFloat(c.price) * c.qty, 0);

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.customerEmail || !form.deliveryAddress) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        deliveryAddress: form.deliveryAddress,
        items: cart.map(c => ({
          menuItemId: c.id,
          itemName: c.name,
          quantity: c.qty,
          unitPrice: c.price,
        })),
      };

      const { data: order } = await orderAPI.create(orderData);
      setStep('paying');

      await orderAPI.pay(order.id, paymentMethod);

      setCart([]);
      onOrderPlaced(order.id);
    } catch (e) {
      setError(e.response?.data?.message || 'Order failed. Please try again.');
      setStep('cart');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Browse the menu and add some items!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

      {/* Left — cart items */}
      <div>
        <h2 style={{ marginBottom: 20, fontSize: 22 }}>Your Order</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{item.imageUrl || '🍽'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>₹{item.price} each</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => updateQty(item.id, -1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'var(--surface2)', color: 'var(--text)',
                    fontSize: 16, border: '1px solid var(--border)',
                  }}
                >−</button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'var(--amber)', color: '#0f0e0c',
                    fontSize: 16, border: 'none',
                  }}
                >+</button>
                <span style={{ color: 'var(--amber)', fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
                  ₹{(parseFloat(item.price) * item.qty).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form + total */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 24,
        position: 'sticky', top: 20,
      }}>
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Delivery Details</h3>

        {[
          { key: 'customerName',    label: 'Full Name *',        type: 'text',  placeholder: 'John Doe' },
          { key: 'customerEmail',   label: 'Email *',            type: 'email', placeholder: 'john@example.com' },
          { key: 'customerPhone',   label: 'Phone',              type: 'tel',   placeholder: '+91 9876543210' },
          { key: 'deliveryAddress', label: 'Delivery Address *', type: 'text',  placeholder: '123 Main St, City' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', fontSize: 12,
              color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500,
            }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}

        {/* Payment method */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12,
            color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500,
          }}>
            Payment Method
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['CARD', 'UPI', 'CASH'].map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: paymentMethod === m ? 'var(--amber)' : 'var(--surface2)',
                color: paymentMethod === m ? '#0f0e0c' : 'var(--text-muted)',
                border: '1px solid ' + (paymentMethod === m ? 'var(--amber)' : 'var(--border)'),
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
            <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
            <span>Delivery fee</span><span>₹29.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span style={{ color: 'var(--amber)' }}>₹{(total + 29).toFixed(2)}</span>
          </div>
        </div>

        {error && <ErrorBox message={error} />}
        <div style={{ marginTop: error ? 12 : 0 }} />

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 10,
            fontSize: 15, fontWeight: 700,
            background: 'var(--amber)', color: '#0f0e0c',
          }}
        >
          {loading
            ? (step === 'paying' ? '💳 Processing Payment...' : '⏳ Placing Order...')
            : '🍔 Place Order & Pay'}
        </button>
      </div>
    </div>
  );
}