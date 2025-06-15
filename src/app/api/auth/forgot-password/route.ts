import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
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
    const { email } = await request.json()

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صحيحة' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // حتى لو لم يوجد المستخدم، نرسل رسالة نجاح لأسباب أمنية
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني موجود في نظامنا، ستتلقى رسالة استعادة كلمة المرور'
      })
    }

    // إنشاء token للاستعادة
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // ساعة واحدة

    // حفظ token في قاعدة البيانات
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // إعداد رابط الاستعادة
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL
      }
      if (process.env.NODE_ENV === 'production') {
        return 'https://exabytex.com'
      }
      return 'http://localhost:3000'
    }

    const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${resetToken}`

    // إرسال البريد الإلكتروني (اختياري - يحتاج إعداد SMTP)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter()
        
        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'استعادة كلمة المرور - Exa Bytex',
          html: `
            <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
                <h1>Exa Bytex</h1>
                <h2>استعادة كلمة المرور</h2>
              </div>
              
              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">مرحباً،</p>
                
                <p style="font-size: 16px; color: #333;">
                  تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في Exa Bytex.
                </p>
                
                <p style="font-size: 16px; color: #333;">
                  إذا كنت قد طلبت هذا، انقر على الرابط أدناه لإعادة تعيين كلمة المرور:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            font-weight: bold; 
                            display: inline-block;">
                    إعادة تعيين كلمة المرور
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666;">
                  أو انسخ الرابط التالي والصقه في المتصفح:
                </p>
                <p style="font-size: 14px; color: #0066cc; word-break: break-all;">
                  ${resetUrl}
                </p>
                
                <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
                  <p style="margin: 0; font-size: 14px; color: #856404;">
                    <strong>ملاحظة هامة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.
                  </p>
                </div>
              </div>
              
              <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>© 2025 Exa Bytex. جميع الحقوق محفوظة.</p>
                <p>إذا كان لديك أي استفسار، تواصل معنا</p>
              </div>
            </div>
          `
        }

        await transporter.sendMail(mailOptions)
        console.log('✅ تم إرسال رسالة استعادة كلمة المرور بنجاح إلى:', email)
      } catch (emailError) {
        console.error('❌ خطأ في إرسال رسالة استعادة كلمة المرور:', emailError)
        // لا نوقف العملية إذا فشل إرسال البريد
      }
    } else {
      console.log('⚠️ لم يتم تكوين SMTP - لن يتم إرسال رسائل البريد الإلكتروني')
      console.log('يمكنك تكوين SMTP بإضافة المتغيرات التالية في ملف .env:')
      console.log('SMTP_HOST=smtp.gmail.com')
      console.log('SMTP_PORT=587')
      console.log('SMTP_USER=your-email@gmail.com')
      console.log('SMTP_PASS=your-app-password')
      
      // في بيئة التطوير فقط، نطبع الرابط
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 رابط إعادة تعيين كلمة المرور (للتطوير فقط):', resetUrl)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      // في بيئة التطوير، يمكن إرجاع الرابط للاختبار
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم. حاول مرة أخرى.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forgot Password API',
    status: 'Active',
    endpoints: {
      'POST /api/auth/forgot-password': 'Send password reset email'
    },
    requiredFields: ['email'],
    features: [
      '📧 Password reset via email',
      '🔒 Secure token generation',
      '⏰ Token expiry (1 hour)',
      '🛡️ Security best practices'
    ]
  })
} 