const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const email = 'ahmed@test.com';
    
    console.log(`🔄 تحديث صلاحيات المستخدم ${email} إلى MANAGER...`);
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'MANAGER' }
    });
    
    console.log(`✅ تم تحديث صلاحيات ${user.name} إلى MANAGER بنجاح!`);
    
  } catch (error) {
    console.error('❌ خطأ في تحديث الصلاحيات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 