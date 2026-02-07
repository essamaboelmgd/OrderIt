import { QrCode, UtensilsCrossed, ShoppingCart, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: QrCode,
    title: 'امسح الرمز',
    description: 'امسح رمز QR الموجود على طاولتك',
  },
  {
    icon: UtensilsCrossed,
    title: 'اختر طعامك',
    description: 'تصفح القائمة واختر أطباقك المفضلة',
  },
  {
    icon: ShoppingCart,
    title: 'أضف للسلة',
    description: 'أضف الأصناف المختارة إلى سلة الطلب',
  },
  {
    icon: CreditCard,
    title: 'أكمل الطلب',
    description: 'اختر طريقة الدفع وأكد طلبك',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">طريقة الطلب</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كيف تطلب؟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اتبع هذه الخطوات البسيطة للاستمتاع بطلبك
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground shadow-gold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -left-3 w-6 border-t-2 border-dashed border-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
