import {
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

export default function DashboardStats() {
    const { products, categories, tables } = useAdmin();
    const { orders, getTodayRevenue, getTodayOrdersCount, getPendingOrders } = useOrders();
    const navigate = useNavigate();

    const stats = [
        {
            title: 'إيرادات اليوم',
            value: `${getTodayRevenue()} جنية`,
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

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-lg text-foreground">أحدث الطلبات</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>عرض الكل</Button>
                    </div>
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b border-border text-right">
                                        <th className="p-4 font-medium text-muted-foreground">رقم الطلب</th>
                                        <th className="p-4 font-medium text-muted-foreground">الطاولة</th>
                                        <th className="p-4 font-medium text-muted-foreground">الحالة</th>
                                        <th className="p-4 font-medium text-muted-foreground">الإجمالي</th>
                                        <th className="p-4 font-medium text-muted-foreground">الوقت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">#{order.id.slice(-6)}</td>
                                            <td className="p-4">{order.tableNumber}</td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    order.status === 'completed' ? "bg-green-100 text-green-700" :
                                                        order.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-blue-100 text-blue-700"
                                                )}>
                                                    {order.status === 'pending' ? 'انتظار' :
                                                        order.status === 'preparing' ? 'تحضير' :
                                                            order.status === 'ready' ? 'جاهز' :
                                                                order.status === 'served' ? 'تم التقديم' : 'مكتمل'}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold">{order.totalAmount} جنية</td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">لا يوجد طلبات حديثة</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Popular Products (Mock Calculation for Demo) */}
                <div className="bg-card rounded-xl shadow-card h-fit">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-bold text-lg text-foreground">الأكثر مبيعاً</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* We can calculate this from real orders data */}
                        {Array.from(
                            orders.flatMap(o => o.items)
                                .reduce((acc, item) => {
                                    acc.set(item.product.id, {
                                        name: item.product.nameAr,
                                        count: (acc.get(item.product.id)?.count || 0) + item.quantity,
                                        price: item.product.price
                                    });
                                    return acc;
                                }, new Map<string, { name: string, count: number, price: number }>())
                                .entries()
                        )
                            .sort((a, b) => b[1].count - a[1].count)
                            .slice(0, 5)
                            .map(([id, item], index) => (
                                <div key={id} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.count} طلب</p>
                                    </div>
                                    <p className="font-bold text-foreground">{item.price} ج.م</p>
                                </div>
                            ))}

                        {orders.length === 0 && (
                            <p className="text-center text-muted-foreground">لا توجد بيانات كافية</p>
                        )}
                    </div>
                </div>
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
