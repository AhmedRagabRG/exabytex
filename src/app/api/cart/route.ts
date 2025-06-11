import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Session } from "next-auth"

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // تحويل features من JSON string إلى array
    const formattedCartItems = cartItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        features: JSON.parse(item.product.features || '[]')
      }
    }))

    const total = formattedCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    return NextResponse.json({ cartItems: formattedCartItems, total })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    let cartItem
    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: { product: true }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: quantity
        },
        include: { product: true }
      })
    }

    // تحويل features من JSON string إلى array
    const formattedCartItem = {
      ...cartItem,
      product: {
        ...cartItem.product,
        features: JSON.parse(cartItem.product.features || '[]')
      }
    }

    return NextResponse.json({ 
      message: "تمت إضافة المنتج إلى السلة",
      cartItem: formattedCartItem 
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
} 