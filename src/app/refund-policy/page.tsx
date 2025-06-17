"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  RefreshCw, 
  CreditCard, 
  Clock, 
  FileText, 
  Mail, 
  Phone,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Zap
} from 'lucide-react'

export default function RefundPolicyPage() {
  const refundConditions = [
    {
      icon: CheckCircle,
      title: "المنتجات الرقمية",
      description: "تطبيقات الذكاء الاصطناعي والبرمجيات",
      conditions: [
        "طلب الاسترداد خلال 7 أيام من الشراء",
        "وجود خلل تقني لا يمكن إصلاحه",
        "عدم توافق المنتج مع المتطلبات المذكورة"
      ],
      timeframe: "7 أيام",
      refundRate: "100%"
    },
    {
      icon: Zap,
      title: "الخدمات الاستشارية",
      description: "الاستشارات والتحليلات المخصصة",
      conditions: [
        "عدم تقديم الخدمة في الوقت المحدد",
        "عدم مطابقة الخدمة للمواصفات المتفق عليها",
        "طلب الإلغاء قبل بدء العمل",
        "عدم رضا العميل عن جودة الخدمة (بشروط)"
      ],
      timeframe: "48 ساعة",
      refundRate: "جزئي أو كامل"
    },
    {
      icon: Shield,
      title: "الاشتراكات الشهرية",
      description: "خدمات الصيانة والدعم المستمر",
      conditions: [
        "إلغاء الاشتراك قبل تجديد الدورة القادمة",
        "عدم استخدام الخدمة لأكثر من 30% من المدة",
        "خلل تقني مستمر في الخدمة",
        "عدم توفر الميزات المعلن عنها"
      ],
      timeframe: "حتى نهاية الدورة",
      refundRate: "تناسبي"
    }
  ]

  const nonRefundableItems = [
    "الخدمات المخصصة التي تم إنجازها بالكامل",
    "المنتجات التي تم تنزيلها واستخدامها",
    "الاستشارات التي تم تقديمها",
    "رسوم المعالجة والخدمات الخارجية",
    "الخدمات المجانية أو العروض الترويجية"
  ]

  const refundProcess = [
    {
      step: 1,
      title: "تقديم الطلب",
      description: "أرسل طلب استرداد عبر البريد الإلكتروني أو نموذج التواصل",
      timeframe: "فوري"
    },
    {
      step: 2,
      title: "المراجعة والتقييم",
      description: "نراجع طلبك والتحقق من استيفاء الشروط",
      timeframe: "1-3 أيام عمل"
    },
    {
      step: 3,
      title: "اتخاذ القرار",
      description: "نبلغك بقرار الموافقة أو الرفض مع التوضيح",
      timeframe: "1-2 أيام عمل"
    },
    {
      step: 4,
      title: "معالجة الاسترداد",
      description: "تحويل المبلغ إلى طريقة الدفع الأصلية",
      timeframe: "3-7 أيام عمل"
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "refunds@exabytex.com",
      action: "mailto:refunds@exabytex.com"
    },
    {
      icon: Phone,
      label: "الهاتف",
      value: "201555831761+",
      action: "tel:+201555831761"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
            <RefreshCw className="h-4 w-4 text-green-400" />
            سياسة الاسترداد
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            سياسة
            <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              الاسترداد
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            نحن ملتزمون برضا عملائنا. إليك سياسة الاسترداد الشاملة والعادلة لجميع خدماتنا ومنتجاتنا.
          </p>
        </div>

        {/* Last Updated */}
        <Card className="mb-8 border-yellow-500/20 bg-yellow-500/10 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-yellow-200 font-medium">آخر تحديث: {new Date().toLocaleDateString('ar-EG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="text-yellow-300/80 text-sm">
                  نراجع سياسة الاسترداد بانتظام لضمان العدالة والوضوح
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-12 border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-400" />
              مقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-300 leading-relaxed">
            <p className="mb-4">
              في <strong className="text-green-400">Exa ByteX</strong>، نسعى دائماً لتقديم منتجات وخدمات عالية الجودة تلبي توقعات عملائنا. 
              هذه السياسة توضح الشروط والأحكام المتعلقة بطلبات الاسترداد للمنتجات والخدمات المختلفة.
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-300 font-medium">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                نحن ملتزمون بمعالجة جميع طلبات الاسترداد بعدالة وشفافية تامة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refund Conditions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">شروط الاسترداد حسب نوع المنتج</h2>
          <div className="grid gap-8">
            {refundConditions.map((item, index) => (
              <Card key={index} className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div>{item.title}</div>
                      <div className="text-sm text-gray-400 font-normal">{item.description}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm text-green-400">المدة الزمنية</div>
                      <div className="font-bold">{item.timeframe}</div>
                      <div className="text-sm text-blue-400">نسبة الاسترداد</div>
                      <div className="font-bold">{item.refundRate}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-white mb-3">شروط الاسترداد:</h4>
                  <ul className="space-y-2">
                    {item.conditions.map((condition, conditionIndex) => (
                      <li key={conditionIndex} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Non-Refundable Items */}
        <Card className="mb-8 border-red-500/20 bg-red-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-400" />
              المنتجات والخدمات غير قابلة للاسترداد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              هناك بعض المنتجات والخدمات التي لا يمكن استردادها وفقاً لطبيعتها:
            </p>
            <ul className="space-y-2">
              {nonRefundableItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">خطوات طلب الاسترداد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundProcess.map((step, index) => (
              <Card key={index} className="border-white/20 bg-white/10 backdrop-blur-md text-center relative">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                  <div className="bg-blue-500/20 rounded-full px-3 py-1 text-blue-300 text-xs">
                    {step.timeframe}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Methods and Processing Times */}
        <Card className="mb-8 border-blue-500/20 bg-blue-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-400" />
              طرق الدفع وأوقات المعالجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">طرق الاسترداد المتاحة:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    البطاقات الائتمانية والخصم
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    PayPal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    التحويل البنكي
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    المحافظ الإلكترونية
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">أوقات المعالجة:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span>البطاقات الائتمانية:</span>
                    <span className="text-blue-400">3-5 أيام عمل</span>
                  </li>
                  <li className="flex justify-between">
                    <span>PayPal:</span>
                    <span className="text-blue-400">1-2 أيام عمل</span>
                  </li>
                  <li className="flex justify-between">
                    <span>التحويل البنكي:</span>
                    <span className="text-blue-400">5-7 أيام عمل</span>
                  </li>
                  <li className="flex justify-between">
                    <span>المحافظ الإلكترونية:</span>
                    <span className="text-blue-400">1-3 أيام عمل</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Circumstances */}
        <Card className="mb-8 border-purple-500/20 bg-purple-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-purple-400" />
              الظروف الاستثنائية
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">✅ حالات الاسترداد الفوري</h4>
                <ul className="text-sm space-y-1">
                  <li>• خلل تقني كبير في المنتج</li>
                  <li>• عدم تطابق المنتج مع الوصف</li>
                  <li>• مشاكل أمنية في التطبيق</li>
                  <li>• عدم عمل الخدمة نهائياً</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">⚖️ حالات الاسترداد الجزئي</h4>
                <ul className="text-sm space-y-1">
                  <li>• استخدام جزئي للخدمة</li>
                  <li>• تأخير في التسليم</li>
                  <li>• عدم اكتمال بعض الميزات</li>
                  <li>• طلب تعديل نطاق العمل</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8 border-green-500/20 bg-green-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Mail className="h-6 w-6 text-green-400" />
              تواصل معنا لطلب الاسترداد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              لتقديم طلب استرداد أو الاستفسار عن حالة طلبك، تواصل معنا عبر:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 text-center">
                  <contact.icon className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">{contact.label}</h4>
                  <a 
                    href={contact.action}
                    className="text-green-300 hover:text-green-200 transition-colors text-lg"
                  >
                    {contact.value}
                  </a>
                  <p className="text-gray-400 text-sm mt-2">
                    نرد خلال 24 ساعة
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">معلومات مطلوبة لطلب الاسترداد:</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• رقم الطلب أو رقم المعاملة</li>
                <li>• تاريخ الشراء</li>
                <li>• وصف مفصل لسبب طلب الاسترداد</li>
                <li>• لقطات شاشة أو أدلة (إن وُجدت)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-400 mb-4">تحتاج لمساعدة في طلب الاسترداد؟</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  تواصل معنا
                </Button>
              </Link>
              <Link href="/privacy-policy">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  سياسة الخصوصية
                </Button>
              </Link>
              <Link href="/terms-of-service">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  شروط الاستخدام
                </Button>
              </Link>
            </div>
          </div>
          
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 