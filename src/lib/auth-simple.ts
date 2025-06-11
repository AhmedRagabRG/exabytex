import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Starting authentication for:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          console.log('❌ User not found:', credentials.email)
          return null
        }

        if (!user.password) {
          console.log('❌ User has no password:', credentials.email)
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.log('❌ Invalid password for:', credentials.email)
          return null
        }

        console.log('✅ Authentication successful for:', credentials.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async signIn({ user, account }: any) {
      console.log('🔑 SignIn callback - User:', user?.email, 'Account:', account?.provider)
      
      // For OAuth providers (Google, Discord), create user if not exists
      if (account?.provider !== 'credentials' && user?.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: user.image,
                role: 'USER'
              }
            })
            console.log('✅ New OAuth user created:', user.email)
          } else {
            console.log('✅ OAuth user exists:', user.email)
          }
        } catch (error) {
          console.error('❌ Error handling OAuth user:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user }: any) {
      console.log('🎫 JWT callback - User:', user?.email, 'Token:', !!token)
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        return {
          ...token,
          id: dbUser?.id || user.id,
          role: dbUser?.role || 'USER',
          image: user.image,
        }
      }
      
      return token
    },
    async session({ session, token }: any) {
      console.log('📝 Session callback - Session:', !!session, 'Token:', !!token)
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          image: token.image as string,
        }
      }
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  debug: true, // Enable debug mode to see what's happening
} 