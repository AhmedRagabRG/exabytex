import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, message } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والرسالة مطلوبة' },
        { status: 400 }
      )
    }

    // للتطوير فقط - ستحتاج لإعداد SMTP حقيقي في البيئة الإنتاجية
    console.log('📧 رسالة اتصال جديدة:')
    console.log('الاسم:', name)
    console.log('البريد:', email)
    console.log('الهاتف:', phone || 'غير محدد')
    console.log('الخدمة:', getServiceName(service))
    console.log('الرسالة:', message)
    console.log('التوقيت:', new Date().toLocaleString('ar-EG'))
    console.log('-------------------')

    // محاكاة إرسال ناجح
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
    })

  } catch (error) {
    console.error('خطأ في إرسال رسالة الاتصال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.' },
      { status: 500 }
    )
  }
}

// دالة مساعدة لتحويل نوع الخدمة إلى اسم عربي
function getServiceName(service: string): string {
  const serviceNames: { [key: string]: string } = {
    'automation': 'الأتمتة والتكامل',
    'chatbot': 'روبوتات المحادثة', 
    'marketing': 'التسويق الرقمي',
    'consultation': 'استشارة عامة'
  }
  
  return serviceNames[service] || service || 'غير محدد'
} 