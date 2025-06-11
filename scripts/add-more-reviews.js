const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addMoreReviews() {
  try {
    console.log('🌱 إضافة مراجعات إضافية...')

    // إنشاء مستخدمين تجريبيين إضافيين
    const users = [
      { name: 'سارة أحمد', email: 'sara@example.com' },
      { name: 'محمد علي', email: 'mohamed@example.com' },
      { name: 'فاطمة خالد', email: 'fatima@example.com' }
    ]

    for (const userData of users) {
      let user = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            role: 'USER'
          }
        })
        console.log(`✅ تم إنشاء مستخدم: ${user.name}`)
      }
    }

    // الحصول على جميع المنتجات
    const products = await prisma.product.findMany()
    const allUsers = await prisma.user.findMany()

    // مراجعات إضافية متنوعة
    const additionalReviews = [
      {
        userEmail: 'sara@example.com',
        productTitle: 'نظام إدارة المحتوى الذكي',
        rating: 4,
        comment: 'منتج جيد جداً وسهل الاستخدام. ساعدني في تنظيم محتوى موقعي بطريقة احترافية. أنصح به.'
      },
      {
        userEmail: 'mohamed@example.com',
        productTitle: 'برنامج تدريبي في الذكاء الاصطناعي',
        rating: 5,
        comment: 'أفضل برنامج تدريبي جربته! المحتوى عملي والشرح واضح. اكتسبت مهارات قيمة في مجال الذكاء الاصطناعي.'
      },
      {
        userEmail: 'fatima@example.com',
        productTitle: 'تطوير تطبيق ويب مخصص',
        rating: 5,
        comment: 'خدمة ممتازة! الفريق محترف والنتيجة فاقت توقعاتي. تم تسليم المشروع في الوقت المحدد وبجودة عالية.'
      },
      {
        userEmail: 'sara@example.com',
        productTitle: 'روبوت المحادثة الذكي',
        rating: 4,
        comment: 'روبوت ذكي ومفيد لخدمة العملاء. سهل التخصيص ويفهم الاستفسارات بشكل جيد. تحسن من تجربة العملاء.'
      },
      {
        userEmail: 'mohamed@example.com',
        productTitle: 'استشارة أمان سيبراني',
        rating: 5,
        comment: 'استشارة شاملة ومفيدة جداً. ساعدتني في تأمين أنظمتي وحماية بياناتي. خبرة عالية في المجال.'
      }
    ]

    for (const reviewData of additionalReviews) {
      const user = allUsers.find(u => u.email === reviewData.userEmail)
      const product = products.find(p => p.title === reviewData.productTitle)

      if (!user || !product) {
        console.log(`⚠️ تجاهل مراجعة - مستخدم أو منتج غير موجود`)
        continue
      }

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
        console.log(`⚠️ مراجعة موجودة بالفعل من ${user.name} للمنتج: ${product.title}`)
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

      console.log(`✅ تم إضافة مراجعة من ${user.name} للمنتج: ${product.title} (${reviewData.rating}/5)`)
    }

    console.log('🎉 تم الانتهاء من إضافة المراجعات الإضافية!')

  } catch (error) {
    console.error('❌ خطأ:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addMoreReviews() 