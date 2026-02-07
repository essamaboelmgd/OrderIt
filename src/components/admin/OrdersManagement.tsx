import { useState } from 'react';
import { Clock, CheckCircle, ChefHat, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/types/restaurant';
import { cn } from '@/lib/utils';

const statusConfig: Record<Order['status'], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  preparing: { label: 'جاري التحضير', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: ChefHat },
  ready: { label: 'جاهز للتقديم', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  served: { label: 'تم التقديم', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Truck },
  completed: { label: 'مكتمل', color: 'bg-muted text-muted-foreground border-muted', icon: CheckCircle },
};

const statusFlow: Order['status'][] = ['pending', 'preparing', 'ready', 'served', 'completed'];

export default function OrdersManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.status === filter);

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          الكل ({orders.length})
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status as Order['status'])}
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const nextStatus = getNextStatus(order.status);

            return (
              <div
                key={order.id}
                className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{order.tableNumber}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <Badge className={cn('border', status.color)}>
                    <StatusIcon className="h-3 w-3 ml-1" />
                    {status.label}
                  </Badge>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.nameAr}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.product.price * item.quantity} جنية
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <p className="text-sm text-muted-foreground bg-muted rounded-lg p-2 mb-4">
                    ملاحظات: {order.notes}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-lg font-bold text-primary">{order.totalAmount} جنية</p>
                    <p className="text-xs text-muted-foreground">
                      {order.paymentMethod === 'cash' ? 'دفع عند الاستلام' : 'دفع إلكتروني'}
                    </p>
                  </div>
                  {nextStatus && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                    >
                      {statusConfig[nextStatus].label}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl">
          <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد طلبات</p>
        </div>
      )}
    </div>
  );
}
