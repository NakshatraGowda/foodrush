import { useState, useEffect } from 'react';
import { menuAPI } from '../api/apiClient';
import { LoadingSpinner, ErrorBox } from './Shared';

export default function MenuView({ addToCart, cart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    menuAPI.getAll()
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => { setError('Could not load menu. Is the backend running?'); setLoading(false); });
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
  const cartQty = (id) => cart.find(c => c.id === id)?.qty || 0;

  if (loading) return <LoadingSpinner text="Loading menu..." />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
            background: filter === cat ? 'var(--amber)' : 'var(--surface2)',
            color: filter === cat ? '#0f0e0c' : 'var(--text-muted)',
            border: '1px solid ' + (filter === cat ? 'var(--amber)' : 'var(--border)'),
          }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 20,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>{item.imageUrl || '🍽'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
              <h3 style={{ fontSize: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{item.name}</h3>
              <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', marginLeft: 8 }}>
                ₹{item.price}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              {item.description}
            </p>
            <button onClick={() => addToCart(item)} style={{
              width: '100%', padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: cartQty(item.id) > 0 ? 'var(--amber-dark)' : 'var(--amber)',
              color: '#0f0e0c',
            }}>
              {cartQty(item.id) > 0 ? `In Cart (${cartQty(item.id)}) + Add` : '+ Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}