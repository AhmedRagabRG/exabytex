const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserRole() {
  console.log('🔧 تحديث دور المستخدم...');

  try {
    // البحث عن أول مستخدم وتحديث دوره إلى MANAGER
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('❌ لا يوجد مستخدمين في قاعدة البيانات');
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'MANAGER' }
    });

    console.log(`✅ تم تحديث دور المستخدم ${user.email} إلى MANAGER`);
    
  } catch (error) {
    console.error('❌ خطأ في تحديث دور المستخدم:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole(); 