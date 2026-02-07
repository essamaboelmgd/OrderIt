import { ChefHat, Users, Clock, Star } from 'lucide-react';
import heroImage from '@/assets/hero-restaurant.jpg';

const stats = [
  { icon: ChefHat, value: '15+', label: 'طاهٍ محترف' },
  { icon: Users, value: '50K+', label: 'عميل سعيد' },
  { icon: Clock, value: '10+', label: 'سنوات خبرة' },
  { icon: Star, value: '4.9', label: 'تقييم العملاء' },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="مطعم الذواقة"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-6 animate-float">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-7 w-7 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <p className="text-sm text-muted-foreground">تقييم ممتاز</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium text-primary mb-2 block">من نحن</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                قصة شغف بالطعام العربي الأصيل
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                منذ أكثر من عشر سنوات، بدأنا رحلتنا في تقديم أشهى المأكولات العربية 
                التقليدية بلمسة عصرية. نحرص على استخدام أجود المكونات الطازجة 
                ونفتخر بفريق طهاة محترفين يضعون شغفهم في كل طبق.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <stat.icon className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
