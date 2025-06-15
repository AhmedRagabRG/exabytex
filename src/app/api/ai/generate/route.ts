import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Session } from 'next-auth';

// تهيئة محركات AI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// تكلفة الكوينز لكل نوع محتوى
const COIN_COSTS = {
  ARTICLE: 50,
  BLOG_POST: 40,
  SOCIAL_POST: 20,
  PRODUCT_DESC: 25,
  EMAIL: 30,
  AD_COPY: 35,
  SCRIPT: 45,
  SUMMARY: 15,
  TRANSLATION: 20,
  REWRITE: 25,
};

// قوالب الـ prompts لكل نوع محتوى
const PROMPTS = {
  ARTICLE: (topic: string, keywords: string, language: string) => 
    `اكتب مقالاً شاملاً ومفصلاً حول "${topic}" باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    استخدم الكلمات المفتاحية التالية: ${keywords}
    اجعل المقال احترافياً ومفيداً ومقسماً لفقرات واضحة.`,
    
  BLOG_POST: (topic: string, keywords: string, language: string) => 
    `اكتب منشور مدونة جذاب وقابل للقراءة حول "${topic}" باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    استخدم الكلمات المفتاحية: ${keywords}
    اجعله شخصياً وودوداً مع عنوان جذاب.`,
    
  SOCIAL_POST: (topic: string, platform: string, language: string) => 
    `اكتب منشوراً لوسائل التواصل الاجتماعي (${platform}) حول "${topic}" باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    اجعله قصيراً وجذاباً ومناسباً للنشر.`,
    
  PRODUCT_DESC: (product: string, features: string, language: string) => 
    `اكتب وصفاً احترافياً ومقنعاً للمنتج التالي: "${product}" باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    المميزات الرئيسية: ${features}
    اجعل الوصف يركز على الفوائد والمميزات.`,
    
  EMAIL: (purpose: string, tone: string, language: string) => 
    `اكتب بريداً إلكترونياً ${purpose} بنبرة ${tone} باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    اجعله مهذباً ومباشراً وواضحاً.`,
    
  AD_COPY: (product: string, audience: string, language: string) => 
    `اكتب نصاً إعلانياً مقنعاً للمنتج "${product}" للجمهور المستهدف: ${audience} باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}.
    اجعله جذاباً ومحفزاً للشراء.`,
    
  SUMMARY: (text: string, language: string) => 
    `لخص النص التالي باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'} في فقرات قصيرة ومركزة:
    
    ${text}`,
    
  TRANSLATION: (text: string, fromLang: string, toLang: string) => 
    `ترجم النص التالي من ${fromLang} إلى ${toLang} مع الحفاظ على المعنى والسياق:
    
    ${text}`,
    
  REWRITE: (text: string, style: string, language: string) => 
    `أعد صياغة النص التالي بأسلوب ${style} باللغة ${language === 'ar' ? 'العربية' : 'الإنجليزية'}:
    
    ${text}`,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

      const body = await request.json();
  const { type, prompt, title, language = 'ar', metadata = {}, aiModel = 'gemini' } = body;

    // التحقق من صحة البيانات
    if (!type || !prompt || !title) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    if (!COIN_COSTS[type as keyof typeof COIN_COSTS]) {
      return NextResponse.json({ error: 'نوع المحتوى غير صحيح' }, { status: 400 });
    }

    const coinsCost = COIN_COSTS[type as keyof typeof COIN_COSTS];

    // التحقق من رصيد الكوينز
    const userCoins = await prisma.userCoins.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCoins || userCoins.balance < coinsCost) {
      return NextResponse.json({ 
        error: 'رصيد الكوينز غير كافي',
        required: coinsCost,
        available: userCoins?.balance || 0
      }, { status: 400 });
    }

    // إنشاء الـ prompt النهائي
    let finalPrompt = prompt;
    
    // استخدام القوالب المحددة مسبقاً إذا أمكن
    if (type === 'ARTICLE' && metadata.keywords) {
      finalPrompt = PROMPTS.ARTICLE(prompt, metadata.keywords, language);
    } else if (type === 'BLOG_POST' && metadata.keywords) {
      finalPrompt = PROMPTS.BLOG_POST(prompt, metadata.keywords, language);
    } else if (type === 'SOCIAL_POST' && metadata.platform) {
      finalPrompt = PROMPTS.SOCIAL_POST(prompt, metadata.platform, language);
    } else if (type === 'PRODUCT_DESC' && metadata.features) {
      finalPrompt = PROMPTS.PRODUCT_DESC(prompt, metadata.features, language);
    } else if (type === 'EMAIL' && metadata.tone) {
      finalPrompt = PROMPTS.EMAIL(prompt, metadata.tone, language);
    } else if (type === 'AD_COPY' && metadata.audience) {
      finalPrompt = PROMPTS.AD_COPY(prompt, metadata.audience, language);
    } else if (type === 'SUMMARY') {
      finalPrompt = PROMPTS.SUMMARY(prompt, language);
    } else if (type === 'TRANSLATION' && metadata.fromLang && metadata.toLang) {
      finalPrompt = PROMPTS.TRANSLATION(prompt, metadata.fromLang, metadata.toLang);
    } else if (type === 'REWRITE' && metadata.style) {
      finalPrompt = PROMPTS.REWRITE(prompt, metadata.style, language);
    }

    // استدعاء AI API حسب النموذج المحدد
    let generatedContent = '';
    let modelUsed = '';

    if (aiModel === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API key غير متوفر' }, { status: 500 });
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `أنت كاتب محتوى محترف ومبدع. مهمتك إنشاء محتوى عالي الجودة باللغة المطلوبة. 
                     كن دقيقاً ومفيداً وإبداعياً في كتابتك.`
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      generatedContent = completion.choices[0]?.message?.content || '';
      modelUsed = 'gpt-4';
    } else {
      // استخدام Gemini كنموذج افتراضي
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key غير متوفر' }, { status: 500 });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `أنت كاتب محتوى محترف ومبدع. مهمتك إنشاء محتوى عالي الجودة باللغة المطلوبة. 
                           كن دقيقاً ومفيداً وإبداعياً في كتابتك.

${finalPrompt}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      generatedContent = response.text();
      modelUsed = 'gemini-1.5-flash';
    }
    
    if (!generatedContent) {
      return NextResponse.json({ error: 'فشل في توليد المحتوى' }, { status: 500 });
    }

    // حساب عدد الكلمات
    const wordCount = generatedContent.split(/\s+/).length;

    // بدء transaction لضمان تطابق العمليات
    const result = await prisma.$transaction(async (tx) => {
      // خصم الكوينز
      const updatedCoins = await tx.userCoins.update({
        where: { userId: session.user.id },
        data: {
          balance: { decrement: coinsCost },
          totalSpent: { increment: coinsCost }
        }
      });

      // إنشاء معاملة الكوينز
      await tx.coinTransaction.create({
        data: {
          userId: session.user.id,
          type: 'SPEND',
          amount: -coinsCost,
          reason: `توليد محتوى - ${type}`,
          description: title,
          balanceBefore: updatedCoins.balance + coinsCost,
          balanceAfter: updatedCoins.balance,
        }
      });

      // حفظ المحتوى المولد
      const aiContent = await tx.aIContent.create({
        data: {
          userId: session.user.id,
          type,
          title,
          prompt,
          content: generatedContent,
          model: modelUsed,
          coinsCost,
          wordCount,
          language,
          metadata: JSON.stringify(metadata)
        }
      });

      // ربط معاملة الكوينز بالمحتوى
      await tx.coinTransaction.updateMany({
        where: {
          userId: session.user.id,
          relatedId: null,
          reason: `توليد محتوى - ${type}`
        },
        data: {
          relatedId: aiContent.id
        }
      });

      return { aiContent, newBalance: updatedCoins.balance };
    });

    return NextResponse.json({
      success: true,
      content: result.aiContent,
      newBalance: result.newBalance,
      message: 'تم توليد المحتوى بنجاح'
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في توليد المحتوى',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 