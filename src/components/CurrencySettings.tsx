'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Settings, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Globe
} from 'lucide-react';
import { SUPPORTED_CURRENCIES, CurrencySettings as CurrencySettingsType } from '@/lib/currency';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface SupportedCurrency {
  name: string;
  symbol: string;
  position: 'before' | 'after';
}

export function CurrencySettings() {
  console.log('🔧 CurrencySettings component تم تحميله');
  
  const { settings: contextSettings, updateSettings: updateContextSettings } = useCurrencyContext();
  const [settings, setSettings] = useState<CurrencySettingsType>(contextSettings);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState<Record<string, SupportedCurrency>>({});
  const [exchangeRatesInfo, setExchangeRatesInfo] = useState<any>(null);

  useEffect(() => {
    setSettings(contextSettings);
    fetchSupportedCurrencies();
    fetchExchangeRatesInfo();
  }, [contextSettings]);

  const fetchSupportedCurrencies = async () => {
    try {
      const response = await fetch('/api/settings/currency');
      if (response.ok) {
        const data = await response.json();
        setSupportedCurrencies(data.supportedCurrencies);
      }
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
      setSupportedCurrencies(SUPPORTED_CURRENCIES);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRatesInfo = async () => {
    try {
      const response = await fetch('/api/currency/exchange-rates');
      if (response.ok) {
        const data = await response.json();
        setExchangeRatesInfo(data);
      }
    } catch (error) {
      console.error('Error fetching exchange rates info:', error);
    }
  };

  const handleUpdateExchangeRates = async () => {
    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/currency/exchange-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setExchangeRatesInfo(data);
        setMessage({ 
          text: data.isLiveData 
            ? 'تم تحديث أسعار الصرف من API بنجاح' 
            : 'API غير متاح، يتم استخدام الأسعار الاحتياطية', 
          type: data.isLiveData ? 'success' : 'error'
        });
        
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ text: data.error || 'فشل في تحديث أسعار الصرف', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      setMessage({ text: 'حدث خطأ في تحديث أسعار الصرف', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = supportedCurrencies[currencyCode];
    if (currency) {
      setSettings(prev => ({
        ...prev,
        defaultCurrency: currencyCode,
        currencySymbol: currency.symbol,
        currencyPosition: currency.position
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/currency', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
        updateContextSettings(data.settings);
        setMessage({ text: 'تم حفظ إعدادات العملة بنجاح', type: 'success' });
        
        // إخفاء الرسالة بعد 3 ثوان
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: data.error || 'فشل في حفظ الإعدادات', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ text: 'حدث خطأ في حفظ الإعدادات', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // معاينة السعر
  const getPreviewPrice = () => {
    const amount = 1299.99;
    const formattedAmount = amount.toLocaleString('ar-SA', {
      minimumFractionDigits: settings.decimalPlaces,
      maximumFractionDigits: settings.decimalPlaces
    });

    if (settings.currencyPosition === 'before') {
      return `${settings.currencySymbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${settings.currencySymbol}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">جاري تحميل إعدادات العملة...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رسالة النجاح/الخطأ */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* إعدادات العملة */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            إعدادات العملة
          </CardTitle>
          <CardDescription className="text-gray-600">
            تحديد العملة الافتراضية للموقع وطريقة عرض الأسعار
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* اختيار العملة */}
          <div>
            <Label htmlFor="currency" className="text-gray-900 mb-3 block">العملة الافتراضية</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(supportedCurrencies).map(([code, currency]) => (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code)}
                  className={`p-3 rounded-lg border transition-all ${
                    settings.defaultCurrency === code
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{code}</div>
                    <div className="text-sm opacity-80">{currency.symbol}</div>
                    <div className="text-xs opacity-60">{currency.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* رمز العملة المخصص */}
          <div>
            <Label htmlFor="currencySymbol" className="text-gray-900 mb-2 block">رمز العملة</Label>
            <Input
              id="currencySymbol"
              value={settings.currencySymbol}
              onChange={(e) => setSettings(prev => ({ ...prev, currencySymbol: e.target.value }))}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
              placeholder="مثال: ر.س"
            />
          </div>

          {/* موضع العملة */}
          <div>
            <Label className="text-gray-900 mb-3 block">موضع رمز العملة</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setSettings(prev => ({ ...prev, currencyPosition: 'before' }))}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  settings.currencyPosition === 'before'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                قبل المبلغ ({settings.currencySymbol} 100)
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, currencyPosition: 'after' }))}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  settings.currencyPosition === 'after'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                بعد المبلغ (100 {settings.currencySymbol})
              </button>
            </div>
          </div>

          {/* عدد الخانات العشرية */}
          <div>
            <Label htmlFor="decimalPlaces" className="text-gray-900 mb-2 block">عدد الخانات العشرية</Label>
            <select
              id="decimalPlaces"
              value={settings.decimalPlaces}
              onChange={(e) => setSettings(prev => ({ ...prev, decimalPlaces: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>0 (بدون خانات عشرية)</option>
              <option value={1}>1 خانة عشرية</option>
              <option value={2}>2 خانة عشرية</option>
              <option value={3}>3 خانات عشرية</option>
              <option value={4}>4 خانات عشرية</option>
            </select>
          </div>

          {/* معاينة */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 mb-2 block">معاينة الأسعار</Label>
            <div className="text-2xl font-bold text-blue-600">
              {getPreviewPrice()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              هكذا ستظهر الأسعار في المتجر
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="text-blue-800 font-medium mb-2">ملاحظة مهمة:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• سيتم تطبيق هذه الإعدادات على جميع الأسعار في الموقع</li>
              <li>• تأكد من اختيار العملة المناسبة لجمهورك المستهدف</li>
              <li>• يمكنك تغيير الإعدادات في أي وقت</li>
            </ul>
          </div>

          {/* زر الحفظ */}
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </CardContent>
      </Card>

      {/* إدارة أسعار الصرف */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            أسعار الصرف
          </CardTitle>
          <CardDescription className="text-gray-600">
            تحديث أسعار الصرف من API خارجي للحصول على أحدث الأسعار
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* معلومات أسعار الصرف */}
          {exchangeRatesInfo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">مصدر البيانات:</span>
                <Badge variant={exchangeRatesInfo.isLiveData ? "default" : "secondary"}>
                  {exchangeRatesInfo.source}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">آخر تحديث:</span>
                <span className="text-gray-600 text-sm">
                  {new Date(exchangeRatesInfo.lastUpdated).toLocaleString('ar-SA')}
                </span>
              </div>

              {exchangeRatesInfo.isLiveData ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">أسعار الصرف محدثة من API</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">يتم استخدام أسعار احتياطية (API غير متاح)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* زر تحديث أسعار الصرف */}
          <Button 
            onClick={handleUpdateExchangeRates}
            disabled={updating}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 ml-2" />
            )}
            {updating ? 'جاري التحديث...' : 'تحديث أسعار الصرف'}
          </Button>

          {/* معلومات إضافية عن أسعار الصرف */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="text-blue-800 font-medium mb-2">حول أسعار الصرف:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• يتم جلب الأسعار من exchangerate-api.com</li>
              <li>• التحديث التلقائي كل ساعة</li>
              <li>• في حالة عدم توفر API، يتم استخدام أسعار احتياطية</li>
              <li>• جميع الأسعار بالنسبة للجنيه المصري (للكاشير)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 