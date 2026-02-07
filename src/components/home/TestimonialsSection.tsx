import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'أحمد محمد',
    role: 'زبون دائم',
    content: 'أفضل مطعم عربي جربته! الطعام لذيذ والخدمة ممتازة. نظام الطلب عبر QR سهّل العملية كثيراً.',
    rating: 5,
    avatar: 'أ',
  },
  {
    name: 'سارة الأحمد',
    role: 'مدونة طعام',
    content: 'تجربة رائعة من البداية للنهاية. المندي من ألذ ما ذقت والأجواء مميزة جداً.',
    rating: 5,
    avatar: 'س',
  },
  {
    name: 'خالد العمري',
    role: 'رجل أعمال',
    content: 'مكان مثالي لاجتماعات العمل والعزومات. الجودة ثابتة والطاقم محترف.',
    rating: 5,
    avatar: 'خ',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">آراء العملاء</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ماذا يقول عملاؤنا
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-background rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
