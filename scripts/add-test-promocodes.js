const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTestPromoCodes() {
  try {
    // البحث عن مانجر أو أدمن لربطه بالكوبونات
    const manager = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'MANAGER' },
          { role: 'ADMIN' }
        ]
      }
    })

    if (!manager) {
      console.log('لا يوجد مانجر أو أدمن في النظام')
      return
    }

    const testPromoCodes = [
      {
        code: 'WELCOME20',
        description: 'خصم ترحيبي للعملاء الجدد',
        discountType: 'PERCENTAGE',
        discountValue: 20.0,
        minimumAmount: 100.0,
        maxUses: 50,
        createdById: manager.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // شهر من الآن
      },
      {
        code: 'SUMMER50',
        description: 'خصم الصيف الكبير',
        discountType: 'FIXED',
        discountValue: 50.0,
        minimumAmount: 200.0,
        maxUses: 100,
        createdById: manager.id,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // شهرين من الآن
      },
      {
        code: 'VIP10',
        description: 'خصم للعملاء المميزين',
        discountType: 'PERCENTAGE',
        discountValue: 10.0,
        minimumAmount: null,
        maxUses: null, // استخدام لا محدود
        createdById: manager.id,
        expiresAt: null // بدون انتهاء صلاحية
      }
    ]

    for (const promoData of testPromoCodes) {
      // التحقق من عدم وجود كوبون بنفس الرمز
      const existingPromo = await prisma.promoCode.findUnique({
        where: { code: promoData.code }
      })

      if (!existingPromo) {
        await prisma.promoCode.create({
          data: promoData
        })
        console.log(`✅ تم إضافة كوبون ${promoData.code}`)
      } else {
        console.log(`⚠️ كوبون ${promoData.code} موجود بالفعل`)
      }
    }

    console.log('\n🎉 تمت إضافة كوبونات الاختبار بنجاح!')
    
  } catch (error) {
    console.error('خطأ في إضافة كوبونات الاختبار:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestPromoCodes() 