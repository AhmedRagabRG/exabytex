# 🚀 دليل نشر AI Agency App - exabytex.com

## متطلبات النشر

### 1. متطلبات الخادم
- Ubuntu 20.04+ أو CentOS 8+
- Docker & Docker Compose
- 4GB RAM أو أكثر
- 50GB مساحة تخزين أو أكثر
- اتصال إنترنت مستقر

### 2. إعدادات الدومين
- تأكد أن DNS الخاص بـ `exabytex.com` يشير لـ IP الخادم
- إعداد A Record: `exabytex.com` → `YOUR_SERVER_IP`
- إعداد A Record: `www.exabytex.com` → `YOUR_SERVER_IP`

## خطوات النشر

### 1. تحضير البيئة
```bash
# استنسخ المشروع
git clone <repository-url>
cd ai-agency-app

# انسخ ملف البيئة وحدث القيم
cp .env.example .env
nano .env
```

### 2. تحديث متغيرات البيئة (.env)
```env
# PostgreSQL Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=main_db
POSTGRES_NON_ROOT_USER=app_user
POSTGRES_NON_ROOT_PASSWORD=your_app_user_secure_password

# AI Agency App
NEXTAUTH_SECRET=your_super_secret_key_minimum_32_characters_here
NEXTAUTH_URL=https://exabytex.com
NEXT_PUBLIC_BASE_URL=https://exabytex.com

# Google OAuth (احصل عليها من Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Exchange Rate API (احصل عليها من exchangerate-api.com)
EXCHANGERATE_API_KEY=your_exchangerate_api_key

# Kashier Payment Gateway
KASHIER_MERCHANT_ID=your_kashier_merchant_id
KASHIER_API_KEY=your_kashier_api_key
```

### 3. تشغيل النشر
```bash
# جعل السكريپتات قابلة للتنفيذ
chmod +x deploy.sh setup-ssl.sh monitor.sh

# تشغيل النشر
./deploy.sh

# إعداد SSL Certificate (بعد انتشار DNS)
./setup-ssl.sh exabytex.com admin@exabytex.com

# مراقبة النظام
./monitor.sh
```

### 4. إعداد Nginx Proxy Manager

1. افتح `http://YOUR_SERVER_IP:81`
2. سجل دخول (البيانات الافتراضية):
   - Email: `admin@example.com`
   - Password: `changeme`
3. أضف Proxy Host جديد:
   - Domain: `exabytex.com`, `www.exabytex.com`
   - Scheme: `http`
   - Forward Hostname: `ai-agency-app`
   - Forward Port: `3000`
   - Cache Assets: `enabled`
   - Block Common Exploits: `enabled`
   - Websockets Support: `enabled`

4. إعداد SSL:
   - اختر "Request a new SSL Certificate"
   - فعل "Force SSL"
   - فعل "HTTP/2 Support"

## إعدادات Google OAuth

1. اذهب لـ [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر موجود
3. فعل Google+ API
4. أنشئ OAuth 2.0 credentials
5. أضف Authorized redirect URIs:
   - `https://exabytex.com/api/auth/callback/google`

## إعدادات Kashier

1. سجل في [Kashier](https://kashier.io/)
2. احصل على Production API credentials
3. أضف webhook URL: `https://exabytex.com/api/webhooks/kashier`

## المراقبة والصيانة

### التحقق من حالة الخدمات
```bash
docker-compose ps
docker-compose logs ai-agency-app
```

### تحديث التطبيق
```bash
git pull origin main
docker-compose up -d --build ai-agency-app
```

### النسخ الاحتياطي لقاعدة البيانات
```bash
docker-compose exec postgres pg_dump -U $POSTGRES_USER ai_agency_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### استعادة قاعدة البيانات
```bash
docker-compose exec -i postgres psql -U $POSTGRES_USER ai_agency_db < backup_file.sql
```

## URLs المهمة

- **الموقع الرئيسي**: https://exabytex.com
- **لوحة الإدارة**: https://exabytex.com/dashboard
- **Nginx Proxy Manager**: http://YOUR_SERVER_IP:81
- **Portainer**: http://YOUR_SERVER_IP:9000
- **n8n**: http://YOUR_SERVER_IP:5678

## معلومات الدخول الافتراضية

### Admin Dashboard
- Email: `admin@test.com`
- Password: `admin123`

### Nginx Proxy Manager
- Email: `admin@example.com`
- Password: `changeme`

## استكشاف الأخطاء

### مشكلة في الاتصال بقاعدة البيانات
```bash
docker-compose exec postgres psql -U $POSTGRES_USER -d ai_agency_db -c "SELECT 1;"
```

### مشكلة في SSL
- تأكد من إعداد DNS الصحيح
- انتظر بضع دقائق لانتشار الشهادة
- تحقق من logs: `docker-compose logs npm`

### مشكلة في الذاكرة
```bash
# مراقبة استهلاك الذاكرة
docker stats
```

## الأمان

1. **تغيير كلمات المرور الافتراضية**
2. **تحديث متغيرات البيئة بقيم آمنة**
3. **إعداد Firewall**:
```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 81  # Nginx Proxy Manager
ufw allow 9000  # Portainer
ufw enable
```

4. **تحديثات دورية**:
```bash
apt update && apt upgrade -y
docker-compose pull
```

## الدعم

في حالة وجود مشاكل:
1. تحقق من logs: `docker-compose logs`
2. تأكد من إعدادات DNS
3. تحقق من متغيرات البيئة
4. راجع وثائق الخدمات المستخدمة 