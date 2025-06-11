const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const reviews = [
  {
    userEmail: "admin@example.com",
    productIndex: 0,
    rating: 5,
    comment: "منتج رائع ساعدني كثيراً في تطوير أعمالي. التكامل مع الذكاء الاصطناعي أحدث نقلة نوعية في شركتي والنتائج فاقت توقعاتي بكثير."
  },
  {
    userEmail: "admin@example.com",
    productIndex: 1,
    rating: 4,
    comment: "أداة مفيدة جداً لتحليل البيانات. واجهة سهلة الاستخدام وتقارير مفصلة. أنصح بها لكل من يريد فهم بياناته بشكل أعمق."
  },
  {
    userEmail: "admin@example.com",
    productIndex: 2,
    rating: 5,
    comment: "برنامج تدريبي ممتاز! المحتوى شامل ومفصل، والمدربون محترفون. اكتسبت مهارات جديدة في الذكاء الاصطناعي بطريقة عملية."
  },
  {
    userEmail: "admin@example.com",
    productIndex: 3,
    rating: 5,
    comment: "خدمة تطوير المواقع احترافية للغاية. الفريق متفهم للمتطلبات وينجز العمل في الوقت المحدد. جودة عالية وأسعار معقولة."
  },
  {
    userEmail: "admin@example.com",
    productIndex: 4,
    rating: 4,
    comment: "نظام إدارة ممتاز يوفر الكثير من الوقت والجهد. التقارير مفيدة والواجهة بديهية. سهل عملية إدارة الأعمال بشكل كبير."
  },
  {
    userEmail: "admin@example.com",
    productIndex: 5,
    rating: 5,
    comment: "أفضل منصة للتسويق الإلكتروني جربتها! الأدوات متطورة والنتائج ملموسة. زادت مبيعاتي بنسبة 200% خلال شهرين فقط."
  }
]

async function seedReviews() {
  try {
    console.log('🌱 بدء إضافة المراجعات التجريبية...')
    
    // الحصول على المستخدم
    const user = await prisma.user.findUnique({
      where: { email: "admin@example.com" }
    })
    
    if (!user) {
      console.error('❌ لم يتم العثور على المستخدم admin@example.com')
      return
    }
    
    // الحصول على جميع المنتجات
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    if (products.length === 0) {
      console.error('❌ لم يتم العثور على منتجات')
      return
    }
    
    console.log(`📦 تم العثور على ${products.length} منتج`)
    
    for (const reviewData of reviews) {
      if (reviewData.productIndex >= products.length) {
        console.log(`⚠️ تجاهل مراجعة للمنتج ${reviewData.productIndex} - المنتج غير موجود`)
        continue
      }
      
      const product = products[reviewData.productIndex]
      
      // التحقق من عدم وجود مراجعة سابقة
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: product.id
          }
        }
      })
      
      if (existingReview) {
        console.log(`⚠️ مراجعة موجودة بالفعل للمنتج: ${product.title}`)
        continue
      }
      
      // إنشاء المراجعة
      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating: reviewData.rating,
          comment: reviewData.comment
        }
      })
      
      console.log(`✅ تم إضافة مراجعة للمنتج: ${product.title} (تقييم: ${reviewData.rating}/5)`)
    }
    
    console.log('🎉 تم الانتهاء من إضافة المراجعات!')
    
  } catch (error) {
    console.error('❌ خطأ في إضافة المراجعات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedReviews() 