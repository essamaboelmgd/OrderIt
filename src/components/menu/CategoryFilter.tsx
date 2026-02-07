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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
          selectedCategory === null
            ? 'bg-primary text-primary-foreground shadow-gold'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        )}
      >
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-gold'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          )}
        >
          {category.nameAr}
        </button>
      ))}
    </div>
  );
}
