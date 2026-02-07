export interface Category {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  categoryId: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  paymentMethod: 'online' | 'cash';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  number: number;
  qrCode: string;
  isActive: boolean;
}
