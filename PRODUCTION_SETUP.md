# إعداد المشروع للإنتاج (Production Setup)

## 🚀 التحديثات الجديدة

تم تحديث المشروع ليكون جاهزاً للإنتاج مع الميزات التالية:

### ✅ الميزات المحدثة:
- **إدارة ذكية للروابط**: النظام يختار الرابط المناسب تلقائياً
- **حماية أمنية محسّنة**: عدم طباعة الروابط الحساسة في الإنتاج
- **نظام بريد محسّن**: قوالب جميلة ومتجاوبة
- **دوال مساعدة موحدة**: لإدارة الروابط والإعدادات

---

## 🔧 الإعدادات المطلوبة

### 1. متغيرات البيئة الأساسية

إنشئ ملف `.env.production` أو `.env.local` وأضف:

```env
# الإعدادات الأساسية
NODE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"

# قاعدة البيانات
DATABASE_URL="your-production-database-url"

# المصادقة
NEXTAUTH_SECRET="your-strong-secret-key"

# إعداد البريد الإلكتروني (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="no-reply@yourdomain.com"
CONTACT_EMAIL="info@yourdomain.com"

# إعدادات الدفع (إذا كنت تستخدمها)
KASHIER_API_KEY="your-production-api-key"
PAYPAL_CLIENT_ID="your-production-paypal-id"
PAYPAL_CLIENT_SECRET="your-production-paypal-secret"
```

### 2. إعداد الدومين

استبدل `yourdomain.com` بالدومين الفعلي لموقعك:

```bash
# مثال
NEXT_PUBLIC_BASE_URL="https://exabytex.com"
NEXTAUTH_URL="https://exabytex.com"
```

---

## 📧 إعداد البريد الإلكتروني

### خيار 1: Gmail (الأسهل)

1. **فعّل المصادقة الثنائية**
2. **أنشئ App Password**:
   - اذهب إلى [App Passwords](https://myaccount.google.com/apppasswords)
   - أنشئ كلمة مرور للتطبيق
   - استخدمها في `SMTP_PASS`

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-char-app-password"
```

### خيار 2: خادم SMTP مخصص

```env
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="no-reply@yourdomain.com"
SMTP_PASS="your-email-password"
```

### خيار 3: خدمات البريد المدفوعة

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-smtp-user"
SMTP_PASS="your-mailgun-smtp-password"
```

---

## 🔒 الأمان والحماية

### الميزات الأمنية المدمجة:

1. **عدم طباعة الروابط الحساسة في الإنتاج**
2. **صفحة admin tokens متاحة للتطوير فقط**
3. **معالجة أخطاء ذكية**
4. **حماية من الروابط المكسورة**

### نصائح إضافية:

```env
# استخدم مفتاح قوي للمصادقة
NEXTAUTH_SECRET="your-very-strong-secret-minimum-32-characters"

# استخدم قاعدة بيانات آمنة
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

---

## 🚀 خطوات النشر

### 1. التحقق من الإعدادات

```bash
# تأكد من وجود جميع المتغيرات المطلوبة
npm run build
```

### 2. اختبار النظام

```bash
# تشغيل النظام محلياً في وضع الإنتاج
npm run start
```

### 3. اختبار البريد الإلكتروني

- اذهب إلى `/contact`
- أرسل رسالة تجريبية
- تحقق من وصول الرسائل

### 4. اختبار نظام كلمة المرور

- اذهب إلى `/auth/forgot-password`
- اطلب إعادة تعيين كلمة المرور
- تحقق من وصول الرسالة

---

## 🔍 استكشاف الأخطاء

### مشاكل الروابط:

```bash
# تحقق من المتغيرات
echo $NEXT_PUBLIC_BASE_URL
echo $NEXTAUTH_URL
```

### مشاكل البريد:

```bash
# تحقق من إعدادات SMTP
node -e "console.log('SMTP User:', process.env.SMTP_USER)"
node -e "console.log('SMTP Host:', process.env.SMTP_HOST)"
```

### رسائل الخطأ الشائعة:

| الخطأ | السبب | الحل |
|-------|--------|------|
| `SMTP not configured` | لم يتم إعداد SMTP | أضف متغيرات SMTP |
| `Invalid Base URL` | رابط غير صحيح | تحقق من NEXT_PUBLIC_BASE_URL |
| `Connection refused` | مشكلة في الخادم | تحقق من إعدادات الخادم |

---

## 📊 مراقبة النظام

### في بيئة التطوير:
- الروابط تظهر في Console للاختبار
- رسائل مفصلة لاستكشاف الأخطاء

### في بيئة الإنتاج:
- حماية كاملة للمعلومات الحساسة
- رسائل مبسطة في Logs
- أداء محسّن

---

## 📝 قائمة المراجعة قبل النشر

- [ ] إعداد جميع متغيرات البيئة
- [ ] اختبار إرسال البريد الإلكتروني
- [ ] اختبار نظام كلمة المرور
- [ ] تحديث الدومين في جميع الإعدادات
- [ ] التأكد من عمل قاعدة البيانات
- [ ] اختبار النظام في وضع الإنتاج

---

## 🆘 الدعم الفني

إذا واجهت أي مشكلة:

1. **تحقق من Logs**:
   ```bash
   pm2 logs
   # أو
   docker logs container-name
   ```

2. **تحقق من متغيرات البيئة**:
   ```bash
   printenv | grep SMTP
   printenv | grep NEXT_PUBLIC
   ```

3. **اختبر الاتصال**:
   ```bash
   telnet smtp.gmail.com 587
   ```

---

**✨ المشروع الآن جاهز للإنتاج مع حماية كاملة وأداء محسّن!** 