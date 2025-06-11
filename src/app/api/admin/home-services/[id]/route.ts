import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { serverAuthOptions } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { Session } from "next-auth"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(serverAuthOptions) as Session
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const resolvedParams = await params
    
    const service = await prisma.homeService.update({
      where: { id: resolvedParams.id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        features: JSON.stringify(data.features),
        icon: data.icon,
        gradient: data.gradient,
        bgGradient: data.bgGradient,
        sortOrder: data.sortOrder,
        isActive: data.isActive
      }
    })
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating home service:', error)
    return NextResponse.json(
      { error: 'Failed to update home service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(serverAuthOptions) as Session
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    await prisma.homeService.delete({
      where: { id: resolvedParams.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting home service:', error)
    return NextResponse.json(
      { error: 'Failed to delete home service' },
      { status: 500 }
    )
  }
} 