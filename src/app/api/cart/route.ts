import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: true, cart: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        product: true
      }
    });

    const cart = cartItems.map(item => ({
      id: item.id, // استخدام cart item ID بدلاً من product ID
      productId: item.product.id,
      name: item.product.title,
      price: item.product.hasDiscount && item.product.discountedPrice !== null ? item.product.discountedPrice : item.product.price,
      quantity: item.quantity,
      image: item.product.image || '/api/placeholder/64/64',
      category: item.product.category,
      description: item.product.description,
      type: item.product.category === 'Digital Currency' ? 'coins' : 'product',
      hasDiscount: item.product.hasDiscount || false,
      discountedPrice: item.product.discountedPrice,
      features: item.product.features
    }));

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ success: true, cart: [] });
  }
}

// Update cart (for localStorage sync) or Add single product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    
    // التحقق من نوع الطلب: إضافة منتج واحد أم مزامنة السلة
    if (body.productId && body.quantity !== undefined) {
      // إضافة منتج واحد للسلة
      const { productId, quantity = 1, price, discountedPrice, hasDiscount } = body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
      }

      // التحقق من وجود المنتج في السلة
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          userId: user.id,
          productId: productId
        }
      });

      if (existingCartItem) {
        // تحديث الكمية والسعر
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { 
            quantity: existingCartItem.quantity + quantity,
            price: price,
            discountedPrice: discountedPrice,
            hasDiscount: hasDiscount
          },
          include: { product: true }
        });

        return NextResponse.json({ success: true, cartItem: updatedCartItem });
      } else {
        // إضافة عنصر جديد
        const cartItem = await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId: productId,
            quantity: quantity,
            price: price,
            discountedPrice: discountedPrice,
            hasDiscount: hasDiscount
          },
          include: { product: true }
        });

        return NextResponse.json({ success: true, cartItem });
      }
    } else if (body.cart && Array.isArray(body.cart)) {
      // مزامنة السلة من localStorage
      const cart = body.cart;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
      }

      // بدلاً من حذف السلة كاملة، دمج العناصر الجديدة مع الموجودة
      for (const item of cart) {
        if (item.type === 'coins') {
          // للكوينز: إنشاء منتج مؤقت أو البحث عن منتج موجود
          let coinProduct = await prisma.product.findFirst({
            where: {
              category: 'Digital Currency',
              title: item.name
            }
          });

          if (!coinProduct) {
            coinProduct = await prisma.product.create({
              data: {
                title: item.name,
                description: item.description || `عملة رقمية - ${item.name}`,
                price: item.price,
                image: item.image || '/api/placeholder/64/64',
                category: 'Digital Currency',
                features: JSON.stringify(['منتج رقمي', 'كوينز', 'فوري']),
                isActive: true
              }
            });
          }

          // التحقق من وجود منتج كوينز مشابه في السلة
          const existingCoinItem = await prisma.cartItem.findFirst({
            where: {
              userId: user.id,
              productId: coinProduct.id
            }
          });

          if (existingCoinItem) {
            // تحديث الكمية إذا كان موجود
            await prisma.cartItem.update({
              where: { id: existingCoinItem.id },
              data: { quantity: existingCoinItem.quantity + (item.quantity || 1) }
            });
          } else {
            // إضافة عنصر جديد
            await prisma.cartItem.create({
              data: {
                userId: user.id,
                productId: coinProduct.id,
                quantity: item.quantity || 1
              }
            });
          }
        } else {
          // للمنتجات العادية
          const product = await prisma.product.findUnique({
            where: { id: item.id }
          });

          if (product) {
            // التحقق من وجود المنتج في السلة
            const existingItem = await prisma.cartItem.findFirst({
              where: {
                userId: user.id,
                productId: product.id
              }
            });

            if (existingItem) {
              // تحديث الكمية إذا كان موجود
              await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + (item.quantity || 1) }
              });
            } else {
              // إضافة عنصر جديد
              await prisma.cartItem.create({
                data: {
                  userId: user.id,
                  productId: product.id,
                  quantity: item.quantity || 1
                }
              });
            }
          }
        }
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'بيانات السلة غير صحيحة' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ السلة' },
      { status: 500 }
    );
  }
}

// Add single item to cart (for backward compatibility)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مسموح' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1, coinAmount } = body;

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // إذا كان المنتج كوينز
    if (coinAmount) {
      const coinProduct = await prisma.product.create({
        data: {
          title: `${coinAmount} كوين`,
          description: `باقة ${coinAmount} كوين لاستخدام مولد المحتوى بالذكاء الاصطناعي - رقمي`,
          price: coinAmount * 0.10,
          image: '/api/placeholder/64/64',
          category: 'Digital Currency',
          features: JSON.stringify(['منتج رقمي', 'كوينز', 'فوري']),
          isActive: true
        }
      });

      const cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: coinProduct.id,
          quantity: 1
        },
        include: {
          product: true
        }
      });

      return NextResponse.json({ success: true, cartItem });
    }

    // للمنتجات العادية
    if (!productId) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    // التحقق من وجود المنتج في السلة
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: productId
      }
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: { product: true }
      });

      return NextResponse.json({ success: true, cartItem: updatedCartItem });
    } else {
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: true
        }
      });

      return NextResponse.json({ success: true, cartItem });
    }
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إضافة المنتج للسلة' },
      { status: 500 }
    );
  }
} 