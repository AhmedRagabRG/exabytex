import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // فحص وجود مستخدم مدير
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      console.log('✅ يوجد مستخدم مدير بالفعل:', existingAdmin.email);
      return;
    }

    // إنشاء كلمة مرور مشفرة
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // إنشاء مستخدم مدير جديد
    const admin = await prisma.user.create({
      data: {
        name: 'مدير الموقع',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+966501234567'
      }
    });

    console.log('🎉 تم إنشاء مستخدم مدير جديد:');
    console.log('📧 البريد الإلكتروني:', admin.email);
    console.log('🔑 كلمة المرور: admin123');
    console.log('👤 الاسم:', admin.name);
    console.log('🛡️ الدور:', admin.role);

    // إنشاء إعدادات افتراضية للموقع
    const existingSettings = await prisma.siteSettings.findFirst();
    
    if (!existingSettings) {
      await prisma.siteSettings.create({
        data: {
          siteName: 'AI Agency',
          siteDescription: 'وكالة متخصصة في الذكاء الاصطناعي والتسويق الرقمي',
          defaultCurrency: 'SAR',
          currencySymbol: 'ر.س',
          currencyPosition: 'after',
          decimalPlaces: 2,
          updatedById: admin.id
        }
      });
      console.log('⚙️ تم إنشاء إعدادات الموقع الافتراضية');
    }

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم المدير:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 