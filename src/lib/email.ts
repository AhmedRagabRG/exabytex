import nodemailer from 'nodemailer'

// إنشاء transporter مع إعدادات أكثر أماناً
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // إعدادات إضافية لتحسين الاتصال
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // إعدادات TLS
  tls: {
    rejectUnauthorized: false, // لا ترفض الشهادات غير الموثقة
    minVersion: 'TLSv1.2' // استخدام TLS 1.2 كحد أدنى
  }
})

// التحقق من صحة الاتصال
async function verifyConnection() {
  try {
    await transporter.verify()
    console.log('SMTP connection verified successfully')
    return true
  } catch (error) {
    console.error('SMTP connection error:', error)
    return false
  }
}

// إرسال بريد إلكتروني مع معالجة أفضل للأخطاء
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    // التحقق من الاتصال قبل الإرسال
    const isConnected = await verifyConnection()
    if (!isConnected) {
      throw new Error('فشل الاتصال بخادم البريد الإلكتروني')
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    
    // رسائل خطأ أكثر تفصيلاً
    let errorMessage = 'حدث خطأ أثناء إرسال البريد الإلكتروني'
    
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ETIMEDOUT') {
        errorMessage = 'انتهت مهلة الاتصال بخادم البريد الإلكتروني'
      } else if (nodeError.code === 'ECONNREFUSED') {
        errorMessage = 'تم رفض الاتصال بخادم البريد الإلكتروني'
      } else if (nodeError.code === 'EAUTH') {
        errorMessage = 'فشل المصادقة مع خادم البريد الإلكتروني'
      }
    }
    
    throw new Error(errorMessage)
  }
}

// إرسال بريد إلكتروني لاستعادة كلمة المرور
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`
  
  return sendEmail({
    to: email,
    subject: 'استعادة كلمة المرور',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">استعادة كلمة المرور</h2>
        <p>مرحباً،</p>
        <p>لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بك. يمكنك النقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            إعادة تعيين كلمة المرور
          </a>
        </p>
        <p>إذا لم تطلب استعادة كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        <p>ينتهي هذا الرابط خلال 24 ساعة.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          إذا لم تتمكن من النقر على الزر، يمكنك نسخ ولصق الرابط التالي في متصفحك:<br>
          ${resetUrl}
        </p>
      </div>
    `,
  })
}

// إرسال بريد إلكتروني لشراء المنتج
export async function sendProductPurchaseEmail({
  email,
  productName,
  orderId,
  downloadUrl,
  customSubject,
  customContent,
  transactionId
}: {
  email: string
  productName: string
  orderId: string
  downloadUrl: string
  customSubject?: string
  customContent?: string
  transactionId?: string
}) {
  const subject = customSubject || `تم شراء ${productName} بنجاح`;
  const content = customContent || `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">شكراً لشرائك ${productName}</h2>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>رقم الطلب:</strong> ${orderId}</p>
          ${transactionId ? `<p style="margin: 5px 0;"><strong>رقم العملية:</strong> ${transactionId}</p>` : ''}
          <p style="margin: 5px 0;"><strong>المنتج:</strong> ${productName}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p>يمكنك تحميل المنتج من خلال الزر أدناه:</p>
          <a href="${downloadUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            تحميل المنتج
          </a>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
          <p style="color: #666; font-size: 14px;">
            يمكنك أيضاً الوصول إلى منتجاتك في أي وقت من خلال 
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="color: #007bff; text-decoration: none;">
              لوحة التحكم
            </a>
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            إذا لم تتمكن من النقر على الزر، يمكنك نسخ ولصق الرابط التالي في متصفحك:<br>
            ${downloadUrl}
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: content,
  });
} 