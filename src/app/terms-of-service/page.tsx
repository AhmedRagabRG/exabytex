"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Scale, 
  Shield, 
  FileText, 
  Mail, 
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock,
  Globe,
  UserCheck,
  Ban,
  Gavel
} from 'lucide-react'

export default function TermsOfServicePage() {
  const mainSections = [
    {
      icon: UserCheck,
      title: "الأهلية والتسجيل",
      content: [
        "يجب تقديم معلومات دقيقة وحديثة عند التسجيل",
        "أنت مسؤول عن الحفاظ على سرية كلمة المرور",
        "نحتفظ بالحق في رفض أو إنهاء أي حساب دون إشعار مسبق"
      ]
    },
    {
      icon: FileText,
      title: "استخدام الخدمات",
      content: [
        "يُسمح باستخدام خدماتنا للأغراض التجارية والشخصية المشروعة فقط",
        "لا يُسمح بإعادة بيع أو توزيع منتجاتنا دون إذن كتابي",
        "يجب احترام حقوق الملكية الفكرية لجميع المحتويات",
        "ممنوع استخدام الخدمات لأي أنشطة غير قانونية أو ضارة",
        "نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت"
      ]
    },
    {
      icon: Lock,
      title: "الملكية الفكرية",
      content: [
        "جميع المحتويات والتطبيقات والتقنيات مملوكة لشركة Exa Bytex",
        "نمنحك رخصة محدودة وغير حصرية لاستخدام منتجاتنا",
        "لا يُسمح بنسخ أو تعديل أو إنشاء أعمال مشتقة من منتجاتنا",
        "علامتنا التجارية وشعارنا محميان بموجب قوانين حقوق الطبع والنشر",
        "أي انتهاك لحقوق الملكية الفكرية سيُعرّضك للمساءلة القانونية"
      ]
    },
    {
      icon: Ban,
      title: "السلوك المحظور",
      content: [
        "تحميل أو نشر محتوى ضار أو غير قانوني أو مسيء",
        "محاولة اختراق أو إتلاف أنظمتنا أو خوادمنا",
        "التدخل في عمل الخدمات أو مضايقة المستخدمين الآخرين",
        "انتحال شخصية أشخاص آخرين أو نشر معلومات مضللة",
        "استخدام برامج تلقائية أو روبوتات دون إذن"
      ]
    },
    {
      icon: Shield,
      title: "المسؤولية والضمانات",
      content: [
        "نقدم خدماتنا 'كما هي' دون ضمانات صريحة أو ضمنية",
        "لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء",
        "مسؤوليتنا محدودة بقيمة المبلغ المدفوع للخدمة",
        "لسنا مسؤولين عن أي أضرار غير مباشرة أو عرضية",
        "أنت مسؤول عن استخدام خدماتنا وفقاً للقوانين المحلية"
      ]
    },
    {
      icon: Gavel,
      title: "إنهاء الخدمة",
      content: [
        "يمكنك إلغاء حسابك في أي وقت من خلال الإعدادات",
        "نحتفظ بالحق في إنهاء حسابك في حالة انتهاك هذه الشروط",
        "سيتم حذف بياناتك خلال 30 يوماً من إنهاء الحساب",
        "تبقى الأقسام المتعلقة بالمسؤولية والملكية الفكرية سارية",
        "لن تُسترد الرسوم المدفوعة إلا وفقاً لسياسة الاسترداد"
      ]
    }
  ]

  const paymentTerms = [
    "جميع الأسعار معروضة بالدولار الأمريكي، ولكن الدفع يتم بالجنيه المصري عند استخدام أي وسيلة دفع غير PayPal، وذلك بسبب بوابة الدفع الخاصة بنا. الفاتورة ستظهر بالجنيه المصري بناءً على سعر الصرف الحالي وقت المعاملة",
    "الدفع مطلوب مقدماً لجميع الخدمات ما لم نتفق على خلاف ذلك",
    "نستخدم مقدمي خدمة دفع آمنين ومعتمدين",
    "قد تطبق رسوم إضافية من مقدم خدمة الدفع الخاص بك",
    "الأسعار قابلة للتغيير مع إشعار مسبق 30 يوماً"
  ]

  const privacyHighlights = [
    "نحمي خصوصيتك ونتعامل مع بياناتك بأقصى درجات الحماية",
    "لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة",
    "نستخدم تقنيات التشفير المتقدمة لحماية بياناتك",
    "يمكنك الوصول إلى بياناتك وتعديلها أو حذفها في أي وقت"
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
    }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
            <Scale className="h-4 w-4 text-purple-400" />
            شروط الاستخدام
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            شروط
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              الاستخدام
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            هذه الشروط تحكم استخدامك لخدماتنا ومنتجاتنا. يرجى قراءتها بعناية قبل استخدام خدماتنا.
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
                  نراجع شروط الاستخدام بانتظام لضمان الوضوح والعدالة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-12 border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-400" />
              الموافقة على الشروط
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-300 leading-relaxed">
            <p className="mb-4">
              مرحباً بك في <strong className="text-purple-400">Exa Bytex</strong>. باستخدام موقعنا الإلكتروني أو أي من خدماتنا، 
              فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، 
              يرجى عدم استخدام خدماتنا.
            </p>
            <p className="mb-4">
              هذه الشروط تشكل اتفاقية قانونية ملزمة بينك وبين شركة Exa Bytex. نحتفظ بالحق في تعديل 
              هذه الشروط في أي وقت، وسنقوم بإشعارك بأي تغييرات مهمة.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-purple-300 font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                يُعتبر استمرارك في استخدام خدماتنا بعد تعديل الشروط موافقة على الشروط الجديدة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="grid gap-8 mb-12">
          {mainSections.map((section, index) => (
            <Card key={index} className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
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

        {/* Payment Terms */}
        <Card className="mb-8 border-green-500/20 bg-green-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-400" />
              شروط الدفع والأسعار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {paymentTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Privacy Summary */}
        <Card className="mb-8 border-blue-500/20 bg-blue-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" />
              ملخص سياسة الخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              حماية خصوصيتك أولوية قصوى بالنسبة لنا. إليك الأسس الرئيسية لسياسة الخصوصية:
            </p>
            <ul className="space-y-3">
              {privacyHighlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/privacy-policy">
                <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  اقرأ سياسة الخصوصية كاملة
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8 border-orange-500/20 bg-orange-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Gavel className="h-6 w-6 text-orange-400" />
              القانون المطبق وحل النزاعات
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">القانون المطبق</h4>
                <p className="text-sm mb-2">
                  تخضع هذه الشروط وتُفسر وفقاً لقوانين جمهورية مصر العربية، دون تطبيق مبادئ تضارب القوانين.
                </p>
                <p className="text-xs text-gray-400">
                  جميع النزاعات ستخضع لاختصاص المحاكم المصرية المختصة.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">حل النزاعات</h4>
                <p className="text-sm mb-2">
                  نشجع على حل النزاعات ودياً أولاً من خلال التواصل المباشر معنا. 
                  إذا لم يكن ذلك ممكناً، فسيتم اللجوء للطرق القانونية المناسبة.
                </p>
                <p className="text-xs text-gray-400">
                  يُفضل التحكيم للنزاعات التجارية الكبيرة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Force Majeure */}
        <Card className="mb-8 border-red-500/20 bg-red-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              القوة القاهرة والظروف الاستثنائية
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4">
              لن نكون مسؤولين عن أي تأخير أو فشل في الأداء ناتج عن ظروف خارجة عن سيطرتنا المعقولة، بما في ذلك:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>• الكوارث الطبيعية والظواهر الجوية</li>
                <li>• الحروب والأزمات السياسية</li>
                <li>• انقطاع الإنترنت أو الخدمات التقنية</li>
                <li>• الإضرابات وتوقف الخدمات العامة</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>• القوانين والتشريعات الجديدة</li>
                <li>• الهجمات السيبرانية</li>
                <li>• فشل البنية التحتية للإنترنت</li>
                <li>• أي ظروف أخرى خارجة عن السيطرة</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8 border-purple-500/20 bg-purple-500/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              تواصل معنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              إذا كان لديك أي أسئلة حول شروط الاستخدام أو تحتاج لتوضيحات، تواصل معنا:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 text-center">
                  <contact.icon className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">{contact.label}</h4>
                  <a 
                    href={contact.action}
                    className="text-purple-300 hover:text-purple-200 transition-colors text-lg"
                  >
                    {contact.value}
                  </a>
                  <p className="text-gray-400 text-sm mt-2">
                    للاستفسارات القانونية
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-400 mb-4">اطلع على سياساتنا الأخرى:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy-policy">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Shield className="mr-2 h-4 w-4" />
                  سياسة الخصوصية
                </Button>
              </Link>
              <Link href="/refund-policy">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  سياسة الاسترداد
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  تواصل معنا
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