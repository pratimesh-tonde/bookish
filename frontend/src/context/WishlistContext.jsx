import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setBooks([]);
      return;
    }
    try {
      const { data } = await api.get("/auth/wishlist");
      setBooks(data.wishlist);
    } catch (err) {
      console.error("Could not load wishlist", err);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (bookId) => {
    await api.post(`/auth/wishlist/${bookId}`);
    fetchWishlist();
  };

  const isWishlisted = (bookId) => books.some((b) => b._id === bookId);

  return (
    <WishlistContext.Provider value={{ books, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
