import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, UtensilsCrossed } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/menu/ProductCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { Input } from '@/components/ui/input';
import { categories, products } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTableNumber, tableNumber } = useCart();

  // Refs for scrolling
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isManualScrolling = useRef(false);

  // Get table number from URL
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(parseInt(table, 10));
    }
  }, [searchParams, setTableNumber]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    if (searchQuery) {
      // If searching, return a flat list or filtered groups. 
      // Let's return a single "Search Results" group or filter within categories.
      // Filtering within categories preserves the structure.
      const filtered = categories.map(cat => ({
        ...cat,
        products: products.filter(p =>
          p.categoryId === cat.id &&
          (p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(cat => cat.products.length > 0);
      return filtered;
    }

    return categories.map(cat => ({
      ...cat,
      products: products.filter(p => p.categoryId === cat.id)
    }));
  }, [searchQuery]);

  // Scroll Spy Logic
  useEffect(() => {
    if (searchQuery) return; // Disable scroll spy during search

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [productsByCategory, searchQuery]);

  const scrollToCategory = (categoryId: string | null) => {
    if (!categoryId) return; // "All" button logic might be different or removed

    setActiveCategory(categoryId);
    isManualScrolling.current = true;

    const element = categoryRefs.current[categoryId];
    if (element) {
      const headerOffset = 180; // Approximate height of sticky header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset manual scroll lock after animation
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
    }
  };

  return (
    <Layout>
      {/* Hero Section - Compact on Mobile */}
      <div className="relative h-[20vh] min-h-[200px] md:min-h-[300px] flex items-center justify-center overflow-hidden bg-brown">
        <div className="absolute inset-0 opacity-20 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain blur-sm filter" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />

        <div className="relative z-10 text-center space-y-2 px-4 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-cream font-display">قائمة الطعام</h1>
          <p className="text-cream/80 text-sm md:text-lg max-w-xl mx-auto">
            تصفح أشهى الأطباق
          </p>
        </div>
      </div>

      {/* Sticky Navigation & Search */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container py-3 space-y-3">
          {/* Search and Table Info */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طبق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 h-10 rounded-xl border-border/50 bg-muted/50 focus:bg-background transition-colors text-sm"
              />
            </div>

            {tableNumber && (
              <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <span className="text-xs font-medium text-foreground">طاولة</span>
                <span className="text-lg font-bold text-primary">{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Categories - Sticky Tabs */}
          {!searchQuery && (
            <CategoryFilter
              categories={categories}
              selectedCategory={activeCategory}
              onSelectCategory={scrollToCategory}
            />
          )}
        </div>
      </div>

      {/* Main Content List */}
      <div className="container py-8 min-h-screen">
        {productsByCategory.length > 0 ? (
          <div className="space-y-10 pb-20">
            {productsByCategory.map((category) => (
              <div
                key={category.id}
                id={category.id}
                ref={(el) => (categoryRefs.current[category.id] = el)}
                className="scroll-mt-40 animate-fade-in"
              >
                {/* Category Title */}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="h-8 w-1 bg-primary rounded-full inline-block"></span>
                  {category.nameAr}
                </h2>

                {/* Products Grid */}
                <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">جرب كلمة بحث أخرى</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
