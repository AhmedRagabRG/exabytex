# إعداد بوابات الدفع - Payment Gateway Setup

تم إضافة دعم PayPal و Apple Pay للتطبيق. يرجى اتباع التعليمات التالية لإعداد وتفعيل طرق الدفع.

## 📋 نظرة عامة

### طرق الدفع المدعومة:
1. **كاشير (Kashier)** - البطاقات الائتمانية (موجود مسبقاً)
2. **PayPal** - محفظة PayPal والبطاقات الائتمانية
3. **Apple Pay** - عبر كاشير للأجهزة المدعومة

---

## 🔧 إعداد PayPal

### 1. إنشاء حساب PayPal Developer

1. اذهب إلى [PayPal Developer](https://developer.paypal.com/)
2. قم بتسجيل الدخول أو إنشاء حساب جديد
3. اذهب إلى "My Apps & Credentials"
4. انقر على "Create App"

### 2. إعداد التطبيق

```
App Name: AI Agency Store
Merchant: اختر حساب PayPal Business الخاص بك
Features: 
  ✅ Accept payments
  ✅ Express Checkout
Country: Egypt (أو البلد المناسب)
```

### 3. الحصول على المفاتيح

بعد إنشاء التطبيق، ستحصل على:
- **Client ID**: يبدأ بـ `A` (مطلوب)
- **Client Secret**: سري ولا يجب مشاركته (مطلوب للخادم)

### 4. إضافة متغيرات البيئة

أضف المتغيرات التالية إلى ملف `.env.local`:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_TEST_MODE=true
```

### 5. URLs للاختبار والإنتاج

**للاختبار (Sandbox):**
- استخدم حساب PayPal sandbox
- `PAYPAL_TEST_MODE=true`

**للإنتاج:**
- استخدم حساب PayPal حقيقي
- `PAYPAL_TEST_MODE=false`
- تأكد من أن `NEXT_PUBLIC_BASE_URL` يشير لدومين حقيقي

---

## 🍎 إعداد Apple Pay

### 1. متطلبات Apple Pay

1. **Apple Developer Account** (مدفوع - $99/سنة)
2. **شهادة SSL صالحة** للموقع
3. **دومين حقيقي** (لا يعمل مع localhost)

### 2. إعداد Apple Pay في Apple Developer

1. اذهب إلى [Apple Developer Console](https://developer.apple.com/)
2. انتقل إلى "Certificates, Identifiers & Profiles"
3. اختر "Identifiers" ثم "Merchant IDs"
4. انقر على "+" لإنشاء Merchant ID جديد

```
Description: AI Agency Store
Identifier: merchant.com.yourdomain.ai-agency
```

### 3. إنشاء شهادة Apple Pay

1. في نفس الصفحة، انقر على Merchant ID الذي أنشأته
2. انقر على "Create Certificate"
3. اتبع التعليمات لإنشاء CSR (Certificate Signing Request)
4. حمل الشهادة (.cer) وحولها إلى .p12

### 4. إعداد كاشير لـ Apple Pay

1. سجل دخول إلى حساب كاشير
2. اذهب إلى إعدادات الدفع
3. فعل "Apple Pay"
4. أضف Merchant ID وحمل الشهادة

### 5. إضافة متغيرات البيئة

```env
# Apple Pay Configuration
APPLE_PAY_MERCHANT_ID=merchant.com.yourdomain.ai-agency
```

### 6. إعداد Domain Verification

1. في Apple Developer Console
2. اذهب إلى Merchant ID > Apple Pay Merchant Domains
3. أضف دومين موقعك
4. حمل ملف التحقق ووضعه في `.well-known/apple-developer-merchantid-domain-association`

---

## 🔐 إعداد الأمان

### HTTPS مطلوب

```nginx
# Nginx Configuration Example
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### متغيرات البيئة الكاملة

```env
# Base Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Kashier (موجود مسبقاً)
KASHIER_MERCHANT_ID=your_merchant_id
KASHIER_API_KEY=your_api_key
KASHIER_SECRET_KEY=your_secret_key
KASHIER_TEST_MODE=true

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_TEST_MODE=true

# Apple Pay
APPLE_PAY_MERCHANT_ID=merchant.com.yourdomain.ai-agency
```

---

## 🧪 اختبار الدفع

### اختبار PayPal
1. استخدم حساب PayPal sandbox
2. بيانات الاختبار متوفرة في PayPal Developer

### اختبار Apple Pay
1. استخدم Safari على iPhone/iPad/Mac
2. أضف بطاقة اختبار إلى Wallet
3. تأكد من أن الموقع يعمل بـ HTTPS

### اختبار كاشير
```bash
# اختبار الاتصال
curl https://yourdomain.com/api/kashier/create-payment

# اختبار Apple Pay
curl https://yourdomain.com/api/kashier/create-apple-pay-payment
```

---

## 🚀 تشغيل التطبيق

```bash
# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm run dev

# أو للإنتاج
npm run build
npm start
```

---

## 📱 واجهة المستخدم

### صفحة الدفع
- يمكن للمستخدم اختيار طريقة الدفع المفضلة
- عرض أزرار مختلفة حسب الطريقة المختارة
- دعم تحويل العملات تلقائياً

### طرق الدفع المعروضة:
1. **البطاقة الائتمانية (كاشير)** - دائماً متوفر
2. **PayPal** - يظهر إذا تم إعداده
3. **Apple Pay** - يظهر فقط على الأجهزة المدعومة

---

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

**PayPal لا يعمل:**
- تحقق من صحة Client ID
- تأكد من تفعيل Express Checkout
- تحقق من إعدادات CORS في PayPal

**Apple Pay لا يظهر:**
- تأكد من استخدام Safari
- تحقق من وجود HTTPS
- تأكد من إعداد Domain Verification

**كاشير لا يقبل Apple Pay:**
- تحقق من إعداد Merchant ID في كاشير
- تأكد من رفع الشهادة الصحيحة
- تحقق من تفعيل Apple Pay في الحساب

### سجلات التتبع

```bash
# مراقبة السجلات
npm run dev

# في المتصفح
Console > Network > تتبع طلبات API
```

---

## 📞 الدعم الفني

للحصول على مساعدة إضافية:
- **كاشير**: [support@kashier.io](mailto:support@kashier.io)
- **PayPal**: [PayPal Developer Support](https://developer.paypal.com/support/)
- **Apple Pay**: [Apple Developer Support](https://developer.apple.com/support/)

---

## 🔄 التحديثات المستقبلية

### مميزات مخططة:
- دعم Google Pay
- دعم المحافظ الرقمية المحلية
- تحسين تجربة المستخدم على الموبايل
- إضافة المزيد من العملات

---

**ملاحظة مهمة:** تأكد من اختبار جميع طرق الدفع في بيئة الاختبار قبل التشغيل في الإنتاج. 