'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Coins, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Mail, 
  Megaphone,
  Video,
  RotateCcw,
  Languages,
  Sparkles,
  Copy,
  Download,
  Clock,
  TrendingUp,
  Zap,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

// أنواع المحتوى وأيقوناتها
const CONTENT_TYPES = {
  ARTICLE: { icon: FileText, label: 'مقال', cost: 50, description: 'مقال شامل ومفصل' },
  BLOG_POST: { icon: PenTool, label: 'مقال مدونة', cost: 40, description: 'منشور مدونة جذاب' },
  SOCIAL_POST: { icon: MessageSquare, label: 'منشور اجتماعي', cost: 20, description: 'منشور لوسائل التواصل' },
  PRODUCT_DESC: { icon: Sparkles, label: 'وصف منتج', cost: 25, description: 'وصف احترافي للمنتج' },
  EMAIL: { icon: Mail, label: 'بريد إلكتروني', cost: 30, description: 'رسالة بريد إلكتروني' },
  AD_COPY: { icon: Megaphone, label: 'نص إعلاني', cost: 35, description: 'محتوى إعلاني مقنع' },
  SCRIPT: { icon: Video, label: 'سكريپت', cost: 45, description: 'سكريپت فيديو أو صوتي' },
  SUMMARY: { icon: TrendingUp, label: 'ملخص', cost: 15, description: 'تلخيص نص موجود' },
  TRANSLATION: { icon: Languages, label: 'ترجمة', cost: 20, description: 'ترجمة نص' },
  REWRITE: { icon: RotateCcw, label: 'إعادة صياغة', cost: 25, description: 'إعادة كتابة النص' },
};

// نماذج AI المتاحة
const AI_MODELS = {
  gemini: { 
    label: 'Google Gemini', 
    icon: Brain, 
    description: 'نموذج جوجل المتقدم - مجاني',
    color: 'text-blue-500',
    isFree: true
  },
  openai: { 
    label: 'OpenAI GPT-4', 
    icon: Zap, 
    description: 'نموذج OpenAI المتطور',
    color: 'text-green-500',
    isFree: false
  }
};

export default function AIContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedType, setSelectedType] = useState<string>('ARTICLE');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('ar');
  const [aiModel, setAiModel] = useState('gemini');
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);

  // جلب رصيد المستخدم
  useEffect(() => {
    if (session?.user) {
      fetchUserBalance();
    }
  }, [session]);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/coins/balance');
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const cost = CONTENT_TYPES[selectedType as keyof typeof CONTENT_TYPES].cost;
    if (userBalance < cost) {
      toast.error('رصيد الكوينز غير كافي');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          title,
          prompt,
          language,
          aiModel,
          metadata
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content);
        setUserBalance(data.newBalance);
        toast.success('تم توليد المحتوى بنجاح!');
      } else {
        toast.error(data.error || 'حدث خطأ في توليد المحتوى');
      }
    } catch (error) {
      toast.error('حدث خطأ في الخادم');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('تم نسخ المحتوى');
    } catch (error) {
      toast.error('فشل في نسخ المحتوى');
    }
  };

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (!session) {
    return null;
  }

  const selectedTypeInfo = CONTENT_TYPES[selectedType as keyof typeof CONTENT_TYPES];
  const selectedModelInfo = AI_MODELS[aiModel as keyof typeof AI_MODELS];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            مولد المحتوى بالذكاء الاصطناعي
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          أنشئ محتوى احترافي ومبدع باستخدام أحدث تقنيات الذكاء الاصطناعي
        </p>
        
        {/* Balance Display */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Coins className="h-4 w-4 mr-2" />
            رصيدك: {userBalance} كوين
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Content Types */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                أنواع المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(CONTENT_TYPES).map(([type, info]) => {
                const Icon = info.icon;
                return (
                  <div
                    key={type}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{info.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {info.cost} كوين
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {info.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Model Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                نموذج الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(AI_MODELS).map(([model, info]) => {
                const Icon = info.icon;
                return (
                  <div
                    key={model}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      aiModel === model
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setAiModel(model)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${info.color}`} />
                        <span className="font-medium">{info.label}</span>
                      </div>
                      {info.isFree && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          مجاني
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {info.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Panel - Content Generation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedTypeInfo.icon className="h-5 w-5" />
                {selectedTypeInfo.label}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedTypeInfo.description} • تكلفة: {selectedTypeInfo.cost} كوين • النموذج: {selectedModelInfo.label}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Fields */}
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المحتوى *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان واضح للمحتوى"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">الوصف أو الطلب *</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اشرح ما تريد إنشاؤه بالتفصيل..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields Based on Content Type */}
                {selectedType === 'ARTICLE' || selectedType === 'BLOG_POST' ? (
                  <div className="space-y-2">
                    <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                    <Input
                      id="keywords"
                      value={metadata.keywords || ''}
                      onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                      placeholder="كلمة1, كلمة2, كلمة3"
                    />
                  </div>
                ) : selectedType === 'SOCIAL_POST' ? (
                  <div className="space-y-2">
                    <Label htmlFor="platform">المنصة</Label>
                    <Select value={metadata.platform || ''} onValueChange={(value) => setMetadata({...metadata, platform: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنصة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">تويتر</SelectItem>
                        <SelectItem value="facebook">فيس بوك</SelectItem>
                        <SelectItem value="instagram">إنستغرام</SelectItem>
                        <SelectItem value="linkedin">لينكد إن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : selectedType === 'EMAIL' ? (
                  <div className="space-y-2">
                    <Label htmlFor="tone">نبرة الرسالة</Label>
                    <Select value={metadata.tone || ''} onValueChange={(value) => setMetadata({...metadata, tone: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">رسمية</SelectItem>
                        <SelectItem value="friendly">ودية</SelectItem>
                        <SelectItem value="professional">مهنية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>

              {/* Balance Warning */}
              {userBalance < selectedTypeInfo.cost && (
                <Alert>
                  <AlertDescription>
                    رصيد الكوينز غير كافي. تحتاج إلى {selectedTypeInfo.cost} كوين ولديك {userBalance} كوين فقط.
                  </AlertDescription>
                </Alert>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || userBalance < selectedTypeInfo.cost}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري التوليد بواسطة {selectedModelInfo.label}...
                  </>
                ) : (
                  <>
                    <selectedModelInfo.icon className="h-4 w-4 mr-2" />
                    توليد المحتوى ({selectedTypeInfo.cost} كوين)
                  </>
                )}
              </Button>

              {/* Generated Content Display */}
              {generatedContent && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">المحتوى المُولد</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent.content)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        نسخ
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-bold text-lg mb-2">{generatedContent.title}</h4>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedContent.content}
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
                      <span>عدد الكلمات: {generatedContent.wordCount} • التكلفة: {generatedContent.coinsCost} كوين</span>
                      <Badge variant="outline" className="text-xs">
                        {generatedContent.model}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 