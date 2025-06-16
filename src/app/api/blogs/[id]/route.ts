import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - جلب مقال واحد بالـ ID أو slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // البحث عن المقال بالـ ID أو slug
    const blog = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        comments: {
          where: {
            isApproved: true,
            parentId: null
          },
          select: {
            id: true,
            content: true,
            authorId: true,
            authorName: true,
            authorAvatar: true,
            createdAt: true,
            replies: {
              where: {
                isApproved: true
              },
              select: {
                id: true,
                content: true,
                authorId: true,
                authorName: true,
                authorAvatar: true,
                createdAt: true
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!blog) {
      return NextResponse.json(
        { 
          success: false,
          error: "المقال غير موجود" 
        },
        { status: 404 }
      )
    }

    // تحويل tags من string إلى array
    const formattedBlog = {
      ...blog,
      tags: JSON.parse(blog.tags || '[]')
    }

    return NextResponse.json({
      success: true,
      data: formattedBlog
    })

  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "حدث خطأ في جلب المقال" 
      },
      { status: 500 }
    )
  }
}

// PUT - تحديث مقال
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const {
      title,
      content,
      excerpt,
      slug,
      coverImage,
      tags,
      featured,
      published,
      status
    } = body

    // البحث عن المقال الموجود
    const existingBlog = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { 
          success: false,
          error: "المقال غير موجود" 
        },
        { status: 404 }
      )
    }

    // إعداد البيانات للتحديث
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (tags !== undefined) updateData.tags = JSON.stringify(Array.isArray(tags) ? tags : [])
    if (featured !== undefined) updateData.featured = featured
    if (published !== undefined) {
      updateData.published = published
      if (published && !existingBlog.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }
    if (status !== undefined) updateData.status = status

    // التحقق من slug إذا تم تغييره
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug }
      })
      
      if (slugExists) {
        return NextResponse.json(
          { 
            success: false,
            error: "رابط المقال موجود بالفعل" 
          },
          { status: 400 }
        )
      }
      
      updateData.slug = slug
    }

    // تحديث المقال
    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // تحويل tags من string إلى array
    const formattedBlog = {
      ...updatedBlog,
      tags: JSON.parse(updatedBlog.tags || '[]')
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث المقال بنجاح",
      data: formattedBlog
    })

  } catch (error) {
    console.error("Error updating blog:", error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false,
          error: "رابط المقال موجود بالفعل" 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: "حدث خطأ في تحديث المقال" 
      },
      { status: 500 }
    )
  }
}

// DELETE - حذف مقال
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // التحقق من وجود المقال
    const existingBlog = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { 
          success: false,
          error: "المقال غير موجود" 
        },
        { status: 404 }
      )
    }

    // حذف المقال
    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "تم حذف المقال بنجاح"
    })

  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "حدث خطأ في حذف المقال" 
      },
      { status: 500 }
    )
  }
} 