import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Session } from "next-auth"
  
export async function GET() {
  try {
    const services = await prisma.homeService.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching home services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home services' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const service = await prisma.homeService.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        features: JSON.stringify(data.features),
        icon: data.icon,
        gradient: data.gradient,
        bgGradient: data.bgGradient,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true
      }
    })
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating home service:', error)
    return NextResponse.json(
      { error: 'Failed to create home service' },
      { status: 500 }
    )
  }
} 