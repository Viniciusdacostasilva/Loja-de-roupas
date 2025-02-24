"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string; // Novo campo para armazenar o tamanho do produto
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, change: number) => void;
  clearCart: () => void;
  total: number;
  setUserEmail: (email: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Carregar carrinho do localStorage baseado no e-mail
  const loadCart = (email: string) => {
    const storedCart = localStorage.getItem(`cart-${email}`);
    if (storedCart) setCart(JSON.parse(storedCart));
  };

  useEffect(() => {
    if (userEmail) loadCart(userEmail);
  }, [userEmail]);

  useEffect(() => {
    const saveCart = setTimeout(() => {
      if (userEmail) {
        localStorage.setItem(`cart-${userEmail}`, JSON.stringify(cart));
      }
    }, 300); 
    return () => clearTimeout(saveCart);
  }, [cart, userEmail]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id && p.size === product.size);
      if (existing) {
        return prevCart.map((p) =>
          p.id === product.id && p.size === product.size
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prevCart) => prevCart.filter((p) => !(p.id === id && p.size === size)));
  };

  const updateQuantity = (id: string, size: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (userEmail) {
      localStorage.removeItem(`cart-${userEmail}`);
    }
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
