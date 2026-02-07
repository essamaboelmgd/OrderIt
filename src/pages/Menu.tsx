import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/menu/ProductCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { Input } from '@/components/ui/input';
import { categories, products } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTableNumber, tableNumber } = useCart();

  // Get table number from URL
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(parseInt(table, 10));
    }
  }, [searchParams, setTableNumber]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">القائمة</h1>
              <p className="text-muted-foreground">اختر من بين أشهى أطباقنا</p>
            </div>
            {tableNumber && (
              <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary/10 rounded-xl">
                <span className="text-xs text-muted-foreground">طاولة رقم</span>
                <span className="text-2xl font-bold text-primary">{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث عن طبق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-12 rounded-xl"
            />
          </div>

          {/* Categories */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
