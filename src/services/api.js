import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('organic_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (err) {
      console.error('Error reading auth token for API request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 unauthorized & attempt refresh token swap
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { token } = refreshResponse.data.data;
        
        // Update user state in localStorage
        try {
          const savedUser = localStorage.getItem('organic_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            parsed.token = token;
            localStorage.setItem('organic_user', JSON.stringify(parsed));
          }
        } catch (storageErr) {
          console.error('Error updating refresh token in localStorage:', storageErr);
        }
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        const retriedResponse = await api(originalRequest);
        return retriedResponse;
      } catch (refreshErr) {
        // Refresh token failed or expired, clean up session
        try {
          localStorage.removeItem('organic_user');
        } catch { /* ignore */ }
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ── AUTH ENDPOINTS ────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  verifyLoginOTP: (data) => api.post('/auth/verify-login-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetOTP: (data) => api.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ── PRODUCT ENDPOINTS ─────────────────────────────────────────────
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (slugOrId) => api.get(`/products/${slugOrId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ── CART ENDPOINTS ────────────────────────────────────────────────
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// ── ORDER ENDPOINTS ───────────────────────────────────────────────
export const orderAPI = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getAllOrders: () => api.get('/orders/admin'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ── WISHLIST ENDPOINTS ────────────────────────────────────────────
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/${productId}`),
};

// ── REVIEW ENDPOINTS ──────────────────────────────────────────────
export const reviewAPI = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  submitReview: (data) => api.post('/reviews', data),
  moderateReview: (id, status) => api.put(`/reviews/${id}/moderate`, { status }),
};

// ── USER ENDPOINTS ────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

export default api;
