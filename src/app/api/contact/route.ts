import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// إعداد nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

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

    // طباعة الرسالة في وحدة التحكم للمراجعة
    console.log('📧 رسالة اتصال جديدة:')
    console.log('الاسم:', name)
    console.log('البريد:', email)
    console.log('الهاتف:', phone || 'غير محدد')
    console.log('الخدمة:', getServiceName(service))
    console.log('الرسالة:', message)
    console.log('التوقيت:', new Date().toLocaleString('ar-EG'))
    console.log('-------------------')

    // إرسال البريد الإلكتروني إذا كان SMTP مُعداً
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter()
        
        // البريد المُرسل للإدارة
        const adminMailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'info@exabytex.com',
          subject: `رسالة جديدة من ${name} - ${getServiceName(service)}`,
          html: `
            <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Exa Bytex</h1>
                <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">رسالة تواصل جديدة</h2>
              </div>
              
              <div style="padding: 30px; background: white; margin: 20px;">
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #1976d2; font-size: 18px; margin: 0 0 10px 0;">معلومات المرسل</h3>
                  <p style="margin: 5px 0; color: #333;"><strong>الاسم:</strong> ${name}</p>
                  <p style="margin: 5px 0; color: #333;"><strong>البريد الإلكتروني:</strong> ${email}</p>
                  <p style="margin: 5px 0; color: #333;"><strong>رقم الهاتف:</strong> ${phone || 'غير محدد'}</p>
                  <p style="margin: 5px 0; color: #333;"><strong>نوع الخدمة:</strong> ${getServiceName(service)}</p>
                  <p style="margin: 5px 0; color: #333;"><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-EG')}</p>
                </div>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                  <h3 style="color: #424242; font-size: 18px; margin: 0 0 15px 0;">نص الرسالة</h3>
                  <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; text-align: center;">
                  <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                    💡 تذكير: يُفضل الرد على العميل خلال ساعة واحدة لضمان أفضل خدمة
                  </p>
                </div>
              </div>
              
              <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2024 Exa Bytex. جميع الحقوق محفوظة.</p>
                <p style="margin: 5px 0 0 0;">نظام إدارة الرسائل التلقائي</p>
              </div>
            </div>
          `
        }

        // البريد المُرسل للعميل (تأكيد الاستلام)
        const clientMailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'تأكيد استلام رسالتك - Exa Bytex',
          html: `
            <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Exa Bytex</h1>
                <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">شكراً لتواصلك معنا</h2>
              </div>
              
              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 18px; color: #333; margin-bottom: 20px;">مرحباً ${name}،</p>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="font-size: 16px; color: #1976d2; margin: 0; text-align: center; font-weight: bold;">
                    ✅ تم استلام رسالتك بنجاح!
                  </p>
                </div>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  نقدر تواصلك معنا وثقتك في خدماتنا. تم استلام رسالتك حول <strong>${getServiceName(service)}</strong> وسيقوم فريقنا المختص بمراجعتها والرد عليك في أقرب وقت ممكن.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0; margin: 20px 0;">
                  <h3 style="color: #424242; font-size: 16px; margin: 0 0 10px 0;">ملخص رسالتك:</h3>
                  <p style="color: #666; margin: 5px 0;"><strong>الخدمة المطلوبة:</strong> ${getServiceName(service)}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-EG')}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2e7d32; font-size: 16px; margin: 0 0 10px 0;">ماذا بعد الآن؟</h3>
                  <ul style="color: #2e7d32; margin: 0; padding-right: 20px;">
                    <li>سنراجع رسالتك خلال ساعة واحدة</li>
                    <li>سيتواصل معك أحد خبرائنا لمناقشة التفاصيل</li>
                    <li>سنقدم لك عرضاً مخصصاً يناسب احتياجاتك</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #666; margin-bottom: 15px;">تحتاج للتواصل الفوري؟</p>
                  <p style="color: #333;">
                    📞 <strong>واتساب:</strong> 201555831761+<br/>
                    📧 <strong>البريد الإلكتروني:</strong> info@exabytex.com
                  </p>
                </div>
              </div>
              
              <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2024 Exa Bytex. جميع الحقوق محفوظة.</p>
                <p style="margin: 5px 0 0 0;">شكراً لثقتك في خدماتنا</p>
              </div>
            </div>
          `
        }

        // إرسال البريدين
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(clientMailOptions)
        ])

        console.log('✅ تم إرسال رسائل البريد الإلكتروني بنجاح')
        console.log('- رسالة للإدارة:', adminMailOptions.to)
        console.log('- رسالة تأكيد للعميل:', email)

      } catch (emailError) {
        console.error('❌ خطأ في إرسال البريد الإلكتروني:', emailError)
        // لا نوقف العملية - نستمر لحفظ الرسالة على الأقل
      }
    } else {
      console.log('⚠️ لم يتم تكوين SMTP - لن يتم إرسال رسائل البريد الإلكتروني')
      console.log('يمكنك تكوين SMTP بإضافة المتغيرات التالية في ملف .env:')
      console.log('SMTP_HOST=smtp.gmail.com')
      console.log('SMTP_PORT=587')
      console.log('SMTP_USER=your-email@gmail.com')
      console.log('SMTP_PASS=your-app-password')
      console.log('CONTACT_EMAIL=info@exabytex.com')
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت ممكن.'
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
  // إذا كانت الخدمة موجودة كاسم باللغة العربية، استخدمها مباشرة
  if (service && service.length > 0 && service !== 'consultation') {
    return service
  }
  
  // للخدمات القديمة المرمزة بالإنجليزية
  const serviceNames: { [key: string]: string } = {
    'automation': 'الأتمتة والتكامل',
    'chatbot': 'روبوتات المحادثة الذكية', 
    'marketing': 'التسويق الرقمي الذكي',
    'consultation': 'استشارة عامة'
  }
  
  return serviceNames[service] || service || 'غير محدد'
} 