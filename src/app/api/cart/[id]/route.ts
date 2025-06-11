import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Session } from "next-auth"

// Update cart item quantity
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "الكمية يجب أن تكون أكبر من صفر" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    // Check if cart item exists and belongs to user
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingCartItem) {
      return NextResponse.json({ error: "عنصر السلة غير موجود" }, { status: 404 })
    }

    if (existingCartItem.userId !== user.id) {
      return NextResponse.json({ error: "غير مصرح بتحديث هذا العنصر" }, { status: 403 })
    }

    // Update cart item
    const cartItem = await prisma.cartItem.update({
      where: { id: resolvedParams.id },
      data: { quantity },
      include: { product: true }
    })

    // تحويل features من JSON string إلى array
    const formattedCartItem = {
      ...cartItem,
      product: {
        ...cartItem.product,
        features: JSON.parse(cartItem.product.features || '[]')
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "تم تحديث الكمية",
      cartItem: formattedCartItem 
    })
  } catch (error) {
    console.error("Update cart item error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}

// Remove cart item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
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

    // First check if the cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "عنصر السلة غير موجود" }, { status: 404 })
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json({ error: "غير مصرح بحذف هذا العنصر" }, { status: 403 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true, message: "تم حذف المنتج من السلة" })
  } catch (error) {
    console.error("Delete cart item error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
} 