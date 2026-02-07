import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle, Truck, Package, ArrowRight, Home } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/types/restaurant';
import { cn } from '@/lib/utils';

const statusSteps = [
  { id: 'pending', label: 'تم الاستلام', icon: Clock },
  { id: 'preparing', label: 'جاري التحضير', icon: ChefHat },
  { id: 'ready', label: 'جاهز', icon: Package },
  { id: 'served', label: 'تم التقديم', icon: Truck },
  { id: 'completed', label: 'مكتمل', icon: CheckCircle },
];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | undefined>();
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (order && order.status !== 'completed') {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [order]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex((step) => step.id === order.status);
  };

  if (!order) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="max-w-md mx-auto text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">لم يتم العثور على الطلب</h1>
            <p className="text-muted-foreground mb-6">
              تأكد من صحة رقم الطلب أو ابدأ طلباً جديداً
            </p>
            <Link to="/menu">
              <Button>
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة للقائمة
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStep = getCurrentStepIndex();
  const estimatedTime = order.items.reduce(
    (max, item) => Math.max(max, item.product.preparationTime),
    0
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{order.id}</h1>
                <p className="text-muted-foreground">طاولة رقم {order.tableNumber}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{formatTime(timeElapsed)}</p>
                <p className="text-sm text-muted-foreground">الوقت المنقضي</p>
              </div>
            </div>

            {order.status !== 'completed' && order.status !== 'served' && (
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">الوقت المتوقع للتحضير</p>
                <p className="text-2xl font-bold text-primary">{estimatedTime} دقيقة</p>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-lg font-bold text-foreground mb-6">حالة الطلب</h2>
            <div className="relative">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div key={step.id} className="flex items-start gap-4 relative">
                    {/* Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={cn(
                          'absolute right-5 top-10 w-0.5 h-12',
                          isCompleted ? 'bg-primary' : 'bg-border'
                        )}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all',
                        isCompleted && 'bg-primary text-primary-foreground',
                        isCurrent && 'bg-primary text-primary-foreground animate-pulse',
                        isPending && 'bg-muted text-muted-foreground'
                      )}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className={cn('pb-8', isPending && 'opacity-50')}>
                      <p className={cn('font-bold', isCurrent && 'text-primary')}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          جاري المعالجة...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-lg font-bold text-foreground mb-4">تفاصيل الطلب</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {item.quantity}
                    </span>
                    <span className="text-foreground">{item.product.nameAr}</span>
                  </div>
                  <span className="font-medium text-muted-foreground">
                    {item.product.price * item.quantity} جنية
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between">
              <span className="font-bold text-foreground">الإجمالي</span>
              <span className="text-xl font-bold text-primary">{order.totalAmount} جنية</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/menu" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 ml-2" />
                طلب المزيد
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
