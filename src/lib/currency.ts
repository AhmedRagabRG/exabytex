import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CurrencySettings {
  defaultCurrency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  decimalPlaces: number;
}

// العملات المدعومة
export const SUPPORTED_CURRENCIES = {
  SAR: { name: 'ريال سعودي', symbol: 'ر.س', position: 'after' as const },
  EGP: { name: 'جنيه مصري', symbol: 'ج.م', position: 'after' as const },
  USD: { name: 'دولار أمريكي', symbol: '$', position: 'before' as const },
  EUR: { name: 'يورو', symbol: '€', position: 'after' as const },
  AED: { name: 'درهم إماراتي', symbol: 'د.إ', position: 'after' as const },
  KWD: { name: 'دينار كويتي', symbol: 'د.ك', position: 'after' as const },
  QAR: { name: 'ريال قطري', symbol: 'ر.ق', position: 'after' as const },
  BHD: { name: 'دينار بحريني', symbol: 'د.ب', position: 'after' as const },
  OMR: { name: 'ريال عماني', symbol: 'ر.ع', position: 'after' as const },
  JOD: { name: 'دينار أردني', symbol: 'د.أ', position: 'after' as const },
  LBP: { name: 'ليرة لبنانية', symbol: 'ل.ل', position: 'after' as const },
  IQD: { name: 'دينار عراقي', symbol: 'د.ع', position: 'after' as const },
  SYP: { name: 'ليرة سورية', symbol: 'ل.س', position: 'after' as const },
  MAD: { name: 'درهم مغربي', symbol: 'د.م', position: 'after' as const },
  TND: { name: 'دينار تونسي', symbol: 'د.ت', position: 'after' as const },
  DZD: { name: 'دينار جزائري', symbol: 'د.ج', position: 'after' as const }
};

// أسعار صرف العملات بالنسبة للجنيه المصري (محدث في يونيو 2025)
export const EXCHANGE_RATES = {
  EGP: 1, // الجنيه المصري (العملة الأساسية)
  USD: 49.5, // دولار أمريكي
  EUR: 52.5, // يورو  
  SAR: 13.2, // ريال سعودي (49.5 / 3.75)
  AED: 13.5, // درهم إماراتي (49.5 / 3.67)
  KWD: 162.5, // دينار كويتي (49.5 / 0.305)
  QAR: 13.6, // ريال قطري (49.5 / 3.64)
  BHD: 131.4, // دينار بحريني (49.5 / 0.377)
  OMR: 128.7, // ريال عماني (49.5 / 0.385)
  JOD: 69.9, // دينار أردني (49.5 / 0.708)
  LBP: 0.033, // ليرة لبنانية (49.5 / 1500)
  IQD: 0.038, // دينار عراقي (49.5 / 1310)
  SYP: 0.0124, // ليرة سورية (49.5 / 4000)
  MAD: 4.95, // درهم مغربي (49.5 / 10)
  TND: 15.8, // دينار تونسي (49.5 / 3.13)
  DZD: 0.37, // دينار جزائري (49.5 / 134)
} as const;

// الحصول على إعدادات العملة من قاعدة البيانات
export async function getCurrencySettings(): Promise<CurrencySettings> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        defaultCurrency: true,
        currencySymbol: true,
        currencyPosition: true,
        decimalPlaces: true
      }
    });

    if (settings) {
      return {
        defaultCurrency: settings.defaultCurrency,
        currencySymbol: settings.currencySymbol,
        currencyPosition: settings.currencyPosition as 'before' | 'after',
        decimalPlaces: settings.decimalPlaces
      };
    }

    // إعدادات افتراضية إذا لم توجد
    return {
      defaultCurrency: 'SAR',
      currencySymbol: 'ر.س',
      currencyPosition: 'after',
      decimalPlaces: 2
    };
  } catch (error) {
    console.error('Error fetching currency settings:', error);
    // إرجاع إعدادات افتراضية في حالة الخطأ
    return {
      defaultCurrency: 'SAR',
      currencySymbol: 'ر.س',
      currencyPosition: 'after',
      decimalPlaces: 2
    };
  }
}

// تنسيق السعر حسب إعدادات العملة
export function formatPrice(
  amount: number, 
  customSettings?: Partial<CurrencySettings>
): string {
  // استخدام الإعدادات المخصصة أو الافتراضية
  const settings = {
    currencySymbol: customSettings?.currencySymbol || 'ر.س',
    currencyPosition: customSettings?.currencyPosition || 'after',
    decimalPlaces: customSettings?.decimalPlaces ?? 2
  };

  // تنسيق الرقم
  const formattedAmount = amount.toLocaleString('ar-SA', {
    minimumFractionDigits: settings.decimalPlaces,
    maximumFractionDigits: settings.decimalPlaces
  });

  // إرجاع السعر مع العملة حسب الموضع
  if (settings.currencyPosition === 'before') {
    return `${settings.currencySymbol} ${formattedAmount}`;
  } else {
    return `${formattedAmount} ${settings.currencySymbol}`;
  }
}

// تحديث إعدادات العملة (للمدراء فقط)
export async function updateCurrencySettings(
  settings: Partial<CurrencySettings>,
  updatedById: string
): Promise<boolean> {
  try {
    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...settings,
          updatedById,
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          ...settings,
          updatedById
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating currency settings:', error);
    return false;
  }
}

// إنشاء hook للاستخدام في React components
export const useCurrency = () => {
  const formatCurrency = (amount: number, customSettings?: Partial<CurrencySettings>) => {
    return formatPrice(amount, customSettings);
  };

  return { formatCurrency };
};

// إنشاء component مساعد لعرض الأسعار
export interface PriceDisplayProps {
  amount: number;
  originalAmount?: number; // للخصومات
  showDiscount?: boolean;
  customSettings?: Partial<CurrencySettings>;
  className?: string;
}

export const getPriceDisplay = (props: PriceDisplayProps) => {
  const { amount, originalAmount, showDiscount, customSettings } = props;
  
  const formattedPrice = formatPrice(amount, customSettings);
  const formattedOriginalPrice = originalAmount ? formatPrice(originalAmount, customSettings) : null;
  
  const hasDiscount = showDiscount && originalAmount && originalAmount > amount;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;

  return {
    formattedPrice,
    formattedOriginalPrice,
    hasDiscount,
    discountPercentage,
    savings: hasDiscount ? formatPrice(originalAmount - amount, customSettings) : null
  };
};

// تحويل المبلغ من عملة معينة إلى الجنيه المصري
export function convertToEGP(amount: number, fromCurrency: string): number {
  if (fromCurrency === 'EGP') {
    return amount;
  }
  
  const rate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
  if (!rate) {
    console.warn(`سعر صرف غير متوفر للعملة: ${fromCurrency}`);
    return amount; // في حالة عدم وجود سعر صرف، استخدم نفس المبلغ
  }
  
  return Math.round((amount * rate) * 100) / 100; // تقريب لرقمين عشريين
}

// تحويل المبلغ من الجنيه المصري إلى عملة أخرى
export function convertFromEGP(amount: number, toCurrency: string): number {
  if (toCurrency === 'EGP') {
    return amount;
  }
  
  const rate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];
  if (!rate) {
    console.warn(`سعر صرف غير متوفر للعملة: ${toCurrency}`);
    return amount;
  }
  
  return Math.round((amount / rate) * 100) / 100;
}

// الحصول على المبلغ المناسب للكاشير (دائماً بالجنيه المصري)
export async function getAmountForKashier(amount: number): Promise<{
  originalAmount: number;
  originalCurrency: string;
  kashierAmount: number;
  kashierCurrency: string;
  exchangeRate?: number;
  isLiveRate: boolean;
}> {
  const settings = await getCurrencySettings();
  
  // إذا كانت العملة الحالية هي الجنيه المصري، لا نحتاج تحويل
  if (settings.defaultCurrency === 'EGP') {
    return {
      originalAmount: amount,
      originalCurrency: 'EGP',
      kashierAmount: amount,
      kashierCurrency: 'EGP',
      isLiveRate: false
    };
  }
  
  // جلب أسعار الصرف الحية
  const liveRates = await getLiveExchangeRates();
  const exchangeRate = liveRates[settings.defaultCurrency];
  
  if (!exchangeRate) {
    console.warn(`سعر صرف غير متوفر للعملة: ${settings.defaultCurrency}`);
    return {
      originalAmount: amount,
      originalCurrency: settings.defaultCurrency,
      kashierAmount: amount,
      kashierCurrency: 'EGP',
      isLiveRate: false
    };
  }
  
  // تحويل من العملة الحالية إلى الجنيه المصري
  const kashierAmount = Math.round((amount * exchangeRate) * 100) / 100;
  
  return {
    originalAmount: amount,
    originalCurrency: settings.defaultCurrency,
    kashierAmount: kashierAmount,
    kashierCurrency: 'EGP',
    exchangeRate: exchangeRate,
    isLiveRate: liveRates !== EXCHANGE_RATES // true إذا كانت من API
  };
}

// دالة لجلب أسعار الصرف من API خارجي
export async function fetchExchangeRates(): Promise<Record<string, number> | null> {
  try {
    // استخدام exchangerate-api.com API (مجاني)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EGP');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // تحويل الأسعار للصيغة المطلوبة (كم جنيه = 1 وحدة من العملة الأخرى)
    const rates: Record<string, number> = {
      EGP: 1, // الجنيه المصري
    };
    
    // تحويل من EGP إلى العملات الأخرى إلى العكس
    Object.keys(EXCHANGE_RATES).forEach(currency => {
      if (currency !== 'EGP' && data.rates[currency]) {
        // إذا كان 1 EGP = 0.02 USD، فإن 1 USD = 50 EGP
        rates[currency] = 1 / data.rates[currency];
      }
    });
    
    console.log('✅ تم جلب أسعار الصرف من API بنجاح');
    return rates;
    
  } catch (error) {
    console.error('❌ فشل في جلب أسعار الصرف من API:', error);
    
    // في حالة فشل API، استخدم الأسعار الاحتياطية
    console.log('🔄 استخدام أسعار الصرف الاحتياطية');
    return null;
  }
}

// متغير لتخزين أسعار الصرف المحدثة
let liveExchangeRates: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // ساعة واحدة

// دالة للحصول على أسعار الصرف (مع التخزين المؤقت)
export async function getLiveExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  // إذا كانت البيانات محدثة (أقل من ساعة), استخدمها
  if (liveExchangeRates && (now - lastFetchTime) < CACHE_DURATION) {
    return liveExchangeRates;
  }
  
  // محاولة جلب أسعار جديدة
  const freshRates = await fetchExchangeRates();
  
  if (freshRates) {
    liveExchangeRates = freshRates;
    lastFetchTime = now;
    return freshRates;
  }
  
  // في حالة الفشل، استخدم الأسعار الثابتة كاحتياط
  return EXCHANGE_RATES;
}

// دالة لتحديث أسعار الصرف يدوياً
export async function updateExchangeRates(): Promise<boolean> {
  try {
    const rates = await fetchExchangeRates();
    if (rates) {
      liveExchangeRates = rates;
      lastFetchTime = Date.now();
      console.log('✅ تم تحديث أسعار الصرف بنجاح');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ فشل في تحديث أسعار الصرف:', error);
    return false;
  }
} 