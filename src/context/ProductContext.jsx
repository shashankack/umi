import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { fetchShopifyProducts } from "../utils/shopify";

const ProductContext = createContext(null);

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single source of truth for loading products; reused by useEffect and refetch
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchShopifyProducts();
      // Defensive: ensure we always set an array
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load products");
      setProducts([]); // keep state consistent on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    let active = true;

    (async () => {
      await loadProducts();
    })();

    // In case you later add abortable fetch inside fetchShopifyProducts,
    // keep this pattern ready to gate state updates.
    return () => {
      active = false;
    };
  }, [loadProducts]);

  // Stable filter helper
  const getFilteredProducts = useCallback(
    (filter) => {
      if (!products?.length) return [];

      const norm = (s) => (s || "").toString().trim().toLowerCase();

      switch ((filter || "").toLowerCase()) {
        case "matcha":
          return products.filter((p) => {
            const t = norm(p.productType);
            return t === "matcha" || t === "matchaware";
          });
        case "accessories":
          return products.filter((p) => norm(p.productType) === "matchaware");
        default:
          return products;
      }
    },
    [products]
  );

  // Useful derived maps (optional, but handy)
  const byId = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      if (p?.id != null) map.set(p.id, p);
    }
    return map;
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      getFilteredProducts,
      byId,
      refetch: loadProducts,
    }),
    [products, loading, error, getFilteredProducts, byId, loadProducts]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
