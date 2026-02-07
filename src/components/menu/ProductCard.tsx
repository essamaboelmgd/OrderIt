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
        'group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover',
        isAdding && 'animate-scale-in'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-overlay opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Prep Time Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 backdrop-blur-sm">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">{product.preparationTime} د</span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-primary px-3 py-1.5 shadow-gold">
          <span className="text-sm font-bold text-primary-foreground">{product.price} ر.س</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-1">{product.nameAr}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.descriptionAr}</p>

        {/* Add to Cart */}
        {quantity === 0 ? (
          <Button
            variant="gold"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
          >
            <Plus className="h-4 w-4" />
            أضف للسلة
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-bold text-primary">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Unavailable Overlay */}
      {!product.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <span className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">
            غير متوفر
          </span>
        </div>
      )}
    </div>
  );
}
