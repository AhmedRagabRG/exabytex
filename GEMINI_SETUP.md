# إعداد Google Gemini AI

تم إضافة دعم Google Gemini AI بجانب OpenAI لمولد المحتوى.

## ✨ المزايا الجديدة

### 🤖 نماذج AI المدعومة:
- **Google Gemini 1.5 Flash** (افتراضي) - مجاني
- **OpenAI GPT-4** - مدفوع

### 🔧 الميزات المضافة:
- اختيار النموذج من واجهة المستخدم
- صفحة إعدادات AI منفصلة (`/ai-content/settings`)
- فحص حالة النماذج
- أيقونة الإعدادات في الهيدر

## 🚀 طريقة الإعداد

### 1. الحصول على مفتاح Gemini API:
1. اذهب إلى: https://aistudio.google.com/app/apikey
2. قم بإنشاء مفتاح API جديد
3. انسخ المفتاح

### 2. إضافة المفتاح للمتغيرات:
```bash
# في ملف .env.local
GEMINI_API_KEY="your_gemini_api_key_here"
OPENAI_API_KEY="your_openai_api_key_here"  # اختياري
```

### 3. إعادة تشغيل الخادم:
```bash
npm run dev
```

## 📋 متغيرات البيئة المطلوبة

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js  
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Models
OPENAI_API_KEY="your-openai-api-key-here"     # اختياري
GEMINI_API_KEY="your-gemini-api-key-here"     # مطلوب للنموذج الافتراضي
```

## 🔍 فحص الحالة

يمكنك فحص حالة النماذج من:
- صفحة الإعدادات: `/ai-content/settings`
- API endpoint: `/api/ai/status`

## 🎯 الاستخدام

1. **اختيار النموذج:** في صفحة مولد المحتوى (`/ai-content`)
2. **Gemini (افتراضي):** مجاني ومتقدم
3. **OpenAI GPT-4:** احتياطي إذا كان متوفراً

## 📝 ملاحظات مهمة

- **Gemini هو النموذج الافتراضي** لأنه مجاني
- **لا يحتاج OpenAI** إلا إذا كنت تريد خيارات إضافية
- **جميع أنواع المحتوى مدعومة** في كلا النموذجين
- **نفس تكلفة الكوينز** لكلا النموذجين

## 🚨 استكشاف الأخطاء

### إذا لم يظهر Gemini كمتاح:
1. تأكد من صحة المفتاح
2. تأكد من إضافة `GEMINI_API_KEY` في `.env.local`
3. أعد تشغيل الخادم
4. تحقق من الإعدادات في `/ai-content/settings`

### إذا فشل في التوليد:
1. تحقق من صحة المفتاح
2. تأكد من وجود رصيد كوينز
3. تحقق من حالة النماذج في الإعدادات

## 🔗 روابط مفيدة

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [OpenAI Platform](https://platform.openai.com/api-keys)

---

تم تطوير هذه الميزة لتوفير بديل مجاني ومتقدم لتوليد المحتوى! 🎉 