const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearTestData() {
  try {
    console.log('🗑️ بدء حذف البيانات التجريبية...')

    // حذف البيانات بالترتيب الصحيح لتجنب مشاكل الـ foreign keys
    const deletedCartItems = await prisma.cartItem.deleteMany({})
    console.log(`✅ تم حذف ${deletedCartItems.count} عنصر من السلة`)

    const deletedWishlistItems = await prisma.wishlist.deleteMany({})
    console.log(`✅ تم حذف ${deletedWishlistItems.count} عنصر من قائمة الرغبات`)

    const deletedReviews = await prisma.review.deleteMany({})
    console.log(`✅ تم حذف ${deletedReviews.count} مراجعة`)

    const deletedOrderItems = await prisma.orderItem.deleteMany({})
    console.log(`✅ تم حذف ${deletedOrderItems.count} عنصر طلب`)

    const deletedOrders = await prisma.order.deleteMany({})
    console.log(`✅ تم حذف ${deletedOrders.count} طلب`)

    const deletedPromoCodes = await prisma.promoCode.deleteMany({})
    console.log(`✅ تم حذف ${deletedPromoCodes.count} كود خصم`)

    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`✅ تم حذف ${deletedProducts.count} منتج`)

    const deletedCategories = await prisma.category.deleteMany({})
    console.log(`✅ تم حذف ${deletedCategories.count} فئة`)

    // حذف مقالات المدونة
    const deletedBlogPosts = await prisma.blogPost.deleteMany({})
    console.log(`✅ تم حذف ${deletedBlogPosts.count} مقال`)

    console.log('\n🎉 تم حذف جميع البيانات التجريبية بنجاح!')
    console.log('⚠️ ملاحظة: بيانات المستخدمين والجلسات لم يتم حذفها للأمان')

  } catch (error) {
    console.error('❌ خطأ في حذف البيانات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('⚠️ تحذير: سيتم حذف جميع البيانات التجريبية!')
console.log('الرجاء الانتظار 3 ثوان أو اضغط Ctrl+C للإلغاء...')

setTimeout(() => {
  clearTestData()
}, 3000) 