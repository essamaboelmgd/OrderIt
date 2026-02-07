import { cn } from '@/lib/utils';
import { Category } from '@/types/restaurant';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
      {/* Removed 'All' button for scroll-spy layout as it's less relevant */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'shrink-0 snap-start rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 border',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground border-primary shadow-gold scale-105'
              : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
          )}
        >
          {category.nameAr}
        </button>
      ))}
    </div>
  );
}
