import { Plus, Minus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/restaurant';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl md:rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-500 hover:shadow-gold/20 hover:border-primary/30 hover:-translate-y-1',
        isAdding && 'animate-scale-in'
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

        {/* Top Badges - Compact */}
        <div className="absolute top-2 inset-x-2 flex justify-between items-start">
          <div className="flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 backdrop-blur-md shadow-sm border border-border/50">
            <Clock className="h-3 w-3 text-primary" />
            <span className="text-[10px] md:text-xs font-bold">{product.preparationTime} د</span>
          </div>
          {/* Price Tag */}
          <div className="rounded-full bg-primary px-2 py-0.5 md:px-3 md:py-1 shadow-gold">
            <span className="text-xs md:text-sm font-bold text-primary-foreground">{product.price} ج</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-5">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm md:text-xl font-bold text-foreground mb-1 md:mb-2 font-display line-clamp-1">{product.nameAr}</h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.descriptionAr}</p>
        </div>

        {/* Action Area */}
        <div className="pt-0 md:pt-2">
          {quantity === 0 ? (
            <Button
              size="sm"
              className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-lg hover:shadow-gold rounded-lg md:rounded-xl font-bold text-xs md:text-sm h-8 md:h-10"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              أضف
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-1 p-1 rounded-lg md:rounded-xl bg-muted/50 border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-10 md:w-10 rounded-md md:rounded-lg hover:bg-background hover:text-destructive hover:shadow-sm"
                onClick={handleDecrement}
              >
                <Minus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <span className="text-sm md:text-lg font-bold text-foreground min-w-[1.5ch] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-10 md:w-10 rounded-md md:rounded-lg hover:bg-background hover:text-primary hover:shadow-sm"
                onClick={handleIncrement}
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Unavailable Overlay */}
      {!product.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
          <span className="rounded-full bg-destructive px-3 py-1 md:px-6 md:py-2 text-xs md:text-sm font-bold text-destructive-foreground shadow-lg transform -rotate-12">
            غير متوفر
          </span>
        </div>
      )}
    </div>
  );
}
