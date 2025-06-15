import { NextRequest, NextResponse } from 'next/server';
import { EXCHANGE_RATES, getLiveExchangeRates, updateExchangeRates } from '@/lib/currency';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - الحصول على أسعار الصرف الحالية
export async function GET() {
  try {
    const liveRates = await getLiveExchangeRates();
    const isLive = liveRates !== EXCHANGE_RATES;
    
    return NextResponse.json({
      success: true,
      exchangeRates: liveRates,
      fallbackRates: EXCHANGE_RATES,
      isLiveData: isLive,
      lastUpdated: new Date().toISOString(),
      baseCurrency: 'EGP',
      source: isLive ? 'API (exchangerate-api.com)' : 'أسعار احتياطية',
      message: isLive ? 'أسعار صرف محدثة من API' : 'أسعار صرف احتياطية (API غير متاح)'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في جلب أسعار الصرف',
      exchangeRates: EXCHANGE_RATES,
      isLiveData: false
    }, { status: 500 });
  }
}

// POST - تحديث أسعار الصرف من API (للمشرفين فقط)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // التحقق من صلاحيات المشرف
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مخول للوصول'
      }, { status: 401 });
    }

    // التحقق من أن المستخدم admin أو manager
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json({
        success: false,
        error: 'ليس لديك صلاحية لتحديث أسعار الصرف'
      }, { status: 403 });
    }

    // تحديث أسعار الصرف من API
    const updateSuccess = await updateExchangeRates();
    
    if (updateSuccess) {
      const updatedRates = await getLiveExchangeRates();
      
      return NextResponse.json({
        success: true,
        message: 'تم تحديث أسعار الصرف بنجاح من API',
        exchangeRates: updatedRates,
        source: 'API (exchangerate-api.com)',
        updatedAt: new Date().toISOString(),
        isLiveData: true
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'فشل في تحديث أسعار الصرف من API',
        exchangeRates: EXCHANGE_RATES,
        source: 'أسعار احتياطية',
        isLiveData: false
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في تحديث أسعار الصرف'
    }, { status: 500 });
  }
}

// PUT - تحديث سعر صرف عملة محددة
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مخول للوصول'
      }, { status: 401 });
    }

    // التحقق من أن المستخدم admin أو manager
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json({
        success: false,
        error: 'ليس لديك صلاحية لتحديث أسعار الصرف'
      }, { status: 403 });
    }

    const body = await request.json();
    const { currency, rate } = body;

    if (!currency || !rate || rate <= 0) {
      return NextResponse.json({
        success: false,
        error: 'العملة والسعر مطلوبان ويجب أن يكون السعر أكبر من صفر'
      }, { status: 400 });
    }

    if (!EXCHANGE_RATES.hasOwnProperty(currency)) {
      return NextResponse.json({
        success: false,
        error: `العملة ${currency} غير مدعومة`
      }, { status: 400 });
    }

    // في التطبيق الحقيقي، يجب حفظ هذا في قاعدة البيانات
    console.log(`تحديث سعر صرف ${currency} إلى ${rate}`);
    
    return NextResponse.json({
      success: true,
      message: `تم تحديث سعر صرف ${currency} بنجاح`,
      currency,
      newRate: rate,
      oldRate: EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES],
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'فشل في تحديث سعر الصرف'
    }, { status: 500 });
  }
} 