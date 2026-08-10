export type Locale = "id" | "en";

export interface Translations {
  landing: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroSubtitleBold: string;
    ctaPrimary: string;
    ctaFloating: string;
    tryFree: string;
    chatNotForm: string;
    activeInMinutes: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    howItWorksCta: string;
    featuresEyebrow: string;
    featuresTitle: string;
    featuresTitleAccent: string;
    dashboardBadge: string;
    dashboardTitle: string;
    dashboardDesc: string;
    dashboardTags: string[];
    domainBadge: string;
    domainTitle: string;
    domainDesc: string;
    domainTags: string[];
    templatesEyebrow: string;
    templatesTitle: string;
    templatesTitleAccent: string;
    templatesDesc: string;
    whyEyebrow: string;
    whyTitle: string;
    whyTitleAccent: string;
    statsLabel1: string;
    statsValue1: string;
    statsLabel2: string;
    statsValue2: string;
    statsLabel3: string;
    statsValue3: string;
    statsLabel4: string;
    statsValue4: string;
    pricingTitle: string;
    pricingSubtitle: string;
    monthly: string;
    yearly: string;
    saveBadge: string;
    saveText: string;
    popularBadge: string;
    priceFree: string;
    priceFreePeriod: string;
    perYear: string;
    monthlyEq: string;
    promo: string;
    perMonth: string;
    perYear2: string;
    startFree: string;
    choosePlan: string;
    ctaBannerTitle: string;
    ctaBannerDesc: string;
    ctaBannerCta: string;
    ctaBannerWhatsapp: string;
    ctaBannerHelper: string;
    ctaBannerContact: string;
    footerCopyright: string;
    footerPrivacy: string;
    footerTerms: string;
    footerRefund: string;
    footerContact: string;
    footerLogin: string;
    footerHome: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    featureChatTitle: string;
    featureChatDesc: string;
    featureDomainTitle: string;
    featureDomainDesc: string;
    featureAnalyticsTitle: string;
    featureAnalyticsDesc: string;
    featureEditTitle: string;
    featureEditDesc: string;
    featureCustomTitle: string;
    featureCustomDesc: string;
    featureWaTitle: string;
    featureWaDesc: string;
    featureSeoTitle: string;
    featureSeoDesc: string;
    featureSubTitle: string;
    featureSubDesc: string;
    featureCatalogTitle: string;
    featureCatalogDesc: string;
    featureMenuTitle: string;
    featureMenuDesc: string;
    navDashboard: string;
    navLogin: string;
    navCreateNew: string;
    navStartFree: string;
    mockupGreeting: string;
    mockupPickType: string;
    mockupChips: string[];
    mockupGenerating: string;
    mockupReady: string;
    mockupStep: string;
    showcaseCreate: string;
    showcaseFallback: string;
    categoryKuliner: string;
    categoryJasa: string;
    categoryProduk: string;
  };
  auth: {
    loginTitle: string;
    loginDesc: string;
    loginCardTitle: string;
    loginCardDesc: string;
    loginFooterHome: string;
    loginFooterRegister: string;
    loginFooterForgot: string;
    loginBadge: string;
    loginStats1Label: string;
    loginStats1Value: string;
    loginStats1Helper: string;
    loginStats2Label: string;
    loginStats2Value: string;
    loginStats2Helper: string;
    loginCardEyebrow: string;
    loginSending: string;
    loginWhatsappHint: string;
    loginOrContinueWith: string;
    loginOrEmail: string;
    loginEmailLabel: string;
    loginEmailPlaceholder: string;
    loginEmailHint: string;
    loginSendCodeWhatsapp: string;
    loginSendCode: string;
    loginPasswordTitle: string;
    loginPasswordDesc: string;
    loginEmailField: string;
    loginPasswordLabel: string;
    loginForgotPassword: string;
    loginPasswordPlaceholder: string;
    loginHidePassword: string;
    loginShowPassword: string;
    loginLoginLoading: string;
    loginSubmitPassword: string;
    loginCodeSentTo: string;
    loginCodeLabel: string;
    loginTrustDevice: string;
    loginBack: string;
    loginVerifying: string;
    loginVerifyOtp: string;
    loginResendCountdown: string;
    loginResend: string;
    loginLinkSent: string;
    loginOtherOptions: string;
    loginOptionWhatsapp: string;
    loginOptionEmail: string;
    loginOptionPassword: string;
    errorEmailValid: string;
    errorPhoneValid: string;
    errorFixFields: string;
    errorOtpInvalid: string;
    errorCredentialsInvalid: string;
    errorWrongCredentials: string;
    toastCodeSent: string;
    errorSendCode: string;
    toastOtpVerified: string;
    errorOtpInvalidExpired: string;
    loginSuccess: string;
    toastSessionExpired: string;
    toastSessionExpiredDesc: string;
    toastDismiss: string;
    errorMagicLinkInvalid: string;
    registerBadge: string;
    registerTitle: string;
    registerDesc: string;
    registerCardEyebrow: string;
    registerCardTitle: string;
    registerCardDesc: string;
    registerFooterLogin: string;
    registerFullName: string;
    registerEmail: string;
    registerWhatsapp: string;
    registerPassword: string;
    registerLoading: string;
    registerSubmit: string;
    registerSuccess: string;
    errorRegisterFailed: string;
    forgotBadge: string;
    forgotTitle: string;
    forgotDesc: string;
    forgotCardEyebrow: string;
    forgotCardTitle: string;
    forgotCardDesc: string;
    forgotFooterLogin: string;
    forgotFooterRegister: string;
    forgotEmail: string;
    forgotEmailPlaceholder: string;
    forgotSending: string;
    forgotSubmit: string;
    forgotSentSuccess: string;
    forgotSentToast: string;
    errorForgotSend: string;
    forgotStat1Label: string;
    forgotStat1Value: string;
    forgotStat1Helper: string;
    forgotStat2Label: string;
    forgotStat2Value: string;
    forgotStat2Helper: string;
    resetBadge: string;
    resetTitle: string;
    resetDesc: string;
    resetCardEyebrow: string;
    resetCardTitle: string;
    resetCardDesc: string;
    resetCardDescNoToken: string;
    resetFooterLogin: string;
    resetFooterRequest: string;
    resetNewPassword: string;
    resetNewPasswordPlaceholder: string;
    resetConfirmPassword: string;
    resetUpdating: string;
    resetUpdate: string;
    errorResetTokenMissing: string;
    errorPasswordMismatch: string;
    toastResetSuccess: string;
    errorResetFailed: string;
    resetStat1Label: string;
    resetStat1Value: string;
    resetStat1Helper: string;
    resetStat2Label: string;
    resetStat2Value: string;
    resetStat2Helper: string;
    verifyBadge: string;
    verifyTitle: string;
    verifyDesc: string;
    verifyCardEyebrow: string;
    verifyCardTitle: string;
    verifyCardIdle: string;
    verifyCardLoading: string;
    verifyFooterLogin: string;
    verifyFooterHome: string;
    verifyLoadingSpinner: string;
    verifyBackToLogin: string;
    verifySuccessTitle: string;
    verifyGoToLogin: string;
    verifyFailedTitle: string;
    verifySentTo: string;
    verifyNoToken: string;
    verifyDone: string;
    errorVerifyFailed: string;
    verifyStat1Label: string;
    verifyStat1Value: string;
    verifyStat1Helper: string;
    verifyStat2Label: string;
    verifyStat2Value: string;
    verifyStat2Helper: string;
    inviteProcessing: string;
    inviteSuccess: string;
    inviteSuccessDesc: string;
    inviteDashboard: string;
    inviteFailedTitle: string;
    inviteBackToLogin: string;
    loginResetSuccess: string;
    loginPasswordChanged: string;
  };
  sections: {
    faqEyebrow: string;
    catalogEyebrow: string;
    benefitsEyebrow: string;
    aboutEyebrowFallback: string;
    aboutImageAlt: string;
    ctaFallback: string;
    footerBlog: string;
    footerSocial: string;
    footerBrand: string;
    footerCopyrightFallback: string;
    heroImageAlt: string;
  };
  common: {
    dashboard: string;
    menu: string;
    loading: string;
    saving: string;
    failed: string;
    retry: string;
    backToHome: string;
    contact: string;
    privacy: string;
    terms: string;
    refund: string;
    allRightsReserved: string;
    builtWith: string;
  };
  dashboard: {
    authenticating: string;
    createWebsite: string;
    mainNav: string;
    switchAccentBlue: string;
    switchAccentMonochrome: string;
    switchLight: string;
    switchDark: string;
    pro: string;
    consoleTitle: string;
    adminWorkspace: string;
    mode: string;
    upgrade: string;
    authenticated: string;
    locked: string;
    appearance: string;
    logout: string;
    backToWebsites: string;
    subDashboard: string;
    subSites: string;
    subDomains: string;
    subLeads: string;
    subAnalytics: string;
    subSettings: string;
    newWebsiteAi: string;
    loadingConsole: string;
    preparingWorkspace: string;
    signedOutLocally: string;
    refreshed: string;
    welcome: string;
    welcomeDesc: string;
    newWebsite: string;
    usingFreePlan: string;
    upgradeToProDesc: string;
    upgradeToPro: string;
    statWebsites: string;
    statLeads: string;
    statVisitors: string;
    statHealth: string;
    sitesPublished: string;
    newProspects: string;
    setupLeadForm: string;
    thisWeek: string;
    allSystemsNormal: string;
    usageMeter: string;
    meterWebsites: string;
    meterAiGenerate: string;
    meterSectionRegen: string;
    meterDesignRegen: string;
    recentActivity: string;
    leadNew: string;
    siteUpdated: string;
    noActivity: string;
    aiInsights: string;
    insightTraffic: string;
    insightNoTraffic: string;
    insightLeads: string;
    insightCreateSite: string;
    admin: {
      platformOverview: string;
      platformStats: string;
      loadingMetrics: string;
      allTenants: string;
      plans: string;
      totalTenants: string;
      totalUsers: string;
      totalSites: string;
      activePlans: string;
      newUsers7d: string;
      in7Days: string;
      recentTenants: string;
      viewAll: string;
      noTenants: string;
      systemHealth: string;
      svcDatabase: string;
      svcCache: string;
      svcAiProvider: string;
      statusHealthy: string;
      statusDown: string;
      statusDisabled: string;
      statusUnknown: string;
      viewDetailedStatus: string;
      quickActions: string;
      qxHealth: string;
      qxAnnounce: string;
      qxUsers: string;
      qxAuditLogs: string;
      platformManagement: string;
      qlTenantsDesc: string;
      qlPlansDesc: string;
      qlHealthDesc: string;
      qlAnnounceDesc: string;
    };
    nav: {
      sectionDashboard: string;
      sectionWebsiteBuilder: string;
      sectionSalesReferral: string;
      sectionSystem: string;
      overview: string;
      notifications: string;
      plans: string;
      health: string;
      announcements: string;
      commissions: string;
      tenants: string;
      templates: string;
      designAssets: string;
      metrics: string;
      sites: string;
      domains: string;
      leads: string;
      analytics: string;
      salesReferral: string;
      salesCommissions: string;
      team: string;
      upgrade: string;
      settings: string;
    };
    sites: {
      close: string;
      cancel: string;
      deleteTitle: string;
      deleteBody: string;
      deleteWarning: string;
      deleteFreeNotice: string;
      deleting: string;
      deleteConfirm: string;
      renameTitle: string;
      renameDesc: string;
      save: string;
      publishTitle: string;
      publishOneStep: string;
      publishReady: string;
      subdomainLabel: string;
      subdomainAvailable: string;
      subdomainInvalidHint: string;
      subdomainHint: string;
      connectCustomDomain: string;
      customDomainDesc: string;
      customDomainLink: string;
      launching: string;
      launchWebsite: string;
      errorLoadSites: string;
      connectingWorkspace: string;
      toastPublished: string;
      toastPublishFailed: string;
      toastUnpublished: string;
      toastUnpublishFailed: string;
      toastRenamed: string;
      toastRenameFailed: string;
      toastDeleted: string;
      toastDeleteFailed: string;
      toastDuplicating: string;
      toastDuplicateFailed: string;
      toastDuplicated: string;
      toastDuplicateError: string;
      publishedPrefix: string;
      updatedPrefix: string;
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
      yesterday: string;
      daysAgo: string;
      searchPlaceholder: string;
      reset: string;
      filterAll: string;
      filterDraft: string;
      filterPublished: string;
      loadingSites: string;
      noSitesMatch: string;
      noSitesMatchDesc: string;
      clearSearch: string;
      statusLive: string;
      statusDraft: string;
      moreOptions: string;
      actionDuplicate: string;
      actionRename: string;
      actionUnpublish: string;
      actionDelete: string;
      domainNotSet: string;
      copyLink: string;
      editPreview: string;
      viewSite: string;
      publish: string;
      linkBlog: string;
      linkCatalog: string;
      linkMenu: string;
      linkSeo: string;
      linkIntegrations: string;
      linkTestimonials: string;
      loadMore: string;
      congratsTitle: string;
      congratsHeading: string;
      congratsBody: string;
      openWebsite: string;
      copyLinkTitle: string;
      checkTip: string;
      done: string;
    };
  };
}

export const translations: Record<Locale, Translations> = {
  id: {
    landing: {
      badge: "AI Website Builder untuk Bisnis Indonesia",
      heroTitle: "Website Bisnis<br />Siap dalam 5 Menit",
      heroSubtitle: "Chat singkat dengan AI, pilih gaya visual, dan website bisnis Anda siap dipublish.",
      heroSubtitleBold: "Tanpa coding, tanpa form panjang.",
      ctaPrimary: "Buat Website Sekarang",
      ctaFloating: "Buat Website Sekarang",
      tryFree: "Gratis dicoba",
      chatNotForm: "Chat AI, bukan form",
      activeInMinutes: "Aktif dalam menit",
      howItWorksTitle: 'Dari chat ke website dalam <span class="text-primary">4 langkah mudah</span>',
      howItWorksSubtitle: "CARA KERJANYA",
      howItWorksCta: "Coba Sekarang — Gratis",
      featuresEyebrow: "FITUR UNGGULAN",
      featuresTitle: 'Lebih dari sekadar <span class="text-primary">website biasa</span>',
      featuresTitleAccent: "website biasa",
      dashboardBadge: "Dashboard",
      dashboardTitle: "Pantau & kembangkan bisnis Anda",
      dashboardDesc: "Dashboard lengkap dengan analytics pengunjung, manajemen leads, dan daftar website dalam satu tempat.",
      dashboardTags: ["Analytics real-time", "Manajemen leads", "Daftar website"],
      domainBadge: "Domain & SEO",
      domainTitle: "Domain sendiri & SEO otomatis",
      domainDesc: "Hubungkan domain custom Anda, SEO title/description, OG tags, JSON-LD, sitemap — semuanya diurus oleh AI.",
      domainTags: ["Custom domain", "SEO otomatis", "Structured data", "Sitemap"],
      templatesEyebrow: "CONTOH HASIL AI",
      templatesTitle: 'Website yang dihasilkan <span class="text-primary">untuk berbagai bisnis</span>',
      templatesTitleAccent: "untuk berbagai bisnis",
      templatesDesc: "AI memilih template dan menulis konten secara otomatis. Ini contoh hasil untuk beberapa jenis bisnis.",
      whyEyebrow: "KENAPA WEBJOZ",
      whyTitle: 'Semua yang Anda butuhkan, <span class="text-primary">sudah tersedia</span>',
      whyTitleAccent: "sudah tersedia",
      statsLabel1: "Waktu generate",
      statsValue1: "< 5 menit",
      statsLabel2: "Online otomatis",
      statsValue2: "100%",
      statsLabel3: "Satu dashboard",
      statsValue3: "8 fitur",
      statsLabel4: "Powered",
      statsValue4: "AI",
      pricingTitle: "Harga Sederhana",
      pricingSubtitle: "Mulai gratis, kembangkan kapan pun Anda siap.",
      monthly: "Bulanan",
      yearly: "Tahunan",
      saveBadge: "Hemat ~16%",
      saveText: "🎉 Hemat hingga 2 bulan dengan langganan paket per tahun",
      popularBadge: "Terpopuler",
      priceFree: "Rp 0",
      priceFreePeriod: "/bulan · selamanya",
      perYear: "/tahun",
      monthlyEq: "(Setara Rp {value}/bln)",
      promo: "Promo",
      perMonth: "/bulan",
      perYear2: "/tahun",
      startFree: "Mulai Gratis",
      choosePlan: "Pilih {plan} ({cycle})",
      ctaBannerTitle: "Siap buat website bisnis Anda?",
      ctaBannerDesc: "Mulai gratis sekarang. Tidak perlu kartu kredit — cukup chat singkat dengan AI dan website Anda siap.",
      ctaBannerCta: "Mulai Gratis Sekarang",
      ctaBannerWhatsapp: "Konsultasi via WhatsApp",
      ctaBannerHelper: "Butuh custom design atau company profile?",
      ctaBannerContact: "Hubungi tim kami",
      footerCopyright: "© {year} Webjoz by Giwangan Studio. AI Website Builder untuk Bisnis Indonesia.",
      footerPrivacy: "Kebijakan Privasi",
      footerTerms: "Syarat & Ketentuan",
      footerRefund: "Kebijakan Refund",
      footerContact: "Hubungi Kami",
      footerLogin: "Login",
      footerHome: "Beranda",
      step1Title: "Kenalkan Bisnis Anda",
      step1Desc: "Chat dengan AI dan beri tahu nama serta apa bisnis yang Anda jalankan. Semuanya lewat percakapan santai.",
      step2Title: "Berikan Detail Singkat",
      step2Desc: "Ceritakan sedikit tentang layanan, area jangkauan, atau apa yang membuat bisnis Anda spesial.",
      step3Title: "Pilih Kategori & Mood",
      step3Desc: "Pilih jenis industri dan suasana (mood) desain yang cocok agar AI bisa menyesuaikan tampilan website Anda.",
      step4Title: "Generate & Publikasikan",
      step4Desc: "Website selesai dibuat dalam hitungan detik. Langsung review, edit bagian mana pun, dan publikasikan segera.",
      featureChatTitle: "Chat AI, Bukan Form",
      featureChatDesc: "Tidak perlu isi form panjang. Cukup chat dengan AI, semua konten dan desain dibuat otomatis.",
      featureDomainTitle: "Custom Domain",
      featureDomainDesc: "Hubungkan domain sendiri dengan panduan CNAME. Cocok untuk branding profesional perusahaan Anda.",
      featureAnalyticsTitle: "Analytics & Leads",
      featureAnalyticsDesc: "Pantau pengunjung website dan kumpulkan leads langsung dari form kontak — semuanya di satu dashboard.",
      featureEditTitle: "Edit Per Section",
      featureEditDesc: "Tidak puas dengan bagian tertentu? Regenerate per section dengan AI, atau edit manual di editor.",
      featureCustomTitle: "Kustomisasi Penuh",
      featureCustomDesc: "Hero, profil, layanan, testimoni, menu, FAQ, footer, hingga SEO — semua konten bisa diedit dan disesuaikan sendiri kapan saja.",
      featureWaTitle: "WhatsApp Terintegrasi",
      featureWaDesc: "Tombol WhatsApp otomatis terpasang di setiap website. Pelanggan bisa langsung chat dalam satu klik.",
      featureSeoTitle: "SEO Siap Pakai",
      featureSeoDesc: "Title, description, OG tags, JSON-LD structured data, dan sitemap — semua sudah diurus oleh AI.",
      featureSubTitle: "Subdomain Instan",
      featureSubDesc: "Setiap website langsung aktif di subdomain Webjoz. Tidak perlu setup server atau DNS manual.",
      featureCatalogTitle: "Katalog Produk",
      featureCatalogDesc: "Tampilkan koleksi produk atau layanan Anda dengan katalog yang rapi, profesional, dan menarik.",
      featureMenuTitle: "Menu Jualan",
      featureMenuDesc: "Mudahkan pelanggan memesan dengan fitur menu interaktif yang siap digunakan untuk bertransaksi.",
      navDashboard: "Dashboard",
      navLogin: "Login",
      navCreateNew: "Buat Website Baru",
      navStartFree: "Mulai Gratis",
      mockupGreeting: "Halo! Apa nama bisnis Anda?",
      mockupPickType: "Keren! 👍 Pilih jenis bisnis:",
      mockupChips: ["🍜 Kuliner", "🔧 Jasa", "🛍 Produk"],
      mockupGenerating: "⚡ AI sedang generate...",
      mockupReady: "✅ Website siap!",
      mockupStep: "Langkah 2 dari 5",
      showcaseCreate: "Buat",
      showcaseFallback: "Website",
      categoryKuliner: "Kuliner",
      categoryJasa: "Jasa",
      categoryProduk: "Produk",
    },
    auth: {
      loginTitle: "Lanjutkan kelola website bisnis Anda.",
      loginDesc: "Login untuk mengelola website, edit konten, lihat analytics, dan pantau performa — semua dari satu dashboard.",
      loginCardTitle: "Login",
      loginCardDesc: "Gunakan WhatsApp, email OTP, atau password untuk mengakses dashboard.",
      loginFooterHome: "Beranda",
      loginFooterRegister: "Buat akun",
      loginFooterForgot: "Lupa password",
      loginBadge: "Webjoz Console",
      loginStats1Label: "AI Builder",
      loginStats1Value: "Chat-Based",
      loginStats1Helper: "Cukup chat dengan AI, website langsung jadi.",
      loginStats2Label: "Mobile-First",
      loginStats2Value: "Optimized",
      loginStats2Helper: "Semua template dioptimalkan untuk tampilan mobile dan siap iklan.",
      loginCardEyebrow: "Login untuk melanjutkan",
      loginSending: "Mengirim kode...",
      loginWhatsappHint: "Link atau kode OTP dikirim via WhatsApp. Nomor baru? Akun otomatis dibuat.",
      loginOrContinueWith: "atau lanjutkan dengan",
      loginOrEmail: "atau masuk dengan email",
      loginEmailLabel: "Alamat email",
      loginEmailPlaceholder: "Alamat email kamu",
      loginEmailHint: "Link atau kode OTP dikirim via email. Email baru? Akun otomatis dibuat.",
      loginSendCodeWhatsapp: "Kirim Kode OTP via WhatsApp",
      loginSendCode: "Kirim Kode OTP",
      loginPasswordTitle: "Login dengan password",
      loginPasswordDesc: "Gunakan email dan password akun kamu.",
      loginEmailField: "Email",
      loginPasswordLabel: "Password",
      loginForgotPassword: "Lupa password?",
      loginPasswordPlaceholder: "Password akun",
      loginHidePassword: "Sembunyikan password",
      loginShowPassword: "Tampilkan password",
      loginLoginLoading: "Login",
      loginSubmitPassword: "Login dengan password",
      loginCodeSentTo: "Kode dikirim via {channel} ke {target}. Berlaku 5 menit.",
      loginCodeLabel: "Kode OTP",
      loginTrustDevice: "Percayai perangkat ini",
      loginBack: "Kembali",
      loginVerifying: "Memverifikasi",
      loginVerifyOtp: "Verifikasi OTP",
      loginResendCountdown: "Kirim ulang ({sec}s)",
      loginResend: "Tidak menerima kode? Kirim ulang",
      loginLinkSent: "Link masuk telah dikirim. Buka link tersebut di perangkat ini untuk melanjutkan.",
      loginOtherOptions: "Opsi lain",
      loginOptionWhatsapp: "WhatsApp",
      loginOptionEmail: "Email OTP",
      loginOptionPassword: "Password",
      errorEmailValid: "Masukkan alamat email yang valid.",
      errorPhoneValid: "Masukkan nomor WhatsApp yang valid.",
      errorFixFields: "Perbaiki field yang ditandai.",
      errorOtpInvalid: "Masukkan kode OTP 6 digit.",
      errorCredentialsInvalid: "Masukkan email dan password yang valid.",
      errorWrongCredentials: "Email atau password salah.",
      toastCodeSent: "Kode terkirim. Silakan cek pesan Anda.",
      errorSendCode: "Gagal mengirim kode. Coba lagi.",
      toastOtpVerified: "Kode OTP terverifikasi. Selamat datang kembali.",
      errorOtpInvalidExpired: "Kode OTP tidak valid atau kedaluwarsa",
      loginSuccess: "Berhasil masuk. Selamat datang kembali.",
      toastSessionExpired: "Sesi Kedaluwarsa",
      toastSessionExpiredDesc: "Sesi Anda telah kedaluwarsa. Silakan masuk kembali untuk melanjutkan.",
      toastDismiss: "Tutup",
      errorMagicLinkInvalid: "Link masuk tidak valid atau kedaluwarsa",
      registerBadge: "Webjoz Console",
      registerTitle: "Mulai kelola bisnis Anda dengan mudah.",
      registerDesc: "Daftar untuk mulai membangun website bisnis yang profesional, cepat, dan siap iklan.",
      registerCardEyebrow: "Buat akun baru",
      registerCardTitle: "Registrasi",
      registerCardDesc: "Isi detail di bawah untuk mendaftarkan akun Anda.",
      registerFooterLogin: "Sudah punya akun? Login",
      registerFullName: "Nama Lengkap",
      registerEmail: "Email",
      registerWhatsapp: "Nomor WhatsApp",
      registerPassword: "Password",
      registerLoading: "Mendaftar...",
      registerSubmit: "Buat Akun",
      registerSuccess: "Akun berhasil dibuat. Silakan login.",
      errorRegisterFailed: "Gagal mendaftar. Coba lagi.",
      forgotBadge: "Pemulihan Kata Sandi",
      forgotTitle: "Mulai alur reset kata sandi dari frontend dashboard.",
      forgotDesc: "Masukkan email Anda dan API Go akan menerbitkan token reset serta link email melalui alur forgot-password yang sudah ada.",
      forgotCardEyebrow: "Pemulihan",
      forgotCardTitle: "Lupa Kata Sandi",
      forgotCardDesc: "Masukkan email akun Anda untuk meminta link reset kata sandi.",
      forgotFooterLogin: "Kembali ke Login",
      forgotFooterRegister: "Buat Akun",
      forgotEmail: "Email",
      forgotEmailPlaceholder: "kamu@email.com",
      forgotSending: "Mengirim link...",
      forgotSubmit: "Kirim Link Reset",
      forgotSentSuccess: "Link reset terkirim. Periksa email Anda untuk link reset kata sandi.",
      forgotSentToast: "Link reset terkirim.",
      errorForgotSend: "Gagal mengirim link reset",
      forgotStat1Label: "Pengiriman",
      forgotStat1Value: "Link Email",
      forgotStat1Helper: "Backend mengirim link reset ke alamat email yang Anda masukkan.",
      forgotStat2Label: "Rute Reset",
      forgotStat2Value: "/reset-password",
      forgotStat2Helper: "Link yang dikirim membuka halaman reset di dashboard.",
      resetBadge: "Atur Ulang Kata Sandi",
      resetTitle: "Tetapkan kata sandi baru menggunakan token dari backend.",
      resetDesc: "Halaman ini memproses token reset dari link email dan mengirimkan kata sandi baru langsung ke API Go.",
      resetCardEyebrow: "Pemulihan",
      resetCardTitle: "Pilih Kata Sandi Baru",
      resetCardDesc: "Masukkan kata sandi baru Anda untuk menyelesaikan proses reset.",
      resetCardDescNoToken: "Buka halaman ini dari email reset kata sandi agar token disertakan.",
      resetFooterLogin: "Kembali ke Login",
      resetFooterRequest: "Minta link reset lagi",
      resetNewPassword: "Kata Sandi Baru",
      resetNewPasswordPlaceholder: "Minimal 8 karakter",
      resetConfirmPassword: "Konfirmasi Kata Sandi Baru",
      resetUpdating: "Memperbarui kata sandi...",
      resetUpdate: "Perbarui Kata Sandi",
      errorResetTokenMissing: "Token reset tidak ada di URL.",
      errorPasswordMismatch: "Kata sandi tidak cocok.",
      toastResetSuccess: "Kata sandi berhasil diperbarui.",
      errorResetFailed: "Gagal mengatur ulang kata sandi",
      resetStat1Label: "Sumber Token",
      resetStat1Value: "Query URL",
      resetStat2Label: "Validasi",
      resetStat2Value: "Prioritas Backend",
      resetStat2Helper: "Token kedaluwarsa atau tidak valid ditolak oleh API.",
      resetStat1Helper: "Backend mengirim link ke sini dengan parameter kueri `token`.",
      verifyBadge: "Verifikasi Akun",
      verifyTitle: "Memverifikasi alamat email Anda.",
      verifyDesc: "Halaman ini memverifikasi email Anda menggunakan token di link yang dikirim ke inbox Anda.",
      verifyCardEyebrow: "Verifikasi",
      verifyCardTitle: "Verifikasi Email",
      verifyCardIdle: "Periksa inbox Anda untuk link verifikasi.",
      verifyCardLoading: "Memvalidasi token keamanan unik Anda...",
      verifyFooterLogin: "Lanjut ke Login",
      verifyFooterHome: "Kembali ke Beranda",
      verifyLoadingSpinner: "Memverifikasi token Anda...",
      verifyBackToLogin: "Kembali ke Login",
      verifySuccessTitle: "Berhasil!",
      verifyGoToLogin: "Ke Halaman Login",
      verifyFailedTitle: "Verifikasi Gagal",
      verifySentTo: "Email verifikasi dikirim ke {email}. Buka link di email tersebut untuk menyelesaikan verifikasi.",
      verifyNoToken: "Buka halaman ini dari email verifikasi Anda agar token disertakan di URL.",
      verifyDone: "Email Anda berhasil diverifikasi! Anda sekarang dapat login.",
      errorVerifyFailed: "Gagal memverifikasi email. Link mungkin kedaluwarsa atau tidak valid.",
      verifyStat1Label: "Sumber Token",
      verifyStat1Value: "Query URL",
      verifyStat1Helper: "Link email backend menyertakan parameter `token` unik.",
      verifyStat2Label: "Status",
      verifyStat2Value: "Validasi Real-time",
      verifyStat2Helper: "Token divalidasi seketika saat halaman dimuat.",
      inviteProcessing: "Memproses undangan...",
      inviteSuccess: "Berhasil bergabung ke tim!",
      inviteSuccessDesc: "Anda sekarang dapat mengakses tim di dashboard.",
      inviteDashboard: "Ke Dashboard",
      inviteFailedTitle: "Gagal",
      inviteBackToLogin: "Kembali ke Login",
      loginResetSuccess: "Kata sandi diperbarui. Anda dapat masuk sekarang.",
      loginPasswordChanged: "Kata sandi diubah. Silakan masuk kembali.",
    },
    sections: {
      faqEyebrow: "Pertanyaan Umum",
      catalogEyebrow: "Koleksi Produk",
      benefitsEyebrow: "Keunggulan",
      aboutEyebrowFallback: "Mengenal Kami",
      aboutImageAlt: "About",
      ctaFallback: "Hubungi Kami",
      footerBlog: "Blog",
      footerSocial: "Media Sosial",
      footerBrand: "Bisnis Kami",
      footerCopyrightFallback: "© {year} {brand}. All rights reserved.",
      heroImageAlt: "Hero",
    },
    common: {
      dashboard: "Dashboard",
      menu: "Menu",
      loading: "Memuat...",
      saving: "Menyimpan...",
      failed: "Gagal",
      retry: "Coba lagi",
      backToHome: "← Kembali ke Beranda",
      contact: "Kontak",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan",
      refund: "Kebijakan Pengembalian Dana",
      allRightsReserved: "Hak cipta dilindungi.",
      builtWith: "Dibangun dengan",
    },
    dashboard: {
      authenticating: "Mengautentikasi...",
      createWebsite: "Buat Website",
      mainNav: "Navigasi utama",
      switchAccentBlue: "Ganti ke aksen biru",
      switchAccentMonochrome: "Ganti ke aksen monokrom",
      switchLight: "Ganti ke mode terang",
      switchDark: "Ganti ke mode gelap",
      pro: "Pro",
      consoleTitle: "Webjoz Console",
      adminWorkspace: "Workspace Admin {env}",
      mode: "Mode",
      upgrade: "Upgrade",
      authenticated: "Terautentikasi",
      locked: "Terkunci",
      appearance: "Tampilan",
      logout: "Keluar",
      backToWebsites: "Kembali ke daftar website",
      subDashboard: "Pantau ringkasan performa dan aktivitas website Anda.",
      subSites: "Kelola dan kustomisasi seluruh website Anda.",
      subDomains: "Hubungkan dan kelola domain kustom Anda agar situs tampil lebih profesional.",
      subLeads: "Inkuiri kontak dan prospek dari pengunjung situs publik Anda.",
      subAnalytics: "Pantau volume kunjungan, asal lalu lintas, dan halaman paling populer.",
      subSettings: "Kelola profil, keamanan akun, hak akses pengguna, dan log audit sistem.",
      newWebsiteAi: "Website AI Baru",
      loadingConsole: "Memuat Console...",
      preparingWorkspace: "Menyiapkan workspace aman",
      signedOutLocally: "Keluar secara lokal. Sesi server mungkin masih perlu ditinjau.",
      refreshed: "Dashboard diperbarui.",
      welcome: "Selamat Datang{name}",
      welcomeDesc: "Kelola website, domain, dan leads Anda dari satu tempat.",
      newWebsite: "+ Website Baru",
      usingFreePlan: "Anda sedang menggunakan paket {plan}",
      upgradeToProDesc: "Upgrade ke Pro untuk custom domain, SEO optimasi, lebih banyak website, dan AI generates tanpa batas.",
      upgradeToPro: "Upgrade ke Pro",
      statWebsites: "Website",
      statLeads: "Leads",
      statVisitors: "Pengunjung",
      statHealth: "Kesehatan",
      sitesPublished: "{count} published",
      newProspects: "Prospek baru",
      setupLeadForm: "Pasang form lead",
      thisWeek: "Minggu ini",
      allSystemsNormal: "Semua sistem normal",
      usageMeter: "Pemakaian Paket",
      meterWebsites: "Website",
      meterAiGenerate: "AI Generate",
      meterSectionRegen: "Regen Section",
      meterDesignRegen: "Regen Desain",
      recentActivity: "Aktivitas Terbaru",
      leadNew: "Lead baru: {name}",
      siteUpdated: "Website \"{name}\" diupdate",
      noActivity: "Belum ada aktivitas.",
      aiInsights: "Wawasan AI",
      insightTraffic: "📈 Traffic terpantau masuk minggu ini sebanyak {count} kunjungan.",
      insightNoTraffic: "📉 Belum ada traffic signifikan minggu ini.",
      insightLeads: "🔥 Anda memiliki {count} prospek baru!",
      insightCreateSite: "✨ Buat website pertama Anda dengan AI Builder!",
      admin: {
        platformOverview: "Platform Overview",
        platformStats: "{tenants} tenants · {users} users · {sites} sites di seluruh platform",
        loadingMetrics: "Memuat metrik platform...",
        allTenants: "Semua Tenant",
        plans: "Plans",
        totalTenants: "Total Tenant",
        totalUsers: "Total Pengguna",
        totalSites: "Total Website",
        activePlans: "Paket Aktif",
        newUsers7d: "Pengguna Baru (7h)",
        in7Days: "+{count} dalam 7 hari",
        recentTenants: "Tenant Terbaru",
        viewAll: "Lihat semua",
        noTenants: "Belum ada tenant terdaftar.",
        systemHealth: "Kesehatan Sistem",
        svcDatabase: "Database",
        svcCache: "Cache",
        svcAiProvider: "Penyedia AI",
        statusHealthy: "Sehat",
        statusDown: "Down",
        statusDisabled: "Nonaktif",
        statusUnknown: "Tidak diketahui",
        viewDetailedStatus: "Lihat status detail →",
        quickActions: "Aksi Cepat",
        qxHealth: "Health",
        qxAnnounce: "Announce",
        qxUsers: "Users",
        qxAuditLogs: "Audit Logs",
        platformManagement: "Manajemen Platform",
        qlTenantsDesc: "Lihat & kelola semua akun tenant",
        qlPlansDesc: "Tentukan & tetapkan paket langganan",
        qlHealthDesc: "Status database, cache & penyedia AI",
        qlAnnounceDesc: "Kirim pesan ke semua tenant",
      },
      nav: {
        sectionDashboard: "Dashboard",
        sectionWebsiteBuilder: "Website Builder",
        sectionSalesReferral: "Sales & Referral",
        sectionSystem: "Sistem",
        overview: "Ringkasan",
        notifications: "Notifikasi",
        plans: "Manajemen Paket",
        health: "Kesehatan Sistem",
        announcements: "Pengumuman",
        commissions: "Semua Komisi",
        tenants: "Semua Tenant",
        templates: "Galeri Template",
        designAssets: "Aset Desain",
        metrics: "Metrik",
        sites: "Website Saya",
        domains: "Custom Domain",
        leads: "Customer Leads",
        analytics: "Web Statistik",
        salesReferral: "Kode Referral",
        salesCommissions: "Komisi Saya",
        team: "Tim",
        upgrade: "Upgrade Paket",
        settings: "Pengaturan",
      },
      sites: {
        close: "Tutup",
        cancel: "Batal",
        deleteTitle: "Hapus Website?",
        deleteBody: "Anda akan menghapus website \"{name}\" secara permanen. Tindakan ini tidak dapat dibatalkan.",
        deleteWarning: "Semua konten, pengaturan, dan data website ini akan dihapus dan tidak bisa dipulihkan.",
        deleteFreeNotice: "Kamu pakai paket Free — kuota 1 website ini tidak akan kembali setelah dihapus. Kamu hanya bisa membuat 1 website gratis seumur hidup.",
        deleting: "Menghapus...",
        deleteConfirm: "Ya, Hapus",
        renameTitle: "Ganti Nama Website",
        renameDesc: "Masukkan nama baru untuk website Anda.",
        save: "Simpan",
        publishTitle: "Publikasikan Website",
        publishOneStep: "Satu Langkah Lagi! 🚀",
        publishReady: "Website {name} Anda siap untuk dipublikasikan ke seluruh dunia.",
        subdomainLabel: "Nama Subdomain",
        subdomainAvailable: "Tersedia: {url}",
        subdomainInvalidHint: "Gunakan huruf kecil, angka, atau tanda hubung (-)",
        subdomainHint: "Hanya huruf kecil, angka, dan tanda hubung. Subdomain tidak bisa diubah setelah dipublikasikan.",
        connectCustomDomain: "Hubungkan Custom Domain",
        customDomainDesc: "Ingin brand yang lebih profesional seperti domainanda.com? Anda dapat mengaturnya di {link} setelah website Anda live.",
        customDomainLink: "Custom Domain",
        launching: "Meluncurkan...",
        launchWebsite: "Luncurkan Website",
        errorLoadSites: "Gagal memuat situs",
        connectingWorkspace: "Menghubungkan ke workspace...",
        toastPublished: "Website berhasil dipublikasikan! 🚀",
        toastPublishFailed: "Gagal mempublikasikan website",
        toastUnpublished: "Website berhasil di-draft kembali.",
        toastUnpublishFailed: "Gagal mengubah status publikasi",
        toastRenamed: "Nama website berhasil diubah.",
        toastRenameFailed: "Gagal mengubah nama website",
        toastDeleted: "Situs berhasil dihapus.",
        toastDeleteFailed: "Gagal menghapus situs",
        toastDuplicating: "Menduplikasi website...",
        toastDuplicateFailed: "Gagal membuat duplikat website",
        toastDuplicated: "Website berhasil diduplikat!",
        toastDuplicateError: "Gagal menduplikasi website",
        publishedPrefix: "Dipublikasikan",
        updatedPrefix: "Diubah",
        justNow: "{prefix} baru saja",
        minutesAgo: "{prefix} {n} menit lalu",
        hoursAgo: "{prefix} {n} jam lalu",
        yesterday: "{prefix} kemarin",
        daysAgo: "{prefix} {n} hari lalu",
        searchPlaceholder: "Cari website berdasarkan nama...",
        reset: "Reset",
        filterAll: "Semua",
        filterDraft: "Draft",
        filterPublished: "Dipublikasikan",
        loadingSites: "Memuat situs Anda...",
        noSitesMatch: "Tidak ada website yang cocok",
        noSitesMatchDesc: "Coba kata kunci pencarian lain, filter status yang berbeda, atau buat website baru.",
        clearSearch: "Bersihkan Pencarian",
        statusLive: "Live",
        statusDraft: "Draft",
        moreOptions: "Opsi lainnya",
        actionDuplicate: "Duplikat",
        actionRename: "Ganti nama",
        actionUnpublish: "Batalkan publikasi",
        actionDelete: "Hapus",
        domainNotSet: "Domain belum diatur",
        copyLink: "Salin tautan",
        editPreview: "Edit & Preview",
        viewSite: "Lihat Web",
        publish: "Publikasikan",
        linkBlog: "Blog",
        linkCatalog: "Katalog",
        linkMenu: "Menu",
        linkSeo: "SEO",
        linkIntegrations: "Integrasi",
        linkTestimonials: "Testimoni",
        loadMore: "Muat Lebih Banyak",
        congratsTitle: "🎉 Selamat! Website Anda Telah Live",
        congratsHeading: "Website Anda Resmi Mengudara!",
        congratsBody: "Selamat! Halaman web {name} Anda sekarang aktif dan dapat diakses dari mana saja di seluruh dunia.",
        openWebsite: "Buka Website",
        copyLinkTitle: "Salin Link",
        checkTip: "💡 Ingin mengecek? Klik link di atas untuk membuka website live Anda di tab baru.",
        done: "Selesai",
      },
    },
  },
  en: {
    landing: {
      badge: "AI Website Builder for Indonesian Businesses",
      heroTitle: "Business Website<br />Ready in 5 Minutes",
      heroSubtitle: "Have a quick chat with AI, choose a visual style, and your business website is ready to publish.",
      heroSubtitleBold: "No coding, no long forms.",
      ctaPrimary: "Create Website Now",
      ctaFloating: "Create Website Now",
      tryFree: "Try for free",
      chatNotForm: "AI Chat, not forms",
      activeInMinutes: "Live in minutes",
      howItWorksTitle: 'From chat to website in <span class="text-primary">4 easy steps</span>',
      howItWorksSubtitle: "HOW IT WORKS",
      howItWorksCta: "Try Now — Free",
      featuresEyebrow: "KEY FEATURES",
      featuresTitle: 'More than just a <span class="text-primary">regular website</span>',
      featuresTitleAccent: "regular website",
      dashboardBadge: "Dashboard",
      dashboardTitle: "Monitor & grow your business",
      dashboardDesc: "Complete dashboard with visitor analytics, lead management, and website list in one place.",
      dashboardTags: ["Real-time analytics", "Lead management", "Website list"],
      domainBadge: "Domain & SEO",
      domainTitle: "Custom domain & automatic SEO",
      domainDesc: "Connect your custom domain, SEO title/description, OG tags, JSON-LD, sitemap — all handled by AI.",
      domainTags: ["Custom domain", "Automatic SEO", "Structured data", "Sitemap"],
      templatesEyebrow: "AI GENERATED EXAMPLES",
      templatesTitle: 'Websites generated <span class="text-primary">for various businesses</span>',
      templatesTitleAccent: "for various businesses",
      templatesDesc: "AI selects templates and writes content automatically. Here are examples for several business types.",
      whyEyebrow: "WHY WEBJOZ",
      whyTitle: 'Everything you need, <span class="text-primary">already available</span>',
      whyTitleAccent: "already available",
      statsLabel1: "Generation time",
      statsValue1: "< 5 mins",
      statsLabel2: "Auto online",
      statsValue2: "100%",
      statsLabel3: "One dashboard",
      statsValue3: "8 features",
      statsLabel4: "Powered",
      statsValue4: "AI",
      pricingTitle: "Simple Pricing",
      pricingSubtitle: "Start free, expand whenever you're ready.",
      monthly: "Monthly",
      yearly: "Yearly",
      saveBadge: "Save ~16%",
      saveText: "🎉 Save up to 2 months with annual subscription",
      popularBadge: "Most Popular",
      priceFree: "$0",
      priceFreePeriod: "/month · forever",
      perYear: "/year",
      monthlyEq: "(≈ {value}/mo)",
      promo: "Promo",
      perMonth: "/month",
      perYear2: "/year",
      startFree: "Start Free",
      choosePlan: "Choose {plan} ({cycle})",
      ctaBannerTitle: "Ready to build your business website?",
      ctaBannerDesc: "Start for free now. No credit card needed — just a short chat with AI and your website is ready.",
      ctaBannerCta: "Start Free Now",
      ctaBannerWhatsapp: "Consult via WhatsApp",
      ctaBannerHelper: "Need custom design or company profile?",
      ctaBannerContact: "Contact our team",
      footerCopyright: "© {year} Webjoz by Giwangan Studio. AI Website Builder for Indonesian Businesses.",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms & Conditions",
      footerRefund: "Refund Policy",
      footerContact: "Contact Us",
      footerLogin: "Login",
      footerHome: "Home",
      step1Title: "Introduce Your Business",
      step1Desc: "Chat with AI and tell them the name and type of business you run. All through a casual conversation.",
      step2Title: "Share Brief Details",
      step2Desc: "Tell them a little about your services, coverage area, or what makes your business special.",
      step3Title: "Choose Category & Mood",
      step3Desc: "Pick your industry type and design mood so AI can match your website's appearance.",
      step4Title: "Generate & Publish",
      step4Desc: "Website is built in seconds. Review, edit any section, and publish immediately.",
      featureChatTitle: "AI Chat, Not Forms",
      featureChatDesc: "No long forms to fill. Just chat with AI and all content and design are generated automatically.",
      featureDomainTitle: "Custom Domain",
      featureDomainDesc: "Connect your own domain with CNAME guidance. Perfect for professional company branding.",
      featureAnalyticsTitle: "Analytics & Leads",
      featureAnalyticsDesc: "Track website visitors and collect leads directly from the contact form — all in one dashboard.",
      featureEditTitle: "Edit Per Section",
      featureEditDesc: "Not satisfied with a section? Regenerate it with AI, or edit manually in the editor.",
      featureCustomTitle: "Full Customization",
      featureCustomDesc: "Hero, profile, services, testimonials, menu, FAQ, footer, and SEO — all content can be edited and customized anytime.",
      featureWaTitle: "Integrated WhatsApp",
      featureWaDesc: "WhatsApp button is automatically installed on every website. Customers can chat in one click.",
      featureSeoTitle: "SEO Ready",
      featureSeoDesc: "Title, description, OG tags, JSON-LD structured data, and sitemap — all handled by AI.",
      featureSubTitle: "Instant Subdomain",
      featureSubDesc: "Every website is instantly active on a Webjoz subdomain. No server setup or manual DNS needed.",
      featureCatalogTitle: "Product Catalog",
      featureCatalogDesc: "Showcase your products or services with a neat, professional, and attractive catalog.",
      featureMenuTitle: "Sales Menu",
      featureMenuDesc: "Make it easy for customers to order with an interactive menu ready for transactions.",
      navDashboard: "Dashboard",
      navLogin: "Login",
      navCreateNew: "Create New Website",
      navStartFree: "Start Free",
      mockupGreeting: "Hi! What's your business name?",
      mockupPickType: "Awesome! 👍 Pick your business type:",
      mockupChips: ["🍜 Food & Beverage", "🔧 Services", "🛍 Products"],
      mockupGenerating: "⚡ AI is generating...",
      mockupReady: "✅ Website ready!",
      mockupStep: "Step 2 of 5",
      showcaseCreate: "Create",
      showcaseFallback: "Website",
      categoryKuliner: "Food & Beverage",
      categoryJasa: "Services",
      categoryProduk: "Products",
    },
    auth: {
      loginTitle: "Continue managing your business website.",
      loginDesc: "Log in to manage your website, edit content, view analytics, and monitor performance — all from one dashboard.",
      loginCardTitle: "Login",
      loginCardDesc: "Use WhatsApp, email OTP, or password to access the dashboard.",
      loginFooterHome: "Home",
      loginFooterRegister: "Create account",
      loginFooterForgot: "Forgot password",
      loginBadge: "Webjoz Console",
      loginStats1Label: "AI Builder",
      loginStats1Value: "Chat-Based",
      loginStats1Helper: "Just chat with AI, website is ready instantly.",
      loginStats2Label: "Mobile-First",
      loginStats2Value: "Optimized",
      loginStats2Helper: "All templates are optimized for mobile and ad-ready.",
      loginCardEyebrow: "Login to continue",
      loginSending: "Sending code...",
      loginWhatsappHint: "A link or OTP code is sent via WhatsApp. New number? An account is created automatically.",
      loginOrContinueWith: "or continue with",
      loginOrEmail: "or log in with email",
      loginEmailLabel: "Email address",
      loginEmailPlaceholder: "Your email address",
      loginEmailHint: "A link or OTP code is sent via email. New email? An account is created automatically.",
      loginSendCodeWhatsapp: "Send OTP via WhatsApp",
      loginSendCode: "Send OTP",
      loginPasswordTitle: "Log in with password",
      loginPasswordDesc: "Use your account email and password.",
      loginEmailField: "Email",
      loginPasswordLabel: "Password",
      loginForgotPassword: "Forgot password?",
      loginPasswordPlaceholder: "Account password",
      loginHidePassword: "Hide password",
      loginShowPassword: "Show password",
      loginLoginLoading: "Logging in",
      loginSubmitPassword: "Log in with password",
      loginCodeSentTo: "Code sent via {channel} to {target}. Valid for 5 minutes.",
      loginCodeLabel: "OTP Code",
      loginTrustDevice: "Trust this device",
      loginBack: "Back",
      loginVerifying: "Verifying",
      loginVerifyOtp: "Verify OTP",
      loginResendCountdown: "Resend ({sec}s)",
      loginResend: "Didn't receive a code? Resend",
      loginLinkSent: "A login link has been sent. Open it on this device to continue.",
      loginOtherOptions: "Other options",
      loginOptionWhatsapp: "WhatsApp",
      loginOptionEmail: "Email OTP",
      loginOptionPassword: "Password",
      errorEmailValid: "Please enter a valid email address.",
      errorPhoneValid: "Please enter a valid WhatsApp number.",
      errorFixFields: "Please fix the highlighted fields.",
      errorOtpInvalid: "Please enter a 6-digit OTP code.",
      errorCredentialsInvalid: "Please enter a valid email and password.",
      errorWrongCredentials: "Incorrect email or password.",
      toastCodeSent: "Code sent. Please check your messages.",
      errorSendCode: "Failed to send code. Try again.",
      toastOtpVerified: "OTP verified. Welcome back.",
      errorOtpInvalidExpired: "Invalid or expired OTP code",
      loginSuccess: "Successfully logged in. Welcome back.",
      toastSessionExpired: "Session Expired",
      toastSessionExpiredDesc: "Your session has expired. Please log in again to continue.",
      toastDismiss: "Dismiss",
      errorMagicLinkInvalid: "Login link is invalid or expired",
      registerBadge: "Webjoz Console",
      registerTitle: "Start managing your business with ease.",
      registerDesc: "Sign up to start building a professional, fast, ad-ready business website.",
      registerCardEyebrow: "Create new account",
      registerCardTitle: "Registration",
      registerCardDesc: "Fill in the details below to register your account.",
      registerFooterLogin: "Already have an account? Login",
      registerFullName: "Full Name",
      registerEmail: "Email",
      registerWhatsapp: "WhatsApp Number",
      registerPassword: "Password",
      registerLoading: "Signing up...",
      registerSubmit: "Create Account",
      registerSuccess: "Account created successfully. Please log in.",
      errorRegisterFailed: "Failed to sign up. Try again.",
      forgotBadge: "Password Recovery",
      forgotTitle: "Start the password reset flow from the dashboard frontend.",
      forgotDesc: "Submit your email and the Go API will issue the reset token and email link through its existing forgot-password flow.",
      forgotCardEyebrow: "Recovery",
      forgotCardTitle: "Forgot Password",
      forgotCardDesc: "Enter your account email to request a password reset link.",
      forgotFooterLogin: "Back to login",
      forgotFooterRegister: "Create account",
      forgotEmail: "Email",
      forgotEmailPlaceholder: "you@mail.com",
      forgotSending: "Sending link...",
      forgotSubmit: "Send Reset Link",
      forgotSentSuccess: "Reset link sent. Check your email for the password reset link.",
      forgotSentToast: "Reset link sent.",
      errorForgotSend: "Failed to send reset link",
      forgotStat1Label: "Delivery",
      forgotStat1Value: "Email Link",
      forgotStat1Helper: "The backend sends a reset link to the email address you submit.",
      forgotStat2Label: "Reset Route",
      forgotStat2Value: "/reset-password",
      forgotStat2Helper: "The emailed link lands on the dashboard reset page.",
      resetBadge: "Reset Password",
      resetTitle: "Set a new password using the token issued by the backend.",
      resetDesc: "This page consumes the password reset token from the email link and submits the new password directly to the Go API.",
      resetCardEyebrow: "Recovery",
      resetCardTitle: "Choose a New Password",
      resetCardDesc: "Enter your new password to complete the reset flow.",
      resetCardDescNoToken: "Open this page from the password reset email so the token is included.",
      resetFooterLogin: "Back to login",
      resetFooterRequest: "Request another reset link",
      resetNewPassword: "New Password",
      resetNewPasswordPlaceholder: "Minimum 8 characters",
      resetConfirmPassword: "Confirm New Password",
      resetUpdating: "Updating password...",
      resetUpdate: "Update Password",
      errorResetTokenMissing: "Reset token is missing from the URL.",
      errorPasswordMismatch: "Passwords do not match.",
      toastResetSuccess: "Password updated successfully.",
      errorResetFailed: "Failed to reset password",
      resetStat1Label: "Token Source",
      resetStat1Value: "URL Query",
      resetStat1Helper: "The backend email links here with a `token` query parameter.",
      resetStat2Label: "Validation",
      resetStat2Value: "Backend-first",
      resetStat2Helper: "Expired or invalid tokens are rejected by the API.",
      verifyBadge: "Account Verification",
      verifyTitle: "Verifying your email address.",
      verifyDesc: "This page verifies your email using the token provided in the link sent to your inbox.",
      verifyCardEyebrow: "Verification",
      verifyCardTitle: "Email Verification",
      verifyCardIdle: "Check your inbox for the verification link.",
      verifyCardLoading: "Validating your unique secure token...",
      verifyFooterLogin: "Proceed to login",
      verifyFooterHome: "Back to home",
      verifyLoadingSpinner: "Verifying your token...",
      verifyBackToLogin: "Back to Login",
      verifySuccessTitle: "Success!",
      verifyGoToLogin: "Go to Login",
      verifyFailedTitle: "Verification Failed",
      verifySentTo: "A verification email was sent to {email}. Open the link in that email to complete verification.",
      verifyNoToken: "Open this page from your verification email so the token is included in the URL.",
      verifyDone: "Your email has been successfully verified! You can now log in.",
      errorVerifyFailed: "Failed to verify email. The link might be expired or invalid.",
      verifyStat1Label: "Token Source",
      verifyStat1Value: "URL Query",
      verifyStat1Helper: "The backend email link includes a unique `token` parameter.",
      verifyStat2Label: "Status",
      verifyStat2Value: "Real-time Validation",
      verifyStat2Helper: "Tokens are validated instantly upon page load.",
      inviteProcessing: "Processing invitation...",
      inviteSuccess: "Successfully joined the team!",
      inviteSuccessDesc: "You can now access the team in the dashboard.",
      inviteDashboard: "Go to Dashboard",
      inviteFailedTitle: "Failed",
      inviteBackToLogin: "Back to Login",
      loginResetSuccess: "Password updated. You can sign in now.",
      loginPasswordChanged: "Password changed. Please sign in again.",
    },
    sections: {
      faqEyebrow: "FAQ",
      catalogEyebrow: "Product Collection",
      benefitsEyebrow: "Benefits",
      aboutEyebrowFallback: "About Us",
      aboutImageAlt: "About",
      ctaFallback: "Contact Us",
      footerBlog: "Blog",
      footerSocial: "Social Media",
      footerBrand: "Our Business",
      footerCopyrightFallback: "© {year} {brand}. All rights reserved.",
      heroImageAlt: "Hero",
    },
    common: {
      dashboard: "Dashboard",
      menu: "Menu",
      loading: "Loading...",
      saving: "Saving...",
      failed: "Failed",
      retry: "Retry",
      backToHome: "← Back to Home",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      refund: "Refund Policy",
      allRightsReserved: "All rights reserved.",
      builtWith: "Built with",
    },
    dashboard: {
      authenticating: "Authenticating...",
      createWebsite: "Create Website",
      mainNav: "Main navigation",
      switchAccentBlue: "Switch to blue accent",
      switchAccentMonochrome: "Switch to monochrome accent",
      switchLight: "Switch to light mode",
      switchDark: "Switch to dark mode",
      pro: "Pro",
      consoleTitle: "Webjoz Console",
      adminWorkspace: "{env} Admin Workspace",
      mode: "Mode",
      upgrade: "Upgrade",
      authenticated: "Authenticated",
      locked: "Locked",
      appearance: "Appearance",
      logout: "Logout",
      backToWebsites: "Back to websites list",
      subDashboard: "Monitor the summary of your website's performance and activity.",
      subSites: "Manage and customize all of your websites.",
      subDomains: "Connect and manage custom domains to make your site look more professional.",
      subLeads: "Contact inquiries and prospects from your public site visitors.",
      subAnalytics: "Monitor visit volume, traffic sources, and most popular pages.",
      subSettings: "Manage profile, account security, user access, and system audit logs.",
      newWebsiteAi: "New AI Website",
      loadingConsole: "Loading Console...",
      preparingWorkspace: "Preparing secure workspace",
      signedOutLocally: "Signed out locally. The server session may still need review.",
      refreshed: "Dashboard refreshed.",
      welcome: "Welcome{name}",
      welcomeDesc: "Manage your websites, domains, and leads in one place.",
      newWebsite: "+ New Website",
      usingFreePlan: "You are currently on the {plan} plan",
      upgradeToProDesc: "Upgrade to Pro for custom domain, SEO optimization, more websites, and unlimited AI generates.",
      upgradeToPro: "Upgrade to Pro",
      statWebsites: "Websites",
      statLeads: "Leads",
      statVisitors: "Visitors",
      statHealth: "Health",
      sitesPublished: "{count} published",
      newProspects: "New prospects",
      setupLeadForm: "Set up lead form",
      thisWeek: "This week",
      allSystemsNormal: "All systems normal",
      usageMeter: "Plan Usage",
      meterWebsites: "Websites",
      meterAiGenerate: "AI Generate",
      meterSectionRegen: "Section Regen",
      meterDesignRegen: "Design Regen",
      recentActivity: "Recent Activity",
      leadNew: "New lead: {name}",
      siteUpdated: "Website \"{name}\" updated",
      noActivity: "No activity yet.",
      aiInsights: "AI Insights",
      insightTraffic: "📈 Traffic is being monitored entering this week with {count} visits.",
      insightNoTraffic: "📉 No significant traffic this week yet.",
      insightLeads: "🔥 You have {count} new prospects!",
      insightCreateSite: "✨ Create your first website with AI Builder!",
      admin: {
        platformOverview: "Platform Overview",
        platformStats: "{tenants} tenants · {users} users · {sites} sites across the platform",
        loadingMetrics: "Loading platform metrics...",
        allTenants: "All Tenants",
        plans: "Plans",
        totalTenants: "Total Tenants",
        totalUsers: "Total Users",
        totalSites: "Total Sites",
        activePlans: "Active Plans",
        newUsers7d: "New Users (7d)",
        in7Days: "+{count} in 7 days",
        recentTenants: "Recent Tenants",
        viewAll: "View all",
        noTenants: "No tenants registered yet.",
        systemHealth: "System Health",
        svcDatabase: "Database",
        svcCache: "Cache",
        svcAiProvider: "AI Provider",
        statusHealthy: "Healthy",
        statusDown: "Down",
        statusDisabled: "Disabled",
        statusUnknown: "Unknown",
        viewDetailedStatus: "View detailed status →",
        quickActions: "Quick Actions",
        qxHealth: "Health",
        qxAnnounce: "Announce",
        qxUsers: "Users",
        qxAuditLogs: "Audit Logs",
        platformManagement: "Platform Management",
        qlTenantsDesc: "View & manage all tenant accounts",
        qlPlansDesc: "Define & assign subscription plans",
        qlHealthDesc: "Database, cache & AI provider status",
        qlAnnounceDesc: "Broadcast messages to all tenants",
      },
      nav: {
        sectionDashboard: "Dashboard",
        sectionWebsiteBuilder: "Website Builder",
        sectionSalesReferral: "Sales & Referral",
        sectionSystem: "System",
        overview: "Overview",
        notifications: "Notifications",
        plans: "Plan Management",
        health: "System Health",
        announcements: "Announcements",
        commissions: "All Commissions",
        tenants: "All Tenants",
        templates: "Template Gallery",
        designAssets: "Design Assets",
        metrics: "Metrics",
        sites: "My Websites",
        domains: "Custom Domain",
        leads: "Customer Leads",
        analytics: "Web Statistics",
        salesReferral: "Referral Code",
        salesCommissions: "My Commissions",
        team: "Team",
        upgrade: "Upgrade Plan",
        settings: "Settings",
      },
      sites: {
        close: "Close",
        cancel: "Cancel",
        deleteTitle: "Delete Website?",
        deleteBody: "You are about to permanently delete website \"{name}\". This action cannot be undone.",
        deleteWarning: "All content, settings, and data of this website will be deleted and cannot be recovered.",
        deleteFreeNotice: "You are on the Free plan — this 1 website quota will not be returned after deletion. You can only create 1 free website for life.",
        deleting: "Deleting...",
        deleteConfirm: "Yes, Delete",
        renameTitle: "Rename Website",
        renameDesc: "Enter a new name for your website.",
        save: "Save",
        publishTitle: "Publish Website",
        publishOneStep: "One Step Left! 🚀",
        publishReady: "Your website {name} is ready to be published to the world.",
        subdomainLabel: "Subdomain Name",
        subdomainAvailable: "Available: {url}",
        subdomainInvalidHint: "Use lowercase letters, numbers, or hyphens (-)",
        subdomainHint: "Only lowercase letters, numbers, and hyphens. Subdomain cannot be changed after publishing.",
        connectCustomDomain: "Connect Custom Domain",
        customDomainDesc: "Want a more professional brand like domainanda.com? You can set it up in {link} after your website is live.",
        customDomainLink: "Custom Domain",
        launching: "Launching...",
        launchWebsite: "Launch Website",
        errorLoadSites: "Failed to load sites",
        connectingWorkspace: "Connecting to workspace...",
        toastPublished: "Website published successfully! 🚀",
        toastPublishFailed: "Failed to publish website",
        toastUnpublished: "Website has been set back to draft.",
        toastUnpublishFailed: "Failed to change publication status",
        toastRenamed: "Website name updated.",
        toastRenameFailed: "Failed to rename website",
        toastDeleted: "Site deleted successfully.",
        toastDeleteFailed: "Failed to delete site",
        toastDuplicating: "Duplicating website...",
        toastDuplicateFailed: "Failed to create website duplicate",
        toastDuplicated: "Website duplicated successfully!",
        toastDuplicateError: "Failed to duplicate website",
        publishedPrefix: "Published",
        updatedPrefix: "Updated",
        justNow: "{prefix} just now",
        minutesAgo: "{prefix} {n} minutes ago",
        hoursAgo: "{prefix} {n} hours ago",
        yesterday: "{prefix} yesterday",
        daysAgo: "{prefix} {n} days ago",
        searchPlaceholder: "Search websites by name...",
        reset: "Reset",
        filterAll: "All",
        filterDraft: "Draft",
        filterPublished: "Published",
        loadingSites: "Loading your sites...",
        noSitesMatch: "No matching websites",
        noSitesMatchDesc: "Try a different search keyword, another status filter, or create a new website.",
        clearSearch: "Clear Search",
        statusLive: "Live",
        statusDraft: "Draft",
        moreOptions: "More options",
        actionDuplicate: "Duplicate",
        actionRename: "Rename",
        actionUnpublish: "Unpublish",
        actionDelete: "Delete",
        domainNotSet: "Domain not set",
        copyLink: "Copy link",
        editPreview: "Edit & Preview",
        viewSite: "View Site",
        publish: "Publish",
        linkBlog: "Blog",
        linkCatalog: "Catalog",
        linkMenu: "Menu",
        linkSeo: "SEO",
        linkIntegrations: "Integrations",
        linkTestimonials: "Testimonials",
        loadMore: "Load More",
        congratsTitle: "🎉 Congratulations! Your Website Is Live",
        congratsHeading: "Your Website Is Officially Live!",
        congratsBody: "Congratulations! Your web page {name} is now active and accessible from anywhere in the world.",
        openWebsite: "Open Website",
        copyLinkTitle: "Copy Link",
        checkTip: "💡 Want to check? Click the link above to open your live website in a new tab.",
        done: "Done",
      },
    },
  },
};
