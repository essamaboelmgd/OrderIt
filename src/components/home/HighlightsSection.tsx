import { Zap, Leaf, Clock, Award, QrCode, Shield } from 'lucide-react';

const highlights = [
  {
    icon: QrCode,
    title: 'طلب سريع',
    description: 'اطلب عبر رمز QR بدون انتظار',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Leaf,
    title: 'مكونات طازجة',
    description: 'نستخدم أجود المكونات الطازجة يومياً',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Clock,
    title: 'خدمة سريعة',
    description: 'تحضير سريع وتقديم احترافي',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'جودة عالية',
    description: 'طهاة محترفون بخبرة سنوات',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

export function HighlightsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">لماذا نحن؟</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ما يميزنا عن الآخرين
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-3 shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-full w-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
