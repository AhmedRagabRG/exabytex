const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 إضافة بيانات تجريبية...')

  // البحث عن مستخدم أحمد
  const ahmed = await prisma.user.findUnique({
    where: { email: 'ahmed.shoshan@Outlook.com' }
  })

  if (!ahmed) {
    console.log('❌ مستخدم أحمد غير موجود')
    return
  }

  console.log('✅ تم العثور على المستخدم:', ahmed.email)

  // الحصول على المنتجات الموجودة
  const products = await prisma.product.findMany({
    take: 5
  })

  if (products.length === 0) {
    console.log('❌ لا توجد منتجات في قاعدة البيانات')
    return
  }

  console.log(`✅ تم العثور على ${products.length} منتجات`)

  // إضافة منتجات للمحفوظات
  console.log('📝 إضافة منتجات للمحفوظات...')
  
  for (let i = 0; i < Math.min(3, products.length); i++) {
    const product = products[i]
    
    try {
      await prisma.wishlist.create({
        data: {
          userId: ahmed.id,
          productId: product.id
        }
      })
      console.log(`   ✅ تم إضافة "${product.title}" للمحفوظات`)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`   ⚠️  "${product.title}" موجود بالفعل في المحفوظات`)
      } else {
        console.log(`   ❌ خطأ في إضافة "${product.title}":`, error.message)
      }
    }
  }

  // إنشاء طلبات تجريبية
  console.log('🛍️ إنشاء طلبات تجريبية...')

  // طلب مكتمل
  try {
    const completedOrder = await prisma.order.create({
      data: {
        userId: ahmed.id,
        status: 'COMPLETED',
        total: 2500,
        discount: 250,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price
            },
            {
              productId: products[1].id,
              quantity: 2,
              price: products[1].price
            }
          ]
        }
      }
    })
    console.log('   ✅ تم إنشاء طلب مكتمل:', completedOrder.id)
  } catch (error) {
    console.log('   ❌ خطأ في إنشاء الطلب المكتمل:', error.message)
  }

  // طلب قيد التنفيذ
  try {
    const processingOrder = await prisma.order.create({
      data: {
        userId: ahmed.id,
        status: 'PROCESSING',
        total: 1800,
        discount: 0,
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              price: products[2].price
            }
          ]
        }
      }
    })
    console.log('   ✅ تم إنشاء طلب قيد التنفيذ:', processingOrder.id)
  } catch (error) {
    console.log('   ❌ خطأ في إنشاء الطلب قيد التنفيذ:', error.message)
  }

  // طلب في الانتظار
  try {
    const pendingOrder = await prisma.order.create({
      data: {
        userId: ahmed.id,
        status: 'PENDING',
        total: 950,
        discount: 50,
        items: {
          create: [
            {
              productId: products[3].id,
              quantity: 1,
              price: products[3].price
            }
          ]
        }
      }
    })
    console.log('   ✅ تم إنشاء طلب في الانتظار:', pendingOrder.id)
  } catch (error) {
    console.log('   ❌ خطأ في إنشاء الطلب في الانتظار:', error.message)
  }

  // عرض إحصائيات
  const totalOrders = await prisma.order.count({
    where: { userId: ahmed.id }
  })

  const totalWishlist = await prisma.wishlist.count({
    where: { userId: ahmed.id }
  })

  console.log('\n📊 الإحصائيات النهائية:')
  console.log(`   📦 إجمالي الطلبات: ${totalOrders}`)
  console.log(`   ❤️  إجمالي المحفوظات: ${totalWishlist}`)
  
  console.log('\n✅ تم الانتهاء من إضافة البيانات التجريبية!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 