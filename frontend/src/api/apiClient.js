////import axios from 'axios';
////
////const api = axios.create({
////  baseURL: '',   // empty — Vite proxy forwards /api/* to gateway
////  headers: { 'Content-Type': 'application/json' },
////  timeout: 10000,
////});
////
////export const menuAPI = {
////  getAll: () => api.get('/api/menu'),
////  getByCategory: (cat) => api.get(`/api/menu/category/${cat}`),
////};
////
////export const orderAPI = {
////  create: (data) => api.post('/api/orders', data),
////  getById: (id) => api.get(`/api/orders/${id}`),
////  getByEmail: (email) => api.get(`/api/orders/customer/${email}`),
////  pay: (orderId, paymentMethod) =>
////    api.post(`/api/orders/${orderId}/pay`, { paymentMethod }),
////};
////
////export const paymentAPI = {
////  getByOrderId: (orderId) => api.get(`/api/payments/order/${orderId}`),
////};
////
////export default api;
//
//
//import axios from 'axios';
//
//const api = axios.create({
//  baseURL: '',
//  headers: { 'Content-Type': 'application/json' },
//  timeout: 10000,
//});
//
//export const menuAPI = {
//  getAll: () => api.get('/api/menu'),
//  getByCategory: (cat) => api.get(`/api/menu/category/${cat}`),
//};
//
//export const orderAPI = {
//  create: (data) => api.post('/api/orders', data),
//  getById: (id) => api.get(`/api/orders/${id}`),
//  getByEmail: (email) => api.get(`/api/orders/customer/${email}`),
//  pay: (orderId, paymentMethod) =>
//    api.post(`/api/orders/${orderId}/pay`, { paymentMethod }),
//};
//
//export const paymentAPI = {
//  getByOrderId: (orderId) => api.get(`/api/payments/order/${orderId}`),
//};
//
//export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const menuAPI = {
  getAll: () => api.get('/api/menu'),
};

export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  getById: (id) => api.get(`/api/orders/${id}`),
  pay: (orderId, paymentMethod) => api.post(`/api/orders/${orderId}/pay`, { paymentMethod }),
};

export const paymentAPI = {
  getByOrderId: (orderId) => api.get(`/api/payments/order/${orderId}`),
};

export default api;