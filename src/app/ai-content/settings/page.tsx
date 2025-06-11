'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  Brain, 
  Zap, 
  CheckCircle, 
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function AISettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [apiStatuses, setApiStatuses] = useState({
    openai: false,
    gemini: false
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkAPIStatuses();
    }
  }, [session]);

  const checkAPIStatuses = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/ai/status');
      if (response.ok) {
        const data = await response.json();
        setApiStatuses(data);
      }
    } catch (error) {
      console.error('Error checking API statuses:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            إعدادات الذكاء الاصطناعي
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          إدارة نماذج الذكاء الاصطناعي والمفاتيح
        </p>
      </div>

      <div className="space-y-6">
        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              حالة نماذج الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={checkAPIStatuses}
                disabled={isChecking}
                variant="outline"
              >
                {isChecking ? 'جاري الفحص...' : 'فحص الحالة'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gemini Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Google Gemini</span>
                  </div>
                  {apiStatuses.gemini ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      متاح
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      <XCircle className="h-3 w-3 mr-1" />
                      غير متاح
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  نموذج Google المتقدم للذكاء الاصطناعي
                </p>
                {!apiStatuses.gemini && (
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      يرجى إضافة GEMINI_API_KEY في متغيرات البيئة
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* OpenAI Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="font-medium">OpenAI GPT-4</span>
                  </div>
                  {apiStatuses.openai ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      متاح
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      <XCircle className="h-3 w-3 mr-1" />
                      غير متاح
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  نموذج OpenAI المتطور
                </p>
                {!apiStatuses.openai && (
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      يرجى إضافة OPENAI_API_KEY في متغيرات البيئة
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              إرشادات الإعداد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h4>للحصول على مفتاح Google Gemini API:</h4>
              <ol className="text-sm space-y-1">
                <li>اذهب إلى <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a></li>
                <li>قم بإنشاء مفتاح API جديد</li>
                <li>أضف المفتاح في ملف .env.local كـ GEMINI_API_KEY</li>
              </ol>

              <h4 className="mt-4">للحصول على مفتاح OpenAI API:</h4>
              <ol className="text-sm space-y-1">
                <li>اذهب إلى <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary hover:underline">OpenAI Platform</a></li>
                <li>قم بإنشاء مفتاح API جديد</li>
                <li>أضف المفتاح في ملف .env.local كـ OPENAI_API_KEY</li>
              </ol>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>ملاحظة:</strong> ستحتاج لإعادة تشغيل الخادم بعد إضافة المفاتيح
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>الإعدادات الحالية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>النموذج الافتراضي:</span>
                <Badge variant="outline">Google Gemini</Badge>
              </div>
              <div className="flex justify-between">
                <span>اللغة الافتراضية:</span>
                <Badge variant="outline">العربية</Badge>
              </div>
              <div className="flex justify-between">
                <span>الحد الأقصى للكلمات:</span>
                <Badge variant="outline">2000 كلمة</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 