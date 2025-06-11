const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProductDiscounts() {
  try {
    // جلب جميع المنتجات
    const products = await prisma.product.findMany({
      where: { isActive: true }
    })

    if (products.length === 0) {
      console.log('لا توجد منتجات للتحديث')
      return
    }

    console.log(`وجد ${products.length} منتج(ات)`)

    // إضافة خصم لبعض المنتجات
    const productsToUpdate = products.slice(0, Math.min(3, products.length))

    for (const [index, product] of productsToUpdate.entries()) {
      // تحديد خصم عشوائي بين 10% و 30%
      const discountPercentage = 10 + (index * 10) // 10%, 20%, 30%
      const discountedPrice = product.price * (1 - discountPercentage / 100)

      await prisma.product.update({
        where: { id: product.id },
        data: {
          hasDiscount: true,
          discountedPrice: Math.round(discountedPrice * 100) / 100 // تقريب لمنزلتين عشريتين
        }
      })

      console.log(`✅ تم إضافة خصم ${discountPercentage}% للمنتج: ${product.title}`)
      console.log(`   السعر الأصلي: ${product.price} ر.س`)
      console.log(`   السعر بعد الخصم: ${Math.round(discountedPrice * 100) / 100} ر.س`)
      console.log('')
    }

    console.log('🎉 تمت إضافة الخصومات بنجاح!')

  } catch (error) {
    console.error('خطأ في إضافة خصومات المنتجات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addProductDiscounts() 