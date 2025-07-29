import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
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

// Cart action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART_ID: 'SET_CART_ID',
  SET_LINE_ITEMS: 'SET_LINE_ITEMS',
  SET_CHECKOUT_URL: 'SET_CHECKOUT_URL',
  SET_PRODUCT_IMAGES: 'SET_PRODUCT_IMAGES',
  UPDATE_SUMMARY: 'UPDATE_SUMMARY',
  OPTIMISTIC_ADD: 'OPTIMISTIC_ADD',
  OPTIMISTIC_UPDATE: 'OPTIMISTIC_UPDATE',
  OPTIMISTIC_REMOVE: 'OPTIMISTIC_REMOVE',
};

// Initial state
const initialState = {
  cartId: null,
  lineItems: [],
  checkoutUrl: "#",
  loading: true,
  error: null,
  productImages: {},
  cartSummary: {
    totalQuantity: 0,
    totalItems: 0,
    subtotal: 0,
  },
};

// Optimized reducer with immutable updates
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case CART_ACTIONS.SET_CART_ID:
      return { ...state, cartId: action.payload };
      
    case CART_ACTIONS.SET_LINE_ITEMS:
      const newSummary = calculateSummary(action.payload);
      return { 
        ...state, 
        lineItems: action.payload,
        cartSummary: newSummary
      };
      
    case CART_ACTIONS.SET_CHECKOUT_URL:
      return { ...state, checkoutUrl: action.payload };
      
    case CART_ACTIONS.SET_PRODUCT_IMAGES:
      return { ...state, productImages: action.payload };
      
    case CART_ACTIONS.OPTIMISTIC_ADD:
      const { variantId, quantity } = action.payload;
      const existingIndex = state.lineItems.findIndex(
        item => item.merchandise.id === variantId
      );
      
      let newLineItems;
      if (existingIndex >= 0) {
        newLineItems = state.lineItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newLineItems = [
          ...state.lineItems,
          {
            id: `temp-${variantId}`,
            quantity,
            merchandise: { id: variantId },
            cost: { subtotalAmount: { amount: "0" } }
          },
        ];
      }
      
      return {
        ...state,
        lineItems: newLineItems,
        cartSummary: calculateSummary(newLineItems)
      };
      
    case CART_ACTIONS.OPTIMISTIC_UPDATE:
      const { lineItemId, newQuantity } = action.payload;
      const updatedItems = state.lineItems.map(item =>
        item.id === lineItemId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      return {
        ...state,
        lineItems: updatedItems,
        cartSummary: calculateSummary(updatedItems)
      };
      
    case CART_ACTIONS.OPTIMISTIC_REMOVE:
      const filteredItems = state.lineItems.filter(
        item => item.id !== action.payload
      );
      
      return {
        ...state,
        lineItems: filteredItems,
        cartSummary: calculateSummary(filteredItems)
      };
      
    default:
      return state;
  }
}

// Memoized summary calculation
const calculateSummary = (items) => {
  return {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce(
      (sum, item) => sum + parseFloat(item.cost?.subtotalAmount?.amount || 0),
      0
    )
  };
};

export const OptimizedCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Memoized cart operations
  const cartOperations = useMemo(() => ({
    async initCart() {
      const storedId = sessionStorage.getItem("cartId");
      try {
        if (storedId) {
          const cart = await getCart(storedId);
          if (!cart || !cart.id) throw new Error("Invalid cart");
          
          dispatch({ type: CART_ACTIONS.SET_CART_ID, payload: cart.id });
          dispatch({ type: CART_ACTIONS.SET_LINE_ITEMS, payload: cart.lines.edges.map(edge => edge.node) });
          dispatch({ type: CART_ACTIONS.SET_CHECKOUT_URL, payload: cart.checkoutUrl });
        } else {
          const cart = await createCart();
          if (!cart || !cart.id) throw new Error("Cart creation failed");
          
          sessionStorage.setItem("cartId", cart.id);
          dispatch({ type: CART_ACTIONS.SET_CART_ID, payload: cart.id });
          dispatch({ type: CART_ACTIONS.SET_LINE_ITEMS, payload: [] });
          dispatch({ type: CART_ACTIONS.SET_CHECKOUT_URL, payload: cart.checkoutUrl });
        }
      } catch (err) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message || "Cart initialization failed" });
      } finally {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      }
    },

    async addItem(variantId, quantity = 1) {
      // Optimistic update
      dispatch({ 
        type: CART_ACTIONS.OPTIMISTIC_ADD, 
        payload: { variantId, quantity } 
      });

      try {
        const cart = await addToCart(state.cartId, variantId, quantity);
        if (cart?.lines?.edges) {
          dispatch({ 
            type: CART_ACTIONS.SET_LINE_ITEMS, 
            payload: cart.lines.edges.map(edge => edge.node) 
          });
        }
      } catch (err) {
        console.error("Add to cart failed:", err);
        // Revert optimistic update by reloading cart
        const cart = await getCart(state.cartId);
        dispatch({ 
          type: CART_ACTIONS.SET_LINE_ITEMS, 
          payload: cart.lines.edges.map(edge => edge.node) 
        });
      }
    },

    async updateQuantity(lineItemId, quantity) {
      // Optimistic update
      dispatch({ 
        type: CART_ACTIONS.OPTIMISTIC_UPDATE, 
        payload: { lineItemId, newQuantity: quantity } 
      });

      try {
        const cart = await updateCartItemQuantity(state.cartId, lineItemId, quantity);
        dispatch({ 
          type: CART_ACTIONS.SET_LINE_ITEMS, 
          payload: cart.lines.edges.map(edge => edge.node) 
        });
      } catch (err) {
        console.error("Update quantity failed:", err);
        // Revert optimistic update
        const cart = await getCart(state.cartId);
        dispatch({ 
          type: CART_ACTIONS.SET_LINE_ITEMS, 
          payload: cart.lines.edges.map(edge => edge.node) 
        });
      }
    },

    async removeItem(lineItemId) {
      // Optimistic update
      dispatch({ 
        type: CART_ACTIONS.OPTIMISTIC_REMOVE, 
        payload: lineItemId 
      });

      try {
        const cart = await removeFromCart(state.cartId, lineItemId);
        dispatch({ 
          type: CART_ACTIONS.SET_LINE_ITEMS, 
          payload: cart.lines.edges.map(edge => edge.node) 
        });
      } catch (err) {
        console.error("Remove from cart failed:", err);
        // Revert optimistic update
        const cart = await getCart(state.cartId);
        dispatch({ 
          type: CART_ACTIONS.SET_LINE_ITEMS, 
          payload: cart.lines.edges.map(edge => edge.node) 
        });
      }
    }
  }), [state.cartId]);

  // Initialize cart
  useEffect(() => {
    cartOperations.initCart();
  }, []);

  // Load product images
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
        
        dispatch({ type: CART_ACTIONS.SET_PRODUCT_IMAGES, payload: imageMap });
      } catch (err) {
        console.error("Failed to load product images:", err);
      }
    };
    
    loadProductImages();
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    ...state,
    ...cartOperations
  }), [state, cartOperations]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
