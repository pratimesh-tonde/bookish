import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data.cart.items.filter((i) => i.book)); // guard against deleted books
    } catch (err) {
      console.error("Could not load cart", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId, quantity = 1) => {
    const { data } = await api.post("/cart", { bookId, quantity });
    setItems(data.cart.items.filter((i) => i.book));
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setItems(data.cart.items.filter((i) => i.book));
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setItems(data.cart.items.filter((i) => i.book));
  };

  const clearCartLocal = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.quantity * (i.book?.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, loading, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCartLocal, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
