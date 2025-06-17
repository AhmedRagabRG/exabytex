import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - جلب جميع المنتجات
export async function GET() {
  try {
    console.log('Fetching products: Starting...');
    
    const session = await getServerSession(authOptions);
    console.log('Auth session:', session ? 'Found' : 'Not found');
    
    if (!session?.user) {
      console.log('Auth error: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Querying database for products...');
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        // إخفاء منتجات الكوينز من المتجر
        NOT: {
          category: 'Digital Currency'
        }
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Found ${products.length} products`);

    // تحويل features من string إلى array وحساب التقييم المتوسط
    console.log('Processing products data...');
    const formattedProducts = products.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        : 0;
      
      // معالجة آمنة لـ features
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(product.features || '[]');
      } catch (error) {
        console.warn(`Warning: Could not parse features for product ${product.id}:`, error);
        // إذا لم يكن JSON صحيح، تحويل النص إلى array
        if (product.features && typeof product.features === 'string') {
          parsedFeatures = [product.features];
        } else {
          parsedFeatures = [];
        }
      }
      
      return {
        ...product,
        features: parsedFeatures,
        averageRating: parseFloat(averageRating.toString()),
        reviewCount: ratings.length
      };
    });

    console.log('Successfully processed all products');
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - إضافة منتج جديد (للمدراء فقط)
export async function POST(req: Request) {
  try {
    console.log('Creating new product: Starting...');
    
    const session = await getServerSession(authOptions);
    console.log('Auth session:', {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      } : null
    });
    
    if (!session?.user) {
      console.log('Auth error: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // التحقق من صلاحيات المستخدم
    console.log('Checking user permissions...');
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true }
    });

    console.log('User from database:', user);

    if (!user || user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      console.log('Permission denied: User is not admin');
      return NextResponse.json({ 
        error: 'Forbidden',
        details: 'You do not have permission to perform this action. Current role: ' + (user?.role || 'unknown')
      }, { status: 403 });
    }

    const body = await req.json();
    console.log('Received product data:', { ...body, features: body.features?.length || 0 });
    
    const { 
      title, 
      description, 
      price, 
      discountedPrice,
      hasDiscount,
      image, 
      category,
      features,
      isPopular,
      emailSubject, 
      emailContent,
      downloadUrl 
    } = body;

    console.log('Creating product in database...');
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        hasDiscount: hasDiscount || false,
        image,
        category,
        features: Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]),
        isPopular: isPopular || false,
        isActive: true,
        emailSubject,
        emailContent,
        downloadUrl,
        createdById: session.user.id
      },
    });

    console.log('Product created successfully:', product.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 