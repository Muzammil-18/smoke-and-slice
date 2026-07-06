import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Menu from './pages/Menu'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminMenu from './pages/admin/AdminMenu'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'

const getCartKey = (item) => {
  const size = item.selectedSize ? item.selectedSize.name : '';
  const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
  return `${item.id}__${size}__${extras.map((e) => e.name).sort().join(',')}`;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (item, quantity) => {
    const key = getCartKey(item);
    setCart((prevCart) => {
      const existingItem = prevCart.find((ci) => getCartKey(ci) === key);
      if (existingItem) {
        return prevCart.map((ci) =>
          getCartKey(ci) === key ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (itemId, selectedSize, selectedExtras) => {
    const key = getCartKey({ id: itemId, selectedSize, selectedExtras: selectedExtras || [] });
    setCart((prevCart) => prevCart.filter((ci) => getCartKey(ci) !== key));
  };

  const updateCartQuantity = (itemId, quantity, selectedSize, selectedExtras) => {
    const key = getCartKey({ id: itemId, selectedSize, selectedExtras: selectedExtras || [] });
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSize, selectedExtras);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((ci) => getCartKey(ci) === key ? { ...ci, quantity } : ci)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      {/* Premium Dark Themed Toaster */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1C1C1E',
            color: '#fff',
            border: '1px solid #2a2a2a',
            fontSize: '14px',
            fontFamily: 'Outfit, sans-serif'
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#1C1C1E' },
          },
          error: {
            iconTheme: { primary: '#FF3838', secondary: '#1C1C1E' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout user={user} cart={cart} onLogout={logoutUser} />}>
          <Route index element={<Home addToCart={addToCart} />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu addToCart={addToCart} />} />
          <Route path="menu/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="cart" element={<Cart cart={cart} onUpdateQty={updateCartQuantity} onRemove={removeFromCart} />} />
          <Route path="checkout" element={<Checkout user={user} cart={cart} onClearCart={clearCart} />} />
          <Route path="order-success/:id" element={<OrderSuccess user={user} />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login user={user} onLogin={loginUser} />} />
          <Route path="register" element={<Register user={user} onLogin={loginUser} />} />
          <Route path="profile" element={user ? <Profile user={user} onUpdateProfile={loginUser} /> : <Navigate to="/login" />} />
          <Route path="my-orders" element={user ? <MyOrders user={user} /> : <Navigate to="/login" />} />
        </Route>

        <Route path="/admin" element={<AdminLayout user={user} onLogout={logoutUser} onLogin={loginUser} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/admin" />} />
          <Route path="categories" element={user && user.role === 'admin' ? <AdminCategories user={user} /> : <Navigate to="/admin" />} />
          <Route path="menu" element={user && user.role === 'admin' ? <AdminMenu user={user} /> : <Navigate to="/admin" />} />
          <Route path="orders" element={user && user.role === 'admin' ? <AdminOrders user={user} /> : <Navigate to="/admin" />} />
          <Route path="customers" element={user && user.role === 'admin' ? <AdminCustomers user={user} /> : <Navigate to="/admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;