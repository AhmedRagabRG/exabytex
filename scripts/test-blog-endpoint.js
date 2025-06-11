async function testBlogEndpoint() {
  console.log('🧪 اختبار Blog API endpoint...');
  
  const testData = {
    title: 'مقال اختبار API',
    excerpt: 'ملخص مقال اختبار API',
    content: 'محتوى مقال اختبار API للتأكد من عمل endpoint بشكل صحيح',
    coverImage: '',
    tags: ['api', 'اختبار']
  };
  
  try {
    console.log('📤 إرسال طلب POST إلى /api/blogs...');
    console.log('📄 البيانات:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 استلام استجابة...');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    const result = await response.json();
    console.log('📄 البيانات المرجعة:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ نجح الطلب!');
    } else {
      console.log('❌ فشل الطلب!');
      console.log('🔍 الخطأ:', result.error);
    }
    
  } catch (error) {
    console.error('💥 خطأ في الاتصال:', error.message);
  }
}

async function testGetBlogs() {
  console.log('\n🧪 اختبار جلب المقالات...');
  
  try {
    const response = await fetch('http://localhost:3000/api/blogs?status=ALL');
    console.log('📊 Status:', response.status);
    
    const result = await response.json();
    console.log('📊 عدد المقالات:', result.blogs?.length || 0);
    
    if (result.blogs && result.blogs.length > 0) {
      console.log('✅ تم جلب المقالات بنجاح!');
      result.blogs.slice(0, 3).forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title} (${blog.status})`);
      });
    } else {
      console.log('⚠️ لا توجد مقالات');
    }
    
  } catch (error) {
    console.error('💥 خطأ في جلب المقالات:', error.message);
  }
}

async function main() {
  await testGetBlogs();
  await testBlogEndpoint();
}

main(); 