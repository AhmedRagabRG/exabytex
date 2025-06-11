'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CoinsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // إعادة توجيه تلقائي بعد 3 ثوان
    const timer = setTimeout(() => {
      router.push('/dashboard?tab=coins');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              تم نقل صفحة الكوينز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              أصبحت إدارة الكوينز متاحة الآن في لوحة التحكم للحصول على تجربة أفضل وأكثر تكاملاً.
            </p>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 text-sm">
              🚀 الآن يمكنك:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>اختيار أي عدد من الكوينز</li>
                <li>إضافة الكوينز للسلة</li>
                <li>مراجعة المشتريات بسهولة</li>
                <li>متابعة رصيدك وتاريخ المعاملات</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard?tab=coins">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Coins className="h-4 w-4 mr-2" />
                  انتقال للوحة التحكم
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  الملف الشخصي
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-400">
              سيتم التوجيه تلقائياً خلال 3 ثوان...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 