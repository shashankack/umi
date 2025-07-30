import { createContext, useContext, useState, useEffect } from 'react';
import { fetchShopifyProducts } from '../utils/shopify';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchShopifyProducts();
        
        if (isMounted) {
          setProducts(data);
          setError(null);
          console.log('✅ Products loaded:', data.length);
        }
      } catch (err) {
        if (isMounted) {
          console.error('❌ Failed to fetch products:', err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized filtered products for different sections
  const getFilteredProducts = (filter) => {
    if (!products.length) return [];
    
    switch (filter) {
      case 'matcha':
        return products.filter(p => 
          p.productType.toLowerCase() === 'matcha' || 
          p.productType.toLowerCase() === 'matchaware'
        );
      case 'accessories':
        return products.filter(p => 
          p.productType.toLowerCase() === 'matchaware'
        );
      default:
        return products;
    }
  };

  const value = {
    products,
    loading,
    error,
    getFilteredProducts,
    refetch: () => {
      setLoading(true);
      loadProducts();
    }
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
