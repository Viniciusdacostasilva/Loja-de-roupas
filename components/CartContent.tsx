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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
 

  // Carregar carrinho do localStorage baseado no e-mail
  const loadCart = () => {
    const storedCart = localStorage.getItem(`cart`);
    if (storedCart) setCart(JSON.parse(storedCart));
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = setTimeout(() => {
     
        localStorage.setItem(`cart`, JSON.stringify(cart));
      
    }, 300); 
    return () => clearTimeout(saveCart);
  }, [cart, ]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id && p.size === product.size);
      let updatedCart;
      if (existing) {
        updatedCart = prevCart.map((p) =>
          p.id === product.id && p.size === product.size
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      console.log()
       
  
        localStorage.setItem(`cart`, JSON.stringify(updatedCart));
      console.log(localStorage.getItem(`cart`))
      
      return updatedCart;
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
     
      localStorage.removeItem(`cart`);
    
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
