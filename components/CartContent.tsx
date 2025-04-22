"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
  cartId: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Omit<Product, 'cartId'>) => string | null;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, change: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Função para carregar o carrinho do usuário
  const loadUserCart = async (userId: string) => {
    try {
      setLoading(true);
      const cartDocRef = doc(db, "cart", `user_${userId}`);
      const cartDoc = await getDoc(cartDocRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        setCart(cartData.items || []);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
    
  };

  // Função para salvar o carrinho do usuário
  const saveUserCart = async (userId: string, cartItems: Product[]) => {
    try {
      setLoading(true);
      const cartDocRef = doc(db, "cart", `user_${userId}`);
      const cartData = {
        userId: userId,
        email: session?.user?.email,
        items: cartItems,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(cartDocRef, cartData);
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    } finally { 
      setLoading(false);
    }
  };

  // Carregar carrinho quando usuário fizer login
  useEffect(() => {
    setIsClient(true);
    if (session?.user?.id) {
      loadUserCart(session.user.id);
    }
    // Remove any cart clearing logic here
  }, [session?.user?.id]);

  // Salvar carrinho quando houver mudanças
  useEffect(() => {
    if (isClient && session?.user?.id && (cart.length > 0)) {
      saveUserCart(session.user.id, cart);
    }
    // Remove any cart clearing logic here
  }, [cart, session?.user?.id]);

  const addToCart = (product: Omit<Product, 'cartId'>) => {
    if (!product.id) {
      console.error("Produto sem ID válido:", product);
      return null;
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const cartId = `${product.id}-${product.name}-${product.size}-${timestamp}-${random}`;

    const newProduct = {
      ...product,
      cartId,
      quantity: 1
    };

    setCart(prevCart => [...prevCart, newProduct]);
    return cartId;
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, change: number) => {
    setCart((prevCart) => 
      prevCart.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = async () => {
    if (session?.user?.id) {
      try {
        setLoading(true);
        // Check if the cart document exists first
        const cartDocRef = doc(db, "cart", `user_${session.user.id}`);
        const cartDoc = await getDoc(cartDocRef);
        
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          // Only clear if it belongs to the current user
          if (cartData.userId === session.user.id) {
            await saveUserCart(session.user.id, []);
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
      } finally { 
        setLoading(false);
      }
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!isClient) {
    return null;
  }

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        total,
        totalItems: getTotalItems(),
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
