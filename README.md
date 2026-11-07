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
