const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addDiscountedProducts() {
  try {
    // منتجات مع خصومات
    const discountedProducts = [
      {
        title: "نظام إدارة العملاء الذكي - إصدار محدود",
        description: "نظام شامل لإدارة العملاء مع ذكاء اصطناعي متقدم لتحليل سلوك العملاء وتوقع احتياجاتهم",
        price: 2500,
        discountedPrice: 1899,
        hasDiscount: true,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        category: "الأتمتة والتكامل",
        features: JSON.stringify([
          "تحليل سلوك العملاء بالذكاء الاصطناعي",
          "توقع احتياجات العملاء المستقبلية",
          "تكامل مع جميع المنصات",
          "تقارير تحليلية متقدمة",
          "دعم فني على مدار الساعة"
        ]),
        isPopular: true,
        isActive: true
      },
      {
        title: "روبوت محادثة للتجارة الإلكترونية - عرض خاص",
        description: "روبوت محادثة ذكي مصمم خصيصاً للمتاجر الإلكترونية مع قدرات بيع متقدمة",
        price: 1800,
        discountedPrice: 1299,
        hasDiscount: true,
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
        category: "روبوتات المحادثة",
        features: JSON.stringify([
          "معالجة الطلبات تلقائياً",
          "توصيات منتجات ذكية",
          "دعم متعدد اللغات",
          "تتبع المخزون",
          "تحليلات مبيعات متقدمة"
        ]),
        isPopular: true,
        isActive: true
      },
      {
        title: "حملة تسويق رقمي بالذكاء الاصطناعي - خصم كبير",
        description: "حملة تسويقية شاملة تستخدم الذكاء الاصطناعي لاستهداف العملاء المحتملين بدقة عالية",
        price: 3200,
        discountedPrice: 2399,
        hasDiscount: true,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        category: "التسويق الرقمي",
        features: JSON.stringify([
          "استهداف دقيق للعملاء المحتملين",
          "تحسين الإعلانات تلقائياً",
          "تحليل المنافسين",
          "تقارير أداء شاملة",
          "إدارة حملات متعددة المنصات"
        ]),
        isPopular: false,
        isActive: true
      },
      {
        title: "نظام تحليل البيانات المتقدم - سعر مميز",
        description: "منصة تحليل بيانات متطورة تحول البيانات الخام إلى رؤى قابلة للتنفيذ",
        price: 4500,
        discountedPrice: 3199,
        hasDiscount: true,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        category: "الأتمتة والتكامل",
        features: JSON.stringify([
          "تحليل البيانات في الوقت الفعلي",
          "لوحات تحكم تفاعلية",
          "تنبؤات مستقبلية دقيقة",
          "تكامل مع مصادر البيانات المختلفة",
          "أمان متقدم للبيانات"
        ]),
        isPopular: true,
        isActive: true
      },
      {
        title: "مساعد ذكي للمكاتب - عرض محدود",
        description: "مساعد ذكي متكامل لإدارة المهام اليومية وتحسين الإنتاجية في المكاتب",
        price: 1200,
        discountedPrice: 899,
        hasDiscount: true,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
        category: "روبوتات المحادثة",
        features: JSON.stringify([
          "جدولة المواعيد الذكية",
          "إدارة المهام والمشاريع",
          "تذكيرات تلقائية",
          "تكامل مع التقويم",
          "تقارير الإنتاجية"
        ]),
        isPopular: false,
        isActive: true
      }
    ]

    // منتجات بدون خصم
    const regularProducts = [
      {
        title: "استشارة تطوير الأعمال الرقمية",
        description: "جلسة استشارية شاملة مع خبرائنا لتطوير استراتيجية الأعمال الرقمية",
        price: 500,
        hasDiscount: false,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        category: "الاستشارات",
        features: JSON.stringify([
          "تحليل وضع الشركة الحالي",
          "وضع استراتيجية رقمية",
          "خطة تنفيذية مفصلة",
          "متابعة لمدة شهر",
          "تقرير شامل"
        ]),
        isPopular: false,
        isActive: true
      }
    ]

    // إضافة المنتجات
    console.log('🚀 بدء إضافة المنتجات مع الخصومات...')

    for (const product of discountedProducts) {
      const created = await prisma.product.create({
        data: product
      })
      console.log(`✅ تم إضافة منتج مع خصم: ${created.title}`)
      console.log(`   السعر الأصلي: ${created.price} ر.س`)
      console.log(`   السعر بعد الخصم: ${created.discountedPrice} ر.س`)
      console.log(`   نسبة الخصم: ${(((created.price - created.discountedPrice) / created.price) * 100).toFixed(0)}%`)
      console.log(`   المدخرات: ${(created.price - created.discountedPrice)} ر.س`)
      console.log('---')
    }

    for (const product of regularProducts) {
      const created = await prisma.product.create({
        data: product
      })
      console.log(`✅ تم إضافة منتج عادي: ${created.title} - ${created.price} ر.س`)
    }

    console.log('\n🎉 تم إضافة جميع المنتجات بنجاح!')
    console.log(`📊 إجمالي المنتجات مع خصم: ${discountedProducts.length}`)
    console.log(`📊 إجمالي المنتجات عادية: ${regularProducts.length}`)

  } catch (error) {
    console.error('❌ خطأ في إضافة المنتجات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addDiscountedProducts() 