import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Order, CartItem } from '@/types/restaurant';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (items: CartItem[], tableNumber: number, paymentMethod: 'online' | 'cash', notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByTable: (tableNumber: number) => Order[];
  getPendingOrders: () => Order[];
  getTodayRevenue: () => number;
  getTodayOrdersCount: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'restaurant-orders';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((order: Order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));
    }
    return [];
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback(
    (items: CartItem[], tableNumber: number, paymentMethod: 'online' | 'cash', notes?: string): Order => {
      const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        tableNumber,
        items,
        status: 'pending',
        paymentMethod,
        totalAmount,
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
      )
    );
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders]
  );

  const getOrdersByTable = useCallback(
    (tableNumber: number) => orders.filter((order) => order.tableNumber === tableNumber),
    [orders]
  );

  const getPendingOrders = useCallback(
    () => orders.filter((order) => order.status !== 'completed'),
    [orders]
  );

  const getTodayRevenue = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders
      .filter((order) => new Date(order.createdAt) >= today && order.status !== 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orders]);

  const getTodayOrdersCount = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((order) => new Date(order.createdAt) >= today).length;
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByTable,
        getPendingOrders,
        getTodayRevenue,
        getTodayOrdersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
