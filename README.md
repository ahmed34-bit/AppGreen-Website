# AppGreen — الموقع الرسمي لتطبيق Android

الموقع الإلكتروني الرسمي (Static Website) لتطبيق **AppGreen** المتخصص في الخدمات الزراعية، السوق الفلاحي، حلول الدرون، وإدارة مشاريع التشجير.

---

## 1. هيكلة المشروع

```text
AppGreen-Website/
├── index.html                  # الصفحة الرئيسية (Hero, About, Features, Screenshots, Download, Contact)
├── privacy.html                # صفحة سياسة الخصوصية المستقلة (AR / FR / EN)
├── terms.html                  # صفحة شروط الخدمة والاستخدام المستقلة (AR / FR / EN)
├── .nojekyll                   # ملف إعداد GitHub Pages لتقديم الملفات الثابتة مباشرة
├── README.md                   # دليل تشغيل وتحديث الموقع
└── assets/
    ├── css/
    │   └── styles.css          # نظام التصميم المخصص بهوية AppGreen مع دعم RTL/LTR والوضع الداكن
    ├── js/
    │   ├── config.js           # إعدادات الروابط وإصدار APK وروابط الصفحات في مكان واحد
    │   ├── translations.js     # القاموس اللغوي الكامل (العربية، الفرنسية، الإنجليزية)
    │   └── main.js             # محرك تبديل اللغات، معرض الصور، والصفحات القانونية
    ├── images/
    │   ├── app_logo.png        # شعار AppGreen الرسمي
    │   ├── ai_mascot_avatar.png
    │   ├── banner_drone.png
    │   └── screenshots/        # لقطات شاشة حقيقية من تطبيق AppGreen
    └── video/
        └── README.txt          # مسار ملف الفيديو التقديمي الرسمي (assets/video/appgreen-promo.mp4)
```

---

## 2. طريقة تشغيل الموقع محلياً

بما أن المشروع موجود داخل مسار `c:\xampp\htdocs\AppGreen-Website`، يمكنك تشغيله بأي من الطرق التالية:

1. **عبر خادم XAMPP (Apache)**:
   - شغّل Apache من لوحة تحكم XAMPP.
   - افتح المتصفح على الرابط: `http://localhost/AppGreen-Website/`
2. **عبر Python أو Node.js (بدون XAMPP)**:
   ```powershell
   cd c:\xampp\htdocs\AppGreen-Website
   python -m http.server 8080
   ```
   ثم افتح: `http://localhost:8080`
3. **فتح مباشر**:
   - يمكنك فتح ملف `index.html` مباشرة في المتصفح.

---

## 3. كيفية تفعيل الفيديو السينمائي التقديمي (`#video-showcase`)

1. ضع ملف الفيديو الرسمي بصيغة MP4 في المسار:
   `assets/video/appgreen-promo.mp4`
2. افتح الملف [`assets/js/config.js`](./assets/js/config.js) وغيّر:
   ```javascript
   promoVideo: {
     isVideoFileAvailable: true,
     mp4Url: "./assets/video/appgreen-promo.mp4",
     posterUrl: "./assets/images/banner_drone.png"
   }
   ```
3. سيعمل الفيديو تلقائياً بالوضع الصامت (`autoplay muted loop playsinline`) مع تفعيل زر تشغيل/كتم الصوت اليدوي وإيقافه تلقائياً عند الخروج من الشاشة لتحسين الأداء على الهواتف.

---

## 4. كيفية تفعيل رابط تحميل APK عند نشر Release على GitHub

افتح الملف [`assets/js/config.js`](./assets/js/config.js) وعدّل قسم `download` و `app.apkFileSize`:

```javascript
  app: {
    name: "AppGreen",
    packageName: "com.example.appgreen",
    versionName: "1.0",
    versionCode: 1,
    minAndroidVersion: "Android 7.0+ (API 24)",
    targetSdk: 37,
    apkFileSize: "38.8 MB", // ضع حجم ملف APK الفعلي هنا
    lastUpdated: "2026-10"
  },

  download: {
    isReleasePublished: true, // غيّرها إلى true بعد رفع APK على GitHub Releases
    apkDownloadUrl: "https://github.com/<USERNAME>/<REPO>/releases/download/v1.0/AppGreen-v1.0.apk",
    releasesPageUrl: "https://github.com/<USERNAME>/<REPO>/releases/latest"
  },
```
سيقوم الموقع تلقائياً بتحويل زر التحميل وشارة الحالة في جميع اللغات الثلاث (AR / FR / EN) إلى وضع التحميل المباشر.

