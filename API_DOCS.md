# Blog API Documentation

## Overview
واجهة برمجة تطبيقات بسيطة لإدارة المدونات تتيح لك إنشاء وقراءة وتحديث وحذف المقالات من أي تطبيق خارجي.

## Base URL
```
http://localhost:3000/api/blogs
```

## Endpoints

### 1. جلب جميع المقالات
**GET** `/api/blogs`

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | رقم الصفحة |
| `limit` | number | 10 | عدد المقالات في كل صفحة |
| `status` | string | "PUBLISHED" | حالة المقالات (PUBLISHED, PENDING, DRAFT, ALL) |
| `featured` | boolean | - | المقالات المميزة فقط |

#### مثال على الطلب
```bash
curl -X GET "http://localhost:3000/api/blogs?page=1&limit=5&status=PUBLISHED&featured=true"
```

#### مثال على الاستجابة
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": "clx123456789",
        "title": "عنوان المقال",
        "content": "محتوى المقال...",
        "excerpt": "مقدمة المقال",
        "slug": "article-slug",
        "coverImage": "https://example.com/image.jpg",
        "authorId": "clx987654321",
        "authorName": "اسم الكاتب",
        "authorAvatar": "https://example.com/avatar.jpg",
        "tags": ["تقنية", "ذكاء اصطناعي"],
        "featured": true,
        "status": "PUBLISHED",
        "published": true,
        "publishedAt": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "author": {
          "id": "clx987654321",
          "name": "اسم الكاتب",
          "email": "author@example.com",
          "image": "https://example.com/avatar.jpg"
        },
        "comments": [
          {
            "id": "clx111111111",
            "content": "تعليق رائع",
            "authorName": "معلق",
            "createdAt": "2024-01-15T11:00:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "pages": 5
    }
  }
}
```

### 2. إنشاء مقال جديد
**POST** `/api/blogs`

#### متطلبات الطلب

**للاستخدام العادي (مع تسجيل الدخول):**
```json
{
  "title": "عنوان المقال", // مطلوب
  "content": "محتوى المقال الكامل", // مطلوب
  "excerpt": "مقدمة أو ملخص المقال", // مطلوب
  "slug": "article-slug", // اختياري (سيتم إنشاؤه تلقائياً من العنوان)
  "coverImage": "https://example.com/image.jpg", // اختياري
  "tags": ["تقنية", "برمجة"], // اختياري
  "featured": false, // اختياري - افتراضي false
  "published": true // اختياري - افتراضي false
}
```

**للاستخدام الخارجي (بدون session):**
```json
{
  "title": "عنوان المقال", // مطلوب
  "content": "محتوى المقال الكامل", // مطلوب
  "excerpt": "مقدمة أو ملخص المقال", // مطلوب
  "slug": "article-slug", // اختياري (سيتم إنشاؤه تلقائياً من العنوان)
  "coverImage": "https://example.com/image.jpg", // اختياري
  "authorId": "clx987654321", // مطلوب - ID المؤلف
  "authorName": "اسم الكاتب", // مطلوب
  "authorAvatar": "https://example.com/avatar.jpg", // اختياري
  "tags": ["تقنية", "برمجة"], // اختياري
  "featured": false, // اختياري - افتراضي false
  "published": true // اختياري - افتراضي false
}
```

#### مثال على الطلب
```bash
curl -X POST "http://localhost:3000/api/blogs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "مقدمة في الذكاء الاصطناعي",
    "content": "الذكاء الاصطناعي هو تقنية ثورية...",
    "excerpt": "تعرف على أساسيات الذكاء الاصطناعي",
    "authorId": "clx987654321",
    "authorName": "أحمد محمد",
    "tags": ["ذكاء اصطناعي", "تقنية"],
    "published": true
  }'
```

#### مثال على الاستجابة
```json
{
  "success": true,
  "message": "تم إنشاء المقال بنجاح",
  "data": {
    "id": "clx123456789",
    "title": "مقدمة في الذكاء الاصطناعي",
    "slug": "مقدمة-في-الذكاء-الاصطناعي",
    "status": "PUBLISHED",
    "published": true,
    "publishedAt": "2024-01-15T10:00:00Z",
    // ... باقي البيانات
  }
}
```

### 3. جلب مقال واحد
**GET** `/api/blogs/{id}`

#### مثال على الطلب
```bash
# بالـ ID
curl -X GET "http://localhost:3000/api/blogs/clx123456789"

# بالـ slug
curl -X GET "http://localhost:3000/api/blogs/article-slug"
```

#### مثال على الاستجابة
```json
{
  "success": true,
  "data": {
    "id": "clx123456789",
    "title": "عنوان المقال",
    "content": "محتوى المقال الكامل...",
    "tags": ["تقنية", "برمجة"],
    "author": {
      "id": "clx987654321",
      "name": "اسم الكاتب",
      "email": "author@example.com"
    },
    "comments": [
      {
        "id": "clx111111111",
        "content": "تعليق رائع",
        "authorName": "معلق",
        "createdAt": "2024-01-15T11:00:00Z",
        "replies": [
          {
            "id": "clx222222222",
            "content": "رد على التعليق",
            "authorName": "كاتب آخر",
            "createdAt": "2024-01-15T12:00:00Z"
          }
        ]
      }
    ]
  }
}
```

### 4. تحديث مقال
**PUT** `/api/blogs/{id}`

#### متطلبات الطلب
```json
{
  "title": "عنوان محدث", // اختياري
  "content": "محتوى محدث", // اختياري
  "excerpt": "مقدمة محدثة", // اختياري
  "slug": "new-slug", // اختياري
  "coverImage": "https://example.com/new-image.jpg", // اختياري
  "tags": ["تقنية محدثة"], // اختياري
  "featured": true, // اختياري
  "published": true, // اختياري
  "status": "PUBLISHED" // اختياري
}
```

#### مثال على الطلب
```bash
curl -X PUT "http://localhost:3000/api/blogs/clx123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "عنوان محدث للمقال",
    "featured": true,
    "published": true
  }'
```

### 5. حذف مقال
**DELETE** `/api/blogs/{id}`

#### مثال على الطلب
```bash
curl -X DELETE "http://localhost:3000/api/blogs/clx123456789"
```

#### مثال على الاستجابة
```json
{
  "success": true,
  "message": "تم حذف المقال بنجاح"
}
```

## حالات الخطأ

### خطأ 400 - Bad Request
```json
{
  "success": false,
  "error": "العنوان والمحتوى والمقدمة ومعلومات الكاتب مطلوبة"
}
```

### خطأ 404 - Not Found
```json
{
  "success": false,
  "error": "المقال غير موجود"
}
```

### خطأ 500 - Server Error
```json
{
  "success": false,
  "error": "حدث خطأ في الخادم"
}
```

## ملاحظات مهمة

1. **طريقتان للاستخدام**:
   - **الاستخدام العادي**: مع session مسجل دخول - لا يحتاج `authorId`
   - **الاستخدام الخارجي**: بدون session - يجب توفير `authorId` و `authorName`

2. **المؤلف (Author)**: يجب أن يكون `authorId` موجود في قاعدة البيانات (للاستخدام الخارجي)

3. **Slug**: إذا لم تقم بتوفير slug، سيتم إنشاؤه تلقائياً من العنوان

4. **Tags**: يتم حفظها كـ JSON array في قاعدة البيانات

5. **الحالة (Status)**: 
   - `PENDING`: في انتظار المراجعة
   - `PUBLISHED`: منشور
   - `DRAFT`: مسودة

6. **النشر**: إذا كان `published: true`، سيتم تعيين `publishedAt` تلقائياً

7. **المصادقة**: للاستخدام العادي، تأكد من إرسال cookies الخاصة بالـ session

## أمثلة على الاستخدام في JavaScript

### إنشاء مقال جديد (للاستخدام العادي مع session)
```javascript
const createBlog = async () => {
  const response = await fetch('http://localhost:3000/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // مهم لإرسال cookies
    body: JSON.stringify({
      title: 'مقال جديد',
      content: 'محتوى المقال...',
      excerpt: 'مقدمة المقال',
      tags: ['تقنية', 'برمجة'],
      published: true
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### إنشاء مقال جديد (للاستخدام الخارجي)
```javascript
const createBlogExternal = async () => {
  const response = await fetch('http://localhost:3000/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'مقال جديد',
      content: 'محتوى المقال...',
      excerpt: 'مقدمة المقال',
      authorId: 'user-id-here',
      authorName: 'اسم الكاتب',
      tags: ['تقنية', 'برمجة'],
      published: true
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### جلب المقالات
```javascript
const getBlogs = async () => {
  const response = await fetch('http://localhost:3000/api/blogs?page=1&limit=10');
  const data = await response.json();
  console.log(data.data.blogs);
};
``` 