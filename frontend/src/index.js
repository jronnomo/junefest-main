import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import store from './store';

// Routes
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// App shell
import App from './App';

// Public screens
import HomeScreen from './screens/HomeScreen';
import BarsScreen from './screens/BarsScreen';
import EventsScreen from './screens/EventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Shop screens (public)
import ShopScreen from './screens/ShopScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';

// Auth-required screens
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';

// Admin screens
import AdminDashboard from './screens/Admin/AdminDashboard';
import AdminCarouselScreen from './screens/Admin/AdminCarouselScreen';
import AdminBarsScreen from './screens/Admin/AdminBarsScreen';
import AdminBarEditScreen from './screens/Admin/AdminBarEditScreen';
import AdminEventsScreen from './screens/Admin/AdminEventsScreen';
import AdminEventEditScreen from './screens/Admin/AdminEventEditScreen';
import OrderListScreen from './screens/Admin/OrderListScreen';
import ProductListScreen from './screens/Admin/ProductListScreen';
import ProductEditScreen from './screens/Admin/ProductEditScreen';
import UserListScreen from './screens/Admin/UserListScreen';
import UserEditScreen from './screens/Admin/UserEditScreen';

// CSS
import './assets/bootstrap.custom.css';
import './assets/junefest.theme.css';
import './assets/index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* Public routes */}
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/bars' element={<BarsScreen />} />
      <Route path='/events' element={<EventsScreen />} />
      <Route path='/events/:id' element={<EventDetailScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      {/* Shop (public) */}
      <Route path='/shop' element={<ShopScreen />} />
      <Route path='/shop/search/:keyword' element={<ShopScreen />} />
      <Route path='/shop/page/:pageNumber' element={<ShopScreen />} />
      <Route path='/shop/search/:keyword/page/:pageNumber' element={<ShopScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />

      {/* Private routes */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/orders/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>

      {/* Admin routes */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/carousel' element={<AdminCarouselScreen />} />
        <Route path='/admin/bars' element={<AdminBarsScreen />} />
        <Route path='/admin/bars/:id/edit' element={<AdminBarEditScreen />} />
        <Route path='/admin/events' element={<AdminEventsScreen />} />
        <Route path='/admin/events/:id/edit' element={<AdminEventEditScreen />} />
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
        <Route path='/admin/products/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
