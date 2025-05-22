// Updated CartContext with productImages support
import { createContext, useContext, useEffect, useState } from "react";
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  fetchShopifyProducts,
} from "../utils/shopify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState("#");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState({});

  const [cartSummary, setCartSummary] = useState({
    totalQuantity: 0,
    totalItems: 0,
    subtotal: 0,
  });

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
          updateSummary(cart.lines.edges.map((edge) => edge.node));
        } else {
          const cart = await createCart();
          if (!cart || !cart.id) throw new Error("Cart creation failed");

          sessionStorage.setItem("cartId", cart.id);
          setCartId(cart.id);
          setLineItems([]);
          setCheckoutUrl(cart.checkoutUrl);
          updateSummary([]);
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

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        const products = await fetchShopifyProducts();
        const imageMap = {};

        products.forEach((product) => {
          const imageUrl = product.images.edges[0]?.node.url || null;
          product.variants.edges.forEach((variant) => {
            imageMap[variant.node.id] = imageUrl;
          });
        });

        setProductImages(imageMap);
      } catch (err) {
        console.error("Failed to load product images:", err);
      }
    };

    loadProductImages();
  }, []);

  const updateSummary = (items) => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) =>
        sum + parseFloat(item.cost?.subtotalAmount?.amount || 0),
      0
    );
    setCartSummary({ totalQuantity, totalItems, subtotal });
  };

  const addItem = async (variantId, quantity = 1) => {
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
            id: `temp-${variantId}`,
            quantity,
            merchandise: { id: variantId },
          },
        ];
      }
    });

    try {
      const cart = await addToCart(cartId, variantId, quantity);
      if (cart?.lines?.edges) {
        const updatedItems = cart.lines.edges.map((edge) => edge.node);
        setLineItems(updatedItems);
        updateSummary(updatedItems);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      setError("Failed to add item to cart");
    }
  };

  const removeItem = async (lineItemId) => {
    const optimisticItems = lineItems.filter((item) => item.id !== lineItemId);
    setLineItems(optimisticItems);
    updateSummary(optimisticItems);

    try {
      const cart = await removeFromCart(cartId, lineItemId);
      if (cart?.lines?.edges) {
        const updatedItems = cart.lines.edges.map((edge) => edge.node);
        setLineItems(updatedItems);
        updateSummary(updatedItems);
      }
    } catch (err) {
      console.error("Remove from cart failed:", err);
      setError("Failed to remove item");
    }
  };

  const updateQuantity = async (lineItemId, quantity) => {
    const optimisticItems = lineItems.map((item) =>
      item.id === lineItemId ? { ...item, quantity } : item
    );
    setLineItems(optimisticItems);
    updateSummary(optimisticItems);

    try {
      const cart = await updateCartItemQuantity(cartId, lineItemId, quantity);
      if (cart?.lines?.edges) {
        const updatedItems = cart.lines.edges.map((edge) => edge.node);
        setLineItems(updatedItems);
        updateSummary(updatedItems);
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
        productImages,
        cartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
