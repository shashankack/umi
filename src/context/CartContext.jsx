import { createContext, useContext, useEffect, useState } from "react";
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
} from "../utils/shopify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState("#");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initCart = async () => {
      const storedId = sessionStorage.getItem("cartId");

      try {
        if (storedId) {
          const cart = await getCart(storedId);
          if (!cart || !cart.id) throw new Error("Invalid cart");

          setCartId(cart.id);
          setLineItems(cart.lines.edges.map((edge) => edge.node));
          setCheckoutUrl(cart.checkoutUrl);
          // console.log("Loaded cart from sessionStorage", cart);
        } else {
          const cart = await createCart();
          if (!cart || !cart.id) throw new Error("Cart creation failed");

          sessionStorage.setItem("cartId", cart.id);
          setCartId(cart.id);
          setLineItems([]);
          setCheckoutUrl(cart.checkoutUrl);
          console.log("Created new cart", cart);
        }
      } catch (err) {
        console.error("Cart initialization failed:", err);
        setError(err.message || "Cart initialization failed");
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, []);

  const addItem = async (variantId, quantity = 1) => {
    // Optimistic update
    setLineItems((prev) => {
      const existingItem = prev.find(
        (item) => item.merchandise.id === variantId
      );
      if (existingItem) {
        return prev.map((item) =>
          item.merchandise.id === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: `temp-${variantId}`, // Temporary ID until API returns real one
            quantity,
            merchandise: { id: variantId },
          },
        ];
      }
    });

    try {
      const cart = await addToCart(cartId, variantId, quantity);
      if (cart?.lines?.edges) {
        setLineItems(cart.lines.edges.map((edge) => edge.node));
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      setError("Failed to add item to cart");
    }
  };

  const removeItem = async (lineItemId) => {
    // Optimistic update
    setLineItems((prev) => prev.filter((item) => item.id !== lineItemId));

    try {
      const cart = await removeFromCart(cartId, lineItemId);
      if (cart?.lines?.edges) {
        setLineItems(cart.lines.edges.map((edge) => edge.node));
      }
    } catch (err) {
      console.error("Remove from cart failed:", err);
      setError("Failed to remove item");
    }
  };

  const updateQuantity = async (lineItemId, quantity) => {
    // Optimistic update
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === lineItemId ? { ...item, quantity } : item
      )
    );

    try {
      const cart = await updateCartItemQuantity(cartId, lineItemId, quantity);
      if (cart?.lines?.edges) {
        setLineItems(cart.lines.edges.map((edge) => edge.node));
      }
    } catch (err) {
      console.error("Update quantity failed:", err);
      setError("Failed to update quantity");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        lineItems,
        loading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
