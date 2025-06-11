# AI Agency - موقع وكالة الذكاء الاصطناعي والتسويق الرقمي

## نظرة عامة

هذا موقع ويب متكامل لوكالة متخصصة في الذكاء الاصطناعي والتسويق الرقمي، مبني باستخدام Next.js 15 مع TypeScript و Tailwind CSS. يحتوي الموقع على جميع الميزات المطلوبة للوكالة الحديثة.

## الميزات الرئيسية

### 🏠 الصفحة الرئيسية (Landing Page)
- تصميم جذاب ومتجاوب
- قسم Hero مع دعوة للعمل
- عرض الخدمات بشكل تفاعلي
- شهادات العملاء
- نموذج التواصل

### 🛒 المتجر (Store)
- عرض المنتجات الرقمية (AI Workflows)
- نظام تصفية وبحث متقدم
- بطاقات منتجات تفاعلية
- دعم عرض شبكي وقائمة

### 📝 المدونة (Blog)
- نظام CMS بسيط باستخدام Markdown
- مقالات مميزة ومنتظمة
- نظام Tags للتصنيف
- صفحات مقالات مخصصة

### 👤 نظام المصادقة
- تسجيل الدخول والحساب الجديد
- استخدام NextAuth.js
- دعم قاعدة البيانات مع Prisma

### 📊 لوحة التحكم (Dashboard)
- عرض بيانات المستخدم
- حالة الطلبات
- إدارة الـ Workflows المشتراة

## التقنيات المستخدمة

### Frontend
- **Next.js 15** - إطار عمل React مع App Router
- **TypeScript** - للكتابة المنظمة والآمنة
- **Tailwind CSS** - للتصميم المتجاوب والسريع
- **Lucide Icons** - مجموعة أيقونات حديثة

### Backend & Database
- **Prisma** - ORM لقاعدة البيانات
- **NextAuth.js** - نظام المصادقة
- **SQLite/PostgreSQL** - قاعدة البيانات

### Content Management
- **Gray Matter** - لمعالجة ملفات Markdown
- **Remark** - لتحويل Markdown إلى HTML

## بنية المشروع

```
ai-agency-app/
├── src/
│   ├── app/                 # صفحات التطبيق (App Router)
│   │   ├── page.tsx         # الصفحة الرئيسية
│   │   ├── store/           # صفحات المتجر
│   │   ├── blog/            # صفحات المدونة
│   │   ├── dashboard/       # لوحة التحكم
│   │   └── auth/            # صفحات المصادقة
│   ├── components/          # المكونات القابلة للإعادة
│   │   ├── ui/              # مكونات واجهة المستخدم الأساسية
│   │   ├── layout/          # مكونات التخطيط (Header, Footer)
│   │   └── sections/        # أقسام الصفحات
│   ├── lib/                 # المكتبات والأدوات المساعدة
│   ├── types/               # تعريفات الأنواع TypeScript
│   └── styles/              # ملفات الأنماط
├── posts/                   # مقالات المدونة (Markdown)
├── public/                  # الملفات الثابتة
└── prisma/                  # إعدادات قاعدة البيانات
```

## التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- Git

### خطوات التثبيت

1. **استنساخ المشروع:**
```bash
git clone <repository-url>
cd ai-agency-app
```

2. **تثبيت الحزم:**
```bash
npm install
```

3. **إعداد متغيرات البيئة:**
```bash
cp .env.example .env.local
```

عدل ملف `.env.local` وأضف المتغيرات المطلوبة:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
```

4. **إعداد قاعدة البيانات:**
```bash
npx prisma generate
npx prisma db push
```

5. **تشغيل المشروع:**
```bash
npm run dev
```

المشروع سيكون متاحاً على `http://localhost:3000`

## البناء للإنتاج

```bash
npm run build
npm start
```

## المكونات الرئيسية

### 🎨 مكونات الواجهة (UI Components)

#### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  اضغط هنا
</Button>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>العنوان</CardTitle>
  </CardHeader>
  <CardContent>
    المحتوى هنا
  </CardContent>
</Card>
```

### 📄 إدارة المحتوى

#### إضافة مقال جديد
1. أنشئ ملف `.md` جديد في مجلد `posts/`
2. أضف البيانات الوصفية في الأعلى:
```markdown
---
title: "عنوان المقال"
excerpt: "ملخص المقال"
date: "2024-01-01"
author:
  name: "اسم الكاتب"
  avatar: "/path/to/avatar.jpg"
tags: ["تقنية", "ذكاء اصطناعي"]
featured: true
---

محتوى المقال هنا...
```

#### إضافة منتج جديد
عدل ملف `src/app/store/page.tsx` وأضف المنتج الجديد في مصفوفة `products`.

## التخصيص والتطوير

### 🎨 الألوان والتصميم
- الألوان الرئيسية: أزرق (#2563eb) وبنفسجي (#7c3aed)
- الخط: Cairo للغة العربية
- الاتجاه: RTL (من اليمين لليسار)

### 🌐 دعم اللغات
المشروع مُحسن للغة العربية مع دعم RTL، ويمكن إضافة لغات أخرى بسهولة.

### 📱 الاستجابة (Responsive)
التصميم متجاوب بالكامل ويعمل على:
- أجهزة سطح المكتب
- أجهزة اللوحية
- الهواتف المحمولة

## الدعم والمساهمة

### 🐛 الإبلاغ عن المشاكل
إذا واجهت أي مشكلة، يرجى فتح Issue في المستودع.

### 🤝 المساهمة
نرحب بالمساهمات! اتبع الخطوات التالية:
1. Fork المشروع
2. أنشئ branch جديد للميزة
3. Commit التغييرات
4. Push للـ branch
5. أنشئ Pull Request

## الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## جهات الاتصال

- **الموقع:** [AI Agency](https://aiagency.com)
- **البريد الإلكتروني:** info@aiagency.com
- **الهاتف:** +201555831761

---

تم تطوير هذا المشروع لتقديم حلول الذكاء الاصطناعي والتسويق الرقمي للشركات في المنطقة العربية. 🚀
