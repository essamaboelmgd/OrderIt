import { Link } from 'react-router-dom';
import { CheckCircle, Clock, UtensilsCrossed } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const orderNumber = Math.floor(Math.random() * 9000) + 1000;

  return (
    <Layout>
      <div className="container py-20">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            تم استلام طلبك بنجاح!
          </h1>
          <p className="text-muted-foreground mb-8">
            رقم الطلب: <span className="font-bold text-primary">#{orderNumber}</span>
          </p>

          {/* Status Card */}
          <div className="rounded-2xl bg-card shadow-card p-6 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-xs text-muted-foreground mt-2">جاري التحضير</span>
              </div>
              <div className="h-0.5 w-12 bg-muted" />
              <div className="flex flex-col items-center opacity-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground mt-2">جاهز للتقديم</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">الوقت المتوقع للتحضير</p>
              <p className="text-3xl font-bold text-primary">15-20 دقيقة</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            سيتم إحضار طلبك إلى طاولتك بمجرد جاهزيته. شكراً لاختياركم OrderIt!
          </p>

          <Link to="/menu">
            <Button variant="outline" size="lg">
              العودة للقائمة
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
