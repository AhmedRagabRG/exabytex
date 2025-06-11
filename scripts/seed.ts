import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    id: "1",
    title: "نظام أتمتة الرد الآلي المتقدم",
    description: "نظام ذكي للرد الآلي على العملاء باستخدام الذكاء الاصطناعي مع دعم كامل للغة العربية",
    price: 2499,
    discountedPrice: 1999,
    hasDiscount: true,
    image: "/api/placeholder/300/200",
    category: "الذكاء الاصطناعي",
    features: JSON.stringify([
      "رد آلي ذكي باللغة العربية",
      "تكامل مع واتساب وتيليجرام",
      "تحليل مزاج العميل",
      "إدارة الطلبات التلقائية",
      "تقارير مفصلة عن الأداء",
      "دعم فني 24/7"
    ]),
    isPopular: true
  },
  {
    id: "2",
    title: "روبوت المحادثة للمواقع الإلكترونية",
    description: "إضافة ذكية لموقعك الإلكتروني لتوفير دعم عملاء فوري ومتقدم باللغة العربية",
    price: 1799,
    image: "/api/placeholder/300/200",
    category: "خدمة العملاء",
    features: JSON.stringify([
      "دعم العربية والإنجليزية",
      "تعلم من المحادثات السابقة",
      "تكامل مع منصات التواصل",
      "إجابات ذكية ومخصصة",
      "تحليل مشاعر العملاء",
      "نقل للموظفين عند الحاجة"
    ]),
    isPopular: false
  },
  {
    id: "3",
    title: "نظام التسويق الرقمي المؤتمت",
    description: "منصة شاملة لأتمتة حملات التسويق الرقمي وتحليل الأداء بدقة عالية",
    price: 3499,
    image: "/api/placeholder/300/200",
    category: "التسويق الرقمي",
    features: JSON.stringify([
      "أتمتة حملات البريد الإلكتروني",
      "إدارة منصات التواصل الاجتماعي",
      "تحليل أداء الحملات",
      "استهداف ذكي للجمهور",
      "تخصيص المحتوى",
      "تقارير مفصلة عن العائد"
    ]),
    isPopular: true
  },
  {
    id: "4",
    title: "نظام تحليل البيانات الذكي",
    description: "أداة تحليل بيانات متقدمة تستخدم الذكاء الاصطناعي لاستخراج رؤى قيمة",
    price: 4299,
    image: "/api/placeholder/300/200",
    category: "تحليل البيانات",
    features: JSON.stringify([
      "تحليل البيانات المعقدة",
      "تصورات بيانية تفاعلية",
      "تنبؤات مستقبلية دقيقة",
      "تحديد الأنماط والاتجاهات",
      "تقارير تلقائية",
      "تكامل مع مصادر البيانات المختلفة"
    ]),
    isPopular: false
  },
  {
    id: "5",
    title: "منصة التجارة الإلكترونية الذكية",
    description: "حل متكامل للتجارة الإلكترونية مع توصيات ذكية وإدارة متقدمة للمخزون",
    price: 5999,
    image: "/api/placeholder/300/200",
    category: "التجارة الإلكترونية",
    features: JSON.stringify([
      "توصيات منتجات ذكية",
      "إدارة مخزون آلية",
      "تحليل سلوك المتسوقين",
      "نظام دفع آمن ومتعدد",
      "أتمتة عمليات الشحن",
      "لوحة تحكم شاملة"
    ]),
    isPopular: false
  },
  {
    id: "6",
    title: "نظام الموارد البشرية الذكي",
    description: "منصة HR متطورة لإدارة الموظفين والمواهب باستخدام الذكاء الاصطناعي",
    price: 3799,
    image: "/api/placeholder/300/200",
    category: "الموارد البشرية",
    features: JSON.stringify([
      "فرز السير الذاتية تلقائياً",
      "تقييم أداء الموظفين",
      "تخطيط التطوير المهني",
      "إدارة الحضور والانصراف",
      "تحليل رضا الموظفين",
      "توقع معدل الدوران"
    ]),
    isPopular: false
  }
]

const blogPosts = [
  {
    title: "مستقبل الذكاء الاصطناعي في الأعمال السعودية",
    content: `مستقبل الذكاء الاصطناعي في الأعمال السعودية مع رؤية 2030. 

يشهد القطاع التجاري تحولاً جذرياً مع دخول تقنيات الذكاء الاصطناعي. المملكة تسعى لتصبح مركزاً عالمياً للتقنيات المتقدمة.

## التطبيقات الحالية:
- التجارة الإلكترونية: أنظمة التوصية الذكية
- القطاع المصرفي: كشف الاحتيال التلقائي  
- قطاع الصحة: التشخيص المساعد

## التوقعات المستقبلية:
1. انتشار واسع للأتمتة
2. نمو قطاع التقنيات الناشئة
3. تطوير المواهب المحلية

الذكاء الاصطناعي استراتيجية أساسية للنمو في السوق السعودي.`,
    excerpt: "استكشاف كيفية تأثير الذكاء الاصطناعي على مستقبل الأعمال في المملكة العربية السعودية ودوره في تحقيق رؤية 2030",
    slug: "future-of-ai-in-saudi-business",
    coverImage: "/api/placeholder/800/400",
    authorName: "د. أحمد المحمد",
    authorAvatar: "/api/placeholder/100/100",
    tags: JSON.stringify(["الذكاء الاصطناعي", "رؤية 2030", "الأعمال السعودية", "التحول الرقمي"]),
    featured: true,
    published: true
  },
  {
    title: "10 طرق لاستخدام الذكاء الاصطناعي في تحسين خدمة العملاء",
    content: `10 طرق لاستخدام الذكاء الاصطناعي في تحسين خدمة العملاء.

## الطرق الرئيسية:
1. روبوتات المحادثة الذكية (متوفرة 24/7)
2. تحليل المشاعر (Sentiment Analysis)
3. التنبؤ بحاجات العملاء
4. أتمتة التذاكر والشكاوى
5. المساعدات الصوتية
6. التخصيص الذكي للمحتوى
7. تحليل ردود أفعال العملاء
8. الدعم التنبؤي
9. التفاعل متعدد القنوات
10. تحليل الأداء المستمر

الذكاء الاصطناعي يمكن الشركات من تقديم تجربة استثنائية للعملاء وبناء علاقات طويلة المدى.`,
    excerpt: "دليل شامل لاستخدام تقنيات الذكاء الاصطناعي المختلفة لتطوير وتحسين جودة خدمة العملاء في شركتك",
    slug: "10-ways-ai-customer-service",
    coverImage: "/api/placeholder/800/400",
    authorName: "سارة أحمد",
    authorAvatar: "/api/placeholder/100/100",
    tags: JSON.stringify(["خدمة العملاء", "الذكاء الاصطناعي", "روبوتات المحادثة", "تحليل المشاعر"]),
    featured: false,
    published: true
  },
  {
    title: "كيفية اختيار نظام إدارة علاقات العملاء (CRM) المناسب لشركتك",
    content: `دليل شامل لاختيار نظام إدارة علاقات العملاء المناسب لشركتك. نظام CRM أصبح ضرورة حتمية للشركات في السوق التنافسي اليوم.

## ما هو نظام CRM؟
نظام إدارة علاقات العملاء هو منصة تتيح للشركات إدارة بيانات العملاء وتتبع التفاعلات والمبيعات وأتمتة عمليات التسويق.

## خطوات الاختيار:
1. تحديد احتياجات شركتك
2. تحديد المميزات المطلوبة  
3. التأكد من سهولة الاستخدام
4. فحص إمكانيات التكامل
5. مراجعة الأمان وحماية البيانات

النظام المناسب سيساعدك على زيادة المبيعات وتحسين علاقات العملاء وتوفير الوقت والجهد.`,
    excerpt: "دليل شامل لمساعدتك في اختيار وتطبيق نظام إدارة علاقات العملاء المناسب لاحتياجات شركتك وأهدافها",
    slug: "how-to-choose-crm-system",
    coverImage: "/api/placeholder/800/400",
    authorName: "محمد العتيبي",
    authorAvatar: "/api/placeholder/100/100",
    tags: JSON.stringify(["CRM", "إدارة علاقات العملاء", "إدارة الأعمال", "المبيعات"]),
    featured: true,
    published: true
  }
]

async function main() {
  console.log('🌱 بدء ملء قاعدة البيانات...')

  // Clear existing data
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.blogPost.deleteMany()

  console.log('🗑️  تم حذف البيانات الموجودة')

  // Seed products
  console.log('📦 إضافة المنتجات...')
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  // Get admin user for blog posts
  const adminUser = await prisma.user.findFirst({
    where: { 
      OR: [
        { role: 'ADMIN' },
        { role: 'MANAGER' }
      ]
    }
  })

  // Seed blog posts
  console.log('📝 إضافة المقالات...')
  if (adminUser) {
    for (const post of blogPosts) {
      await prisma.blogPost.create({
        data: {
          ...post,
          authorId: adminUser.id,
          status: 'PUBLISHED'
        }
      })
    }
  } else {
    console.log('⚠️ لا يوجد مدير لإضافة المقالات')
  }

  console.log('✅ تم ملء قاعدة البيانات بنجاح!')
  console.log(`📦 تم إضافة ${products.length} منتجات`)
  console.log(`📝 تم إضافة ${blogPosts.length} مقالات`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ في ملء قاعدة البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 