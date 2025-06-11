import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { getCurrencySettings, updateCurrencySettings, SUPPORTED_CURRENCIES } from '@/lib/currency';

const prisma = new PrismaClient();

// جلب إعدادات العملة الحالية
export async function GET() {
  try {
    const currencySettings = await getCurrencySettings();
    
    return NextResponse.json({
      settings: currencySettings,
      supportedCurrencies: SUPPORTED_CURRENCIES
    });
  } catch (error) {
    console.error('Error fetching currency settings:', error);
    return NextResponse.json(
      { error: 'فشل في جلب إعدادات العملة' },
      { status: 500 }
    );
  }
}

// تحديث إعدادات العملة (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // فحص الصلاحيات: المدير فقط
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل إعدادات العملة' },
        { status: 403 }
      );
    }

    const { defaultCurrency, currencySymbol, currencyPosition, decimalPlaces } = await request.json();

    // التحقق من صحة البيانات
    if (!defaultCurrency || !currencySymbol) {
      return NextResponse.json(
        { error: 'العملة ورمز العملة مطلوبان' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_CURRENCIES[defaultCurrency as keyof typeof SUPPORTED_CURRENCIES]) {
      return NextResponse.json(
        { error: 'العملة المحددة غير مدعومة' },
        { status: 400 }
      );
    }

    if (currencyPosition !== 'before' && currencyPosition !== 'after') {
      return NextResponse.json(
        { error: 'موضع العملة يجب أن يكون "before" أو "after"' },
        { status: 400 }
      );
    }

    if (typeof decimalPlaces !== 'number' || decimalPlaces < 0 || decimalPlaces > 4) {
      return NextResponse.json(
        { error: 'عدد الخانات العشرية يجب أن يكون بين 0 و 4' },
        { status: 400 }
      );
    }

    // تحديث إعدادات العملة
    const success = await updateCurrencySettings({
      defaultCurrency,
      currencySymbol,
      currencyPosition,
      decimalPlaces
    }, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'فشل في تحديث إعدادات العملة' },
        { status: 500 }
      );
    }

    // جلب الإعدادات المحدثة
    const updatedSettings = await getCurrencySettings();

    return NextResponse.json({
      message: 'تم تحديث إعدادات العملة بنجاح',
      settings: updatedSettings
    });

  } catch (error) {
    console.error('Error updating currency settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث إعدادات العملة' },
      { status: 500 }
    );
  }
} 