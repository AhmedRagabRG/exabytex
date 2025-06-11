const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testReview() {
  try {
    console.log('🔍 البحث عن المستخدم...')
    const user = await prisma.user.findUnique({
      where: { email: "admin@example.com" }
    })
    
    if (!user) {
      console.error('❌ المستخدم غير موجود')
      return
    }
    
    console.log('✅ تم العثور على المستخدم:', user.name)
    
    console.log('🔍 البحث عن المنتجات...')
    const products = await prisma.product.findMany({
      take: 1
    })
    
    if (products.length === 0) {
      console.error('❌ لا توجد منتجات')
      return
    }
    
    const product = products[0]
    console.log('✅ تم العثور على منتج:', product.title)
    
    // التحقق من وجود مراجعة سابقة
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id
        }
      }
    })
    
    if (existingReview) {
      console.log('⚠️ مراجعة موجودة بالفعل للمنتج')
      console.log('المراجعة الموجودة:', {
        rating: existingReview.rating,
        comment: existingReview.comment.substring(0, 50) + '...'
      })
      return
    }
    
    // إنشاء مراجعة تجريبية
    console.log('➕ إنشاء مراجعة جديدة...')
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        rating: 5,
        comment: "منتج رائع ساعدني كثيراً في تطوير أعمالي. التكامل مع الذكاء الاصطناعي أحدث نقلة نوعية في شركتي والنتائج فاقت توقعاتي بكثير."
      }
    })
    
    console.log('🎉 تم إنشاء المراجعة بنجاح!')
    console.log('تفاصيل المراجعة:', {
      id: review.id,
      rating: review.rating,
      comment: review.comment.substring(0, 50) + '...'
    })
    
  } catch (error) {
    console.error('❌ خطأ:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testReview() 