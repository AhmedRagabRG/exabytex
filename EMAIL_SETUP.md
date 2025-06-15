# إعداد نظام البريد الإلكتروني للتواصل

## نظرة عامة
تم تطوير نظام تواصل معنا ليرسل رسائل البريد الإلكتروني تلقائياً عند تلقي رسائل من العملاء.

## الميزات المضافة
✅ **إرسال بريد للإدارة** - يحتوي على تفاصيل الرسالة كاملة  
✅ **إرسال بريد تأكيد للعميل** - يؤكد استلام الرسالة  
✅ **تصميم جميل ومتجاوب** - قوالب HTML احترافية  
✅ **دعم اللغة العربية** - النصوص والاتجاه الصحيح  
✅ **معالجة الأخطاء** - النظام يعمل حتى لو فشل إرسال البريد  

## خطوات الإعداد

### 1. إنشاء كلمة مرور تطبيق Gmail

1. **فعّل المصادقة الثنائية**:
   - اذهب إلى [إعدادات الأمان في Google](https://myaccount.google.com/security)
   - فعّل "التحقق بخطوتين"

2. **أنشئ كلمة مرور تطبيق**:
   - اذهب إلى [كلمات مرور التطبيقات](https://myaccount.google.com/apppasswords)
   - اختر "تطبيق آخر" واكتب "AI Agency Contact Form"
   - انسخ كلمة المرور المكونة من 16 حرف

### 2. إعداد متغيرات البيئة

أضف هذه المتغيرات في ملف `.env.local`:

```env
# إعداد البريد الإلكتروني (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
SMTP_FROM="your-email@gmail.com"
CONTACT_EMAIL="info@exabytex.com"

# إعداد الروابط (مهم للإنتاج)
NEXT_PUBLIC_BASE_URL="https://exabytex.com"
NEXTAUTH_URL="https://exabytex.com"
```

**ملاحظات مهمة**:
- `SMTP_USER`: البريد الإلكتروني الخاص بك
- `SMTP_PASS`: كلمة مرور التطبيق (16 حرف من Gmail)
- `SMTP_FROM`: البريد المرسل منه (عادة نفس SMTP_USER)
- `CONTACT_EMAIL`: البريد الذي ستصل إليه رسائل العملاء

### 3. بدائل أخرى لـ Gmail

#### استخدام Outlook/Hotmail:
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

#### استخدام Yahoo:
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

#### استخدام خادم SMTP مخصص:
```env
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="no-reply@yourdomain.com"
SMTP_PASS="your-password"
```

## اختبار النظام

### 1. التشغيل المحلي
```bash
npm run dev
```

### 2. زيارة صفحة التواصل
اذهب إلى: `http://localhost:3000/contact`

### 3. إرسال رسالة تجريبية
- املأ النموذج بالبيانات المطلوبة
- اضغط "أرسل رسالتك الآن"
- تحقق من الرسائل في وحدة التحكم (Console)

## استكشاف الأخطاء

### إذا لم تصل الرسائل:

1. **تحقق من المتغيرات**:
   ```bash
   # في terminal المشروع
   node -e "console.log(process.env.SMTP_USER)"
   ```

2. **تحقق من اللوج**:
   - ابحث عن رسائل في Console
   - إذا رأيت "⚠️ لم يتم تكوين SMTP" فالمتغيرات غير موجودة
   - إذا رأيت "❌ خطأ في إرسال البريد الإلكتروني" فهناك مشكلة في الإعدادات

3. **أخطاء شائعة**:
   - **535 Authentication Failed**: كلمة المرور خاطئة
   - **Connection Timeout**: تحقق من SMTP_HOST و SMTP_PORT
   - **Invalid Login**: تأكد من صحة البريد الإلكتروني

### اختبار بدون SMTP

إذا كنت تريد اختبار النظام بدون إعداد SMTP:
- النظام سيعمل بشكل طبيعي
- ستظهر الرسائل في Console
- العميل سيرى رسالة نجاح
- لن يتم إرسال رسائل فعلية

## الملفات المعدلة

### ✅ تحديثات جديدة (Production Ready):
- `src/app/api/contact/route.ts` - تم تحديث API لإرسال البريد
- `src/app/api/auth/forgot-password/route.ts` - إصلاح نظام إعادة كلمة المرور
- `src/lib/utils.ts` - إضافة دوال مساعدة للروابط
- `src/lib/blog.ts` - إصلاح روابط المدونة
- `src/app/store/[id]/page.tsx` - إصلاح روابط المتجر
- `src/app/admin/reset-tokens/page.tsx` - إصلاح روابط الإدارة
- `EMAIL_SETUP.md` - دليل الإعداد المحدث

### 🔧 التحسينات المضافة:
- **إدارة ذكية للروابط**: النظام يختار الرابط المناسب حسب البيئة
- **عدم طباعة الروابط في الإنتاج**: لحماية الأمان
- **دوال مساعدة مشتركة**: لتوحيد طريقة التعامل مع الروابط
- **دعم متغيرات بيئة متعددة**: NEXT_PUBLIC_BASE_URL و NEXTAUTH_URL

## الدعم

إذا واجهت أي مشكلة:
1. تأكد من صحة جميع المتغيرات
2. جرب بريد إلكتروني مختلف
3. تحقق من إعدادات الحماية في Gmail
4. تأكد من تفعيل "تطبيقات أقل أماناً" إذا لزم الأمر

---

**ملاحظة**: هذا النظام يدعم الإرسال المتوازي لرسالتين (للإدارة والعميل) مما يضمن سرعة في الأداء. 