const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    title: "نظام إدارة المحتوى الذكي",
    description: "نظام متطور لإدارة المحتوى بتقنيات الذكاء الاصطناعي لتحسين تجربة المستخدم وإدارة المحتوى بكفاءة عالية",
    price: 2999.99,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "أدوات الذكاء الاصطناعي",
    features: JSON.stringify([
      "إدارة المحتوى بالذكاء الاصطناعي",
      "تحليل سلوك المستخدمين",
      "تحسين تجربة المستخدم",
      "إدارة متعددة الأنظمة",
      "تقارير تحليلية متقدمة",
      "دعم فني 24/7"
    ]),
    isPopular: true,
    isActive: true
  },
  {
    title: "استشارة رقمية شاملة",
    description: "خدمة استشارية متكاملة لتطوير استراتيجية رقمية فعالة وتحسين الأداء التقني للمؤسسات",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=300&fit=crop",
    category: "الاستشارات",
    features: JSON.stringify([
      "تحليل الوضع الحالي",
      "استراتيجية رقمية مخصصة",
      "خطة تنفيذ مفصلة",
      "متابعة وتقييم الأداء",
      "تدريب الفرق",
      "دعم مستمر لمدة 6 أشهر"
    ]),
    isPopular: false,
    isActive: true
  },
  {
    title: "برنامج تدريبي في الذكاء الاصطناعي",
    description: "برنامج تدريبي شامل لتعلم تطبيقات الذكاء الاصطناعي في الأعمال والحصول على شهادة معتمدة",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    category: "التدريب",
    features: JSON.stringify([
      "40 ساعة تدريبية",
      "مشاريع عملية متقدمة",
      "شهادة معتمدة",
      "ورش عمل تفاعلية",
      "دعم المدربين",
      "وصول مدى الحياة للمحتوى"
    ]),
    isPopular: true,
    isActive: true
  },
  {
    title: "تطوير تطبيق ويب مخصص",
    description: "خدمة تطوير تطبيقات ويب متطورة ومخصصة بأحدث التقنيات وأفضل الممارسات في البرمجة",
    price: 4999.99,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    category: "التطوير",
    features: JSON.stringify([
      "تصميم UX/UI متقدم",
      "برمجة full-stack",
      "قاعدة بيانات محسنة",
      "أمان متطور",
      "استضافة سحابية",
      "صيانة لمدة سنة"
    ]),
    isPopular: false,
    isActive: true
  },
  {
    title: "روبوت المحادثة الذكي",
    description: "روبوت محادثة متطور بتقنيات الذكاء الاصطناعي لخدمة العملاء والدعم الفني على مدار الساعة",
    price: 1999.99,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    category: "أدوات الذكاء الاصطناعي",
    features: JSON.stringify([
      "دعم متعدد اللغات",
      "تعلم آلي مستمر",
      "تكامل مع المنصات",
      "تحليل المشاعر",
      "إحصائيات مفصلة",
      "واجهة سهلة الاستخدام"
    ]),
    isPopular: true,
    isActive: true
  },
  {
    title: "استشارة أمان سيبراني",
    description: "خدمة استشارية متخصصة لتقييم وتحسين الأمان السيبراني وحماية البيانات والأنظمة",
    price: 1799.99,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    category: "الاستشارات",
    features: JSON.stringify([
      "تقييم شامل للأمان",
      "تحديد نقاط الضعف",
      "خطة أمان مخصصة",
      "تدريب الموظفين",
      "مراقبة مستمرة",
      "تقارير دورية"
    ]),
    isPopular: false,
    isActive: true
  }
];

async function seedProducts() {
  console.log('🌱 بدء إضافة المنتجات التجريبية...');

  try {
    // حذف المنتجات الموجودة
    await prisma.product.deleteMany({});
    console.log('✅ تم حذف المنتجات الموجودة');

    // إضافة المنتجات الجديدة
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ تم إضافة منتج: ${product.title}`);
    }

    console.log(`🎉 تم إضافة ${sampleProducts.length} منتج بنجاح!`);
    
  } catch (error) {
    console.error('❌ خطأ في إضافة المنتجات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts(); 