'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  BarChart3,
  ShoppingCart,
  Heart,
  BookOpen,
  CheckCircle,
  CreditCard,
} from 'lucide-react';
import { BlogManagement } from '@/components/admin/BlogManagement';
import { CurrencySettings } from '@/components/CurrencySettings';

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
        console.log('📊 البيانات الكاملة من API:', data);
        
        if (data.success && data.user) {
          const userData = data.user;
          console.log('📊 بيانات المستخدم:', userData);
          console.log('🛡️ دور المستخدم:', userData.role);
          console.log('🔍 هل هو مدير؟', userData.role === 'ADMIN' || userData.role === 'MANAGER');
          
          // تحويل البيانات للـ format المطلوب
          const profileData = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            image: userData.image,
            role: userData.role,
            createdAt: userData.createdAt,
            _count: {
              orders: userData.totalOrders || 0,
              cartItems: 0, // سيتم إضافتها لاحقاً
              wishlistItems: userData.savedProducts || 0,
              authoredBlogs: 0, // سيتم إضافتها لاحقاً
              approvedBlogs: 0, // سيتم إضافتها لاحقاً
            }
          };
          
          setUserProfile(profileData);
        }
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
              <div className="text-gray-400 text-sm">الطلبات</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.wishlistItems}</div>
              <div className="text-gray-400 text-sm">المفضلة</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.authoredBlogs}</div>
              <div className="text-gray-400 text-sm">المقالات</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProfile._count.approvedBlogs}</div>
              <div className="text-gray-400 text-sm">المعتمدة</div>
            </CardContent>
          </Card>
        </div>

        {/* محتوى الملف الشخصي */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-white/20">الطلبات</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">الإعدادات</TabsTrigger>
              {(userProfile?.role === 'ADMIN' || userProfile?.role === 'MANAGER') && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-white/20">
                  <Shield className="h-4 w-4 mr-2" />
                  إدارة
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <User className="h-5 w-5" />
                      المعلومات الشخصية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">الاسم</Label>
                      <div className="text-white">{userProfile.name}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">البريد الإلكتروني</Label>
                      <div className="text-white">{userProfile.email}</div>
                    </div>
                    {userProfile.phone && (
                      <div>
                        <Label className="text-gray-300">رقم الهاتف</Label>
                        <div className="text-white">{userProfile.phone}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart3 className="h-5 w-5" />
                      إحصائيات النشاط
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">إجمالي الطلبات</span>
                      <span className="text-white font-bold">{userProfile._count.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">العناصر المفضلة</span>
                      <span className="text-white font-bold">{userProfile._count.wishlistItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">المقالات المكتوبة</span>
                      <span className="text-white font-bold">{userProfile._count.authoredBlogs}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShoppingCart className="h-5 w-5" />
                    طلباتي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-400 py-8">
                    لا توجد طلبات بعد
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="h-5 w-5" />
                      إعدادات الحساب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                      تعديل المعلومات الشخصية
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                      تغيير كلمة المرور
                    </Button>
                    <Button variant="destructive" className="w-full">
                      حذف الحساب
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <CreditCard className="h-5 w-5" />
                      إعدادات العملة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CurrencySettings />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {(userProfile.role === 'ADMIN' || userProfile.role === 'MANAGER') && (
              <TabsContent value="admin" className="space-y-4 mt-6">
                <BlogManagement />
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
} 