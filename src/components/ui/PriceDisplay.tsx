'use client';

import { Badge } from '@/components/ui/badge';
import { Tag, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number; // للخصومات
  showDiscount?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

export function PriceDisplay({ 
  amount, 
  originalAmount, 
  showDiscount = false,
  className = '',
  size = 'md',
  showSavings = false
}: PriceDisplayProps) {
  const { settings, isLoading } = useCurrencyContext();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-300 h-6 w-20 rounded ${className}`}></div>
    );
  }

  const formattedPrice = formatPrice(amount, settings);
  const formattedOriginalPrice = originalAmount ? formatPrice(originalAmount, settings) : null;
  
  const hasDiscount = showDiscount && originalAmount && originalAmount > amount;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;
  const savings = hasDiscount ? formatPrice(originalAmount - amount, settings) : null;

  // أحجام النصوص
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl', 
    lg: 'text-4xl'
  };

  const smallSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  if (hasDiscount) {
    return (
      <div className={className}>
        {/* الخصم */}
        <div className="space-y-2">
          {/* السعر الحالي */}
          <div className={`font-bold text-green-400 ${sizeClasses[size]}`}>
            {formattedPrice}
          </div>
          
          {/* السعر الأصلي والخصم */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-gray-400 line-through ${smallSizeClasses[size]}`}>
              {formattedOriginalPrice}
            </span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <Tag className="h-3 w-3 ml-1" />
              خصم {discountPercentage}%
            </Badge>
          </div>

          {/* المدخرات */}
          {showSavings && savings && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <Sparkles className="h-3 w-3" />
              <span>وفر {savings}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className={`font-bold ${sizeClasses[size]}`}>
        {formattedPrice}
      </span>
    </div>
  );
}

// Component مبسط للاستخدام في الحالات البسيطة
export function SimplePrice({ amount, className = '' }: { amount: number; className?: string }) {
  return <PriceDisplay amount={amount} className={className} size="sm" />;
}

// Component للخصومات
export function DiscountPrice({ 
  amount, 
  originalAmount, 
  className = '',
  showSavings = true 
}: { 
  amount: number; 
  originalAmount: number; 
  className?: string;
  showSavings?: boolean;
}) {
  return (
    <PriceDisplay 
      amount={amount} 
      originalAmount={originalAmount}
      showDiscount={true}
      showSavings={showSavings}
      className={className}
      size="md"
    />
  );
} 