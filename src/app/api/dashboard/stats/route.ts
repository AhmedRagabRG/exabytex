import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "غير مخول للوصول" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Check if user is admin or manager  
    const isAuthorized = user.role === "ADMIN" || user.role === "MANAGER";

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "غير مخول للوصول" },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalBlogs,
      totalRevenue,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.blogPost.count(),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { total: true },
      }),
    ]);

    // Get recent activity (last 10 orders)
    const recentActivity = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const stats = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalBlogs,
      totalRevenue: totalRevenue._sum.total || 0,
      recentActivity,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("خطأ في جلب إحصائيات لوحة التحكم:", error);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
} 