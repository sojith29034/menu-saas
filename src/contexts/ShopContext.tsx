import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopFormData } from '../types';

interface ShopContextType {
  shops: ShopFormData[];
  loading: boolean;
  error: string | null;
  getShopById: (id: string) => ShopFormData | undefined;
  createShop: (data: ShopFormData) => Promise<void>;
  updateShop: (id: string, data: ShopFormData) => Promise<void>;
  deleteShop: (id: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<ShopFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shops');
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      const data = await response.json();
      setShops(data);
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Implement getShopById function
  const getShopById = (id: string): ShopFormData | undefined => {
    const shop = shops.find(shop => shop._id === id);
    if (!shop) return undefined;

    // Convert menu from array to object format if needed
    return {
      ...shop,
      menu: Array.isArray(shop.menu) 
        ? shop.menu 
        : Object.entries(shop.menu).map(([categoryName, items]) => ({
            categoryName,
            items: Array.isArray(items) ? items : []
          }))
    };
  };

  const createShop = async (shopData: ShopFormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shop');
      }

      await fetchShops();
    } catch (err) {
      console.error('Error creating shop:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateShop = async (id: string, shopData: ShopFormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shops/id/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update shop');
      }

      await fetchShops();
    } catch (err) {
      console.error('Error updating shop:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteShop = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shops/id/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete shop');
      }

      await fetchShops();
    } catch (err) {
      console.error('Error deleting shop:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    shops,
    loading,
    error,
    getShopById,
    createShop,
    updateShop,
    deleteShop,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}