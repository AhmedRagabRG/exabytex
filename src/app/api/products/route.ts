import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from "next-auth";

const prisma = new PrismaClient();

// GET - جلب جميع المنتجات
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
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

    // تحويل features من string إلى array وحساب التقييم المتوسط
    const formattedProducts = products.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        : 0;
      
      return {
        ...product,
        features: JSON.parse(product.features || '[]'),
        averageRating: parseFloat(averageRating.toString()),
        reviewCount: ratings.length
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتجات' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من أن المستخدم مانجر أو أدمن
    if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لإضافة منتجات' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, price, discountedPrice, hasDiscount, image, category, features, isPopular } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: 'جميع البيانات الأساسية مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة بيانات الخصم
    if (hasDiscount && (!discountedPrice || parseFloat(discountedPrice) >= parseFloat(price))) {
      return NextResponse.json(
        { error: 'السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي' },
        { status: 400 }
      );
    }

    // إنشاء المنتج الجديد
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        discountedPrice: hasDiscount ? parseFloat(discountedPrice) : null,
        hasDiscount: Boolean(hasDiscount),
        image: image || '/placeholder-product.jpg',
        category,
        features: JSON.stringify(features || []),
        isPopular: Boolean(isPopular),
        isActive: true,
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      ...product,
      features: JSON.parse(product.features)
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء المنتج' },
      { status: 500 }
    );
  }
} 