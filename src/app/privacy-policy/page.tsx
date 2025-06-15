"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Shield, 
  Eye, 
  FileText, 
  Mail, 
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Users,
  Globe
} from 'lucide-react'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "المعلومات التي نجمعها",
      content: [
        "المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف",
        "معلومات الحساب: كلمة المرور المشفرة، تفضيلات الحساب",
        "معلومات الاستخدام: سجل التصفح، المنتجات المشتراة، تفاعلاتك مع الموقع",
        "المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل",
        "معلومات الدفع: تتم معالجتها بواسطة مقدمي خدمة دفع آمنين"
      ]
    },
    {
      icon: Eye,
      title: "كيف نستخدم معلوماتك",
      content: [
        "تقديم وتحسين خدماتنا وتطبيقات الذكاء الاصطناعي",
        "التواصل معك بخصوص طلباتك واستفساراتك",
        "إرسال تحديثات المنتجات والخدمات الجديدة",
        "معالجة المدفوعات وإدارة الحسابات",
        "تحليل استخدام الموقع لتحسين تجربة المستخدم",
        "ضمان الأمان ومنع الاحتيال"
      ]
    },
    {
      icon: Shield,
      title: "حماية معلوماتك",
      content: [
        "تشفير جميع البيانات الحساسة باستخدام SSL",
        "تخزين آمن لكلمات المرور باستخدام تقنيات التشفير المتقدمة",
        "وصول محدود للموظفين المخولين فقط",
        "مراقبة مستمرة للأنشطة المشبوهة",
        "نسخ احتياطية منتظمة ومحمية",
        "امتثال لمعايير الأمان الدولية"
      ]
    },
    {
      icon: Users,
      title: "مشاركة المعلومات",
      content: [
        "لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة",
        "قد نشارك معلومات مع مقدمي خدمة موثوقين (الدفع، الاستضافة)",
        "الإفصاح عند الضرورة القانونية أو لحماية حقوقنا",
        "نحصل على موافقتك الصريحة قبل أي مشاركة أخرى",
        "جميع الشركاء ملزمون بحماية خصوصيتك"
      ]
    },
    {
      icon: Globe,
      title: "الكوكيز وتقنيات التتبع",
      content: [
        "نستخدم كوكيز ضرورية لعمل الموقع بشكل صحيح",
        "كوكيز تحليلية لفهم كيفية استخدام الموقع",
        "كوكيز التخصيص لحفظ تفضيلاتك",
        "يمكنك إدارة إعدادات الكوكيز من متصفحك",
        "بعض الميزات قد لا تعمل بدون كوكيز معينة"
      ]
    },
    {
      icon: CheckCircle,
      title: "حقوقك",
      content: [
        "الوصول إلى معلوماتك الشخصية المحفوظة لدينا",
        "تصحيح أو تحديث معلوماتك",
        "حذف حسابك ومعلوماتك (مع مراعاة المتطلبات القانونية)",
        "إيقاف الرسائل التسويقية",
        "طلب نسخة من بياناتك",
        "تقديم شكوى للسلطات المختصة"
      ]
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "info@exabytex.com",
      action: "mailto:info@exabytex.com"
    },
    {
      icon: Phone,
      label: "الهاتف",
      value: "201555831761+",
      action: "tel:+201555831761"
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
            <Shield className="h-4 w-4 text-blue-400" />
            سياسة الخصوصية
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            حماية
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              خصوصيتك
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية. هذه السياسة توضح كيف نجمع ونستخدم ونحمي بياناتك.
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
                  نراجع سياسة الخصوصية بانتظام لضمان حماية أفضل لبياناتك
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-12 border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-400" />
              مقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-300 leading-relaxed">
            <p className="mb-4">
              شركة <strong className="text-blue-400">Exa Bytex</strong> ("نحن"، "لنا"، "الشركة") تقدر خصوصيتك وتلتزم بحماية معلوماتك الشخصية. 
              هذه السياسة تصف ممارساتنا في جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا الإلكتروني وخدماتنا.
            </p>
            <p className="mb-4">
              باستخدام موقعنا أو خدماتنا، فإنك توافق على جمع ومعالجة معلوماتك وفقاً لهذه السياسة.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                إذا كان لديك أي أسئلة حول هذه السياسة، يرجى التواصل معنا فوراً.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="grid gap-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Retention */}
        <Card className="mb-8 border-purple-500/20 bg-purple-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Database className="h-6 w-6 text-purple-400" />
              الاحتفاظ بالبيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4">
              نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضرورياً لتقديم خدماتنا أو للامتثال للالتزامات القانونية:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">الحسابات النشطة</h4>
                <p className="text-sm">نحتفظ بالبيانات طالما الحساب نشط أو حسب الحاجة لتقديم الخدمات</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">الحسابات المحذوفة</h4>
                <p className="text-sm">نحذف البيانات خلال 30 يوم من طلب الحذف (ما لم تتطلب القوانين الاحتفاظ بها)</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">بيانات المعاملات</h4>
                <p className="text-sm">نحتفظ بسجلات المعاملات لمدة 7 سنوات للامتثال للمتطلبات المحاسبية</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">السجلات الأمنية</h4>
                <p className="text-sm">نحتفظ بسجلات الأمان لمدة سنة واحدة لحماية أنظمتنا</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-8 border-orange-500/20 bg-orange-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              التغييرات على هذه السياسة
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4">
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. عند إجراء تغييرات مهمة، سنقوم بما يلي:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                إرسال إشعار بالبريد الإلكتروني للمستخدمين المسجلين
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                عرض إشعار بارز على الموقع
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                تحديث تاريخ "آخر تحديث" في أعلى هذه الصفحة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                منحك 30 يوماً للمراجعة قبل سريان التغييرات
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8 border-green-500/20 bg-green-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Mail className="h-6 w-6 text-green-400" />
              تواصل معنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو تريد ممارسة حقوقك، يمكنك التواصل معنا:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                  <contact.icon className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">{contact.label}</h4>
                  {contact.action ? (
                    <a 
                      href={contact.action}
                      className="text-green-300 hover:text-green-200 transition-colors text-sm"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-gray-300 text-sm">{contact.value}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-400 mb-4">تحتاج للمساعدة أو لديك استفسار؟</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  تواصل معنا
                </Button>
              </Link>
              <Link href="/terms-of-service">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  شروط الاستخدام
                </Button>
              </Link>
              <Link href="/refund-policy">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  سياسة الاسترداد
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