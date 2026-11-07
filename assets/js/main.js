/**
 * AppGreen Official Website — Main Interactive Controller
 * Handles Trilingual (AR/FR/EN) RTL/LTR switching, Dark/Light Theme,
 * Dynamic Section Rendering, Screenshot Gallery Lightbox, and Legal Accordions.
 */

(function () {
  "use strict";

  const CONFIG = window.APPGREEN_CONFIG;
  const TRANSLATIONS = window.APPGREEN_TRANSLATIONS;

  let currentLang = getInitialLanguage();
  let currentScreenshotFilter = "all";
  let currentVideoSceneIndex = 0;
  let cinemaElapsedMs = 0;
  let cinemaIsPlaying = true;
  let cinemaInViewport = true;
  let cinemaIsMuted = true;
  let openingVideoClosed = false;
  let cinemaTimerId = null;
  let cinemaObserverAttached = false;
  let userGestureAudioBound = false;
  let aboutVideoBound = false;
  let activeCampaignId = "bainem_doc";
  let leafletMapInstance = null;
  let leafletMarkersMap = {};

  // SVG Icons Library for Features & Pillars
  const ICONS = {
    market: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    campaigns: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7l-2-2"/><path d="M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z"/><path d="m14 14-2 2"/></svg>`,
    services: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    drone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="m10.5 10.5-4-4"/><path d="m13.5 10.5 4-4"/><path d="m10.5 13.5-4 4"/><path d="m13.5 13.5 4 4"/><circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/></svg>`,
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1"/></svg>`,
    experience: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    zoom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    chevronDown: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    volumeMuted: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
    volumeOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    pin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    volunteer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    seedling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M7 13c-4 0-5-4-5-7 4 0 7 2 7 6"/><path d="M17 11c4 0 5-4 5-7-4 0-7 2-7 6"/></svg>`
  };

  // ==========================================================================
  // 1. Initialization
  // ==========================================================================

  function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get("lang");
    if (queryLang && CONFIG.i18n.supportedLangs.includes(queryLang)) {
      localStorage.setItem("appgreen_lang", queryLang);
      return queryLang;
    }
    const saved = localStorage.getItem("appgreen_lang");
    if (saved && CONFIG.i18n.supportedLangs.includes(saved)) {
      return saved;
    }
    return CONFIG.i18n.defaultLang;
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("appgreen_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("appgreen_theme", next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    if (theme === "dark") {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  // ==========================================================================
  // 2. Language Application & Dynamic Rendering
  // ==========================================================================

  function setLanguage(lang) {
    if (!CONFIG.i18n.supportedLangs.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem("appgreen_lang", lang);

    const dict = TRANSLATIONS[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = dict.meta.dir;

    // Update page title based on active page
    const pageType = document.body.getAttribute("data-page") || "home";
    if (pageType === "privacy") {
      document.title = dict.meta.titlePrivacy;
    } else if (pageType === "terms") {
      document.title = dict.meta.titleTerms;
    } else {
      document.title = dict.meta.titleHome;
    }

    // Highlight active language button
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // Update static [data-i18n] text nodes
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n");
      const val = resolvePath(dict, path);
      if (typeof val === "string") {
        el.textContent = val;
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const path = el.getAttribute("data-i18n-placeholder");
      const val = resolvePath(dict, path);
      if (typeof val === "string") {
        el.setAttribute("placeholder", val);
      }
    });

    // Render page-specific dynamic components with isolated error handling
    try {
      if (pageType === "home") {
        safeRender("HeroDownloadState", () => renderHeroDownloadState(dict));
        safeRender("VideoShowcaseSection", () => renderVideoShowcaseSection(dict));
        safeRender("AboutSection", () => renderAboutSection(dict));
        safeRender("FeaturesSection", () => renderFeaturesSection(dict));
        safeRender("CampaignsMapSection", () => renderCampaignsMapSection(dict));
        safeRender("VolunteerContributeSection", () => renderVolunteerContributeSection(dict));
        safeRender("ScreenshotsSection", () => renderScreenshotsSection(dict));
        safeRender("DownloadSection", () => renderDownloadSection(dict));
      } else if (pageType === "privacy") {
        safeRender("PrivacyPage", () => renderPrivacyPage(dict));
      } else if (pageType === "terms") {
        safeRender("TermsPage", () => renderTermsPage(dict));
      }
    } finally {
      observeRevealElements();
    }
  }

  function safeRender(sectionName, renderFn) {
    try {
      renderFn();
    } catch (err) {
      console.error(`[AppGreen Render Error] Failed to render ${sectionName}:`, err);
    }
  }

  function resolvePath(obj, path) {
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  function getCampaignLatLng(card) {
    if (!card) return [36.795, 2.965];
    if (typeof card.lat === "number" && typeof card.lng === "number") {
      return [card.lat, card.lng];
    }
    if (Array.isArray(card.coords) && card.coords.length >= 2) {
      return [Number(card.coords[0]) || 0, Number(card.coords[1]) || 0];
    }
    return [36.795, 2.965];
  }

  // ==========================================================================
  // 3. Home Page Dynamic Sections
  // ==========================================================================

  function renderHeroDownloadState(dict) {
    const heroBtn = document.getElementById("heroDownloadBtn");
    const heroBtnText = document.getElementById("heroDownloadBtnText");
    if (!heroBtn || !heroBtnText) return;

    const isReady = CONFIG.download.isReleasePublished && CONFIG.download.apkDownloadUrl.trim() !== "";
    if (isReady) {
      heroBtnText.textContent = dict.hero.btnDownloadReady;
      heroBtn.setAttribute("href", CONFIG.download.apkDownloadUrl);
      heroBtn.setAttribute("download", CONFIG.download.apkFileName || "AppGreen-Test-v1.0.apk");
    } else {
      heroBtnText.textContent = dict.hero.btnDownloadPending;
      heroBtn.setAttribute("href", "#download");
      heroBtn.removeAttribute("download");
    }
  }

  function formatCinemaTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function getCinemaSceneTimings(scenes) {
    const defaultDurationSec = (CONFIG.promoVideo && CONFIG.promoVideo.sceneDurationSeconds) || 7;
    const openingDurationSec = (CONFIG.promoVideo && CONFIG.promoVideo.openingVideoDurationSeconds) || 16;
    let cursorMs = 0;
    const items = (Array.isArray(scenes) ? scenes : []).map((scene, idx) => {
      const sec = scene.durationSec || (idx === 0 ? openingDurationSec : defaultDurationSec);
      const durationMs = sec * 1000;
      const item = {
        index: idx,
        startMs: cursorMs,
        endMs: cursorMs + durationMs,
        durationMs,
        scene
      };
      cursorMs += durationMs;
      return item;
    });
    const totalDurationMs = cursorMs || 37000;
    return { items, totalDurationMs };
  }

  function getActiveSceneFromElapsed(scenes, elapsedMs) {
    const { items, totalDurationMs } = getCinemaSceneTimings(scenes);
    if (items.length === 0) {
      return { activeIdx: 0, activeScene: {}, totalDurationMs: 37000, items: [] };
    }
    const clampedMs = Math.max(0, Math.min(totalDurationMs - 1, elapsedMs));
    const found = items.find((it) => clampedMs >= it.startMs && clampedMs < it.endMs) || items[0];
    return {
      activeIdx: found.index,
      activeScene: found.scene,
      activeItem: found,
      totalDurationMs,
      items
    };
  }

  function updateSoundControlUI() {
    const soundBtn = document.getElementById("videoSoundToggleBtn");
    const closeBtn = document.getElementById("videoCloseBtn");
    const audioHint = document.getElementById("cinemaVideoAudioHint");
    const audioHintText = document.getElementById("cinemaVideoAudioHintText");
    const dict = TRANSLATIONS[currentLang];
    if (soundBtn && dict && dict.videoShowcase) {
      const currVs = dict.videoShowcase;
      soundBtn.innerHTML = `
        ${cinemaIsMuted ? ICONS.volumeMuted : ICONS.volumeOn}
        <span id="videoSoundToggleText">${escapeHtml(cinemaIsMuted ? currVs.btnUnmute : currVs.btnMute)}</span>
      `;
    }
    if (audioHint && dict && dict.videoShowcase) {
      const currVs = dict.videoShowcase;
      audioHint.classList.toggle("muted-state", cinemaIsMuted);
      if (audioHintText) {
        audioHintText.textContent = cinemaIsMuted
          ? (currVs.hintEnableSound || "انقر لتشغيل الصوت HD")
          : (currVs.hintMuteSound || "كتم الصوت");
      }
      const iconSpan = audioHint.querySelector(".audio-hint-icon");
      if (iconSpan) iconSpan.textContent = cinemaIsMuted ? "🔊" : "🔇";
    }
    if (closeBtn) {
      closeBtn.style.display = currentVideoSceneIndex === 0 && !openingVideoClosed ? "inline-flex" : "none";
    }
  }

  function closeOpeningVideoOnEnd() {
    const openingVideo = document.getElementById("cinemaOpeningVideo");
    const ambientVideo = document.getElementById("cinemaOpeningAmbientVideo");
    if (openingVideo) {
      openingVideo.pause();
      openingVideo.muted = true;
    }
    if (ambientVideo) {
      ambientVideo.pause();
    }

    openingVideoClosed = true;
    const dict = TRANSLATIONS[currentLang];
    if (!dict || !dict.videoShowcase) return;
    const scenes = dict.videoShowcase.scenes || [];
    const { items } = getCinemaSceneTimings(scenes);
    const nextSceneItem = items[1] || items[0];
    cinemaElapsedMs = nextSceneItem ? nextSceneItem.startMs : 16000;
    currentVideoSceneIndex = nextSceneItem ? nextSceneItem.index : 1;
    updateCinemaActiveFrame(dict, false);
    updateSoundControlUI();
  }

  function syncOpeningVideoPlayback(resetToStart) {
    const openingVideo = document.getElementById("cinemaOpeningVideo");
    const ambientVideo = document.getElementById("cinemaOpeningAmbientVideo");
    if (!openingVideo) return;

    if (resetToStart) {
      try {
        openingVideo.currentTime = 0;
        if (ambientVideo) ambientVideo.currentTime = 0;
      } catch (e) {
        // Ignore seek errors before metadata is loaded
      }
    }

    const shouldPlay =
      currentVideoSceneIndex === 0 && !openingVideoClosed && cinemaIsPlaying && cinemaInViewport;

    if (!shouldPlay) {
      if (!openingVideo.paused) openingVideo.pause();
      if (ambientVideo && !ambientVideo.paused) ambientVideo.pause();
      updateSoundControlUI();
      return;
    }

    openingVideo.volume = 1.0;
    openingVideo.muted = cinemaIsMuted;

    if (ambientVideo) {
      ambientVideo.muted = true;
      if (ambientVideo.paused) {
        const ambPromise = ambientVideo.play();
        if (ambPromise && typeof ambPromise.catch === "function") {
          ambPromise.catch(() => {});
        }
      }
    }

    if (openingVideo.paused) {
      const playPromise = openingVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // If browser policy prevents unmuted autoplay on initial load,
          // ensure immediate muted playback so video plays fluidly without showing a static image.
          openingVideo.muted = true;
          cinemaIsMuted = true;
          updateSoundControlUI();
          const retryMuted = openingVideo.play();
          if (retryMuted && typeof retryMuted.catch === "function") {
            retryMuted.catch(() => {});
          }
          bindFirstGestureAudioUnlock();
        });
      }
    }
    updateSoundControlUI();
  }

  function bindFirstGestureAudioUnlock() {
    if (userGestureAudioBound) return;
    userGestureAudioBound = true;
    const unlockHandler = () => {
      const openingVideo = document.getElementById("cinemaOpeningVideo");
      if (
        openingVideo &&
        currentVideoSceneIndex === 0 &&
        !openingVideoClosed &&
        cinemaIsPlaying &&
        cinemaInViewport
      ) {
        cinemaIsMuted = false;
        openingVideo.muted = false;
        openingVideo.volume = 1.0;
        const p = openingVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        updateSoundControlUI();
      }
      document.removeEventListener("click", unlockHandler);
      document.removeEventListener("touchstart", unlockHandler);
      document.removeEventListener("keydown", unlockHandler);
      userGestureAudioBound = false;
    };
    document.addEventListener("click", unlockHandler, { once: true, passive: true });
    document.addEventListener("touchstart", unlockHandler, { once: true, passive: true });
    document.addEventListener("keydown", unlockHandler, { once: true, passive: true });
  }

  function toggleCinemaAudio(shouldUnmute) {
    cinemaIsMuted = !shouldUnmute;
    const openingVideo = document.getElementById("cinemaOpeningVideo");
    if (openingVideo) {
      openingVideo.volume = 1.0;
      openingVideo.muted = cinemaIsMuted;
      if (!cinemaIsMuted && currentVideoSceneIndex === 0 && !openingVideoClosed && cinemaIsPlaying) {
        const p = openingVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }
    updateSoundControlUI();
  }

  function renderVideoShowcaseSection(dict) {
    const stageContainer = document.getElementById("videoStageFrame");
    const scenesGrid = document.getElementById("videoScenesGrid");
    const specBanner = document.getElementById("videoFileSpecBanner");
    if (!stageContainer || !dict.videoShowcase) return;

    const vs = dict.videoShowcase;
    const scenes = Array.isArray(vs.scenes) ? vs.scenes : [];
    const { activeIdx, activeScene, totalDurationMs, items } = getActiveSceneFromElapsed(scenes, cinemaElapsedMs);
    currentVideoSceneIndex = activeIdx;
    stageContainer.setAttribute("data-active-scene", activeScene.id || "opening");

    const videoSrc = (CONFIG.promoVideo && CONFIG.promoVideo.mp4Url) || "./assets/video/app.mp4";
    const posterSrc = (CONFIG.promoVideo && CONFIG.promoVideo.posterUrl) || "./assets/images/banner_drone.png";
    const assets = (CONFIG.promoVideo && CONFIG.promoVideo.assets) || {
      logo: "./assets/images/app_logo.png",
      openingVideo: "./assets/video/app.mp4",
      secondaryVideo: "./assets/video/appgreen.mp4",
      aerialForest: "./assets/images/cinema/scene_aerial_forest.jpg",
      volunteersPlanting: "./assets/images/cinema/scene_volunteers_planting.jpg",
      phoneScreenCampaigns: "./assets/images/screenshots/screen_campaigns_list.png",
      phoneScreenMarket: "./assets/images/screenshots/screen_market.png",
      phoneScreenServices: "./assets/images/screenshots/screen_services.png",
      phoneScreenCampaignDetail: "./assets/images/screenshots/screen_campaign_detail1.png"
    };

    const disclosureBadge = vs.animatedDisclosureBadge || vs.statusPlaceholderBadge || "";
    const disclosureNote = vs.animatedDisclosureNote || vs.statusPlaceholderNote || "";

    // Build the 4 continuous scene layers inside the responsive cinema viewport
    stageContainer.innerHTML = `
      <div class="cinema-scenes-viewport">
        <!-- SCENE 1: Opening Video (assets/video/app.mp4) with Sound & Auto-Close on End -->
        <div class="cinema-scene-layer cinema-opening-video-scene ${activeIdx === 0 && !openingVideoClosed ? "active" : ""}" data-scene-layer="0">
          <video
            id="cinemaOpeningAmbientVideo"
            class="cinema-opening-video-ambient"
            src="${escapeHtml(videoSrc)}"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            aria-hidden="true"
          ></video>
          <div class="cinema-opening-ambient-tint" aria-hidden="true"></div>

          <div class="cinema-opening-video-frame">
            <video
              id="cinemaOpeningVideo"
              class="cinema-opening-video-main"
              src="${escapeHtml(videoSrc)}"
              autoplay
              muted
              playsinline
              preload="auto"
            ></video>
            <button
              type="button"
              class="cinema-video-audio-hint ${cinemaIsMuted ? "muted-state" : ""}"
              id="cinemaVideoAudioHint"
              title="${escapeHtml(cinemaIsMuted ? (vs.hintEnableSound || "انقر لتشغيل الصوت HD") : (vs.hintMuteSound || "كتم الصوت"))}"
            >
              <span class="audio-hint-icon">${cinemaIsMuted ? "🔊" : "🔇"}</span>
              <span id="cinemaVideoAudioHintText">${escapeHtml(cinemaIsMuted ? (vs.hintEnableSound || "انقر لتشغيل الصوت HD") : (vs.hintMuteSound || "كتم الصوت"))}</span>
            </button>
          </div>
          <div class="cinema-vignette-overlay"></div>
        </div>

        <!-- SCENE 2: Reforestation Campaigns & Interactive Algeria Map Overlay -->
        <div class="cinema-scene-layer ${activeIdx === 1 ? "active" : ""}" data-scene-layer="1">
          <img src="${escapeHtml(assets.aerialForest)}" alt="Aerial Green Forests" class="cinema-bg-plate pan-up" />
          <div class="cinema-vignette-overlay"></div>
          <div class="cinema-map-hologram">
            <div class="cinema-map-hologram-header">
              <span>🗺️ ${escapeHtml(vs.mapOverlayLabel || "Algeria Reforestation Map")}</span>
              <span style="direction:ltr;">GPS • 58 Wilayas</span>
            </div>
            <div class="cinema-map-pins-grid">
              <div class="cinema-map-pin-card">
                <span class="cinema-pin-pulse"></span>
                <span>${escapeHtml(vs.mapPin1 || "Baïnem • Alger")}</span>
              </div>
              <div class="cinema-map-pin-card">
                <span class="cinema-pin-pulse"></span>
                <span>${escapeHtml(vs.mapPin2 || "Hauts Plateaux")}</span>
              </div>
              <div class="cinema-map-pin-card">
                <span class="cinema-pin-pulse"></span>
                <span>${escapeHtml(vs.mapPin3 || "Barrage Vert")}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SCENE 3: Volunteering & Seedling Contribution in the Field -->
        <div class="cinema-scene-layer ${activeIdx === 2 ? "active" : ""}" data-scene-layer="2">
          <img src="${escapeHtml(assets.volunteersPlanting)}" alt="Volunteers Planting Trees" class="cinema-bg-plate pan-zoom-in" />
          <div class="cinema-vignette-overlay"></div>
          <div class="cinema-volunteer-overlay">
            <div class="cinema-vol-card">
              <img src="./assets/images/avatar_farmer.png" alt="Field Volunteer" />
              <div>
                <div style="font-size:0.76rem;color:#86EFAC;font-weight:800;">01 • AppGreen</div>
                <div style="font-size:0.95rem;font-weight:800;">${escapeHtml(vs.volPill1 || "")}</div>
              </div>
            </div>
            <div class="cinema-vol-card">
              <img src="${escapeHtml(assets.phoneScreenCampaignDetail)}" alt="Seedling Contribution" />
              <div>
                <div style="font-size:0.76rem;color:#86EFAC;font-weight:800;">02 • AppGreen</div>
                <div style="font-size:0.95rem;font-weight:800;">${escapeHtml(vs.volPill2 || "")}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SCENE 4: Grand Finale (Phone + Logo + «معًا نحو جزائر أكثر خضرة» + «اكتشف AppGreen») -->
        <div class="cinema-scene-layer ${activeIdx === 3 ? "active" : ""}" data-scene-layer="3">
          <div class="cinema-opening-bg"></div>
          <div class="cinema-grid-mesh"></div>
          <div class="cinema-center-stage">
            <div class="cinema-brand-column">
              <div class="cinema-logo-badge">
                <img src="${escapeHtml(assets.logo)}" alt="AppGreen Logo" />
                <div>
                  <div class="cinema-logo-badge-name">AppGreen</div>
                  <div class="cinema-logo-badge-sub">${escapeHtml(vs.brandOverlayTitle)}</div>
                </div>
              </div>
              <h3 class="cinema-stage-headline">${escapeHtml(vs.finaleSlogan || activeScene.title)}</h3>
              <p class="cinema-stage-subtext">${escapeHtml(vs.finaleSub || activeScene.desc)}</p>
              <div class="cinema-finale-actions">
                <a href="#campaigns-map" class="btn-cinema-discover">
                  <span>${escapeHtml(vs.btnDiscoverAppGreen || "اكتشف AppGreen")}</span>
                </a>
                <a href="#download" class="btn-cinema-secondary">
                  <span>${escapeHtml(vs.btnDownloadApp || "APK")}</span>
                </a>
              </div>
            </div>

            <div class="cinema-phone-device zoom-dolly">
              <div class="cinema-phone-screen-slider">
                <img src="${escapeHtml(assets.phoneScreenCampaigns)}" alt="AppGreen Finale Screen" class="active-screen" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top HUD Controls Bar -->
      <div class="video-hud-top">
        <div class="video-hud-pill">
          <span class="video-hud-dot"></span>
          <span id="cinemaHudBadgeText">${escapeHtml(activeScene.badge || disclosureBadge)}</span>
          <span style="opacity:0.75;direction:ltr;" id="cinemaTimeCounter">
            (${formatCinemaTime(cinemaElapsedMs / 1000)} / ${formatCinemaTime(totalDurationMs / 1000)})
          </span>
        </div>

        <div class="video-controls-bar">
          <button type="button" class="video-ctrl-btn" id="videoSoundToggleBtn">
            ${cinemaIsMuted ? ICONS.volumeMuted : ICONS.volumeOn}
            <span id="videoSoundToggleText">${escapeHtml(cinemaIsMuted ? vs.btnUnmute : vs.btnMute)}</span>
          </button>
          <button type="button" class="video-ctrl-btn" id="videoPlayToggleBtn">
            ${cinemaIsPlaying ? ICONS.pause : ICONS.play}
            <span id="videoPlayToggleText">${escapeHtml(cinemaIsPlaying ? vs.btnPause : vs.btnPlay)}</span>
          </button>
          <button type="button" class="video-ctrl-btn" id="videoReplayBtn" title="${escapeHtml(vs.btnReplay || "")}">
            <span>↺ ${escapeHtml(vs.btnReplay || "")}</span>
          </button>
          <button
            type="button"
            class="video-ctrl-btn"
            id="videoCloseBtn"
            style="display:${activeIdx === 0 && !openingVideoClosed ? "inline-flex" : "none"};border-color:rgba(248,113,113,0.5);"
            title="${escapeHtml(vs.btnCloseVideo || "إغلاق الفيديو")}"
          >
            <span>✕ ${escapeHtml(vs.btnCloseVideo || "إغلاق الفيديو")}</span>
          </button>
        </div>
      </div>

      <!-- Bottom Story Narrative & Telemetry Bar -->
      <div class="video-stage-bottom">
        <div class="video-brand-overlay">
          <img src="${escapeHtml(assets.logo)}" alt="AppGreen Logo" />
          <div>
            <div class="video-brand-title" id="cinemaBottomTitle">${escapeHtml(activeScene.title || vs.brandOverlayTitle)}</div>
            <div class="video-brand-tagline" id="cinemaBottomDesc">${escapeHtml(activeScene.desc || vs.brandOverlaySub)}</div>
          </div>
        </div>
        <div class="video-active-scene-caption">
          <span id="cinemaHudMetric1">${escapeHtml(activeScene.hudMetric1 || "")}</span>
          <span id="cinemaHudMetric2" style="color:#ECFDF5;font-size:0.75rem;">${escapeHtml(activeScene.hudMetric2 || "")}</span>
        </div>
      </div>
    `;

    // Render Continuous Timeline Scrubber & 4 Chapter Pills
    if (scenesGrid && scenes.length > 0) {
      const progressPct = Math.min(100, (cinemaElapsedMs / totalDurationMs) * 100);
      scenesGrid.innerHTML = `
        <div class="cinema-progress-track">
          <div class="cinema-progress-fill" id="cinemaProgressFill" style="width:${progressPct.toFixed(1)}%;"></div>
        </div>
        <div class="cinema-chapters-strip">
          ${scenes
            .map(
              (scene, idx) => `
            <button
              type="button"
              class="cinema-chapter-pill ${idx === activeIdx ? "active" : ""}"
              data-scene-idx="${idx}"
            >
              <span class="cinema-chapter-time">${escapeHtml(scene.timeRange || "")}</span>
              <span>${escapeHtml(scene.badge)}</span>
            </button>
          `
            )
            .join("")}
        </div>
      `;

      scenesGrid.querySelectorAll(".cinema-chapter-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-scene-idx"), 10) || 0;
          if (idx === 0) {
            openingVideoClosed = false;
            cinemaIsMuted = false;
          }
          const targetItem = items[idx] || items[0];
          cinemaElapsedMs = targetItem ? targetItem.startMs : 0;
          const prevIdx = currentVideoSceneIndex;
          currentVideoSceneIndex = idx;
          updateSoundControlUI();
          updateCinemaActiveFrame(TRANSLATIONS[currentLang], idx === 0 && (prevIdx !== 0 || !openingVideoClosed));
        });
      });
    }

    // Render Disclosure Bar
    if (specBanner) {
      specBanner.style.display = "flex";
      specBanner.innerHTML = `
        <div class="video-file-spec-text">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <strong style="color:#86EFAC;margin-inline-end:6px;">${escapeHtml(disclosureBadge)}:</strong>
            <span>${escapeHtml(disclosureNote)}</span>
          </div>
        </div>
      `;
    }

    // Bind Controls
    const soundBtn = document.getElementById("videoSoundToggleBtn");
    const playBtn = document.getElementById("videoPlayToggleBtn");
    const replayBtn = document.getElementById("videoReplayBtn");
    const closeBtn = document.getElementById("videoCloseBtn");
    const audioHintBtn = document.getElementById("cinemaVideoAudioHint");
    const openingVideoEl = document.getElementById("cinemaOpeningVideo");

    if (audioHintBtn) {
      audioHintBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCinemaAudio(cinemaIsMuted);
      });
    }

    if (openingVideoEl) {
      openingVideoEl.addEventListener("click", () => {
        toggleCinemaAudio(cinemaIsMuted);
      });
      openingVideoEl.addEventListener("ended", () => {
        closeOpeningVideoOnEnd();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeOpeningVideoOnEnd();
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        toggleCinemaAudio(cinemaIsMuted);
      });
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        cinemaIsPlaying = !cinemaIsPlaying;
        syncOpeningVideoPlayback(false);
        const currVs = TRANSLATIONS[currentLang].videoShowcase;
        playBtn.innerHTML = `
          ${cinemaIsPlaying ? ICONS.pause : ICONS.play}
          <span id="videoPlayToggleText">${escapeHtml(cinemaIsPlaying ? currVs.btnPause : currVs.btnPlay)}</span>
        `;
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        openingVideoClosed = false;
        cinemaElapsedMs = 0;
        cinemaIsPlaying = true;
        cinemaIsMuted = false;
        updateSoundControlUI();
        updateCinemaActiveFrame(TRANSLATIONS[currentLang], true);
      });
    }

    syncOpeningVideoPlayback(true);
    startCinemaEngine();
    attachCinemaViewportObserver(stageContainer);
  }

  function updateCinemaActiveFrame(dict, forceVideoReset) {
    if (!dict || !dict.videoShowcase) return;
    const vs = dict.videoShowcase;
    const scenes = Array.isArray(vs.scenes) ? vs.scenes : [];
    const prevSceneIdx = currentVideoSceneIndex;
    const { activeIdx, activeScene, totalDurationMs } = getActiveSceneFromElapsed(scenes, cinemaElapsedMs);
    currentVideoSceneIndex = activeIdx;

    const stageContainer = document.getElementById("videoStageFrame");
    if (stageContainer) {
      stageContainer.setAttribute("data-active-scene", activeScene.id || "opening");
      stageContainer.querySelectorAll(".cinema-scene-layer").forEach((layer) => {
        const layerIdx = parseInt(layer.getAttribute("data-scene-layer"), 10);
        const isActiveLayer = layerIdx === activeIdx && !(layerIdx === 0 && openingVideoClosed);
        layer.classList.toggle("active", isActiveLayer);
      });
    }

    const enteredOpening = forceVideoReset || (activeIdx === 0 && prevSceneIdx !== 0);
    syncOpeningVideoPlayback(enteredOpening);

    const badgeEl = document.getElementById("cinemaHudBadgeText");
    if (badgeEl) badgeEl.textContent = activeScene.badge || "";

    const timeEl = document.getElementById("cinemaTimeCounter");
    if (timeEl) {
      timeEl.textContent = `(${formatCinemaTime(cinemaElapsedMs / 1000)} / ${formatCinemaTime(totalDurationMs / 1000)})`;
    }

    const titleEl = document.getElementById("cinemaBottomTitle");
    if (titleEl) titleEl.textContent = activeScene.title || vs.brandOverlayTitle;

    const descEl = document.getElementById("cinemaBottomDesc");
    if (descEl) descEl.textContent = activeScene.desc || vs.brandOverlaySub;

    const m1El = document.getElementById("cinemaHudMetric1");
    if (m1El) m1El.textContent = activeScene.hudMetric1 || "";

    const m2El = document.getElementById("cinemaHudMetric2");
    if (m2El) m2El.textContent = activeScene.hudMetric2 || "";

    const progEl = document.getElementById("cinemaProgressFill");
    if (progEl) {
      const pct = Math.min(100, (cinemaElapsedMs / totalDurationMs) * 100);
      progEl.style.width = `${pct.toFixed(1)}%`;
    }

    const scenesGrid = document.getElementById("videoScenesGrid");
    if (scenesGrid) {
      scenesGrid.querySelectorAll(".cinema-chapter-pill").forEach((pill) => {
        const idx = parseInt(pill.getAttribute("data-scene-idx"), 10);
        pill.classList.toggle("active", idx === activeIdx);
      });
    }
  }

  function startCinemaEngine() {
    if (cinemaTimerId) clearInterval(cinemaTimerId);
    const stepMs = 200;
    cinemaTimerId = setInterval(() => {
      if (!cinemaIsPlaying || !cinemaInViewport) return;
      const dict = TRANSLATIONS[currentLang];
      if (!dict || !dict.videoShowcase) return;
      const scenes = dict.videoShowcase.scenes || [];
      const { items, totalDurationMs } = getCinemaSceneTimings(scenes);

      // While Scene 1 (app.mp4) is playing, sync elapsed time to the video's real playback time
      // and let its `ended` event close the video when it finishes.
      if (currentVideoSceneIndex === 0 && !openingVideoClosed) {
        const openingVideo = document.getElementById("cinemaOpeningVideo");
        if (openingVideo) {
          if (!openingVideo.paused && openingVideo.duration) {
            cinemaElapsedMs = Math.min((items[0] ? items[0].endMs - 50 : 15950), openingVideo.currentTime * 1000);
            updateCinemaActiveFrame(dict, false);
            return;
          } else {
            // Opening video is buffering, loading, or waiting for play in viewport.
            // DO NOT skip the video or advance to photo scenes! Keep waiting and attempt muted playback.
            if (cinemaIsPlaying && cinemaInViewport && openingVideo.paused) {
              const p = openingVideo.play();
              if (p && typeof p.catch === "function") p.catch(() => {});
            }
            return;
          }
        }
      }

      const nextMs = cinemaElapsedMs + stepMs;
      if (currentVideoSceneIndex === 0 && items[0] && nextMs >= items[0].endMs) {
        closeOpeningVideoOnEnd();
        return;
      }

      if (nextMs >= totalDurationMs) {
        // Once the opening video has finished and closed, loop through Scenes 2-4 without reopening the video
        const loopStartMs = openingVideoClosed && items[1] ? items[1].startMs : 0;
        cinemaElapsedMs = loopStartMs;
        updateCinemaActiveFrame(dict, !openingVideoClosed);
      } else {
        cinemaElapsedMs = nextMs;
        updateCinemaActiveFrame(dict, false);
      }
    }, stepMs);
  }

  function attachCinemaViewportObserver(targetEl) {
    if (cinemaObserverAttached || !targetEl || !("IntersectionObserver" in window)) return;
    cinemaObserverAttached = true;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          cinemaInViewport = entry.isIntersecting;
          syncOpeningVideoPlayback(false);
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(targetEl);
  }

  function renderCampaignsMapSection(dict) {
    const cardsStack = document.getElementById("campaignsCardsStack");
    const previewRealBtn = document.getElementById("previewRealCampaignScreenBtn");
    if (!cardsStack || !dict.campaignsMap) return;

    const cm = dict.campaignsMap;
    const cards = Array.isArray(cm.cards) ? cm.cards : [];

    cardsStack.innerHTML = cards
      .map((card) => {
        const [lat, lng] = getCampaignLatLng(card);
        const statusText = card.statusText || card.statusNote || "";
        return `
      <article
        class="campaign-showcase-card ${card.id === activeCampaignId ? "active" : ""}"
        data-campaign-id="${escapeHtml(card.id)}"
        data-lat="${lat}"
        data-lng="${lng}"
      >
        <div class="campaign-card-top">
          <span class="campaign-badge-tag">${escapeHtml(card.badge)}</span>
          <span class="campaign-location-pill">
            ${ICONS.pin}
            <span>${escapeHtml(card.location)}</span>
          </span>
        </div>
        <h3 class="campaign-card-title">${escapeHtml(card.title)}</h3>
        <div class="campaign-goal-box">${escapeHtml(card.goal)}</div>
        <p class="campaign-card-desc">${escapeHtml(card.desc)}</p>
        <div class="campaign-card-meta">
          <span class="campaign-status-text">${escapeHtml(statusText)}</span>
          <span class="campaign-focus-btn">
            ${ICONS.pin}
            <span>GPS: ${lat.toFixed(3)}, ${lng.toFixed(3)}</span>
          </span>
        </div>
      </article>
    `;
      })
      .join("");

    cardsStack.querySelectorAll(".campaign-showcase-card").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const cid = cardEl.getAttribute("data-campaign-id");
        const lat = parseFloat(cardEl.getAttribute("data-lat"));
        const lng = parseFloat(cardEl.getAttribute("data-lng"));
        activeCampaignId = cid;

        cardsStack.querySelectorAll(".campaign-showcase-card").forEach((el) => {
          el.classList.toggle("active", el.getAttribute("data-campaign-id") === cid);
        });

        if (leafletMapInstance && !isNaN(lat) && !isNaN(lng)) {
          leafletMapInstance.flyTo([lat, lng], 9, { duration: 0.9 });
          if (leafletMarkersMap[cid]) {
            leafletMarkersMap[cid].openPopup();
          }
        }
      });
    });

    if (previewRealBtn) {
      previewRealBtn.onclick = () => {
        openLightbox(
          "./assets/images/screenshots/screen_campaigns_list.png",
          cm.title,
          cm.illustrativeNoticeText || cm.illustrativeBannerText || ""
        );
      };
    }

    initOrUpdateAlgeriaMap(dict);
  }

  function initOrUpdateAlgeriaMap(dict) {
    const mapEl = document.getElementById("algeriaCampaignsMap");
    if (!mapEl || !dict.campaignsMap) return;

    const cm = dict.campaignsMap;
    const cards = Array.isArray(cm.cards) ? cm.cards : [];

    // If Leaflet is loaded, initialize or update interactive map
    if (typeof window.L !== "undefined") {
      if (!leafletMapInstance) {
        const center = (CONFIG.campaigns && CONFIG.campaigns.mapCenter) || [35.65, 3.45];
        const zoom = (CONFIG.campaigns && CONFIG.campaigns.mapZoom) || 6;

        leafletMapInstance = window.L.map("algeriaCampaignsMap", {
          scrollWheelZoom: false
        }).setView(center, zoom);

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap contributors"
        }).addTo(leafletMapInstance);
      }

      // Clear previous markers and add localized popups
      Object.values(leafletMarkersMap).forEach((m) => {
        if (m && leafletMapInstance) leafletMapInstance.removeLayer(m);
      });
      leafletMarkersMap = {};

      const greenPinIcon = window.L.divIcon({
        className: "appgreen-map-pin",
        html: `<div class="appgreen-pin-bubble"><span>🌲</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -34]
      });

      cards.forEach((card) => {
        const coords = getCampaignLatLng(card);
        const marker = window.L.marker(coords, { icon: greenPinIcon }).addTo(leafletMapInstance);
        marker.bindPopup(`
          <div style="font-family:inherit;min-width:190px;padding:4px 2px;">
            <div style="font-size:11px;font-weight:800;color:#1B5E38;margin-bottom:3px;">${escapeHtml(card.location)}</div>
            <div style="font-size:13.5px;font-weight:800;color:#0F2617;margin-bottom:5px;">${escapeHtml(card.title)}</div>
            <div style="font-size:11.5px;color:#3A5442;">${escapeHtml(card.goal)}</div>
          </div>
        `);
        marker.on("click", () => {
          activeCampaignId = card.id;
          document.querySelectorAll(".campaign-showcase-card").forEach((el) => {
            el.classList.toggle("active", el.getAttribute("data-campaign-id") === card.id);
          });
        });
        leafletMarkersMap[card.id] = marker;
      });

      if (leafletMarkersMap[activeCampaignId]) {
        leafletMarkersMap[activeCampaignId].openPopup();
      }
    } else {
      // Clean interactive SVG fallback if offline
      mapEl.innerHTML = `
        <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;color:#ECFDF5;background:radial-gradient(circle at 50% 35%, #1B5E38 0%, #092914 100%);">
          <div style="font-size:2.2rem;margin-bottom:10px;">🗺️</div>
          <h4 style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">${escapeHtml(cm.mapHeaderTitle || cm.mapTitle || "")}</h4>
          <p style="font-size:0.86rem;color:#A7F3D0;max-width:360px;">${escapeHtml(cm.mapHeaderSub || cm.mapLegendText || "")}</p>
        </div>
      `;
    }
  }

  function renderVolunteerContributeSection(dict) {
    const grid = document.getElementById("volunteerPathwaysGrid");
    if (!grid || !dict.volunteerContribute) return;

    const vc = dict.volunteerContribute;
    const pathwaysList = Array.isArray(vc.pathways)
      ? vc.pathways
      : Array.isArray(vc.cards)
      ? vc.cards
      : [];

    const pathwayIcons = {
      volunteer: ICONS.volunteer,
      contribute: ICONS.seedling
    };

    grid.innerHTML = pathwaysList
      .map(
        (card) => `
      <article class="pathway-card reveal">
        <div>
          <div class="pathway-card-top">
            <div class="pathway-icon-box">
              ${pathwayIcons[card.id] || ICONS.campaigns}
            </div>
            <span class="pathway-badge">${escapeHtml(card.badge)}</span>
          </div>
          <h3 class="pathway-title">${escapeHtml(card.title)}</h3>
          <p class="pathway-desc">${escapeHtml(card.desc)}</p>
          <div class="pathway-steps">
            ${(Array.isArray(card.steps) ? card.steps : [])
              .map(
                (step, idx) => `
              <div class="pathway-step-item">
                <span class="pathway-step-num">${idx + 1}</span>
                <span>${escapeHtml(step)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        <div>
          <a href="${escapeHtml(card.btnTarget || "#download")}" class="btn btn-primary-hero" style="width:100%;">
            <span>${escapeHtml(card.btnText)}</span>
          </a>
        </div>
      </article>
    `
      )
      .join("");
  }

  function renderAboutSection(dict) {
    const pillarsContainer = document.getElementById("aboutPillarsList");
    if (pillarsContainer) {
      const pillarIcons = [ICONS.campaigns, ICONS.services, ICONS.ai];
      pillarsContainer.innerHTML = dict.about.pillars
        .map(
          (p, idx) => `
        <div class="pillar-card reveal">
          <div class="pillar-icon">${pillarIcons[idx % pillarIcons.length]}</div>
          <div>
            <h4 class="pillar-title">${escapeHtml(p.title)}</h4>
            <p class="pillar-desc">${escapeHtml(p.desc)}</p>
          </div>
        </div>
      `
        )
        .join("");
    }

    const rolesContainer = document.getElementById("aboutRolesGrid");
    if (rolesContainer) {
      rolesContainer.innerHTML = dict.about.roles
        .map(
          (r) => `
        <div class="role-card reveal">
          <div class="role-card-top">
            <h4 class="role-title">${escapeHtml(r.role)}</h4>
            <span class="role-badge">${escapeHtml(r.badge)}</span>
          </div>
          <p class="role-desc">${escapeHtml(r.desc)}</p>
        </div>
      `
        )
        .join("");
    }

    const aboutFieldVideo = document.getElementById("aboutFieldVideo");
    const aboutSoundBtn = document.getElementById("aboutVideoSoundBtn");
    if (aboutFieldVideo && aboutSoundBtn) {
      const updateAboutSoundBtn = () => {
        const currVs = TRANSLATIONS[currentLang].videoShowcase;
        aboutSoundBtn.innerHTML = `
          ${aboutFieldVideo.muted ? ICONS.volumeMuted : ICONS.volumeOn}
          <span id="aboutVideoSoundText">${escapeHtml(aboutFieldVideo.muted ? currVs.btnUnmute : currVs.btnMute)}</span>
        `;
      };
      updateAboutSoundBtn();

      if (!aboutVideoBound) {
        aboutVideoBound = true;
        const toggleAboutAudio = () => {
          aboutFieldVideo.volume = 1.0;
          aboutFieldVideo.muted = !aboutFieldVideo.muted;
          if (!aboutFieldVideo.muted) {
            // Mute opening video if it's still playing so two audio tracks don't overlap
            toggleCinemaAudio(false);
            const p = aboutFieldVideo.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          }
          updateAboutSoundBtn();
        };
        aboutSoundBtn.addEventListener("click", toggleAboutAudio);
        aboutFieldVideo.addEventListener("click", toggleAboutAudio);
      }
    }
  }

  function renderFeaturesSection(dict) {
    const grid = document.getElementById("featuresGrid");
    if (!grid) return;

    grid.innerHTML = dict.features.items
      .map(
        (item) => `
      <article class="feature-card reveal">
        <div>
          <div class="feature-card-top">
            <div class="feature-icon-box">${ICONS[item.icon] || ICONS.campaigns}</div>
            <span class="feature-badge">${escapeHtml(item.badge)}</span>
          </div>
          <h3 class="feature-title">${escapeHtml(item.title)}</h3>
          <p class="feature-desc">${escapeHtml(item.desc)}</p>
        </div>
        <div class="feature-highlights">
          ${item.highlights
            .map(
              (h) => `
            <div class="feature-highlight-item">
              ${ICONS.check}
              <span>${escapeHtml(h)}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </article>
    `
      )
      .join("");
  }

  function renderScreenshotsSection(dict) {
    const filtersWrap = document.getElementById("screenshotFilters");
    const grid = document.getElementById("screenshotsGrid");
    if (!filtersWrap || !grid) return;

    const filterKeys = ["all", "campaigns", "market", "services", "account"];
    filtersWrap.innerHTML = filterKeys
      .map(
        (key) => `
      <button type="button" class="filter-tab-btn ${currentScreenshotFilter === key ? "active" : ""}" data-filter="${key}">
        ${escapeHtml(dict.screenshots.filters[key])}
      </button>
    `
      )
      .join("");

    filtersWrap.querySelectorAll(".filter-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentScreenshotFilter = btn.getAttribute("data-filter");
        renderScreenshotsSection(TRANSLATIONS[currentLang]);
        observeRevealElements();
      });
    });

    const filteredItems =
      currentScreenshotFilter === "all"
        ? dict.screenshots.items
        : dict.screenshots.items.filter((i) => i.category === currentScreenshotFilter);

    grid.innerHTML = filteredItems
      .map(
        (item) => `
      <div class="screenshot-card reveal" data-src="${escapeHtml(item.src)}" data-title="${escapeHtml(item.title)}" data-desc="${escapeHtml(item.desc)}">
        <div class="screenshot-frame">
          <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <div class="screenshot-zoom-overlay">
            <span class="screenshot-zoom-badge">${ICONS.zoom}</span>
          </div>
        </div>
        <h4 class="screenshot-title">${escapeHtml(item.title)}</h4>
        <p class="screenshot-desc">${escapeHtml(item.desc)}</p>
      </div>
    `
      )
      .join("");

    grid.querySelectorAll(".screenshot-card").forEach((card) => {
      card.addEventListener("click", () => {
        openLightbox(
          card.getAttribute("data-src"),
          card.getAttribute("data-title"),
          card.getAttribute("data-desc")
        );
      });
    });
  }

  let apkSizeDetectedOnce = false;

  function detectApkFileSizeAutomatically() {
    if (apkSizeDetectedOnce || typeof window.fetch !== "function") return;
    const apkUrl = CONFIG.download && CONFIG.download.apkDownloadUrl;
    if (!apkUrl) return;
    apkSizeDetectedOnce = true;

    window
      .fetch(apkUrl, { method: "HEAD" })
      .then((res) => {
        if (!res || !res.ok) return;
        const lenHeader = res.headers && res.headers.get("content-length");
        const bytes = lenHeader ? parseInt(lenHeader, 10) : 0;
        if (bytes > 0) {
          const mb = (bytes / (1024 * 1024)).toFixed(2) + " MB";
          CONFIG.app.apkFileSize = mb;
          const specSizeValue = document.getElementById("specSizeValue");
          if (specSizeValue) specSizeValue.textContent = mb;
          const metaPill = document.getElementById("downloadBtnMetaPill");
          if (metaPill) {
            const ver = CONFIG.download.versionLabel || "v1.0.0 TEST";
            metaPill.textContent = `${ver} • ${mb}`;
          }
        }
      })
      .catch(() => {
        // Keep configured fallback size ("37.57 MB")
      });
  }

  function renderDownloadSection(dict) {
    const statusPill = document.getElementById("downloadStatusPill");
    const statusNotice = document.getElementById("downloadStatusNotice");
    const unknownSourcesEl = document.getElementById("downloadUnknownSourcesNote");
    const actionWrap = document.getElementById("downloadActionsWrap");
    const specSizeValue = document.getElementById("specSizeValue");
    const stepsList = document.getElementById("downloadStepsList");

    const isReady = CONFIG.download.isReleasePublished && CONFIG.download.apkDownloadUrl.trim() !== "";
    const apkFileName = CONFIG.download.apkFileName || "AppGreen-Test-v1.0.apk";
    const versionLabel = CONFIG.download.versionLabel || "v1.0.0 TEST";
    const sizeText = CONFIG.app.apkFileSize ? CONFIG.app.apkFileSize : dict.download.specSizePending;

    if (statusPill) {
      statusPill.className = `download-status-pill ${isReady ? "ready" : "pending"}`;
      statusPill.textContent = isReady ? dict.download.statusReadyBadge : dict.download.statusPendingBadge;
    }

    if (statusNotice) {
      statusNotice.textContent = isReady ? dict.download.statusReadyNotice : dict.download.statusPendingNotice;
    }

    if (unknownSourcesEl && dict.download.unknownSourcesNote) {
      unknownSourcesEl.textContent = dict.download.unknownSourcesNote;
    }

    if (specSizeValue) {
      specSizeValue.textContent = sizeText;
    }

    if (actionWrap) {
      let html = "";
      if (isReady) {
        html += `
          <a
            href="${escapeHtml(CONFIG.download.apkDownloadUrl)}"
            download="${escapeHtml(apkFileName)}"
            class="btn-apk-download ready"
            id="directApkDownloadBtn"
          >
            <svg class="android-btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16V9a7 7 0 0 1 14 0v7"/><line x1="8" y1="3" x2="6" y2="6"/><line x1="16" y1="3" x2="18" y2="6"/><circle cx="9.5" cy="10.5" r="0.8" fill="currentColor"/><circle cx="14.5" cy="10.5" r="0.8" fill="currentColor"/><rect x="3" y="10" width="2" height="6" rx="1"/><rect x="19" y="10" width="2" height="6" rx="1"/><path d="M7 16v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4"/><path d="M14 16v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4"/></svg>
            <span>${escapeHtml(dict.download.btnReadyText)}</span>
            <span class="apk-btn-meta-pill" id="downloadBtnMetaPill">${escapeHtml(versionLabel)} • ${escapeHtml(sizeText)}</span>
          </a>
        `;
      } else {
        html += `
          <button type="button" class="btn-apk-download disabled" aria-disabled="true" title="${escapeHtml(dict.download.statusPendingNotice)}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${escapeHtml(dict.download.btnPendingText)}</span>
          </button>
        `;
      }

      if (CONFIG.download.releasesPageUrl && CONFIG.download.releasesPageUrl.trim() !== "") {
        html += `
          <a href="${escapeHtml(CONFIG.download.releasesPageUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary-hero">
            <span>${escapeHtml(dict.download.btnReleasesPage)}</span>
          </a>
        `;
      }
      actionWrap.innerHTML = html;
    }

    if (stepsList) {
      stepsList.innerHTML = dict.download.steps
        .map(
          (step, idx) => `
        <div class="download-step-item">
          <span class="step-num">${idx + 1}</span>
          <span>${escapeHtml(step)}</span>
        </div>
      `
        )
        .join("");
    }

    detectApkFileSizeAutomatically();
  }

  // ==========================================================================
  // 4. Privacy Policy & Terms of Service Pages
  // ==========================================================================

  function renderPrivacyPage(dict) {
    const confirmCard = document.getElementById("privacyConfirmationCard");
    if (confirmCard && dict.privacyPage.confirmationItems) {
      confirmCard.innerHTML = `
        <div class="confirmation-alert-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${escapeHtml(dict.privacyPage.confirmationBoxTitle)}</span>
        </div>
        <p class="confirmation-alert-intro">${escapeHtml(dict.privacyPage.confirmationBoxIntro)}</p>
        <ul class="confirmation-alert-list">
          ${dict.privacyPage.confirmationItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      `;
    }

    renderLegalSections(dict.privacyPage.sections, "legalSectionsContainer", "legalSearchInput");
  }

  function renderTermsPage(dict) {
    renderLegalSections(dict.termsPage.sections, "legalSectionsContainer", "legalSearchInput");
  }

  function renderLegalSections(sections, containerId, searchInputId) {
    const container = document.getElementById(containerId);
    const searchInput = document.getElementById(searchInputId);
    if (!container) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = !query
      ? sections
      : sections.filter(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            s.paragraphs.some((p) => p.toLowerCase().includes(query))
        );

    container.innerHTML = filtered
      .map(
        (sec, idx) => `
      <div class="legal-accordion-item ${idx === 0 || query ? "open" : ""}" data-section-id="${escapeHtml(sec.id)}">
        <button type="button" class="legal-accordion-header">
          <span>${escapeHtml(sec.title)}</span>
          <span class="legal-accordion-chevron">${ICONS.chevronDown}</span>
        </button>
        <div class="legal-accordion-body">
          ${sec.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        </div>
      </div>
    `
      )
      .join("");

    container.querySelectorAll(".legal-accordion-header").forEach((header) => {
      header.addEventListener("click", () => {
        const item = header.closest(".legal-accordion-item");
        if (item) item.classList.toggle("open");
      });
    });
  }

  // ==========================================================================
  // 5. Lightbox, Clipboard Toast & Scroll Observers
  // ==========================================================================

  function openLightbox(src, title, desc) {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImg");
    const titleEl = document.getElementById("lightboxTitle");
    const descEl = document.getElementById("lightboxDesc");
    if (!modal || !img) return;

    img.src = src;
    img.alt = title || "AppGreen Screenshot";
    if (titleEl) titleEl.textContent = title || "";
    if (descEl) descEl.textContent = desc || "";
    modal.classList.add("open");
  }

  function closeLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (modal) modal.classList.remove("open");
  }

  function showToast(message) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function observeRevealElements() {
    const els = document.querySelectorAll(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================================================
  // 6. DOM Ready Event Listeners
  // ==========================================================================

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setLanguage(currentLang);

    // Language Switcher Buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        setLanguage(lang);
      });
    });

    // Theme Toggle Button
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", toggleTheme);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
      });
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
      });
    }

    // Header scroll shadow
    const siteHeader = document.getElementById("siteHeader");
    window.addEventListener("scroll", () => {
      if (siteHeader) {
        siteHeader.classList.toggle("scrolled", window.scrollY > 16);
      }
    });

    // Hero Phone Mockups click -> open Lightbox
    document.querySelectorAll(".phone-mockup[data-src]").forEach((mockup) => {
      mockup.addEventListener("click", () => {
        const src = mockup.getAttribute("data-src");
        openLightbox(src, "AppGreen", "");
      });
    });

    // Lightbox Close
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener("click", closeLightbox);
    }
    if (lightboxModal) {
      lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    // Copy Email Button
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener("click", () => {
        const email = CONFIG.contact.email;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            showToast(TRANSLATIONS[currentLang].contact.copiedToast);
          });
        } else {
          showToast(TRANSLATIONS[currentLang].contact.copiedToast);
        }
      });
    }

    // Legal Search Input & Expand/Collapse All
    const legalSearchInput = document.getElementById("legalSearchInput");
    if (legalSearchInput) {
      legalSearchInput.addEventListener("input", () => {
        const pageType = document.body.getAttribute("data-page");
        if (pageType === "privacy") renderPrivacyPage(TRANSLATIONS[currentLang]);
        if (pageType === "terms") renderTermsPage(TRANSLATIONS[currentLang]);
      });
    }

    const expandAllBtn = document.getElementById("expandAllBtn");
    const collapseAllBtn = document.getElementById("collapseAllBtn");
    if (expandAllBtn) {
      expandAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".legal-accordion-item").forEach((el) => el.classList.add("open"));
      });
    }
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".legal-accordion-item").forEach((el) => el.classList.remove("open"));
      });
    }
  });
})();

