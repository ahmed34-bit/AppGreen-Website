/**
 * AppGreen Official Website — Central Configuration
 * ============================================================================
 * This file centralizes all updatable links, release metadata, promotional
 * video settings, and contact details so you can update them in one place.
 */

window.APPGREEN_CONFIG = {
  // 1. Application Identity & Metadata (extracted from app/build.gradle.kts)
  app: {
    name: "AppGreen",
    packageName: "com.example.appgreen",
    versionName: "1.0",
    versionCode: 1,
    minAndroidVersion: "Android 7.0+ (API 24)",
    targetSdk: 37,
    // Set the exact APK size (e.g. "38.5 MB") once the signed Release APK is generated.
    // Leave as null before the official release is built so the UI shows "TBD upon release".
    apkFileSize: null,
    lastUpdated: "2026-10"
  },

  // 2. Unified Cinematic Presentation Configuration (42s continuous 6-scene story)
  promoVideo: {
    isVideoFileAvailable: false,
    mp4Url: "./assets/video/appgreen-promo.mp4",
    posterUrl: "./assets/images/banner_drone.png",
    totalDurationSeconds: 42,
    sceneDurationSeconds: 7,
    assets: {
      logo: "./assets/images/app_logo.png",
      dayDrone: "./assets/images/banner_drone.png",
      nightDrone: "./assets/images/cinema/scene_night_drone.jpg",
      aerialForest: "./assets/images/cinema/scene_aerial_forest.jpg",
      volunteersPlanting: "./assets/images/cinema/scene_volunteers_planting.jpg",
      phoneScreenCampaigns: "./assets/images/screenshots/screen_campaigns_list.png",
      phoneScreenMarket: "./assets/images/screenshots/screen_market.png",
      phoneScreenServices: "./assets/images/screenshots/screen_services.png",
      phoneScreenCampaignDetail: "./assets/images/screenshots/screen_campaign_detail1.png"
    }
  },

  // 3. Reforestation Campaigns Display Mode
  // - Keep `hasLivePublicApi: false` when hosting as a static site without a public API;
  //   this ensures the map and campaign cards are clearly presented as an illustrative
  //   preview of the in-app experience without inventing live statistics.
  campaigns: {
    hasLivePublicApi: false,
    mapCenter: [35.65, 3.45],
    mapZoom: 6
  },

  // 4. GitHub Releases & APK Download Settings
  // IMPORTANT:
  // - Keep `isReleasePublished: false` until an official Release APK is actually uploaded.
  // - Once uploaded to GitHub Releases, set `isReleasePublished: true` and paste the
  //   direct `.apk` asset URL into `apkDownloadUrl`.
  download: {
    isReleasePublished: false,
    apkDownloadUrl: "", // Example when published: "https://github.com/<USERNAME>/<REPO>/releases/download/v1.0/AppGreen-v1.0.apk"
    releasesPageUrl: "" // Example when published: "https://github.com/<USERNAME>/<REPO>/releases/latest"
  },

  // 5. Internal Page Links (Relative paths for full GitHub Pages compatibility)
  pages: {
    home: "./index.html",
    privacy: "./privacy.html",
    terms: "./terms.html"
  },

  // 6. Official Contact Information
  contact: {
    email: "appgreen.team@gmail.com",
    mailtoUrl: "mailto:appgreen.team@gmail.com"
  },

  // 7. Supported Languages & Default Language
  i18n: {
    defaultLang: "ar",
    supportedLangs: ["ar", "fr", "en"]
  }
};
