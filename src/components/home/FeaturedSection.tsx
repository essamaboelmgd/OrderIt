import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

export function FeaturedSection() {
  const { addItem } = useCart();
  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.nameAr || '';
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-sm font-medium text-primary mb-2 block">الأكثر طلباً</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              أطباقنا المميزة
            </h2>
            <p className="text-muted-foreground mt-2">
              اكتشف أشهر الأطباق التي يفضلها عملاؤنا
            </p>
          </div>
          <Link to="/menu">
            <Button variant="outline" className="hidden sm:flex gap-2 group">
              عرض القائمة كاملة
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.nameAr}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-foreground">{getCategoryName(product.categoryId)}</span>
                </div>

                {/* Prep Time */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium">{product.preparationTime} د</span>
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => addItem(product)}
                  >
                    أضف للسلة - {product.price} ر.س
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {product.nameAr}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.descriptionAr}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{product.price} ر.س</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link to="/menu">
            <Button variant="gold" size="lg" className="gap-2">
              عرض القائمة كاملة
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
