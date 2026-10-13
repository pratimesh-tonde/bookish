import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SessionTimeoutWatcher from "./components/SessionTimeoutWatcher";
import CookieConsent from "./components/cookieconsent";
import { Spinner } from "./components/Common";

// Loaded immediately - the pages most people land on first.
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Code-split everything else so the first page load stays small.
const BookList = lazy(() => import("./pages/BookList"));
const BookDetail = lazy(() => import("./pages/BookDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ManageBooks = lazy(() => import("./admin/ManageBooks"));
const ManageOrders = lazy(() => import("./admin/ManageOrders"));
const ManageCategories = lazy(() => import("./admin/ManageCategories"));

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SessionTimeoutWatcher />
              <CookieConsent />
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="books" element={<BookList />} />
                    <Route path="books/:id" element={<BookDetail />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<Terms />} />

                    {/* logged-in users only */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="cart" element={<Cart />} />
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="orders" element={<MyOrders />} />
                      <Route path="orders/:id" element={<TrackOrder />} />
                      <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* admin only */}
                    <Route path="admin" element={<AdminRoute />}>
                      <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="books" element={<ManageBooks />} />
                        <Route path="orders" element={<ManageOrders />} />
                        <Route path="categories" element={<ManageCategories />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;