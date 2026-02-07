import { useState } from 'react';
import { Clock, CheckCircle, ChefHat, Truck, XCircle, Printer } from 'lucide-react';
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

  const printReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>فاتورة طلب ${order.id}</title>
          <style>
            body { font-family: 'Tajawal', Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            .total { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
            .notes { margin-top: 10px; font-size: 12px; background: #eee; padding: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>OrderIt</h2>
            <p>طلب #${order.id.slice(-6)}</p>
            <p>طاولة: ${order.tableNumber}</p>
            <p>${new Date(order.createdAt).toLocaleString('ar-SA')}</p>
          </div>
          <div>
            ${order.items.map(item => `
                <div class="item">
                    <div style="flex: 1;">
                        <span>${item.product.nameAr} x${item.quantity}</span>
                        ${item.notes ? `<div style="font-size: 11px; color: #666; margin-right: 10px;">- ${item.notes}</div>` : ''}
                    </div>
                    <span>${item.product.price * item.quantity}</span>
                </div>
            `).join('')}
          </div>
          <div class="total">
            <span>الإجمالي</span>
            <span>${order.totalAmount} جنية</span>
          </div>
          ${order.notes ? `<div class="notes">ملاحظات: ${order.notes}</div>` : ''}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
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
            const isLatest = new Date().getTime() - new Date(order.createdAt).getTime() < 1000 * 60 * 5;

            return (
              <div
                key={order.id}
                className={`flex flex-col bg-white text-black p-0 shadow-lg hover:shadow-xl transition-all relative overflow-hidden font-mono text-sm max-w-sm mx-auto w-full ${isLatest && order.status === 'pending' ? 'ring-4 ring-primary/30' : ''}`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 95% 98%, 90% 100%, 85% 98%, 80% 100%, 75% 98%, 70% 100%, 65% 98%, 60% 100%, 55% 98%, 50% 100%, 45% 98%, 40% 100%, 35% 98%, 30% 100%, 25% 98%, 20% 100%, 15% 98%, 10% 100%, 5% 98%, 0 100%)',
                  minHeight: '400px'
                }}
              >
                {/* Receipt Header */}
                <div className="bg-gray-100 p-4 border-b-2 border-dashed border-gray-300 text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                      {order.tableNumber}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl uppercase tracking-widest">OrderIt</h3>
                  <p className="text-xs text-gray-500">#{order.id.slice(-6)}</p>
                  <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                  <Badge className={cn('mt-2', status.color, "bg-opacity-20 border-0")}>
                    {status.label}
                  </Badge>
                </div>

                {/* Items */}
                <div className="p-4 flex-1 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                      <div className="flex gap-2 basis-full">
                        <span className="font-bold w-6 text-center bg-gray-200 rounded text-xs py-1 h-fit shrink-0">{item.quantity}</span>
                        <div className="flex flex-col flex-1">
                          <span className="font-bold">{item.product.nameAr}</span>
                          <span className="text-xs text-gray-500">{item.product.name}</span>
                          {item.notes && (
                            <div className="text-xs text-gray-600 bg-yellow-50 p-1 rounded mt-1 border border-yellow-100 flex items-start gap-1">
                              <span className="font-bold text-[10px] shrink-0">ملاحظة:</span> <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold">{item.product.price * item.quantity}</span>
                    </div>
                  ))}

                  {order.notes && (
                    <div className="bg-yellow-50 p-2 text-xs border border-yellow-100 rounded mt-4">
                      <span className="font-bold block mb-1">ملاحظات:</span>
                      {order.notes}
                    </div>
                  )}
                </div>


                {/* Total & Actions */}
                <div className="p-4 bg-gray-50 border-t-2 border-dashed border-gray-300">
                  <div className="flex justify-between items-center mb-4 text-lg font-bold">
                    <span>الإجمالي</span>
                    <span>{order.totalAmount} جنية</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full border-black text-black hover:bg-gray-100"
                      onClick={() => printReceipt(order)}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      طباعة
                    </Button>

                    {nextStatus ? (
                      <Button
                        className={`w-full ${nextStatus === 'preparing' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                        onClick={() => updateOrderStatus(order.id, nextStatus)}
                      >
                        {nextStatus === 'preparing' ? 'استلام' : statusConfig[nextStatus].label}
                      </Button>
                    ) : (
                      <div className="bg-green-100 text-green-800 text-center py-2 rounded font-bold text-sm">
                        مكتمل
                      </div>
                    )}
                  </div>
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
