const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBlogCreation() {
  console.log('🧪 اختبار إنشاء مقال مباشرة في قاعدة البيانات...');
  
  try {
    // البحث عن المستخدم
    const user = await prisma.user.findFirst({
      where: {
        role: 'MANAGER'
      }
    });
    
    if (!user) {
      console.log('❌ لا يوجد مستخدم بصلاحية MANAGER');
      return;
    }
    
    console.log('👤 المستخدم المستخدم:', user.name, user.email);
    
    // بيانات المقال التجريبي
    const blogData = {
      title: 'مقال اختبار من Script',
      content: 'هذا محتوى مقال اختبار تم إنشاؤه مباشرة من script للتأكد من أن قاعدة البيانات تعمل بشكل صحيح.',
      excerpt: 'ملخص مقال الاختبار',
      slug: 'test-blog-from-script-' + Date.now(),
      coverImage: null,
      authorId: user.id,
      authorName: user.name || user.email || 'كاتب مجهول',
      authorAvatar: user.image || null,
      tags: JSON.stringify(['اختبار', 'script']),
      status: 'PUBLISHED',
      published: true,
      publishedAt: new Date(),
      approvedById: user.id
    };
    
    console.log('📝 بيانات المقال:', blogData);
    
    // إنشاء المقال
    const blog = await prisma.blogPost.create({
      data: blogData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    console.log('✅ تم إنشاء المقال بنجاح!');
    console.log('📄 ID:', blog.id);
    console.log('📄 العنوان:', blog.title);
    console.log('📄 الحالة:', blog.status);
    console.log('📄 منشور:', blog.published);
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المقال:', error);
    console.error('تفاصيل الخطأ:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

async function listBlogs() {
  console.log('\n📋 قائمة المقالات الموجودة:');
  
  try {
    const blogs = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (blogs.length === 0) {
      console.log('لا توجد مقالات');
      return;
    }
    
    blogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title}`);
      console.log(`   المؤلف: ${blog.authorName} (${blog.author.email})`);
      console.log(`   الحالة: ${blog.status}`);
      console.log(`   منشور: ${blog.published}`);
      console.log(`   تاريخ الإنشاء: ${blog.createdAt.toLocaleString('ar-SA')}`);
      console.log('   ---');
    });
    
    console.log(`\n📊 المجموع: ${blogs.length} مقال`);
    
  } catch (error) {
    console.error('❌ خطأ في جلب المقالات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await listBlogs();
  await testBlogCreation();
  await listBlogs();
}

main(); 