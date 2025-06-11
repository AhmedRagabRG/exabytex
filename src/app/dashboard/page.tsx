"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Star,
  CreditCard,
  Package,
  BarChart3,
  Calendar,
  Brain,
  Bot,
  Award,
  TrendingUp,
  Gift,
  FileText,
  Tag,
  Activity,
} from "lucide-react";
import { DateDisplay } from "@/components/ui/date-display";
import ProductManagement from "@/components/admin/ProductManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import PromoCodeManagement from "@/components/admin/PromoCodeManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import OrdersTab from "@/components/dashboard/OrdersTab";
import WishlistTab from "@/components/dashboard/WishlistTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import { toast } from "sonner";
import { HomeServicesManager } from "@/components/dashboard/home-services-manager";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  totalOrders?: number;
  totalSpent?: number;
  savedProducts?: number;
  loyaltyPoints?: number;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalBlogs: number;
  totalRevenue: number;
  recentActivity: unknown[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "orders"
    | "saved"
    | "profile"
    | "products"
    | "categories"
    | "promo-codes"
    | "blog-management"
    | "home-services"
    | "featured-blogs"
  >("overview");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle button clicks
  const handleTabChange = (
    tab:
      | "overview"
      | "orders"
      | "saved"
      | "profile"
      | "products"
      | "categories"
      | "promo-codes"
      | "blog-management"
      | "home-services"
      | "featured-blogs"
  ) => {
    setActiveTab(tab);
  };

  const handleGoToProducts = () => {
    router.push("/products");
  };

  const handleProfileUpdate = (updatedUser: UserData) => {
    setUserData(updatedUser);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  // Fetch dashboard data only for admins/managers after userData is loaded
  useEffect(() => {
    if (userData && (userData.role === "ADMIN" || userData.role === "MANAGER")) {
      fetchDashboardData();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error("فشل في تحميل بيانات المستخدم");
      }
    } catch (error) {
      console.error("خطأ في تحميل بيانات المستخدم:", error);
      toast.error("خطأ في تحميل بيانات المستخدم");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.stats);
      } else {
        console.error("فشل في تحميل إحصائيات لوحة التحكم");
      }
    } catch (error) {
      console.error("خطأ في تحميل إحصائيات لوحة التحكم:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            خطأ في تحميل البيانات
          </h2>
          <p className="text-gray-600 mb-4">لم نتمكن من تحميل بيانات حسابك</p>
          <Button onClick={fetchUserData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  const isAdmin = userData.role === "ADMIN";
  const isManager = userData.role === "MANAGER" || userData.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-gray-600">
                مرحباً بك، {userData.name || userData.email}
              </p>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Badge variant="outline" className="flex items-center">
                <User className="h-4 w-4 ml-1" />
                {userData.role === "ADMIN"
                  ? "مدير النظام"
                  : userData.role === "MANAGER"
                  ? "مدير"
                  : "مستخدم"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => handleTabChange("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="h-4 w-4 inline ml-2" />
              نظرة عامة
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline ml-2" />
              طلباتي
            </button>

            <button
              onClick={() => handleTabChange("saved")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "saved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Heart className="h-4 w-4 inline ml-2" />
              المحفوظات
            </button>

            <button
              onClick={() => handleTabChange("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="h-4 w-4 inline ml-2" />
              الملف الشخصي
            </button>

            {/* Admin/Manager only tabs */}
            {(isManager || isAdmin) && (
              <>
                <button
                  onClick={() => handleTabChange("products")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "products"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Package className="h-4 w-4 inline ml-2" />
                  إدارة المنتجات
                </button>

                <button
                  onClick={() => handleTabChange("categories")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "categories"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Tag className="h-4 w-4 inline ml-2" />
                  إدارة الفئات
                </button>

                <button
                  onClick={() => handleTabChange("promo-codes")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "promo-codes"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Gift className="h-4 w-4 inline ml-2" />
                  أكواد الخصم
                </button>

                <button
                  onClick={() => handleTabChange("blog-management")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "blog-management"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FileText className="h-4 w-4 inline ml-2" />
                  إدارة المقالات
                </button>

                <button
                  onClick={() => handleTabChange("home-services")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "home-services"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Settings className="h-4 w-4 inline ml-2" />
                  إدارة الخدمات
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            user={userData}
            onTabChange={handleTabChange}
            onGoToProducts={handleGoToProducts}
          />
        )}
        {activeTab === "orders" && (
          <OrdersTab onGoToProducts={handleGoToProducts} />
        )}
        {activeTab === "saved" && (
          <WishlistTab onGoToProducts={handleGoToProducts} />
        )}
        {activeTab === "profile" && (
          <ProfileTab user={userData} onProfileUpdate={handleProfileUpdate} />
        )}
        {(isManager || isAdmin) && activeTab === "products" && <ProductManagement />}
        {(isManager || isAdmin) && activeTab === "categories" && <CategoryManagement />}
        {(isManager || isAdmin) && activeTab === "promo-codes" && <PromoCodeManagement />}
        {(isManager || isAdmin) && activeTab === "blog-management" && <BlogManagement />}
        {(isManager || isAdmin) && activeTab === "home-services" && <HomeServicesManager />}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  user,
  onGoToProducts,
}: {
  user: UserData;
  onTabChange: (
    tab:
      | "overview"
      | "orders"
      | "saved"
      | "profile"
      | "products"
      | "categories"
      | "promo-codes"
      | "blog-management"
  ) => void;
  onGoToProducts: () => void;
}) {
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: user.totalOrders?.toString() || "0",
      icon: ShoppingBag,
      color: "blue",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600",
      change: user.totalOrders && user.totalOrders > 0 ? "+12%" : "0%",
      changeType:
        user.totalOrders && user.totalOrders > 0
          ? ("positive" as const)
          : ("neutral" as const),
    },
    {
      title: "إجمالي المبلغ",
      value: `${user.totalSpent?.toLocaleString() || "0"} ج.م`,
      icon: CreditCard,
      color: "green",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      textColor: "text-green-600",
      change: user.totalSpent && user.totalSpent > 0 ? "+8%" : "0%",
      changeType:
        user.totalSpent && user.totalSpent > 0
          ? ("positive" as const)
          : ("neutral" as const),
    },
    {
      title: "المنتجات المحفوظة",
      value: user.savedProducts?.toString() || "0",
      icon: Heart,
      color: "red",
      bgColor: "bg-red-50",
      iconBg: "bg-red-500",
      textColor: "text-red-600",
      change:
        user.savedProducts && user.savedProducts > 0
          ? `+${user.savedProducts}`
          : "0",
      changeType:
        user.savedProducts && user.savedProducts > 0
          ? ("positive" as const)
          : ("neutral" as const),
    },
    {
      title: "نقاط الولاء",
      value: user.loyaltyPoints?.toLocaleString() || "0",
      icon: Star,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-500",
      textColor: "text-yellow-600",
      change:
        user.loyaltyPoints && user.loyaltyPoints > 0
          ? `+${user.loyaltyPoints}`
          : "0",
      changeType:
        user.loyaltyPoints && user.loyaltyPoints > 0
          ? ("positive" as const)
          : ("neutral" as const),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                مرحباً، {user.name || "مستخدم عزيز"}!
              </h2>
              <p className="text-blue-100 mb-3">
                مرحباً بك في لوحة التحكم الذكية. إليك نظرة سريعة على نشاطك.
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-blue-200">
                <Calendar className="h-4 w-4" />
                <span>
                  عضو منذ <DateDisplay date={user.createdAt} />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.bgColor} border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    تم إنشاء الحساب بنجاح
                  </p>
                  <p className="text-xs text-gray-500">
                    <DateDisplay date={user.createdAt} />
                  </p>
                </div>
              </div>

              {user.totalOrders && user.totalOrders > 0 ? (
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      تم تأكيد طلب جديد
                    </p>
                    <p className="text-xs text-gray-500">منذ يومين</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">لا توجد طلبات حتى الآن</p>
                  <Button
                    onClick={onGoToProducts}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    تصفح المنتجات
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Tips */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              نصائح ذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    💡 نصيحة اليوم
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    استخدم ميزة الحفظ للمنتجات التي تهمك لمراجعتها لاحقاً
                    ومقارنة الأسعار.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Award className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    🎯 تحدي الأسبوع
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    أكمل ملفك الشخصي واحصل على نقاط ولاء إضافية وعروض حصرية.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-12 w-full mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
