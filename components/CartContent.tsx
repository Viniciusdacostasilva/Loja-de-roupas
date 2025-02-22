"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  clearCart: () => void;
  total: number;
  setUserEmail: (email: string) => void; // Definir o e-mail do usuário
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Carregar carrinho do usuário
  useEffect(() => {
    if (userEmail) {
      const storedCart = localStorage.getItem(`cart-${userEmail}`);
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, [userEmail]);

  // Salvar carrinho no localStorage vinculado ao e-mail
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`cart-${userEmail}`, JSON.stringify(cart));
    }
  }, [cart, userEmail]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id);
      if (existing) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, setUserEmail }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
