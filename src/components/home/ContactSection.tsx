import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactInfo = [
  {
    icon: MapPin,
    title: 'العنوان',
    details: 'شارع الملك فهد، الرياض',
    subtitle: 'المملكة العربية السعودية',
  },
  {
    icon: Phone,
    title: 'الهاتف',
    details: '+966 11 234 5678',
    subtitle: 'متاح على مدار الساعة',
  },
  {
    icon: Clock,
    title: 'ساعات العمل',
    details: '12:00 م - 12:00 ص',
    subtitle: 'يومياً',
  },
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    details: 'info@restaurant.sa',
    subtitle: 'نرد خلال 24 ساعة',
  },
];

export function ContactSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">تواصل معنا</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            نحن هنا لخدمتكم
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-foreground font-medium">{item.details}</p>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[21/9] bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">خريطة الموقع</p>
              <Button variant="outline" className="mt-4">
                فتح في خرائط جوجل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
