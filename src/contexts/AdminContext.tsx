import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { Category, Product, Table } from '@/types/restaurant';
import { categories as initialCategories, products as initialProducts } from '@/data/mockData';

interface AdminContextType {
  isAuthenticated: boolean;

  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  categories: Category[];
  products: Product[];
  tables: Table[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTable: (tableNumber: number) => void;
  deleteTable: (id: string) => void;
  toggleTableStatus: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  auth: 'restaurant-admin-token',
  categories: 'restaurant-categories',
  products: 'restaurant-products',
  tables: 'restaurant-tables',
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!Cookies.get(STORAGE_KEYS.auth);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.categories);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.products);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.tables);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 10 }, (_, i) => ({
      id: `table-${i + 1}`,
      number: i + 1,
      qrCode: `/menu?table=${i + 1}`,
      isActive: true,
    }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tables, JSON.stringify(tables));
  }, [tables]);

  const login = useCallback(async (password: string, email: string = 'admin@admin.com') => {
    try {
      const response = await authService.login(email, password);
      // The user wants to keep things in cookies
      // We assume response.access_token is the token
      if (response && response.access_token) {
        Cookies.set(STORAGE_KEYS.auth, response.access_token, { expires: 7 }); // 7 days
        setIsAuthenticated(true);
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'تأكد من البريد الإلكتروني وكلمة المرور',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    Cookies.remove(STORAGE_KEYS.auth);
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((id: string, category: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...category } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...product } : prod))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  }, []);

  const addTable = useCallback((tableNumber: number) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: tableNumber,
      qrCode: `/menu?table=${tableNumber}`,
      isActive: true,
    };
    setTables((prev) => [...prev, newTable]);
  }, []);

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  }, []);

  const toggleTableStatus = useCallback((id: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id ? { ...table, isActive: !table.isActive } : table
      )
    );
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        categories,
        products,
        tables,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addTable,
        deleteTable,
        toggleTableStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
