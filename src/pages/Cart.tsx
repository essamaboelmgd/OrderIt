import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Banknote } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Cart() {
  const { items, tableNumber, updateQuantity, removeItem, updateItemNotes, clearCart, totalAmount } = useCart();
  const { createOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast.error('يرجى مسح رمز QR للطاولة أولاً');
      return;
    }

    if (items.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    setIsSubmitting(true);

    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order = createOrder(items, tableNumber, paymentMethod);

    toast.success('تم إرسال طلبك بنجاح!');
    clearCart();
    navigate(`/order-tracking?id=${order.id}`);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">السلة فارغة</h1>
            <p className="text-muted-foreground mb-8">لم تقم بإضافة أي أصناف بعد</p>
            <Link to="/menu">
              <Button variant="hero" size="lg">
                تصفح القائمة
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">سلة الطلب</h1>
            <p className="text-muted-foreground">{items.length} صنف في السلة</p>
          </div>
          {tableNumber && (
            <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary/10 rounded-xl">
              <span className="text-xs text-muted-foreground">طاولة رقم</span>
              <span className="text-2xl font-bold text-primary">{tableNumber}</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-4 p-4 rounded-xl bg-card shadow-card"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.nameAr}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{item.product.nameAr}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.descriptionAr}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary">
                        {item.product.price * item.quantity} جنية
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stylish Item Notes */}
                <div className="relative">
                  <div className="absolute top-3 right-3 text-muted-foreground">
                    <Trash2 className="h-3 w-3 opacity-0" /> {/* Spacer */}
                  </div>
                  <Textarea
                    placeholder="ملاحظات على هذا الصنف (اختياري)..."
                    value={item.notes || ''}
                    onChange={(e) => updateItemNotes(item.product.id, e.target.value)}
                    className="min-h-[60px] bg-muted/30 border-dashed focus:border-solid focus:ring-0 resize-none text-sm pr-9"
                  />
                  <div className="absolute top-3 right-3 text-muted-foreground pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-pen"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" /><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><path d="M18.4 2.6a2.17 2.17 0 0 1 3 3L16 11l-4 1 1-4Z" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-card shadow-card p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground">ملخص الطلب</h2>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="block font-medium text-foreground">طريقة الدفع</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Banknote className={cn('h-6 w-6', paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-sm font-medium', paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground')}>
                      نقداً
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      paymentMethod === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <CreditCard className={cn('h-6 w-6', paymentMethod === 'online' ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-sm font-medium', paymentMethod === 'online' ? 'text-primary' : 'text-muted-foreground')}>
                      أونلاين
                    </span>
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-medium">{totalAmount} جنية</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الضريبة (15%)</span>
                  <span className="font-medium">{(totalAmount * 0.15).toFixed(2)} جنية</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>الإجمالي</span>
                  <span className="text-primary">{(totalAmount * 1.15).toFixed(2)} جنية</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !tableNumber}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  <>
                    تأكيد الطلب
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              {!tableNumber && (
                <p className="text-sm text-destructive text-center">
                  يرجى مسح رمز QR للطاولة أولاً
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
