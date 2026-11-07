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
    versionName: "v1.0.0 TEST",
    versionCode: 1,
    minAndroidVersion: "Android 7.0+ (API 24)",
    targetSdk: 37,
    // Fallback APK size ("37.57 MB" = 39,399,210 bytes); also detected automatically via HTTP HEAD in main.js
    apkFileSize: "37.57 MB",
    lastUpdated: "2026-11"
  },

  // 2. Unified 4-Scene Cinematic Presentation (Opening Video app.mp4 + Campaigns + Volunteering + Finale)
  promoVideo: {
    isVideoFileAvailable: true,
    mp4Url: "./assets/video/app.mp4",
    secondaryVideoUrl: "./assets/video/appgreen.mp4",
    posterUrl: "./assets/images/banner_drone.png",
    openingVideoDurationSeconds: 16,
    sceneDurationSeconds: 7,
    totalDurationSeconds: 37,
    assets: {
      logo: "./assets/images/app_logo.png",
      openingVideo: "./assets/video/app.mp4",
      secondaryVideo: "./assets/video/appgreen.mp4",
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

  // 4. Android Test APK Download Settings (Hosted on GitHub Pages)
  download: {
    isReleasePublished: true,
    isTestBuild: true,
    versionLabel: "v1.0.0 TEST",
    apkFileName: "AppGreen-Test-v1.0.apk",
    apkDownloadUrl: "downloads/AppGreen-Test-v1.0.apk",
    releasesPageUrl: ""
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
