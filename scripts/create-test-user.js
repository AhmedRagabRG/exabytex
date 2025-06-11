const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('🔍 التحقق من المستخدم الموجود...')
    
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" }
    })
    
    if (existingUser) {
      console.log('✅ المستخدم موجود بالفعل:', existingUser.name)
      return existingUser
    }
    
    console.log('➕ إنشاء مستخدم جديد...')
    const user = await prisma.user.create({
      data: {
        name: 'Ahmed Test',
        email: 'admin@example.com',
        role: 'MANAGER'
      }
    })
    
    console.log('🎉 تم إنشاء المستخدم بنجاح:', user.name)
    return user
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 