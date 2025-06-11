const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "أدوات الذكاء الاصطناعي",
    description: "تطبيقات وأدوات الذكاء الاصطناعي المتقدمة",
    icon: "Bot"
  },
  {
    name: "الاستشارات",
    description: "استشارات تقنية ورقمية متخصصة",
    icon: "Settings"
  },
  {
    name: "التدريب والتطوير",
    description: "دورات ومناهج تدريبية في التكنولوجيا",
    icon: "Star"
  },
  {
    name: "تطوير الويب",
    description: "حلول تطوير المواقع والتطبيقات",
    icon: "Zap"
  },
  {
    name: "التسويق الرقمي",
    description: "خدمات التسويق والإعلان الرقمي",
    icon: "Rocket"
  },
  {
    name: "حلول الأعمال",
    description: "أنظمة وحلول إدارة الأعمال",
    icon: "Package"
  }
];

async function addDefaultCategories() {
  try {
    console.log('🚀 بدء إضافة الفئات الافتراضية...');

    for (const categoryData of defaultCategories) {
      // التحقق من وجود الفئة
      const existingCategory = await prisma.category.findUnique({
        where: { name: categoryData.name }
      });

      if (!existingCategory) {
        const category = await prisma.category.create({
          data: categoryData
        });
        console.log(`✅ تم إضافة فئة: ${category.name}`);
      } else {
        console.log(`ℹ️  الفئة موجودة بالفعل: ${categoryData.name}`);
      }
    }

    console.log('🎉 تم إنجاز إضافة الفئات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في إضافة الفئات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDefaultCategories(); 