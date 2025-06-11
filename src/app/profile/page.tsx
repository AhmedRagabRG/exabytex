'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  Settings,
  FileText,
  BarChart3,
  ShoppingCart,
  Heart,
  BookOpen,
  Users,
  CheckCircle
} from 'lucide-react';
import { BlogManagement } from '@/components/admin/BlogManagement';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  createdAt: string;
  _count: {
    orders: number;
    cartItems: number;
    wishlistItems: number;
    authoredBlogs: number;
    approvedBlogs: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!session || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">فشل في تحميل البيانات</div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'MANAGER':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'مدير عام';
      case 'MANAGER':
        return 'مدير';
      default:
        return 'مستخدم';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            الملف الشخصي
          </h1>
          <p className="text-gray-300 text-lg">إدارة حسابك ومعلوماتك الشخصية</p>
        </div>

        {/* معلومات المستخدم */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                {userProfile.image ? (
                  <Image src={userProfile.image} alt="Profile" width={64} height={64} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                  <Badge className={getRoleColor(userProfile.role)}>
                    <Shield className="h-3 w-3 ml-1" />
                    {getRoleLabel(userProfile.role)}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userProfile.email}
                  </div>
                  {userProfile.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {userProfile.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    عضو منذ {new Date(userProfile.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.orders}</div>
              <div className="text-sm text-gray-300">طلبات</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.wishlistItems}</div>
              <div className="text-sm text-gray-300">المفضلة</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.authoredBlogs}</div>
              <div className="text-sm text-gray-300">مقالات</div>
            </CardContent>
          </Card>

          {(userProfile.role === 'MANAGER' || userProfile.role === 'ADMIN') && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProfile._count.approvedBlogs}</div>
                <div className="text-sm text-gray-300">موافقات</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="my-blogs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 ml-2" />
              مقالاتي
            </TabsTrigger>
            {(userProfile.role === 'MANAGER' || userProfile.role === 'ADMIN') && (
              <TabsTrigger value="blog-management" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 ml-2" />
                إدارة المقالات
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">نظرة عامة على الحساب</CardTitle>
                <CardDescription className="text-gray-300">
                  ملخص نشاطك على المنصة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">الأنشطة الأخيرة</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>• آخر تسجيل دخول: اليوم</p>
                      <p>• عدد المقالات المكتوبة: {userProfile._count.authoredBlogs}</p>
                      <p>• عدد الطلبات: {userProfile._count.orders}</p>
                      {(userProfile.role === 'MANAGER' || userProfile.role === 'ADMIN') && (
                        <p>• عدد المقالات المراجعة: {userProfile._count.approvedBlogs}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-3">إجراءات سريعة</h3>
                    <div className="space-y-2">
                      <Link href="/blog/write">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <FileText className="h-4 w-4 ml-2" />
                          كتابة مقال جديد
                        </Button>
                      </Link>
                      <Link href="/store">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <ShoppingCart className="h-4 w-4 ml-2" />
                          تصفح المتجر
                        </Button>
                      </Link>
                      <Link href="/blog">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <BookOpen className="h-4 w-4 ml-2" />
                          قراءة المقالات
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">إعدادات الحساب</CardTitle>
                <CardDescription className="text-gray-300">
                  إدارة معلوماتك الشخصية وإعدادات الحساب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-300 py-8">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>صفحة الإعدادات قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-blogs">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">مقالاتي</CardTitle>
                <CardDescription className="text-gray-300">
                  جميع المقالات التي كتبتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-300 py-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>عرض مقالاتك الشخصية قيد التطوير</p>
                  <Link href="/blog/write">
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      اكتب مقال جديد
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {(userProfile.role === 'MANAGER' || userProfile.role === 'ADMIN') && (
            <TabsContent value="blog-management">
              <BlogManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
} 