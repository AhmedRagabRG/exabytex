'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, RefreshCw, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefreshSessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white">تحديث الجلسة</CardTitle>
          <CardDescription className="text-gray-300">
            إدارة جلستك الحالية والأدوار
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* معلومات الجلسة الحالية */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">الجلسة الحالية:</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <strong>الحالة:</strong> {status === 'authenticated' ? 'مسجل دخول' : 'غير مسجل'}
              </p>
              {session && (
                <>
                  <p className="text-gray-300">
                    <strong>البريد:</strong> {session.user?.email}
                  </p>
                  <p className="text-gray-300">
                    <strong>الاسم:</strong> {session.user?.name || 'غير محدد'}
                  </p>
                  <p className="text-gray-300">
                    <strong>الدور:</strong> {(session.user as any)?.role || 'غير محدد'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* الأزرار */}
          <div className="space-y-3">
            <Button 
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              تسجيل الخروج وإعادة الدخول
            </Button>

            {status === 'authenticated' && (
              <>
                <Button 
                  onClick={handleGoToProfile}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  الذهاب للملف الشخصي
                </Button>

                <Button 
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  الذهاب للوحة التحكم
                </Button>
              </>
            )}

            <Button 
              onClick={() => window.location.reload()}
              variant="ghost"
              className="w-full text-gray-300 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة تحميل الصفحة
            </Button>
          </div>

          {/* تعليمات */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">تعليمات:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• إذا لم تظهر أدوار MANAGER، اضغط تسجيل الخروج</li>
              <li>• سجل دخولك مرة أخرى باستخدام نفس البيانات</li>
              <li>• الدور سيظهر بشكل صحيح بعد إعادة تسجيل الدخول</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 