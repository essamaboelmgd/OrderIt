import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Utensils, Sparkles, ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-restaurant.jpg';

export function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="مطعم الذواقة"
          className="h-full w-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brown/95 via-brown/75 to-brown/50 dark:from-black/95 dark:via-black/80 dark:to-black/60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-8 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-5 py-2.5 backdrop-blur-md border border-primary/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">تجربة طعام استثنائية</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight">
            اكتشف طعم
            <span className="block text-gradient mt-2">الأصالة العربية</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-cream/80 leading-relaxed max-w-xl">
            استمتع بتجربة طعام فريدة مع أشهى المأكولات العربية التقليدية 
            المحضرة بعناية من أجود المكونات الطازجة
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/menu">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-gold">
                <Utensils className="h-5 w-5" />
                استعرض القائمة
              </Button>
            </Link>
            <Link to="/menu">
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto border-cream/30 text-cream hover:bg-cream/10"
              >
                <QrCode className="h-5 w-5" />
                امسح رمز QR
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-cream/20">
            <div>
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-cream/60 text-sm">عميل سعيد</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">4.9</p>
              <p className="text-cream/60 text-sm">تقييم ممتاز</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-cream/60 text-sm">سنوات خبرة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60 hover:text-cream transition-colors cursor-pointer"
      >
        <span className="text-sm">اكتشف المزيد</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
