import { NextRequest, NextResponse } from 'next/server';
import { getAmountForKashier } from '@/lib/currency';

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'مطلوب مبلغ صالح' },
        { status: 400 }
      );
    }

    const conversion = await getAmountForKashier(amount);
    return NextResponse.json(conversion);

  } catch (error) {
    console.error('خطأ في تحويل العملة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحويل العملة' },
      { status: 500 }
    );
  }
} 