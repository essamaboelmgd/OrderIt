import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/data/mockData';

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">تصفح حسب التصنيف</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            اكتشف قائمتنا المتنوعة
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.nameAr}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white mb-1">{category.nameAr}</h3>
                <div className="flex items-center gap-1 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>تصفح</span>
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
