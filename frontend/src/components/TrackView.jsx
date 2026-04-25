import { useState, useEffect } from 'react';
import { orderAPI, paymentAPI } from '../api/apiClient';
import { StatusBadge, ErrorBox } from './Shared';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];

export default function TrackView({ initialOrderId }) {
  const [orderId, setOrderId] = useState(initialOrderId ? String(initialOrderId) : '');
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialOrderId) fetchOrder(initialOrderId);
  }, [initialOrderId]);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError(null);
    setOrder(null);
    setPayment(null);
    try {
      const { data } = await orderAPI.getById(id);
      setOrder(data);
      try {
        const { data: p } = await paymentAPI.getByOrderId(id);
        setPayment(p);
      } catch {
        // payment may not exist yet — fine
      }
    } catch {
      setError('Order not found. Please check the order ID.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, fontSize: 22 }}>Track Your Order</h2>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <input
          type="number"
          placeholder="Enter Order ID (e.g. 1)"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={() => fetchOrder(orderId)}
          disabled={!orderId || loading}
          style={{
            padding: '10px 20px', borderRadius: 8,
            background: 'var(--amber)', color: '#0f0e0c',
            fontWeight: 700, fontSize: 14,
          }}
        >
          {loading ? '...' : 'Track'}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {order && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status card */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Order #{order.id}</div>
                <h3 style={{ fontSize: 18 }}>{order.customerName}</h3>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Progress steps */}
            {!['CANCELLED', 'PAYMENT_FAILED'].includes(order.status) && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div
                      key={step}
                      style={{
                        display: 'flex', alignItems: 'center',
                        flex: i < STATUS_STEPS.length - 1 ? 1 : 'unset',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          margin: '0 auto 6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: done ? (active ? 'var(--amber)' : 'var(--amber-dark)') : 'var(--surface2)',
                          border: '2px solid ' + (done ? 'var(--amber)' : 'var(--border)'),
                          fontSize: 13, fontWeight: 700,
                          color: done ? '#0f0e0c' : 'var(--text-dim)',
                        }}>
                          {done && !active ? '✓' : i + 1}
                        </div>
                        <div style={{
                          fontSize: 10, whiteSpace: 'nowrap',
                          color: done ? 'var(--text)' : 'var(--text-dim)',
                          fontWeight: done ? 600 : 400,
                        }}>
                          {step}
                        </div>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{
                          flex: 1, height: 2, margin: '0 4px', marginBottom: 22,
                          background: i < currentStep ? 'var(--amber-dark)' : 'var(--border)',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {['CANCELLED', 'PAYMENT_FAILED'].includes(order.status) && (
              <div style={{
                background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)',
                borderRadius: 8, padding: 12, fontSize: 14, color: 'var(--red)', textAlign: 'center',
              }}>
                {order.status === 'PAYMENT_FAILED'
                  ? '❌ Payment failed. Please place a new order and try again.'
                  : '❌ This order has been cancelled.'}
              </div>
            )}
          </div>

          {/* Order items */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 20,
          }}>
            <h4 style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-muted)', letterSpacing: 1 }}>
              ORDER ITEMS
            </h4>
            {order.items?.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 14 }}>{item.itemName} × {item.quantity}</span>
                <span style={{ fontSize: 14, color: 'var(--amber)' }}>₹{item.subtotal}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700, fontSize: 16 }}>
              <span>Total</span>
              <span style={{ color: 'var(--amber)' }}>₹{order.totalAmount}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
              📍 {order.deliveryAddress}
            </div>
          </div>

          {/* Payment info */}
          {payment && (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 20,
            }}>
              <h4 style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-muted)', letterSpacing: 1 }}>
                PAYMENT
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Method</span>
                <span>{payment.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <StatusBadge status={payment.status} />
              </div>
              {payment.transactionId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--green)' }}>
                    {payment.transactionId}
                  </span>
                </div>
              )}
              {payment.failureReason && (
                <div style={{ fontSize: 13, color: 'var(--red)', marginTop: 8 }}>
                  {payment.failureReason}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}