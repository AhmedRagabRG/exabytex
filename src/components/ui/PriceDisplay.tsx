'use client';

import { Badge } from '@/components/ui/badge';
import { Tag, Sparkles } from 'lucide-react';
import { formatPrice, convertFromEGP, convertToEGP } from '@/lib/currency';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number; // للخصومات
  showDiscount?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
  sourceCurrency?: string; // العملة الأصلية للسعر
}

export function PriceDisplay({ 
  amount, 
  originalAmount, 
  showDiscount = false,
  className = '',
  size = 'md',
  showSavings = false,
  sourceCurrency = 'SAR' // افتراضياً بالريال السعودي
}: PriceDisplayProps) {
  const { settings, isLoading } = useCurrencyContext();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-300 h-6 w-20 rounded ${className}`}></div>
    );
  }

  // تحويل السعر من العملة الأصلية إلى الجنيه المصري ثم إلى العملة المختارة
  const convertPrice = (price: number): number => {
    if (sourceCurrency === settings.defaultCurrency) return price;
    const priceInEGP = convertToEGP(price, sourceCurrency);
    return convertFromEGP(priceInEGP, settings.defaultCurrency);
  };

  const convertedAmount = convertPrice(amount);
  const convertedOriginalAmount = originalAmount ? convertPrice(originalAmount) : null;

  const formattedPrice = formatPrice(convertedAmount, settings);
  const formattedOriginalPrice = convertedOriginalAmount ? formatPrice(convertedOriginalAmount, settings) : null;
  
  const hasDiscount = showDiscount && convertedOriginalAmount && convertedOriginalAmount > convertedAmount;
  const discountPercentage = hasDiscount 
    ? Math.round(((convertedOriginalAmount - convertedAmount) / convertedOriginalAmount) * 100)
    : 0;
  const savings = hasDiscount ? formatPrice(convertedOriginalAmount - convertedAmount, settings) : null;

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
export function SimplePrice({ 
  amount, 
  className = '', 
  sourceCurrency = 'SAR' 
}: { 
  amount: number; 
  className?: string;
  sourceCurrency?: string;
}) {
  return <PriceDisplay amount={amount} className={className} size="sm" sourceCurrency={sourceCurrency} />;
}

// Component للخصومات
export function DiscountPrice({ 
  amount, 
  originalAmount, 
  className = '',
  showSavings = true,
  sourceCurrency = 'SAR'
}: { 
  amount: number; 
  originalAmount: number; 
  className?: string;
  showSavings?: boolean;
  sourceCurrency?: string;
}) {
  return (
    <PriceDisplay 
      amount={amount} 
      originalAmount={originalAmount}
      showDiscount={true}
      showSavings={showSavings}
      className={className}
      size="md"
      sourceCurrency={sourceCurrency}
    />
  );
} 