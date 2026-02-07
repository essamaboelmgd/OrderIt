import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderOpen, 
  QrCode, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { useOrders } from '@/contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import OrdersManagement from '@/components/admin/OrdersManagement';
import ProductsManagement from '@/components/admin/ProductsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import TablesManagement from '@/components/admin/TablesManagement';

type Tab = 'dashboard' | 'orders' | 'products' | 'categories' | 'tables';

const navItems = [
  { id: 'dashboard' as Tab, label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'orders' as Tab, label: 'الطلبات', icon: ShoppingBag },
  { id: 'products' as Tab, label: 'المنتجات', icon: Package },
  { id: 'categories' as Tab, label: 'التصنيفات', icon: FolderOpen },
  { id: 'tables' as Tab, label: 'الطاولات', icon: QrCode },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, products, categories, tables } = useAdmin();
  const { orders, getTodayRevenue, getTodayOrdersCount, getPendingOrders } = useOrders();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'إيرادات اليوم',
      value: `${getTodayRevenue()} ر.س`,
      icon: DollarSign,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'طلبات اليوم',
      value: getTodayOrdersCount(),
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'طلبات قيد التنفيذ',
      value: getPendingOrders().length,
      icon: Clock,
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'إجمالي الطلبات',
      value: orders.length,
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersManagement />;
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'tables':
        return <TablesManagement />;
      default:
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-bold text-foreground mb-4">المنتجات</h3>
                <p className="text-3xl font-bold text-primary">{products.length}</p>
                <p className="text-sm text-muted-foreground">منتج في القائمة</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-bold text-foreground mb-4">التصنيفات</h3>
                <p className="text-3xl font-bold text-primary">{categories.length}</p>
                <p className="text-sm text-muted-foreground">تصنيف</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-bold text-foreground mb-4">الطاولات</h3>
                <p className="text-3xl font-bold text-primary">{tables.filter(t => t.isActive).length}</p>
                <p className="text-sm text-muted-foreground">طاولة نشطة</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 right-0 z-50 w-64 bg-card border-l border-border transform transition-transform lg:transform-none',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">مطعم الذواقة</h1>
            <p className="text-sm text-muted-foreground">لوحة التحكم</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-bold text-foreground">
                {navItems.find((item) => item.id === activeTab)?.label}
              </h2>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
