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
    footerBlog: string;
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
    // pricing card feature labels
    activeBadge: string;
    yearlySavings: string;
    websiteCount: string;
    aiGenerate: string;
    aiRegen: string;
    aiDesign: string;
    noCustomDomain: string;
    seoBooster: string;
    subdomainFeature: string;
    hostingFeature: string;
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
    upgradeLabel: string;
    authenticated: string;
    locked: string;
    appearance: string;
    language: string;
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
      recentAccounts: string;
      viewAll: string;
      noAccounts: string;
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
      salesOverview: string;
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
      subdomainPlaceholder: string;
      subdomainAvailable: string;
      subdomainInvalidHint: string;
      subdomainHint: string;
      connectCustomDomain: string;
      customDomainDescPre: string;
      customDomainDescPost: string;
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
      linkEditor: string;
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
      continueEditing: string;
    };
    leads: {
      loadFailed: string;
      loading: string;
      filter: string;
      allWebsites: string;
      emptyTitle: string;
      emptyDesc: string;
      sender: string;
      date: string;
      sourceSite: string;
      actions: string;
      siteId: string;
      detail: string;
      leadDetail: string;
      inquiryMessage: string;
      receivedOn: string;
      sourceUrl: string;
      selectPrompt: string;
    };
    team: {
      loadFailed: string;
      inviteSent: string;
      inviteFailed: string;
      inviteRevoked: string;
      revokeFailed: string;
      memberRemoved: string;
      removeFailed: string;
      membersTitle: string;
      invitePending: string;
      pending: string;
      inviteLinkCopied: string;
      noMembers: string;
      inviteTitle: string;
      emailPlaceholder: string;
      sendInvite: string;
      inviteHint: string;
      limitTitle: string;
      later: string;
      upgradeToPro: string;
      limitDesc: string;
      role: {
        owner: string;
        editor: string;
        viewer: string;
      };
    };
    analytics: {
      loadFailed: string;
      loading: string;
      noChartData: string;
      chartAria: string;
      srActivePoint: string;
      selectSite: string;
      preset7: string;
      preset30: string;
      preset90: string;
      to: string;
      statPageviews: string;
      up: string;
      down: string;
      fromPrevPeriod: string;
      prevPeriodComp: string;
      statUniqueVisitors: string;
      visitorsEstimate: string;
      statAvgDuration: string;
      durationNote: string;
      dailyVisitsTitle: string;
      dailyVisitsDesc: string;
      leadsIn: string;
      leadsFromForms: string;
      conversion: string;
      viewAllLeads: string;
      trafficSources: string;
      noReferrerData: string;
      upsellTitle: string;
      later: string;
      upgradeToPro: string;
      free7Days: string;
      free7DaysDesc: string;
      selectedRange: string;
      proUpgrade: string;
      proUpgradeDesc: string;
    };
    domains: {
      loadFailed: string;
      loading: string;
      added: string;
      addFailed: string;
      invalidFormat: string;
      verified: string;
      verifyFailed: string;
      confirmDelete: string;
      deleted: string;
      deleteFailed: string;
      continueConnect: string;
      upgradeToPro: string;
      close: string;
      upgradePlan: string;
      connectedTitle: string;
      quotaTitle: string;
      quota: string;
      customDomainBadge: string;
      siteId: string;
      waitingPropagation: string;
      active: string;
      pending: string;
      checkDns: string;
      delete: string;
      connectTitle: string;
      connectDesc: string;
      noPublished: string;
      noPublishedDesc: string;
      myWebsites: string;
      linkToSite: string;
      domainAddress: string;
      domainPlaceholder: string;
      validFormat: string;
      invalidFormatHint: string;
      dnsInstructions: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      dnsType: string;
      dnsHost: string;
      dnsTarget: string;
      note: string;
      verifyHint: string;
      connectBtn: string;
      upsellTitle: string;
      upsellDesc: string;
      upsellBranding: string;
      upsellBrandingDesc: string;
      upsellSeo: string;
      upsellSeoDesc: string;
      upsellSsl: string;
      upsellSslDesc: string;
      limitTitle: string;
      limitDesc: string;
      limitDesc2: string;
    };
    settings: {
      tabProfile: string;
      tabSecurity: string;
      tabDevices: string;
      tabUsers: string;
      tabPermissions: string;
      tabLogs: string;
      tabInvestigate: string;
      groupAccount: string;
      groupAdmin: string;
      profileFailedLoad: string;
      profilePhoneError: string;
      profileUpdated: string;
      profileFailedUpdate: string;
      profileEyebrow: string;
      profileTitle: string;
      email: string;
      name: string;
      saveProfile: string;
      profileEmpty: string;
      pwChanged: string;
      pwFailed: string;
      securityEyebrow: string;
      changePassword: string;
      currentPassword: string;
      newPassword: string;
      updatePassword: string;
      devicesFailedLoad: string;
      deviceSignedOut: string;
      deviceSignOutFailed: string;
      trustRemoved: string;
      trustRemovalFailed: string;
      othersSignedOut: string;
      othersSignOutFailed: string;
      allSignedOut: string;
      allSignOutFailed: string;
      browser: string;
      unknownDevice: string;
      unknownUserAgent: string;
      devicesTitle: string;
      refresh: string;
      signOutOthers: string;
      signOutAll: string;
      metricActiveSessions: string;
      metricTrustedDevices: string;
      metricThisSession: string;
      noSessionsTitle: string;
      noSessionsText: string;
      statusCurrent: string;
      statusTrusted: string;
      statusUnknown: string;
      sessionId: string;
      deviceId: string;
      ip: string;
      lastUsed: string;
      expires: string;
      removeTrust: string;
      revoke: string;
      usersFailedLoad: string;
      userUpdated: string;
      userUpdateFailed: string;
      userDeleteConfirm: string;
      userDeleted: string;
      userDeleteFailed: string;
      usersTitle: string;
      searchByNameEmail: string;
      roleFilter: string;
      usersVisibleTitle: string;
      noUsersMatch: string;
      roleUser: string;
      roleSales: string;
      roleAdmin: string;
      roleSuperadmin: string;
      delete: string;
      permsFailedLoad: string;
      permsRoleFailedLoad: string;
      permsSaved: string;
      permsSaveFailed: string;
      rbacEyebrow: string;
      manageRolePermissions: string;
      saving: string;
      saveChanges: string;
      totalPermissions: string;
      availablePermissions: string;
      activePermissions: string;
      resourceSuffix: string;
      logsRefreshed: string;
      logsFailedLoad: string;
      logsTitle: string;
      autoRefreshOn: string;
      autoRefreshOff: string;
      refreshNow: string;
      logFilterLabel: string;
      dateFrom: string;
      dateTo: string;
      eventTable: string;
      noLogsMatch: string;
      logActionOn: string;
      noDescription: string;
      ipAddress: string;
      actorUserId: string;
      userAgent: string;
      investLoadHistoryFailed: string;
      investCompleted: string;
      investFailed: string;
      investDetailFailed: string;
      investLoading: string[];
      investEyebrow: string;
      investTitle: string;
      analyzing: string;
      runInvestigation: string;
      streamingAnalysis: string;
      latestResult: string;
      investOutputTitle: string;
      aiProcessing: string;
      riskLevel: string;
      riskWeightNote: string;
      score: string;
      timeline: string;
      suspiciousSignals: string;
      recommendations: string;
      noItems: string;
      readyTitle: string;
      readyDesc: string;
      savedCount: string;
      savedTitle: string;
      noSavedTitle: string;
      noSavedDesc: string;
      investigationId: string;
      previous: string;
      pageOf: string;
      next: string;
      investigationDetails: string;
      closeDetails: string;
      status: string;
      riskNoteHigh: string;
      riskNoteMedium: string;
      riskNoteLow: string;
      noResultYet: string;
    };
    upgrade: {
      snapLoadError: string;
      loadPlansFailed: string;
      pleaseLogin: string;
      freeActive: string;
      tokenFailed: string;
      waitingPayment: string;
      paymentFailed: string;
      paymentCancelled: string;
      redirecting: string;
      processFailed: string;
      loadingPlans: string;
      backToDashboard: string;
      title: string;
      subtitle: string;
      paymentSuccess: string;
      upgradingDesc: string;
      freePrice: string;
      currentPlan: string;
      unavailable: string;
      websitesCount: string;
      aiGeneratePerMonth: string;
      sectionRegenPerMonth: string;
      designRegenPerMonth: string;
      noCustomDomain: string;
      basicSeo: string;
      popular: string;
      perYear: string;
      promoYearly: string;
      equivalentPerMonth: string;
      savingsPerYear: string;
      perMonth: string;
      promoMonths: string;
      choosePlan: string;
      yearly: string;
      monthly: string;
      customDomainCount: string;
      seoOptimized: string;
    };
    adminPlans: {
      noAccess: string;
      title: string;
      subtitle: string;
      newPlan: string;
      allPlans: string;
      noPlansYet: string;
      createFirstPlan: string;
      perMonth: string;
      perYear: string;
      active: string;
      inactive: string;
      sitesCount: string;
      aiCount: string;
      membersCount: string;
      tablePlan: string;
      tablePrice: string;
      tableSites: string;
      tableAiGen: string;
      tableMembers: string;
      tableDomains: string;
      tableStatus: string;
      promoMonthly: string;
      promoMonthsShort: string;
      promoYearly: string;
      promoTag: string;
      editPlan: string;
      createPlan: string;
      name: string;
      slug: string;
      description: string;
      featuresLabel: string;
      featuresPlaceholder: string;
      priceMonthly: string;
      priceYearly: string;
      promoPricing: string;
      promoPriceMonthly: string;
      promoPriceYearly: string;
      noPromo: string;
      durationMonths: string;
      promoLabel: string;
      promoLabelPlaceholder: string;
      maxSites: string;
      aiGenerates: string;
      sectionRegens: string;
      designRegens: string;
      maxMembers: string;
      customDomains: string;
      planActive: string;
      cancel: string;
      saving: string;
      updatePlan: string;
      createPlanBtn: string;
      deleteConfirm: string;
      planDeleted: string;
      planUpdated: string;
      planCreated: string;
      loadFailed: string;
      saveFailed: string;
      deleteFailed: string;
      required: string;
    };
    adminHealth: {
      noAccess: string;
      title: string;
      subtitle: string;
      refresh: string;
      loadFailed: string;
      loadFailedTitle: string;
      retry: string;
      serviceDatabase: string;
      dbPostgres: string;
      serviceCache: string;
      redisConnection: string;
      serviceAi: string;
      geminiStatus: string;
      serviceVersion: string;
      apiVersionDesc: string;
      statusHealthy: string;
      statusUnhealthy: string;
      statusUnknown: string;
      lastCheckedAt: string;
      neverChecked: string;
      allSystemsUp: string;
      someIssues: string;
    };
    adminMetrics: {
      noAccess: string;
      title: string;
      subtitle: string;
      refresh: string;
      loadFailed: string;
      loadFailedTitle: string;
      retry: string;
      avgDuration: string;
      avgDurationDesc: string;
      p95: string;
      p95Desc: string;
      errorRate: string;
      errorsOfRequests: string;
      activeRequests: string;
      activeRequestsDesc: string;
      trendTitle: string;
      trendDesc: string;
      noTrendData: string;
      recentRequests: string;
      recentRequestsDesc: string;
      noRequestsLogged: string;
    };
    adminTemplates: {
      seedLoadFailed: string;
      backfillConfirm: string;
      backfillDone: string;
      backfillFailed: string;
      seedDeleteConfirm: string;
      seedDeleted: string;
      seedDeleteFailed: string;
      accessDenied: string;
      superadminOnly: string;
      superadmin: string;
      title: string;
      subtitle: string;
      backfillScores: string;
      refreshSeeds: string;
      tabComponents: string;
      tabSeeds: string;
      searchComponentsPlaceholder: string;
      searchSeedsPlaceholder: string;
      allCategories: string;
      allBusinessTypes: string;
      allMoods: string;
      noTemplateMatch: string;
      resetFilter: string;
      score: string;
      defaultSeed: string;
      heading: string;
      normal: string;
      bodyFont: string;
      body: string;
      designQuality: string;
      previewFullscreen: string;
      loginRequired: string;
      loginSession: string;
      loadingSeeds: string;
      superadminOnlyManage: string;
      insufficientAccess: string;
      noSeedsInDb: string;
      noSeedsMatch: string;
      resetSearch: string;
      entriesCount: string;
      noPalette: string;
      base: string;
      view: string;
      delete: string;
      sortNewest: string;
      sortOldest: string;
      sortScoreAsc: string;
      sortScoreDesc: string;
      scoreBelowPlaceholder: string;
      scoreFilterAll: string;
      scoreFilterExcellent: string;
      scoreFilterGood: string;
      scoreFilterWeak: string;
      selectAllFiltered: string;
      clearSelection: string;
      selectedCount: string;
      deleteSelected: string;
      bulkDeleteConfirm: string;
      bulkDeleted: string;
      bulkDeletePartialFail: string;
      critique: string;
      critiqueRunning: string;
      critiqueDone: string;
      critiqueFailed: string;
      aestheticScore: string;
      needsReview: string;
      critiqueTitle: string;
      critiqueStrengths: string;
      critiqueImprovements: string;
      critiqueScreenshot: string;
      critiqueViewDetails: string;
      critiqueDetailsTitle: string;
      critiqueDimensions: string;
      critiqueScreenshotTitle: string;
      critiqueOpenScreenshot: string;
      critiqueClose: string;
      critiqueNoScreenshot: string;
      critiqueVerdict: string;
    };
    adminAnnouncements: {
      noAccess: string;
      title: string;
      subtitle: string;
      new: string;
      all: string;
      noItems: string;
      createFirst: string;
      active: string;
      inactive: string;
      expires: string;
      loadFailed: string;
      created: string;
      createFailed: string;
      deleteConfirm: string;
      deleted: string;
      deleteFailed: string;
      titleField: string;
      severity: string;
      sevInfo: string;
      sevWarning: string;
      sevImportant: string;
      contentField: string;
      cancel: string;
      creating: string;
      create: string;
    };
    adminCommissions: {
      loadFailed: string;
      tier1RangeError: string;
      tier2RangeError: string;
      configUpdated: string;
      configUpdateFailed: string;
      amountPositiveError: string;
      ruleUpdated: string;
      ruleUpdateFailed: string;
      loading: string;
      accessRestricted: string;
      accessRestrictedDesc: string;
      title: string;
      subtitle: string;
      rateSettings: string;
      activeScheme: string;
      tieredScheme: string;
      tier1FirstMonths: string;
      tier2After: string;
      tier1Label: string;
      tier2Label: string;
      save: string;
      superadminOnlyEdit: string;
      superadmin: string;
      bonusRulesSettings: string;
      tier: string;
      onboardingDesc: string;
      milestoneDesc: string;
      bonusAmount: string;
      recurringCommissions: string;
      allBonuses: string;
      allCommissionTxns: string;
      pendingOnPage: string;
      noCommissions: string;
      colDate: string;
      colSalesUser: string;
      colTenantId: string;
      colOrderId: string;
      colGrossAmount: string;
      colRate: string;
      colCommission: string;
      colStatus: string;
      pageOf: string;
      previous: string;
      next: string;
      allBonusesTitle: string;
      noBonuses: string;
      colBonusType: string;
      colDetailPeriod: string;
      colBonusAmount: string;
      bonus: string;
      tenant: string;
      period: string;
      markPaid: string;
      bonusPayoutSuccess: string;
      bonusPayoutFailed: string;
      filterAll: string;
      filterPending: string;
      filterPaid: string;
      filterVoided: string;
      selectAllPending: string;
    };
    adminDesignAssets: {
      accessDenied: string;
      accessDeniedDesc: string;
      superadmin: string;
      loading: string;
      title: string;
      subtitle: string;
      saving: string;
      resetAll: string;
      resetAllConfirm: string;
      resetAllSuccess: string;
      resetAllFailed: string;
      saveLocalOnly: string;
      tabSections: string;
      tabTypography: string;
      tabPalettes: string;
      tabPresets: string;
      hidden: string;
      active: string;
      optional: string;
      required: string;
      show: string;
      hide: string;
      require: string;
      unrequire: string;
      custom: string;
      sectionsVisibilityTitle: string;
      sectionsVisibilityDesc: string;
      resetDefault: string;
      variantsActive: string;
      variantsTitle: string;
      variantsDesc: string;
      variantsCount: string;
      mapTilesTitle: string;
      mapTilesDesc: string;
      tileLabelLight: string;
      tileLabelDark: string;
      tileLabelSatellite: string;
      tileDescOsm: string;
      tileDescCyclosm: string;
      tileDescLight: string;
      tileDescDark: string;
      tileDescEsri: string;
      tileDescSatellite: string;
      addPairingTitle: string;
      addPatternTitle: string;
      addPresetTitle: string;
      name: string;
      description: string;
      headingFont: string;
      bodyFont: string;
      weight: string;
      heroSize: string;
      emojiIcon: string;
      fontPairing: string;
      colorPalette: string;
      mode: string;
      light: string;
      dark: string;
      cancel: string;
      save: string;
      searchPairings: string;
      searchPatterns: string;
      searchPresets: string;
      add: string;
      noPairingsMatch: string;
      noPatternsMatch: string;
      noPresetsMatch: string;
      score: string;
      sectionRequiredError: string;
      sectionHidden: string;
      sectionShown: string;
      sectionRequired: string;
      sectionOptional: string;
      variantHidden: string;
      variantShown: string;
      sectionsReset: string;
      tileHidden: string;
      tileShown: string;
      pairingHidden: string;
      pairingShown: string;
      pairingAdded: string;
      deletePairingConfirm: string;
      pairingDeleted: string;
      patternHidden: string;
      patternShown: string;
      patternAdded: string;
      deletePatternConfirm: string;
      patternDeleted: string;
      presetHidden: string;
      presetShown: string;
      presetAdded: string;
      deletePresetConfirm: string;
      presetDeleted: string;
    };
    notifications: {
      title: string;
      loading: string;
      loadFailed: string;
      markReadFailed: string;
      allRead: string;
      markAllFailed: string;
      markAllRead: string;
      markReadTooltip: string;
      viewTooltip: string;
      unreadCount: string;
      noNew: string;
      emptyTitle: string;
      emptyDesc: string;
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
      daysAgo: string;
      typeAnnouncement: string;
      typeLead: string;
      typeSystem: string;
    };
    investigate: {
      loadingClustering: string;
      loadingTimeline: string;
      loadingSignals: string;
      loadingRecommendations: string;
      loadHistoryFailed: string;
      completed: string;
      runFailed: string;
      loadDetailFailed: string;
      noResultNote: string;
      noteHigh: string;
      noteMedium: string;
      noteLow: string;
      eyebrowAi: string;
      title: string;
      analyzing: string;
      runInvestigation: string;
      fieldResource: string;
      fieldStatus: string;
      fieldAction: string;
      fieldSearch: string;
      fieldDateFrom: string;
      fieldDateTo: string;
      streamingAnalysis: string;
      latestResult: string;
      outputTitle: string;
      aiProcessing: string;
      riskLevel: string;
      riskWeightedDesc: string;
      score: string;
      listTimeline: string;
      listSignals: string;
      listRecommendations: string;
      emptyTitle: string;
      emptyDesc: string;
      savedCount: string;
      savedTitle: string;
      refresh: string;
      noSavedTitle: string;
      noSavedDesc: string;
      investigationChip: string;
      previous: string;
      pageOf: string;
      next: string;
      detailsEyebrow: string;
      closeLabel: string;
      statusLabel: string;
      noItems: string;
      errorEyebrow: string;
      errorTitle: string;
      errorHeading: string;
      errorDesc: string;
      tryAgain: string;
    };
    sales: {
      loadFailed: string;
      codeCopied: string;
      linkCopied: string;
      regenerated: string;
      regenerateFailed: string;
      loading: string;
      accessDeniedTitle: string;
      accessDeniedDesc: string;
      pageTitle: string;
      pageDesc: string;
      viewCommissions: string;
      codeCardTitle: string;
      codeCardDesc: string;
      copied: string;
      copyCode: string;
      updatePrompt: string;
      regenerateCode: string;
      linkCardTitle: string;
      linkCardDesc: string;
      copyLink: string;
      tipsLabel: string;
      tipsText: string;
      programTitle: string;
      commRatePrefix: string;
      commRateSuffix: string;
      commRecurringPrefix: string;
      commRecurringSuffix: string;
      commEditorPrefix: string;
      commEditorSuffix: string;
      dialogTitle: string;
      confirmPrefix: string;
      confirmSuffix: string;
      cancel: string;
      processing: string;
      confirmRegenerate: string;
    };
    salesOverview: {
      loadFailed: string;
      loading: string;
      accessDeniedTitle: string;
      accessDeniedDesc: string;
      pageTitle: string;
      pageDesc: string;
      cardTotal: string;
      cardTotalDesc: string;
      cardCommission: string;
      cardCommissionDesc: string;
      cardBonus: string;
      cardBonusDesc: string;
      cardPending: string;
      cardPendingDesc: string;
      refCardTitle: string;
      refLinkLabel: string;
      copyCode: string;
      copyLink: string;
      copied: string;
      manageRef: string;
      schemeTitle: string;
      tier1Desc: string;
      tier2Desc: string;
      bonusSchemeTitle: string;
      bonusOnboarding: string;
      bonusMilestone: string;
      quickLinksTitle: string;
      linkCommissionsTitle: string;
      linkCommissionsDesc: string;
      linkReferralTitle: string;
      linkReferralDesc: string;
      codeCopied: string;
      linkCopied: string;
    };
    salesCommissions: {
      loadFailed: string;
      loading: string;
      accessDeniedTitle: string;
      accessDeniedDesc: string;
      pageTitle: string;
      pageDesc: string;
      cardTotal: string;
      cardTotalDesc: string;
      cardCommission: string;
      cardCommissionDesc: string;
      cardBonus: string;
      cardBonusDesc: string;
      cardPending: string;
      cardPendingDesc: string;
      tabCommissions: string;
      tabBonuses: string;
      noCommissionsTitle: string;
      noCommissionsDesc: string;
      thDate: string;
      thOrderId: string;
      thTenantId: string;
      thGross: string;
      thRate: string;
      thCommission: string;
      thStatus: string;
      tierLabel: string;
      pageOf: string;
      previous: string;
      next: string;
      noBonusesTitle: string;
      noBonusesDesc: string;
      thBonusType: string;
      thDetail: string;
      thAmount: string;
      bonusTypeLabel: string;
      bonusTenant: string;
      bonusPeriod: string;
    };
    tenants: {
      loadFailed: string;
      accessDenied: string;
      title: string;
      emptyTitle: string;
      thTenant: string;
      thPlan: string;
      thMembers: string;
      thSites: string;
      thCreated: string;
      manage: string;
    };
    tenantDetail: {
      loadFailed: string;
      planUpdated: string;
      assignFailed: string;
      accessDenied: string;
      notFoundTitle: string;
      backToTenants: string;
      tenantInfoTitle: string;
      slugLabel: string;
      ownerIdLabel: string;
      planAssignmentTitle: string;
      currentPlanLabel: string;
      changePlanLabel: string;
      selectPlan: string;
      assign: string;
      usageTitle: string;
      usageGenerates: string;
      usageSectionRegens: string;
      usageDesignRegens: string;
      usageTokenInput: string;
      usageTokenOutput: string;
      usageEmpty: string;
      membersTitle: string;
      noMembers: string;
      thName: string;
      thEmail: string;
      thRole: string;
      thJoined: string;
      viewSites: string;
      viewDomains: string;
      viewLeads: string;
    };
    logs: {
      refreshed: string;
      loadFailed: string;
      title: string;
      autoRefreshOn: string;
      autoRefreshOff: string;
      refreshNow: string;
      filterAction: string;
      filterResource: string;
      filterStatus: string;
      filterIpSearch: string;
      filterDateFrom: string;
      filterDateTo: string;
      eventTable: string;
      emptyDesc: string;
      actionOn: string;
      noDescription: string;
      detailIp: string;
      detailActor: string;
      detailAgent: string;
    };
    permissions: {
      loadInitialFailed: string;
      loadRoleFailed: string;
      saveSuccess: string;
      saveFailed: string;
      eyebrow: string;
      title: string;
      saving: string;
      save: string;
      totalCount: string;
      availablePermissions: string;
      activeCount: string;
      resourceLabel: string;
    };
    sessions: {
      title: string;
      refresh: string;
      refreshLabel: string;
      loadFailed: string;
      signedOut: string;
      signOutFailed: string;
      trustRemoved: string;
      trustRemoveFailed: string;
      othersSignedOut: string;
      othersSignOutFailed: string;
      allSignedOut: string;
      allSignOutFailed: string;
      signOutOthers: string;
      signOutAll: string;
      metricActive: string;
      metricTrusted: string;
      metricCurrent: string;
      emptyTitle: string;
      emptyDesc: string;
      statusCurrent: string;
      statusTrusted: string;
      statusUnknown: string;
      sessionChip: string;
      deviceChip: string;
      trustChip: string;
      unknownDevice: string;
      unknownAgent: string;
      ipLabel: string;
      lastUsed: string;
      trustedUsed: string;
      expires: string;
      removeTrust: string;
      revokeSession: string;
    };
    users: {
      title: string;
      refresh: string;
      searchPlaceholder: string;
      rolePlaceholder: string;
      loadFailed: string;
      roleUpdated: string;
      roleUpdateFailed: string;
      deleteConfirm: string;
      deleted: string;
      deleteFailed: string;
      adminVisibleTitle: string;
      emptyDesc: string;
      delete: string;
    };
    upgradeSuccess: {
      confirmTimeout: string;
      backToDashboard: string;
      pendingTitle: string;
      pendingDesc: string;
      successTitle: string;
      successDesc: string;
      errorTitle: string;
      errorDesc: string;
      txDetails: string;
      orderIdLabel: string;
      totalLabel: string;
      methodLabel: string;
      timeLabel: string;
      goToDashboard: string;
      viewOtherPlans: string;
    };
    sitesNew: {
      connecting: string;
      noWorkspaceTitle: string;
      noWorkspaceDesc: string;
      backToDashboard: string;
    };
    sitesSeo: {
      title: string;
      webLink: string;
      saving: string;
      saved: string;
      save: string;
      loadFailed: string;
      saveFailed: string;
      gscSaved: string;
      aiFailed: string;
      upgradeTitle: string;
      upgradeDesc: string;
      upgradeNow: string;
      later: string;
    };
    sitesIntegrations: {
      title: string;
      webLink: string;
      loadFailed: string;
      saved: string;
      saveFailed: string;
      save: string;
      saving: string;
      ga4Desc: string;
      metaPixelDesc: string;
    };
    sitesTestimonials: {
      loadFailed: string;
      shareTitle: string;
      copy: string;
      linkCopied: string;
      pendingTitle: string;
      approved: string;
      approvedDesc: string;
      approve: string;
      approveFailed: string;
      rejected: string;
      rejectedDesc: string;
      reject: string;
      rejectFailed: string;
      validationRequired: string;
      added: string;
      addFailed: string;
      add: string;
      manualTitle: string;
      manualDesc: string;
      labelName: string;
      labelRole: string;
      labelQuote: string;
      labelRating: string;
      saving: string;
      saveToSite: string;
      cancel: string;
      emptyDesc: string;
    };
    sitesKatalog: {
      loadFailed: string;
      saveFailed: string;
      saving: string;
      saved: string;
      save: string;
      webLink: string;
      emojiPopular: string;
      emojiFood: string;
      emojiServices: string;
      emojiSymbols: string;
      emojiSymbol: string;
      pickEmojiTitle: string;
      close: string;
      sectionTitleMenu: string;
      sectionTitleCatalog: string;
      itemLabelMenu: string;
      itemLabelCatalog: string;
      itemCountLabel: string;
      noCategoriesTitle: string;
      noCategoriesDesc: string;
      itemNumberLabel: string;
      noItemsDesc: string;
      labelSectionTitle: string;
      labelEyebrow: string;
      labelSubtitle: string;
      labelPhoto: string;
      labelName: string;
      labelPrice: string;
      labelBadge: string;
      badgeHint: string;
      labelDescription: string;
      bulletList: string;
      numberedList: string;
      addItemLabel: string;
      addCategory: string;
      defaultCategory: string;
      bannerTitle: string;
      bannerDesc1: string;
      bannerDesc2: string;
      bannerDesc3: string;
      bannerPricePart: string;
      addWord: string;
      aiPromptLabelPrefix: string;
      itemFallback: string;
      aiModalTitle: string;
      aiModalDesc: string;
      aiFailed: string;
      generate: string;
      processing: string;
      cancel: string;
      aiGenerateTitle: string;
      aiGenerateDesc: string;
      optional: string;
      upgradeTitle: string;
      upgradeDesc: string;
      upgradeNow: string;
      later: string;
      chipMenu: string;
      chipCatalog: string;
      chipCategoryCount: string;
    };
    sitesBlog: {
      title: string;
      webLink: string;
      addNew: string;
      layoutLabel: string;
      aiPick: string;
      nonPremiumText: string;
      upgrade: string;
      writePostTitle: string;
      savePost: string;
      cancel: string;
      aiCardTitle: string;
      generate: string;
      generateLabel: string;
      layoutGrid: string;
      layoutGridDesc: string;
      layoutList: string;
      layoutListDesc: string;
      layoutFeatured: string;
      layoutFeaturedDesc: string;
      layoutMinimal: string;
      layoutMinimalDesc: string;
      loadFailed: string;
      draftCreated: string;
      generateFailed: string;
      postCreated: string;
      createFailed: string;
      publishFailed: string;
      published: string;
      layoutSaved: string;
      layoutFailed: string;
      publishedDate: string;
      draftDate: string;
      publishedBadge: string;
      draftBadge: string;
      edit: string;
      publish: string;
      emptyDesc1: string;
      emptyDesc2: string;
    };
    sitesBlogPost: {
      loadFailed: string;
      saveFailed: string;
      bold: string;
      italic: string;
      heading2: string;
      heading3: string;
      bulletList: string;
      orderedList: string;
      blockquote: string;
      link: string;
      uploadImage: string;
      notFound: string;
      back: string;
      editor: string;
      preview: string;
      published: string;
      draft: string;
      unsaved: string;
      savedAt: string;
      save: string;
      excerpt: string;
      seoTitle: string;
      seoDescription: string;
      noindex: string;
      noindexDesc: string;
      cover: string;
      aiFailed: string;
      generating: string;
      generate: string;
      aiCardTitle: string;
      aiPromptLabelPrefix: string;
    };
    sitesEditor: {
      authenticating: string;
      loading: string;
      loadFailed: string;
      loadMore: string;
      backToSites: string;
      back: string;
      contentTab: string;
      designTab: string;
      styleLabel: string;
      layoutLabel: string;
      sectionOrder: string;
      sectionSpacing: string;
      cornerRadius: string;
      cornerSharp: string;
      cornerSoft: string;
      cornerRounded: string;
      heroStyle: string;
      heroCentered: string;
      heroSplit: string;
      heroFullBleed: string;
      heroMinimalist: string;
      spacingCompact: string;
      spacingRelaxed: string;
      spacingCompactShort: string;
      spacingRelaxedShort: string;
      normal: string;
      colorPalette: string;
      primaryColor: string;
      accentColor: string;
      backgroundColor: string;
      surfaceColor: string;
      textColor: string;
      primaryShort: string;
      accentShort: string;
      backgroundShort: string;
      surfaceShort: string;
      textShort: string;
      visualCustomization: string;
      layoutStyle: string;
      aiDesignPrompt: string;
      aiInstructionsTitle: string;
      aiPromptDesc: string;
      generateAi: string;
      regenerateWithAi: string;
      processing: string;
      applyStyle: string;
      cancel: string;
      later: string;
      upgradeToPro: string;
      upgradeDefaultTitle: string;
      upgradeDefaultBody: string;
      upgradeRegenTitle: string;
      upgradeRegenBody: string;
      upgradeDesignTitle: string;
      upgradeDesignBody: string;
      upgradeSuggestionTitle: string;
      upgradeSuggestionBody: string;
      upgradeProDesc: string;
      save: string;
      saving: string;
      saved: string;
      saveSuccess: string;
      saveFailed: string;
      autosaveFailed: string;
      notFoundTitle: string;
      notFoundDesc: string;
      preview: string;
      previewDesktop: string;
      previewTablet: string;
      previewMobile: string;
      toggleDarkAria: string;
      light: string;
      dark: string;
      switchLight: string;
      switchDark: string;
      aiUsage: string;
      generate: string;
      sectionRegen: string;
      designRegen: string;
      qualityScore: string;
      qualityTitle: string;
      qualityDesc: string;
      qualityWarning: string;
      qualityFieldHint: string;
      fill: string;
      viewCompleteness: string;
      undo: string;
      undoAllTitle: string;
      undoDesign: string;
      undoDesignTitle: string;
      noDesignChanges: string;
      show: string;
      hide: string;
      showSection: string;
      hideSection: string;
      hidden: string;
      showPageSections: string;
      expandEditArea: string;
      variantOptions: string;
      selectSectionAria: string;
      openSheet: string;
      closeSheet: string;
      publish: string;
      publishShort: string;
      publishSuccess: string;
      publishFailed: string;
      applying: string;
      applyLive: string;
      apply: string;
      live: string;
      draft: string;
      aiProcessing: string;
      aiReviewActive: string;
      aiReviewDesc1: string;
      aiReviewDesc2: string;
      diffAi: string;
      diffChanges: string;
      content: string;
      old: string;
      new: string;
      use: string;
      useThis: string;
      revert: string;
      aiApplied: string;
      aiCancelled: string;
      aiReverted: string;
      aiNoChange: string;
      aiNoChangeHint: string;
      aiSectionDone: string;
      aiSectionFailed: string;
      aiStyleDone: string;
      aiStyleFailed: string;
      aiStyleNoChange: string;
      aiProcessFailed: string;
      siteStyle: string;
      aiDesignEngine: string;
      latestAiGenerated: string;
      latest: string;
      latestAiDesc: string;
      aiResult: string;
      aiMoodCreated: string;
      editLabel: string;
      confirmPublishTitle: string;
      confirmPublishDesc: string;
      confirmPublishBody: string;
      confirmApply: string;
      upgradeLabel: string;
      aiInstructionsPlaceholder: string;
      aiDesignInstructionsPlaceholder: string;
      aiDesignFailed: string;
      aiHistory: string;
      aiMadeFor: string;
      aiRecommendation: string;
      aiTemplateCategory: string;
      aiTemplateName: string;
      appearancePreset: string;
      bodyFont: string;
      colorPattern: string;
      headingFont: string;
      headingWeight: string;
      heroTitleSize: string;
      manualFineTune: string;
      orChoosePairing: string;
      orChoosePalette: string;
      orChoosePreset: string;
      pageSections: string;
      sizeLarge: string;
      sizeMax: string;
      sizeMedium: string;
      sizeSmall: string;
      sizeVeryLarge: string;
      styleChoiceAria: string;
      typographyStyle: string;
      weightBold: string;
      weightExtraBold: string;
      weightMedium: string;
      weightRegular: string;
      weightSemiBold: string;
    };
    wizard: {
      initialMessage: string;
      nameAckVariants: string[];
      nameConfirmVariants: string[];
      descriptionPrompt: string;
      descriptionSkipKeyword: string;
      descriptionInferenceHigh: string;
      descriptionInferenceMedium: string;
      descriptionInferenceNone: string;
      selectMoodPrompt: string;
      selectLanguagePrompt: string;
      preparingWebsite: string;
      websiteReady: string;
      confirmCardTitle: string;
      confirmCardLabelName: string;
      confirmCardLabelType: string;
      confirmCardLabelTypeHeader: string;
      confirmCardLabelWA: string;
      confirmCardLabelArea: string;
      confirmCardLabelLang: string;
      confirmCardBtnChange: string;
      confirmCardBtnFill: string;
      confirmCardBtnClose: string;
      confirmCardBtnGenerate: string;
      confirmCardBtnGenerateRedo: string;
      confirmCardBtnGenerating: string;
      confirmCardBtnFinishEdit: string;
      successModalTitle: string;
      successModalDesc: string;
      successModalBtnPreview: string;
      successModalBtnEdit: string;
      errorModalRetry: string;
      errorModalCancel: string;
      loadingBuildingTitle: string;
      loadingBuildingTitleWithName: string;
      loadingBuildingTitleGeneral: string;
      loadingPleaseWait: string;
      loadingCharsWritten: string;
      loadingAiInsight: string;
      loadingChecklist0: string;
      loadingChecklist1: string;
      loadingChecklist2: string;
      loadingChecklist3: string;
      loadingChecklist4: string;
      loadingChecklist5: string;
      inputPlaceholderName: string;
      inputPlaceholderDesc: string;
      inputPlaceholderGeneral: string;
      sttListening: string;
      sttUseVoice: string;
      btnNext: string;
      btnSkip: string;
      btnChangeName: string;
      btnYesContinue: string;
      btnSeeOtherOptions: string;
      btnSave: string;
      btnCancel: string;
      btnFinish: string;
      btnSaveAndApply: string;
      previewWebsiteTitle: string;
      openForm: string;
      closeForm: string;
      businessDetailsTitle: string;
      businessDetailsSubtitle: string;
      waSaved: string;
      waEmpty: string;
      areaEmpty: string;
      waHint: string;
      serviceAreaHint: string;
      voiceNotAvailable: string;
      chooseMoreAppropriate: string;
      placeholderPhone: string;
      placeholderArea: string;
      sttStopRecording: string;
      sttStartRecording: string;
      backToChat: string;
      generationFailed: string;
      generationErrorMessage: string;
      successToastTitle: string;
      successToastDesc: string;
      closeNotification: string;
      btnLater: string;
      btnCompleteData: string;
      btnEditPublish: string;
      notThisType: string;
      moreSpecific: string;
      chooseMoodHint: string;
      suggestedBadge: string;
      typeSelectedChooseSub: string;
      wireframeAbout: string;
      wireframeFeatures: string;
      wireframeContact: string;
      statusWaitingInput: string;
      statusAiGenerating: string;
      statusPreviewReady: string;
      statusPreparingAi: string;
      nameConfirmPlaceholder: string;
      descPlaceholder: string;
      labelBusinessName: string;
      labelBusinessType: string;
      labelBusinessSubType: string;
      labelDescription: string;
      labelWhatsapp: string;
      labelServiceArea: string;
      labelMood: string;
      categories: {
        kuliner: string;
        kulinerDesc: string;
        tokoUmkm: string;
        tokoUmkmDesc: string;
        jasa: string;
        jasaDesc: string;
        company: string;
        companyDesc: string;
      };
      moods: {
        modernClean: string;
        modernCleanDesc: string;
        warmVintage: string;
        warmVintageDesc: string;
        boldEnergetic: string;
        boldEnergeticDesc: string;
        elegantLuxury: string;
        elegantLuxuryDesc: string;
        playfulFun: string;
        playfulFunDesc: string;
        minimalistDark: string;
        minimalistDarkDesc: string;
      };
      subtypes: Record<string, string>;
      resumePrompt: string;
      resumeSavedLabel: string;
      resumeContinue: string;
      resumeStartFresh: string;
      timeJustNow: string;
      timeMinutesAgo: string;
      timeHoursAgo: string;
      timeDaysAgo: string;
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
      footerBlog: "Blog",
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
      activeBadge: "Aktif",
      yearlySavings: "🎉 Hemat Rp {value}/tahun",
      websiteCount: "{n} Website",
      aiGenerate: "AI Generate {n}x/bulan",
      aiRegen: "AI Regenerasi {n}x/bulan",
      aiDesign: "AI Design {n}x/bulan",
      noCustomDomain: "Tidak ada custom domain",
      seoBooster: "SEO Booster",
      subdomainFeature: "Subdomain .webjoz.app",
      hostingFeature: "Hosting & SSL gratis",
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
      upgradeLabel: "Upgrade",
      authenticated: "Terautentikasi",
      locked: "Terkunci",
      appearance: "Tampilan",
      language: "Bahasa",
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
        recentAccounts: "Akun Terbaru",
        viewAll: "Lihat semua",
        noAccounts: "Belum ada akun terdaftar.",
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
        salesOverview: "Sales Overview",
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
        subdomainPlaceholder: "namaanda",
        subdomainAvailable: "Tersedia: {url}",
        subdomainInvalidHint: "Gunakan huruf kecil, angka, atau tanda hubung (-)",
        subdomainHint: "Hanya huruf kecil, angka, dan tanda hubung. Subdomain tidak bisa diubah setelah dipublikasikan.",
        connectCustomDomain: "Hubungkan Custom Domain",
        customDomainDescPre: "Ingin brand yang lebih profesional seperti domainanda.com? Anda dapat mengaturnya di",
        customDomainDescPost: "setelah website Anda live.",
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
        linkEditor: "Editor",
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
        continueEditing: "Lanjut Edit",
      },
      leads: {
        loadFailed: "Gagal memuat inbox leads",
        loading: "Memuat kotak masuk leads...",
        filter: "Filter",
        allWebsites: "Semua Website",
        emptyTitle: "Kotak Masuk Kosong",
        emptyDesc: "Belum ada leads yang masuk. Pastikan Anda mengaktifkan opsi \"Tampilkan Formulir Kontak\" pada konfigurasi website Anda.",
        sender: "Pengirim",
        date: "Tanggal Masuk",
        sourceSite: "Website Sumber",
        actions: "Aksi",
        siteId: "Situs ID #{id}",
        detail: "Detail",
        leadDetail: "Detail Leads Pelanggan",
        inquiryMessage: "Pesan Inkuiri",
        receivedOn: "Diterima pada",
        sourceUrl: "URL Halaman Sumber",
        selectPrompt: "Pilih salah satu lead di tabel untuk melihat isi pesan detail.",
      },
      team: {
        loadFailed: "Gagal memuat data tim",
        inviteSent: "Undangan terkirim",
        inviteFailed: "Gagal mengirim undangan",
        inviteRevoked: "Undangan dibatalkan",
        revokeFailed: "Gagal membatalkan undangan",
        memberRemoved: "Anggota dihapus",
        removeFailed: "Gagal menghapus anggota",
        membersTitle: "Anggota Tim ({count})",
        invitePending: "Undangan menunggu · role: {role}",
        pending: "Menunggu",
        inviteLinkCopied: "Link undangan disalin",
        noMembers: "Belum ada anggota tim.",
        inviteTitle: "Undang Anggota Baru",
        emailPlaceholder: "email@contoh.com",
        sendInvite: "Kirim Undangan",
        inviteHint: "Anggota dengan role editor bisa mengedit konten situs. Viewer hanya bisa melihat.",
        limitTitle: "Batas Anggota Tim Tercapai",
        later: "Nanti Saja",
        upgradeToPro: "Upgrade ke Pro",
        limitDesc: "Paket Anda saat ini memiliki batas jumlah anggota tim. Upgrade untuk menambah lebih banyak kolaborator.",
        role: {
          owner: "Pemilik",
          editor: "Editor",
          viewer: "Viewer",
        },
      },
      analytics: {
        loadFailed: "Gagal memuat data analitik",
        loading: "Memuat data analitik...",
        noChartData: "Belum ada data kunjungan untuk rentang waktu ini.",
        chartAria: "Grafik kunjungan harian",
        srActivePoint: "Tanggal {date}, {count} pageviews",
        selectSite: "Pilih website",
        preset7: "7 Hari",
        preset30: "30 Hari",
        preset90: "90 Hari",
        to: "s/d",
        statPageviews: "Total Kunjungan (Pageviews)",
        up: "Naik",
        down: "Turun",
        fromPrevPeriod: "% dari periode sebelumnya",
        prevPeriodComp: "Perbandingan periode sebelumnya",
        statUniqueVisitors: "Kunjungan Unik",
        visitorsEstimate: "Estimasi berbasis IP + perangkat",
        statAvgDuration: "Rata-Rata Durasi",
        durationNote: "Termasuk kunjungan 1 halaman (0 detik)",
        dailyVisitsTitle: "Statistik Kunjungan Harian",
        dailyVisitsDesc: "Visualisasi pergerakan volume pengunjung harian.",
        leadsIn: "Leads Masuk",
        leadsFromForms: "Dari form kontak di situs Anda",
        conversion: " · konversi {pct}%",
        viewAllLeads: "Lihat semua leads",
        trafficSources: "Sumber Pengunjung",
        noReferrerData: "Belum ada data rujukan.",
        upsellTitle: "Buka Akses Analytics Penuh",
        later: "Nanti Saja",
        upgradeToPro: "Upgrade ke Pro",
        free7Days: "Paket Free — Maksimal 7 Hari",
        free7DaysDesc: "Akun Free hanya bisa melihat data analytics maksimal 7 hari ke belakang.",
        selectedRange: "Kamu memilih rentang {from} s/d {to}.",
        proUpgrade: "Upgrade ke Pro",
        proUpgradeDesc: "Dengan paket Pro, kamu bisa mengakses analytics hingga 90 hari, plus fitur eksklusif lainnya seperti kustom domain dan AI content writer tanpa batas.",
      },
      domains: {
        loadFailed: "Gagal memuat data domain",
        loading: "Memuat data domain...",
        added: "Custom domain berhasil ditautkan! Silakan atur CNAME di DNS registrar Anda.",
        addFailed: "Gagal menambahkan domain",
        invalidFormat: "Format domain tidak valid. Contoh: domainanda.com",
        verified: "Domain berhasil diverifikasi!",
        verifyFailed: "Verifikasi DNS gagal. Periksa record CNAME Anda.",
        confirmDelete: "Hapus domain ini?",
        deleted: "Domain dihapus.",
        deleteFailed: "Gagal menghapus domain",
        continueConnect: "Lanjutkan Hubungkan",
        upgradeToPro: "Upgrade ke Pro",
        close: "Tutup",
        upgradePlan: "Upgrade Paket",
        connectedTitle: "Custom Domain Terhubung ({count})",
        quotaTitle: "Paket {plan}: maksimal {max} domain per akun, tidak per website",
        quota: "Kuota: {used} / {max} custom domain",
        customDomainBadge: "Custom Domain",
        siteId: "Site #{id}",
        waitingPropagation: " · menunggu propagasi DNS",
        active: "Aktif",
        pending: "Pending",
        checkDns: "Cek DNS",
        delete: "Hapus",
        connectTitle: "Hubungkan Custom Domain",
        connectDesc: "Gunakan domain milik Anda sendiri untuk tampil lebih profesional.",
        noPublished: "Belum ada website yang dipublikasikan",
        noPublishedDesc: "Custom domain hanya bisa dihubungkan ke website yang sudah live. Publikasikan website Anda terlebih dahulu melalui halaman",
        myWebsites: "My Websites",
        linkToSite: "Tautkan ke Website",
        domainAddress: "Alamat Custom Domain",
        domainPlaceholder: "cth. tokokamu.com atau toko.domainanda.com",
        validFormat: "✓ Format domain valid",
        invalidFormatHint: "Format tidak valid — masukkan domain tanpa http:// atau www.",
        dnsInstructions: "Petunjuk Konfigurasi DNS di Provider Domain",
        step1: "Masuk ke akun Registrar Domain tempat Anda membeli domain (seperti Niagahoster, Rumahweb, Cloudflare, Namecheap, GoDaddy, dll).",
        step2: "Cari domain yang ingin diatur dan buka halaman DNS Management, DNS Zone Editor, atau Manage DNS.",
        step3: "Tambahkan DNS Record baru dengan tipe CNAME dan isi kolom sesuai data di bawah:",
        step4: "Simpan perubahan DNS Anda. Proses propagasi dan verifikasi domain biasanya memerlukan waktu mulai dari 5 menit hingga maksimal 24 jam.",
        dnsType: "Tipe / Type",
        dnsHost: "Host / Nama",
        dnsTarget: "Target / Value",
        note: "Catatan: Jika ingin menggunakan subdomain kustom seperti toko.domainanda.com, ubah kolom Host / Nama menjadi toko.",
        verifyHint: "Setelah menyimpan konfigurasi DNS di atas, kembali ke dashboard dan klik tombol \"Cek DNS\" (ikon Refresh) pada daftar domain Anda untuk memverifikasi.",
        connectBtn: "Tautkan Custom Domain",
        upsellTitle: "✨ Tingkatkan Kredibilitas Bisnis Anda",
        upsellDesc: "Custom Domain adalah fitur Pro yang membantu brand Anda terlihat lebih profesional, terpercaya di mata pelanggan, dan lebih mudah ditemukan di Google (SEO).",
        upsellBranding: "Branding Profesional",
        upsellBrandingDesc: "Gunakan domain milik Anda (cth. tokomu.com) tanpa embel-embel .webjoz.com.",
        upsellSeo: "SEO Lebih Baik",
        upsellSeoDesc: "Google memprioritaskan domain utama untuk mendapatkan posisi teratas di hasil pencarian.",
        upsellSsl: "SSL/HTTPS Otomatis",
        upsellSslDesc: "Keamanan data terjamin dengan enkripsi SSL gratis yang dipasang langsung ke domain Anda.",
        limitTitle: "Batas Custom Domain Tercapai",
        limitDesc: "Paket {plan} Anda hanya mencakup {max} custom domain (berlaku untuk seluruh akun, bukan per website).",
        limitDesc2: "Untuk menambahkan lebih banyak custom domain, silakan upgrade ke paket yang lebih tinggi.",
      },
      settings: {
        tabProfile: "Profil",
        tabSecurity: "Keamanan",
        tabDevices: "Perangkat Aktif",
        tabUsers: "Pengguna",
        tabPermissions: "Izin Role",
        tabLogs: "Audit Logs",
        tabInvestigate: "AI Investigator",
        groupAccount: "Akun",
        groupAdmin: "Admin Sistem",
        profileFailedLoad: "Gagal memuat profil",
        profilePhoneError: "Gunakan format internasional, seperti +628123456789.",
        profileUpdated: "Profil diperbarui.",
        profileFailedUpdate: "Gagal memperbarui profil",
        profileEyebrow: "Profil",
        profileTitle: "Pengaturan Profil",
        email: "Email",
        name: "Nama",
        saveProfile: "Simpan Profil",
        profileEmpty: "Data profil akan muncul di sini setelah autentikasi.",
        pwChanged: "Kata sandi berhasil diubah. Silakan masuk kembali.",
        pwFailed: "Gagal mengubah kata sandi",
        securityEyebrow: "Keamanan",
        changePassword: "Ubah Kata Sandi",
        currentPassword: "Kata Sandi Saat Ini",
        newPassword: "Kata Sandi Baru",
        updatePassword: "Perbarui Kata Sandi",
        devicesFailedLoad: "Gagal memuat perangkat",
        deviceSignedOut: "Perangkat berhasil keluar.",
        deviceSignOutFailed: "Gagal mengeluarkan perangkat",
        trustRemoved: "Perangkat tepercaya dihapus.",
        trustRemovalFailed: "Gagal menghapus perangkat tepercaya",
        othersSignedOut: "Perangkat lain berhasil keluar.",
        othersSignOutFailed: "Gagal mengeluarkan perangkat lain",
        allSignedOut: "Semua perangkat berhasil keluar.",
        allSignOutFailed: "Gagal mengeluarkan semua perangkat",
        browser: "Browser",
        unknownDevice: "Perangkat tidak dikenal",
        unknownUserAgent: "User agent tidak dikenal",
        devicesTitle: "Manajemen Perangkat & Sesi",
        refresh: "Muat Ulang",
        signOutOthers: "Keluar dari perangkat lain",
        signOutAll: "Keluar dari semua perangkat",
        metricActiveSessions: "Sesi aktif",
        metricTrustedDevices: "Perangkat tepercaya",
        metricThisSession: "Sesi ini",
        noSessionsTitle: "Belum ada sesi",
        noSessionsText: "Tidak ada sesi aktif atau perangkat tepercaya yang terkait dengan akun ini.",
        statusCurrent: "sedang masuk",
        statusTrusted: "perangkat tepercaya",
        statusUnknown: "perangkat tidak dikenal",
        sessionId: "Sesi #{id}",
        deviceId: "Perangkat {id}",
        ip: "IP: {ip}",
        lastUsed: "Terakhir digunakan: {date}",
        expires: "Kedaluwarsa: {date}",
        removeTrust: "Hapus kepercayaan",
        revoke: "Cabut",
        usersFailedLoad: "Gagal memuat pengguna",
        userUpdated: "Pengguna diperbarui menjadi {role}",
        userUpdateFailed: "Gagal memperbarui peran pengguna",
        userDeleteConfirm: "Yakin ingin menghapus {name}?",
        userDeleted: "Pengguna {name} berhasil dihapus",
        userDeleteFailed: "Gagal menghapus pengguna",
        usersTitle: "Manajemen Pengguna",
        searchByNameEmail: "Cari berdasarkan nama atau email",
        roleFilter: "Filter peran (user/sales/admin)",
        usersVisibleTitle: "Pengguna yang terlihat admin",
        noUsersMatch: "Tidak ada pengguna yang cocok dengan pencarian.",
        roleUser: "Pengguna",
        roleSales: "Sales",
        roleAdmin: "Admin",
        roleSuperadmin: "Superadmin",
        delete: "Hapus",
        permsFailedLoad: "Gagal memuat data awal",
        permsRoleFailedLoad: "Gagal memuat izin peran",
        permsSaved: "Izin berhasil diperbarui",
        permsSaveFailed: "Gagal memperbarui izin",
        rbacEyebrow: "Manajemen RBAC",
        manageRolePermissions: "Kelola Izin Peran",
        saving: "Menyimpan...",
        saveChanges: "Simpan Perubahan",
        totalPermissions: "Total {count}",
        availablePermissions: "Izin Tersedia",
        activePermissions: "Aktif {count}",
        resourceSuffix: "Sumber Daya {resource}",
        logsRefreshed: "Umpan audit dimuat ulang.",
        logsFailedLoad: "Gagal memuat log",
        logsTitle: "Umpan Log Audit Real-time",
        autoRefreshOn: "Muat Ulang Otomatis Aktif",
        autoRefreshOff: "Muat Ulang Otomatis Nonaktif",
        refreshNow: "Muat Ulang Sekarang",
        logFilterLabel: "IP / Cari",
        dateFrom: "Dari Tanggal",
        dateTo: "Sampai Tanggal",
        eventTable: "Tabel Peristiwa",
        noLogsMatch: "Tidak ada log audit yang cocok dengan filter saat ini.",
        logActionOn: "{action} pada {resource}",
        noDescription: "Tidak ada deskripsi",
        ipAddress: "Alamat IP",
        actorUserId: "ID Pengguna Aktor",
        userAgent: "User Agent",
        investLoadHistoryFailed: "Gagal memuat riwayat",
        investCompleted: "Investigasi AI selesai.",
        investFailed: "Gagal menginvestigasi log",
        investDetailFailed: "Gagal memuat detail",
        investLoading: [
          "Mengelompokkan peristiwa audit yang cocok...",
          "Menyusun linimasa insiden...",
          "Memeriksa silang sinyal mencurigakan...",
          "Menyusun rekomendasi untuk operator...",
        ],
        investEyebrow: "Didukung AI",
        investTitle: "Investigasi dengan AI",
        analyzing: "Menganalisis...",
        runInvestigation: "Jalankan Investigasi",
        streamingAnalysis: "Analisis streaming",
        latestResult: "Hasil terbaru",
        investOutputTitle: "Output Investigasi AI",
        aiProcessing: "Pemrosesan AI",
        riskLevel: "Tingkat Risiko",
        riskWeightNote: "Ditimbang berdasarkan sinyal, urgensi, volume log, dan status insiden",
        score: "Skor {score}",
        timeline: "Linimasa",
        suspiciousSignals: "Sinyal Mencurigakan",
        recommendations: "Rekomendasi",
        noItems: "Tidak ada item yang dikembalikan.",
        readyTitle: "Siap dianalisis",
        readyDesc: "Jalankan investigasi untuk menghasilkan ringkasan, linimasa, sinyal mencurigakan, dan rekomendasi.",
        savedCount: "{count} tersimpan",
        savedTitle: "Investigasi Tersimpan",
        noSavedTitle: "Tidak ada investigasi tersimpan",
        noSavedDesc: "Investigasi yang selesai akan muncul di sini untuk ditinjau ulang.",
        investigationId: "Investigasi #{id}",
        previous: "Sebelumnya",
        pageOf: "Halaman {page} dari {total}",
        next: "Berikutnya",
        investigationDetails: "Detail Investigasi",
        closeDetails: "Tutup detail investigasi",
        status: "Status",
        riskNoteHigh: "Segera eskalasi. Banyak sinyal kuat mengarah ke risiko tinggi.",
        riskNoteMedium: "Perlu ditinjau. Pola mencurigakan perlu ditindaklanjuti operator.",
        riskNoteLow: "Pantau saja. Insiden dengan keyakinan rendah.",
        noResultYet: "Belum ada hasil investigasi yang dimuat.",
      },
      upgrade: {
        snapLoadError: "Gagal memuat Midtrans Snap",
        loadPlansFailed: "Gagal memuat paket",
        pleaseLogin: "Silakan login terlebih dahulu",
        freeActive: "Paket Free sudah aktif",
        tokenFailed: "Gagal mendapatkan token pembayaran",
        waitingPayment: "Menunggu pembayaran... Silakan selesaikan di halaman Midtrans.",
        paymentFailed: "Pembayaran gagal, silakan coba lagi",
        paymentCancelled: "Pembayaran dibatalkan",
        redirecting: "Mengarahkan ke halaman pembayaran...",
        processFailed: "Gagal memproses pembayaran",
        loadingPlans: "Memuat paket...",
        backToDashboard: "Kembali ke dashboard",
        title: "Upgrade Paket",
        subtitle: "Pilih paket langganan yang sesuai dengan skala bisnis Anda.",
        paymentSuccess: "Pembayaran Berhasil!",
        upgradingDesc: "Paket Anda sedang di-upgrade. Mengalihkan ke dashboard...",
        freePrice: "Gratis",
        currentPlan: "Paket Saat Ini",
        unavailable: "Tidak Tersedia",
        websitesCount: "{n} Website",
        aiGeneratePerMonth: "{n} AI Generate / bln",
        sectionRegenPerMonth: "{n} Section Regen / bln",
        designRegenPerMonth: "{n} Design Regen / bln",
        noCustomDomain: "Tidak ada custom domain",
        basicSeo: "SEO dasar",
        popular: "Terpopuler",
        perYear: "/thn",
        promoYearly: "Promo Tahunan",
        equivalentPerMonth: "Setara Rp {value} /bln",
        savingsPerYear: "🎉 Hemat Rp {value} / tahun",
        perMonth: "/bln",
        promoMonths: "Diskon {n} bulan",
        choosePlan: "Pilih {name} ({cycle})",
        yearly: "Tahunan",
        monthly: "Bulanan",
        customDomainCount: "{n} Custom Domain",
        seoOptimized: "SEO optimasi",
      },
      adminPlans: {
        noAccess: "Anda tidak memiliki akses ke halaman ini.",
        title: "Manajemen Paket",
        subtitle: "Tentukan dan kelola paket langganan untuk tenant.",
        newPlan: "Paket Baru",
        allPlans: "Semua Paket",
        noPlansYet: "Belum ada paket yang ditentukan",
        createFirstPlan: "Buat paket pertama",
        perMonth: "/bln",
        perYear: "/thn",
        active: "Aktif",
        inactive: "Nonaktif",
        sitesCount: "{count} situs",
        aiCount: "{count} AI",
        membersCount: "{count} anggota",
        tablePlan: "Paket",
        tablePrice: "Harga",
        tableSites: "Situs",
        tableAiGen: "AI Gen",
        tableMembers: "Anggota",
        tableDomains: "Domain",
        tableStatus: "Status",
        promoMonthly: "Promo: {price}/bln ({months} bulan)",
        promoMonthsShort: "bln",
        promoYearly: "Promo Tahunan: {price}/thn",
        promoTag: "— {label}",
        editPlan: "Edit Paket",
        createPlan: "Buat Paket",
        name: "Nama",
        slug: "Slug",
        description: "Deskripsi",
        featuresLabel: "Fitur (JSON atau daftar teks)",
        featuresPlaceholder: "5 website, 100 AI generate/bulan",
        priceMonthly: "Harga (Bulanan)",
        priceYearly: "Harga (Tahunan)",
        promoPricing: "Harga Promo",
        promoPriceMonthly: "Harga Promo (Bulanan)",
        promoPriceYearly: "Harga Promo (Tahunan)",
        noPromo: "0 = tanpa promo",
        durationMonths: "Durasi (bulan, untuk promo bulanan)",
        promoLabel: "Label Promo",
        promoLabelPlaceholder: "mis. Harga Perkenalan, Diskon Launching",
        maxSites: "Maks. Situs",
        aiGenerates: "AI Generate",
        sectionRegens: "Section Regen",
        designRegens: "Design Regen",
        maxMembers: "Maks. Anggota",
        customDomains: "Custom Domain",
        planActive: "Paket aktif dan tersedia",
        cancel: "Batal",
        saving: "Menyimpan...",
        updatePlan: "Perbarui Paket",
        createPlanBtn: "Buat Paket",
        deleteConfirm: "Yakin ingin menghapus paket ini?",
        planDeleted: "Paket dihapus",
        planUpdated: "Paket diperbarui",
        planCreated: "Paket dibuat",
        loadFailed: "Gagal memuat paket",
        saveFailed: "Gagal menyimpan paket",
        deleteFailed: "Gagal menghapus paket",
        required: "wajib diisi",
      },
      adminHealth: {
        noAccess: "Anda tidak memiliki akses ke halaman ini.",
        title: "Kesehatan Sistem",
        subtitle: "Pantau status layanan dan kesehatan platform.",
        refresh: "Muat Ulang",
        loadFailed: "Gagal mengambil data health",
        loadFailedTitle: "Gagal memuat data",
        retry: "Coba Lagi",
        serviceDatabase: "Database",
        dbPostgres: "Koneksi PostgreSQL",
        serviceCache: "Cache",
        redisConnection: "Koneksi Redis",
        serviceAi: "AI Provider",
        geminiStatus: "Status API Gemini",
        serviceVersion: "Versi API",
        apiVersionDesc: "Versi aplikasi",
        statusHealthy: "Sehat",
        statusUnhealthy: "Tidak Sehat",
        statusUnknown: "Tidak Diketahui",
        lastCheckedAt: "Terakhir diperiksa pukul",
        neverChecked: "Belum pernah diperiksa",
        allSystemsUp: "Semua sistem aktif",
        someIssues: "Beberapa sistem bermasalah",
      },
      adminMetrics: {
        noAccess: "Anda tidak memiliki akses ke halaman ini.",
        title: "Metrik AI Generation",
        subtitle: "Latensi, konkurensi, dan metrik kualitas untuk pembuatan konten AI.",
        refresh: "Muat Ulang",
        loadFailed: "Gagal memuat metrik",
        loadFailedTitle: "Gagal memuat data",
        retry: "Coba Lagi",
        avgDuration: "Durasi Rata-Rata",
        avgDurationDesc: "Rata-rata waktu pembuatan",
        p95: "P95 (bucket terakhir)",
        p95Desc: "Persentil latensi ke-95",
        errorRate: "Tingkat Error",
        errorsOfRequests: "{errors} error / {requests} request",
        activeRequests: "Request Aktif",
        activeRequestsDesc: "Generasi AI bersamaan",
        trendTitle: "Tren (24 jam)",
        trendDesc: "Durasi rata-rata dan tingkat error per jam",
        noTrendData: "Belum ada data tren.",
        recentRequests: "Request Terbaru (10 terakhir)",
        recentRequestsDesc: "Percobaan pembuatan terbaru",
        noRequestsLogged: "Belum ada request yang tercatat.",
      },
      adminTemplates: {
        seedLoadFailed: "Gagal mengambil data design token seeds",
        backfillConfirm: "Backfill scores untuk semua template_library rows yang score=0?",
        backfillDone: "Backfill selesai — scores sudah diperbarui",
        backfillFailed: "Gagal backfill",
        seedDeleteConfirm: "Apakah Anda yakin ingin menghapus design token seed ini secara permanen?",
        seedDeleted: "Design token seed berhasil dihapus",
        seedDeleteFailed: "Gagal menghapus seed",
        accessDenied: "Akses Ditolak",
        superadminOnly: "Halaman ini hanya dapat diakses oleh akun dengan peran",
        superadmin: "Superadmin",
        title: "Template Gallery",
        subtitle: "Review template bawaan sistem dan design token seeds hasil inkubasi generator AI.",
        backfillScores: "Backfill Scores",
        refreshSeeds: "Refresh Seeds",
        tabComponents: "Komponen Template",
        tabSeeds: "Design Token Seeds",
        searchComponentsPlaceholder: "Cari nama, ID, atau deskripsi template...",
        searchSeedsPlaceholder: "Cari tipe bisnis, mood, atau ID seed...",
        allCategories: "Semua Kategori",
        allBusinessTypes: "Semua Tipe Bisnis",
        allMoods: "Semua Mood",
        noTemplateMatch: "Tidak ada template yang cocok dengan pencarian Anda.",
        resetFilter: "Reset Filter",
        score: "Score",
        defaultSeed: "Default Seed",
        heading: "Heading",
        normal: "Normal",
        bodyFont: "Body Font",
        body: "Body",
        designQuality: "Kualitas Desain",
        previewFullscreen: "Pratinjau Fullscreen",
        loginRequired: "Sesi login diperlukan untuk melihat design token seeds.",
        loginSession: "Login Sesi",
        loadingSeeds: "Memuat design token seeds dari API...",
        superadminOnlyManage: "Hanya Superadmin yang Bisa Mengelola Design Token Seeds.",
        insufficientAccess: "Peran akun Anda saat ini tidak memiliki hak akses administratif yang cukup.",
        noSeedsInDb: "Tidak ada design token seeds di database.",
        noSeedsMatch: "Tidak ada seeds yang cocok dengan kata kunci.",
        resetSearch: "Reset Pencarian",
        entriesCount: "{shown} dari {total} entries di template_library",
        noPalette: "No Palette",
        base: "Base",
        view: "Lihat",
        delete: "Hapus",
        sortNewest: "Terbaru",
        sortOldest: "Terlama",
        sortScoreAsc: "Skor Terendah",
        sortScoreDesc: "Skor Tertinggi",
        scoreBelowPlaceholder: "Skor di bawah...",
        scoreFilterAll: "Semua",
        scoreFilterExcellent: "≥80",
        scoreFilterGood: "60–79",
        scoreFilterWeak: "<60",
        selectAllFiltered: "Pilih Semua ({count})",
        clearSelection: "Batal Pilih",
        selectedCount: "{count} dipilih",
        deleteSelected: "Hapus Terpilih",
        bulkDeleteConfirm: "Hapus permanen {count} design token seed yang dipilih?",
        bulkDeleted: "{count} seed berhasil dihapus",
        bulkDeletePartialFail: "{ok} berhasil dihapus, {fail} gagal — coba lagi untuk sisanya",
        critique: "Kritik AI",
        critiqueRunning: "Menganalisis...",
        critiqueDone: "Kritik AI selesai — skor estetika diperbarui",
        critiqueFailed: "Gagal menjalankan kritik AI",
        aestheticScore: "Estetika",
        needsReview: "Perlu Review",
        critiqueTitle: "Kritik AI",
        critiqueStrengths: "Kelebihan",
        critiqueImprovements: "Perbaikan",
        critiqueScreenshot: "screenshot",
        critiqueViewDetails: "Lihat detail",
        critiqueDetailsTitle: "Detail Kritik AI",
        critiqueDimensions: "Skor Dimensi",
        critiqueScreenshotTitle: "Screenshot",
        critiqueOpenScreenshot: "Buka di tab baru",
        critiqueClose: "Tutup",
        critiqueNoScreenshot: "Tidak ada screenshot",
        critiqueVerdict: "Penilaian",
      },
      adminAnnouncements: {
        noAccess: "Anda tidak memiliki akses ke halaman ini.",
        title: "Pengumuman",
        subtitle: "Siarkan pesan ke semua tenant.",
        new: "Pengumuman Baru",
        all: "Semua Pengumuman",
        noItems: "Belum ada pengumuman",
        createFirst: "Buat pengumuman pertama",
        active: "Aktif",
        inactive: "Nonaktif",
        expires: "Berakhir",
        loadFailed: "Gagal memuat pengumuman",
        created: "Pengumuman dibuat",
        createFailed: "Gagal membuat pengumuman",
        deleteConfirm: "Hapus pengumuman ini?",
        deleted: "Pengumuman dihapus",
        deleteFailed: "Gagal menghapus pengumuman",
        titleField: "Judul",
        severity: "Tingkat Kepentingan",
        sevInfo: "Info",
        sevWarning: "Peringatan",
        sevImportant: "Penting",
        contentField: "Konten",
        cancel: "Batal",
        creating: "Membuat...",
        create: "Buat",
      },
      adminCommissions: {
        loadFailed: "Gagal memuat semua komisi",
        tier1RangeError: "Persentase Tier 1 harus antara 0 dan 100",
        tier2RangeError: "Persentase Tier 2 harus antara 0 dan 100",
        configUpdated: "Komisi berhasil diperbarui: Tier 1 {t1}% · Tier 2 {t2}%",
        configUpdateFailed: "Gagal memperbarui komisi",
        amountPositiveError: "Nominal bonus harus berupa angka positif",
        ruleUpdated: "Aturan bonus berhasil diperbarui",
        ruleUpdateFailed: "Gagal memperbarui aturan bonus",
        loading: "Memuat data komisi admin...",
        accessRestricted: "Akses Dibatasi",
        accessRestrictedDesc: "Halaman ini khusus untuk Admin yang memiliki akses permission `commission:read_all`.",
        title: "Manajemen Komisi & Bonus Sales (Admin)",
        subtitle: "Pengaturan persentase komisi, skema bonus onboarding & milestone, dan seluruh transaksi sales partner.",
        rateSettings: "Pengaturan Rate Komisi Sales",
        activeScheme: "Skema Aktif",
        tieredScheme: "Skema Komisi Bertingkat",
        tier1FirstMonths: "tier 1 selama {months} bulan pertama",
        tier2After: "tier 2 setelahnya (berlaku seterusnya)",
        tier1Label: "Tier 1 — {months} bulan pertama (%)",
        tier2Label: "Tier 2 — setelahnya (%)",
        save: "Simpan",
        superadminOnlyEdit: "Hanya {superadmin} yang dapat mengedit skema komisi.",
        superadmin: "Superadmin",
        bonusRulesSettings: "Pengaturan Aturan Bonus (Onboarding & Milestone)",
        tier: "Tier",
        onboardingDesc: "Bonus flat per tenant baru pertama kali bayar.",
        milestoneDesc: "Capai {threshold} tenant baru teraktivasi dalam 1 bulan.",
        bonusAmount: "Nominal Bonus (Rp)",
        recurringCommissions: "Komisi Recurring ({count})",
        allBonuses: "Semua Bonus Sales ({count})",
        allCommissionTxns: "Semua Transaksi Komisi ({count})",
        pendingOnPage: "Pending di Halaman Ini: Rp {amount}",
        noCommissions: "Belum ada komisi tercatat di sistem",
        colDate: "Tanggal",
        colSalesUser: "Sales User ID",
        colTenantId: "Tenant ID",
        colOrderId: "Order ID",
        colGrossAmount: "Gross Amount",
        colRate: "Rate",
        colCommission: "Komisi",
        colStatus: "Status",
        pageOf: "Halaman {page} dari {total}",
        previous: "Sebelumnya",
        next: "Selanjutnya",
        allBonusesTitle: "Semua Bonus Sales ({count})",
        noBonuses: "Belum ada bonus tercatat di sistem",
        colBonusType: "Jenis Bonus",
        colDetailPeriod: "Detail / Periode",
        colBonusAmount: "Nominal Bonus",
        bonus: "Bonus",
        tenant: "Tenant",
        period: "Periode",
        markPaid: "Tandai Dibayar ({count})",
        bonusPayoutSuccess: "{count} bonus berhasil ditandai sebagai dibayar",
        bonusPayoutFailed: "Gagal menandai bonus sebagai dibayar",
        filterAll: "Semua Status",
        filterPending: "Pending",
        filterPaid: "Dibayar",
        filterVoided: "Dibatalkan",
        selectAllPending: "Pilih semua pending di halaman ini",
      },
      adminDesignAssets: {
        accessDenied: "Akses Ditolak",
        accessDeniedDesc: "Halaman ini hanya dapat diakses oleh akun dengan peran {superadmin}.",
        superadmin: "Superadmin",
        loading: "Memuat konfigurasi design assets...",
        title: "Design Assets",
        subtitle: "Kelola section, tipografi, palet warna, dan paket tampilan yang tersedia di editor website.",
        saving: "Menyimpan...",
        resetAll: "Reset Semua",
        resetAllConfirm: "Reset semua pengaturan Design Assets ke default?",
        resetAllSuccess: "Semua pengaturan Design Assets direset ke default.",
        resetAllFailed: "Gagal reset ke server.",
        saveLocalOnly: "Gagal menyimpan ke server. Perubahan tersimpan lokal.",
        tabSections: "Sections",
        tabTypography: "Tipografi",
        tabPalettes: "Palet Warna",
        tabPresets: "Paket Tampilan",
        hidden: "Disembunyikan",
        active: "Aktif",
        optional: "Opsional",
        required: "Wajib",
        show: "Tampilkan",
        hide: "Sembunyikan",
        require: "Wajibkan",
        unrequire: "Lepas Wajib",
        custom: "Custom",
        sectionsVisibilityTitle: "Visibilitas Section",
        sectionsVisibilityDesc: "Section yang disembunyikan tidak muncul di sidebar editor.",
        resetDefault: "Reset Default",
        variantsActive: "{active}/{total} variasi aktif",
        variantsTitle: "Variasi Tampilan",
        variantsDesc: "Kelola variasi tampilan per section. Variasi yang disembunyikan tidak muncul di dropdown editor.",
        variantsCount: "{active}/{total} aktif",
        mapTilesTitle: "Gaya Peta",
        mapTilesDesc: "Kelola pilihan gaya peta yang muncul di editor section Kontak.",
        tileLabelLight: "Terang",
        tileLabelDark: "Gelap",
        tileLabelSatellite: "Satelit",
        tileDescOsm: "OpenStreetMap standar, detail dan gratis.",
        tileDescCyclosm: "OSM dengan jalur sepeda, warna lebih cerah.",
        tileDescLight: "Peta minimalis terang dari CartoCDN.",
        tileDescDark: "Peta gelap elegan dari CartoCDN.",
        tileDescEsri: "Peta jalan bergaya Esri / ArcGIS.",
        tileDescSatellite: "Citra satelit dari Esri World Imagery.",
        addPairingTitle: "Tambah Pasangan Font Baru",
        addPatternTitle: "Tambah Palet Warna Baru",
        addPresetTitle: "Tambah Paket Tampilan Baru",
        name: "Nama",
        description: "Deskripsi",
        headingFont: "Font Heading",
        bodyFont: "Font Body",
        weight: "Ketebalan",
        heroSize: "Ukuran Hero",
        emojiIcon: "Ikon Emoji",
        fontPairing: "Pasangan Font",
        colorPalette: "Palet Warna",
        mode: "Mode",
        light: "Terang",
        dark: "Gelap",
        cancel: "Batal",
        save: "Simpan",
        searchPairings: "Cari pasangan font...",
        searchPatterns: "Cari palet warna...",
        searchPresets: "Cari paket tampilan...",
        add: "Tambah",
        noPairingsMatch: "Tidak ada pasangan font yang cocok.",
        noPatternsMatch: "Tidak ada palet yang cocok.",
        noPresetsMatch: "Tidak ada paket yang cocok.",
        score: "Score: {score}",
        sectionRequiredError: 'Section "{key}" wajib aktif dan tidak bisa disembunyikan.',
        sectionHidden: 'Section "{key}" disembunyikan.',
        sectionShown: 'Section "{key}" ditampilkan.',
        sectionRequired: 'Section "{key}" dijadikan wajib.',
        sectionOptional: 'Section "{key}" bisa disembunyikan.',
        variantHidden: 'Variasi "{variant}" pada "{section}" disembunyikan.',
        variantShown: 'Variasi "{variant}" pada "{section}" ditampilkan.',
        sectionsReset: "Pengaturan sections direset.",
        tileHidden: 'Gaya peta "{tile}" disembunyikan.',
        tileShown: 'Gaya peta "{tile}" ditampilkan.',
        pairingHidden: "Pasangan font disembunyikan.",
        pairingShown: "Pasangan font ditampilkan.",
        pairingAdded: 'Pasangan font "{name}" ditambahkan.',
        deletePairingConfirm: "Hapus pasangan font custom ini?",
        pairingDeleted: "Pasangan font dihapus.",
        patternHidden: "Palet disembunyikan.",
        patternShown: "Palet ditampilkan.",
        patternAdded: 'Palet "{name}" ditambahkan.',
        deletePatternConfirm: "Hapus palet custom ini?",
        patternDeleted: "Palet dihapus.",
        presetHidden: "Paket tampilan disembunyikan.",
        presetShown: "Paket tampilan ditampilkan.",
        presetAdded: 'Paket "{name}" ditambahkan.',
        deletePresetConfirm: "Hapus paket tampilan custom ini?",
        presetDeleted: "Paket tampilan dihapus.",
      },
      notifications: {
        title: "Notifikasi",
        loading: "Memuat notifikasi...",
        loadFailed: "Gagal memuat notifikasi",
        markReadFailed: "Gagal menandai notifikasi",
        allRead: "Semua notifikasi telah dibaca",
        markAllFailed: "Gagal menandai semua notifikasi",
        markAllRead: "Tandai Semua Dibaca",
        markReadTooltip: "Tandai dibaca",
        viewTooltip: "Lihat detail",
        unreadCount: "{count} notifikasi belum dibaca",
        noNew: "Tidak ada notifikasi baru",
        emptyTitle: "Tidak Ada Notifikasi",
        emptyDesc: "Belum ada notifikasi. Anda akan mendapat pemberitahuan saat ada pengumuman baru atau lead masuk ke website Anda.",
        justNow: "Baru saja",
        minutesAgo: "{n}m yang lalu",
        hoursAgo: "{n}j yang lalu",
        daysAgo: "{n}h yang lalu",
        typeAnnouncement: "Pengumuman",
        typeLead: "Lead",
        typeSystem: "Sistem",
      },
      investigate: {
        loadingClustering: "Mengelompokkan event audit yang cocok...",
        loadingTimeline: "Membangun linimasa insiden...",
        loadingSignals: "Memeriksa silang sinyal mencurigakan...",
        loadingRecommendations: "Menyusun rekomendasi untuk operator...",
        loadHistoryFailed: "Gagal memuat riwayat investigasi",
        completed: "Investigasi AI selesai.",
        runFailed: "Gagal menginvestigasi log",
        loadDetailFailed: "Gagal memuat detail investigasi",
        noResultNote: "Belum ada hasil investigasi.",
        noteHigh: "Segera eskalasi. Banyak sinyal kuat menunjuk ke risiko akun atau akses yang meningkat.",
        noteMedium: "Perlu ditinjau. Terdapat cukup pola mencurigakan yang perlu tindak lanjut operator.",
        noteLow: "Pantau saja. Bukti yang ada menunjukkan insiden dengan tingkat keyakinan rendah.",
        eyebrowAi: "Didukung AI",
        title: "Investigasi dengan AI",
        analyzing: "Menganalisis...",
        runInvestigation: "Jalankan Investigasi",
        fieldResource: "Resource",
        fieldStatus: "Status",
        fieldAction: "Aksi",
        fieldSearch: "Cari",
        fieldDateFrom: "Tanggal Dari",
        fieldDateTo: "Tanggal Sampai",
        streamingAnalysis: "Analisis streaming",
        latestResult: "Hasil terbaru",
        outputTitle: "Hasil Investigasi AI",
        aiProcessing: "Pemrosesan AI",
        riskLevel: "Tingkat Risiko",
        riskWeightedDesc: "Dibobot berdasarkan sinyal, urgensi, volume log, dan status insiden",
        score: "Skor {score}",
        listTimeline: "Linimasa",
        listSignals: "Sinyal Mencurigakan",
        listRecommendations: "Rekomendasi",
        emptyTitle: "Siap untuk dianalisis",
        emptyDesc: "Jalankan investigasi untuk membuat ringkasan, linimasa, sinyal mencurigakan, dan rekomendasi.",
        savedCount: "{count} tersimpan",
        savedTitle: "Investigasi Tersimpan",
        refresh: "Muat Ulang",
        noSavedTitle: "Tidak Ada Investigasi Tersimpan",
        noSavedDesc: "Investigasi yang selesai akan muncul di sini untuk peninjauan cepat.",
        investigationChip: "Investigasi #{id}",
        previous: "Sebelumnya",
        pageOf: "Halaman {page} dari {total}",
        next: "Berikutnya",
        detailsEyebrow: "Detail Investigasi",
        closeLabel: "Tutup detail investigasi",
        statusLabel: "Status",
        noItems: "Tidak ada item yang ditampilkan.",
        errorEyebrow: "Kesalahan Sistem",
        errorTitle: "Gagal Memuat Dashboard",
        errorHeading: "Terjadi kesalahan!",
        errorDesc: "Kami menemui kesalahan tak terduga saat mencoba memuat modul investigasi. Ini bisa disebabkan masalah jaringan atau kegagalan server sementara.",
        tryAgain: "Coba Lagi",
      },
      sales: {
        loadFailed: "Gagal memuat kode referral",
        codeCopied: "Kode referral berhasil disalin",
        linkCopied: "Link referral berhasil disalin",
        regenerated: "Kode referral baru berhasil dibuat!",
        regenerateFailed: "Gagal membuat ulang kode referral",
        loading: "Memuat data referral...",
        accessDeniedTitle: "Akses Dibatasi",
        accessDeniedDesc: "Halaman ini khusus untuk Sales Partner & Admin Webjoz. Silakan hubungi admin jika Anda tim sales.",
        pageTitle: "Kode Referral Partner",
        pageDesc: "Bagikan kode atau link referral Anda kepada klien untuk mendapatkan komisi dari setiap transaksi berbayar.",
        viewCommissions: "Lihat Komisi Saya",
        codeCardTitle: "Kode Referral Anda",
        codeCardDesc: "Gunakan kode ini saat pendaftaran website/tenant baru.",
        copied: "Tersalin",
        copyCode: "Salin Kode",
        updatePrompt: "Ingin memperbarui kode?",
        regenerateCode: "Buat Ulang Kode",
        linkCardTitle: "Link Referral Pendaftaran",
        linkCardDesc: "Klien yang mendaftar melalui link ini akan otomatis terhubung ke akun Anda.",
        copyLink: "Salin Link",
        tipsLabel: "Tips:",
        tipsText: "Cantumkan link ini di proposal, pesan WhatsApp, atau bio media sosial Anda.",
        programTitle: "Ketentuan Komisi Sales Partner",
        commRatePrefix: "Komisi sebesar",
        commRateSuffix: "dari nilai transaksi berbayar yang diselesaikan oleh tenant referensi Anda.",
        commRecurringPrefix: "Komisi berlaku",
        commRecurringSuffix: "untuk setiap perpanjangan langganan bulanan maupun tahunan.",
        commEditorPrefix: "Setiap tenant yang mendaftar dengan kode Anda otomatis menambahkan Anda sebagai anggota role",
        commEditorSuffix: "di workspace tenant tersebut.",
        dialogTitle: "Buat Ulang Kode Referral",
        confirmPrefix: "Apakah Anda yakin ingin membuat kode referral baru? Kode lama",
        confirmSuffix: "tidak akan berlaku lagi untuk pendaftaran baru.",
        cancel: "Batal",
        processing: "Memproses...",
        confirmRegenerate: "Ya, Buat Kode Baru",
      },
      salesOverview: {
        loadFailed: "Gagal memuat data sales",
        loading: "Memuat ringkasan...",
        accessDeniedTitle: "Akses Dibatasi",
        accessDeniedDesc: "Halaman ini khusus untuk Sales Partner & Admin. Hubungi admin untuk mengaktifkan akses.",
        pageTitle: "Sales Overview",
        pageDesc: "Ringkasan pendapatan Anda — komisi Tier 1 {t1}% ({months} bln pertama) → Tier 2 {t2}%, plus bonus onboarding & milestone.",
        cardTotal: "Total Pendapatan",
        cardTotalDesc: "Komisi + Bonus terakumulasi",
        cardCommission: "Komisi Recurring",
        cardCommissionDesc: "Tier 1 {t1}% / Tier 2 {t2}%",
        cardBonus: "Total Bonus",
        cardBonusDesc: "{onboarding} Onboarding · {milestone} Milestone",
        cardPending: "Pending Payout",
        cardPendingDesc: "Menunggu proses pencairan",
        refCardTitle: "Kode Referral Anda",
        refLinkLabel: "Link Referral",
        copyCode: "Salin Kode",
        copyLink: "Salin Link",
        copied: "Tersalin!",
        manageRef: "Kelola kode referral",
        schemeTitle: "Skema Komisi Berlaku",
        tier1Desc: "{months} bulan pertama setelah signup",
        tier2Desc: "Setelah {months} bulan berjalan",
        bonusSchemeTitle: "Bonus Tambahan",
        bonusOnboarding: "Bonus Onboarding per tenant",
        bonusMilestone: "Bonus Milestone bulanan",
        quickLinksTitle: "Akses Cepat",
        linkCommissionsTitle: "Riwayat Komisi & Bonus",
        linkCommissionsDesc: "Lihat semua transaksi komisi dan bonus yang tercatat beserta statusnya.",
        linkReferralTitle: "Kelola Kode Referral",
        linkReferralDesc: "Salin, bagikan, atau regenerasi kode referral Anda.",
        codeCopied: "Kode disalin!",
        linkCopied: "Link disalin!",
      },
      salesCommissions: {
        loadFailed: "Gagal memuat data komisi",
        loading: "Memuat data pendapatan...",
        accessDeniedTitle: "Akses Dibatasi",
        accessDeniedDesc: "Anda belum memiliki akses ke halaman komisi & bonus. Hubungi admin untuk mengaktifkan akses sales.",
        pageTitle: "Pendapatan Saya",
        pageDesc: "Komisi bertingkat Tier 1 {t1}% ({months} bulan pertama) → Tier 2 {t2}%, plus bonus onboarding & milestone.",
        cardTotal: "Total Pendapatan",
        cardTotalDesc: "Komisi + Bonus terakumulasi",
        cardCommission: "Komisi Recurring",
        cardCommissionDesc: "Komisi per pembayaran: {t1}% (Tier 1) / {t2}% (Tier 2)",
        cardBonus: "Total Bonus",
        cardBonusDesc: "{onboarding} Onboarding, {milestone} Milestone",
        cardPending: "Pending Payout",
        cardPendingDesc: "Menunggu proses pencairan",
        tabCommissions: "Komisi Recurring ({count})",
        tabBonuses: "Bonus Onboarding & Milestone ({count})",
        noCommissionsTitle: "Belum ada komisi tercatat.",
        noCommissionsDesc: "Bagikan kode referral Anda untuk mulai mendapatkan komisi.",
        thDate: "Tanggal",
        thOrderId: "Order ID",
        thTenantId: "Tenant ID",
        thGross: "Gross Amount",
        thRate: "Rate",
        thCommission: "Komisi",
        thStatus: "Status",
        tierLabel: "Tier {tier}",
        pageOf: "Halaman {page} dari {total}",
        previous: "Sebelumnya",
        next: "Selanjutnya",
        noBonusesTitle: "Belum ada bonus tercatat.",
        noBonusesDesc: "Bonus onboarding (Rp 50.000) dan bonus milestone bulanan akan tercatat otomatis ketika tenant aktif.",
        thBonusType: "Jenis Bonus",
        thDetail: "Detail / Periode",
        thAmount: "Nominal Bonus",
        bonusTypeLabel: "Bonus {type}",
        bonusTenant: "Tenant #{id}",
        bonusPeriod: "Periode {period} (Tier {tier})",
      },
      tenants: {
        loadFailed: "Gagal memuat data tenant",
        accessDenied: "Anda tidak memiliki akses ke halaman ini.",
        title: "Semua Tenant",
        emptyTitle: "Tidak ada tenant",
        thTenant: "Tenant",
        thPlan: "Paket",
        thMembers: "Anggota",
        thSites: "Situs",
        thCreated: "Dibuat",
        manage: "Kelola",
      },
      tenantDetail: {
        loadFailed: "Gagal memuat detail tenant",
        planUpdated: "Paket diperbarui",
        assignFailed: "Gagal menetapkan paket",
        accessDenied: "Anda tidak memiliki akses ke halaman ini.",
        notFoundTitle: "Tenant tidak ditemukan",
        backToTenants: "Kembali ke Tenant",
        tenantInfoTitle: "Info Tenant",
        slugLabel: "Slug",
        ownerIdLabel: "ID Pemilik",
        planAssignmentTitle: "Penetapan Paket",
        currentPlanLabel: "Paket Saat Ini",
        changePlanLabel: "Ganti Paket",
        selectPlan: "Pilih paket...",
        assign: "Tetapkan",
        usageTitle: "Penggunaan AI (bulan ini)",
        usageGenerates: "Generasi",
        usageSectionRegens: "Regen Bagian",
        usageDesignRegens: "Regen Desain",
        usageTokenInput: "Token Masuk",
        usageTokenOutput: "Token Keluar",
        usageEmpty: "Tidak ada data penggunaan bulan ini",
        membersTitle: "Anggota ({count})",
        noMembers: "Tidak ada anggota",
        thName: "Nama",
        thEmail: "Email",
        thRole: "Peran",
        thJoined: "Bergabung",
        viewSites: "Lihat Situs",
        viewDomains: "Lihat Domain",
        viewLeads: "Lihat Lead",
      },
      logs: {
        refreshed: "Feed audit diperbarui.",
        loadFailed: "Gagal memuat log",
        title: "Feed Log Audit Real-time",
        autoRefreshOn: "Auto-refresh Aktif",
        autoRefreshOff: "Auto-refresh Nonaktif",
        refreshNow: "Muat Ulang Sekarang",
        filterAction: "Aksi",
        filterResource: "Resource",
        filterStatus: "Status",
        filterIpSearch: "IP / Cari",
        filterDateFrom: "Tanggal Dari",
        filterDateTo: "Tanggal Sampai",
        eventTable: "Tabel Event",
        emptyDesc: "Tidak ada log audit yang cocok dengan filter saat ini.",
        actionOn: "{action} pada {resource}",
        noDescription: "Tidak ada deskripsi",
        detailIp: "Alamat IP",
        detailActor: "ID User Pelaku",
        detailAgent: "User Agent",
      },
      permissions: {
        loadInitialFailed: "Gagal memuat data awal",
        loadRoleFailed: "Gagal memuat permission role",
        saveSuccess: "Permission berhasil diperbarui",
        saveFailed: "Gagal memperbarui permission",
        eyebrow: "Manajemen RBAC",
        title: "Kelola Permission Role",
        saving: "Menyimpan...",
        save: "Simpan Perubahan",
        totalCount: "{count} Total",
        availablePermissions: "Permission Tersedia",
        activeCount: "{count} Aktif",
        resourceLabel: "Resource {resource}",
      },
      sessions: {
        title: "Manajemen Perangkat & Sesi",
        refresh: "Muat Ulang",
        refreshLabel: "Muat ulang perangkat",
        loadFailed: "Gagal memuat perangkat",
        signedOut: "Perangkat berhasil keluar.",
        signOutFailed: "Gagal membuat perangkat keluar",
        trustRemoved: "Perangkat tepercaya dihapus.",
        trustRemoveFailed: "Gagal menghapus perangkat tepercaya",
        othersSignedOut: "Perangkat lain berhasil keluar.",
        othersSignOutFailed: "Gagal membuat perangkat lain keluar",
        allSignedOut: "Semua perangkat berhasil keluar.",
        allSignOutFailed: "Gagal membuat semua perangkat keluar",
        signOutOthers: "Keluar dari yang lain",
        signOutAll: "Keluar dari semua",
        metricActive: "Sesi aktif",
        metricTrusted: "Perangkat tepercaya",
        metricCurrent: "Sesi ini",
        emptyTitle: "Belum ada sesi",
        emptyDesc: "Belum ada sesi aktif atau perangkat tepercaya yang terhubung ke akun ini.",
        statusCurrent: "sedang masuk",
        statusTrusted: "perangkat tepercaya",
        statusUnknown: "perangkat tidak dikenal",
        sessionChip: "Sesi #{id}",
        deviceChip: "Perangkat {id}",
        trustChip: "Tepercaya {id}",
        unknownDevice: "Perangkat tidak dikenal",
        unknownAgent: "User agent tidak dikenal",
        ipLabel: "IP: {ip}",
        lastUsed: "Terakhir dipakai: {date}",
        trustedUsed: "Pemakaian tepercaya: {date}",
        expires: "Kedaluwarsa: {date}",
        removeTrust: "Hapus kepercayaan",
        revokeSession: "Cabut sesi",
      },
      users: {
        title: "Manajemen User",
        refresh: "Muat Ulang",
        searchPlaceholder: "Cari berdasarkan nama atau email",
        rolePlaceholder: "Filter role (user/sales/admin)",
        loadFailed: "Gagal memuat user",
        roleUpdated: "Role {name} diperbarui menjadi {role}",
        roleUpdateFailed: "Gagal memperbarui role user",
        deleteConfirm: "Yakin ingin menghapus {name}?",
        deleted: "User {name} berhasil dihapus",
        deleteFailed: "Gagal menghapus user",
        adminVisibleTitle: "User yang terlihat admin",
        emptyDesc: "Tidak ada user yang cocok dengan pencarian.",
        delete: "Hapus",
      },
      upgradeSuccess: {
        confirmTimeout: "Konfirmasi pembayaran sedang diproses...",
        backToDashboard: "Kembali ke Dashboard",
        pendingTitle: "Pembayaran Sedang Diproses",
        pendingDesc: "Kami sedang memverifikasi pembayaran Anda. Halaman ini akan refresh otomatis saat pembayaran dikonfirmasi.",
        successTitle: "Paket Berhasil Diupgrade!",
        successDesc: "Selamat! Akun Anda kini menggunakan paket Pro. Nikmati AI generate tanpa batas, custom domain, dan SEO otomatis.",
        errorTitle: "Pembayaran Gagal",
        errorDesc: "Pembayaran Anda tidak dapat diproses. Silakan coba lagi atau periksa metode pembayaran Anda.",
        txDetails: "Detail Transaksi",
        orderIdLabel: "Order ID",
        totalLabel: "Total",
        methodLabel: "Metode",
        timeLabel: "Waktu",
        goToDashboard: "Ke Dashboard",
        viewOtherPlans: "Lihat Paket Lain",
      },
      sitesNew: {
        connecting: "Menghubungkan...",
        noWorkspaceTitle: "Tidak Ada Workspace Aktif",
        noWorkspaceDesc: "Anda perlu bergabung dengan sebuah workspace terlebih dahulu untuk membuat website baru.",
        backToDashboard: "Kembali ke Dashboard",
      },
      sitesSeo: {
        title: "SEO & Performance",
        webLink: "Web",
        saving: "Menyimpan...",
        saved: "Tersimpan",
        save: "Simpan",
        loadFailed: "Gagal memuat pengaturan SEO",
        saveFailed: "Gagal menyimpan SEO",
        gscSaved: "Tersimpan ke Google Search Console",
        aiFailed: "AI gagal mengoptimasi SEO",
        upgradeTitle: "Optimasi AI — Plan Pro",
        upgradeDesc: "AI SEO optimization tersedia tanpa batas di paket Pro.",
        upgradeNow: "Upgrade Sekarang",
        later: "Nanti",
      },
      sitesIntegrations: {
        title: "Integrasi",
        webLink: "Web",
        loadFailed: "Gagal memuat integrasi",
        saved: "Tersimpan",
        saveFailed: "Gagal menyimpan integrasi",
        save: "Simpan",
        saving: "Menyimpan...",
        ga4Desc: "Hubungkan Google Analytics 4 untuk melacak pengunjung, perilaku, dan konversi di website Anda.",
        metaPixelDesc: "Tambahkan Meta Pixel untuk melacak konversi iklan dan membuat audiens ulangan di Instagram & Facebook.",
      },
      sitesTestimonials: {
        loadFailed: "Gagal memuat testimoni",
        shareTitle: "Bagikan Testimoni",
        copy: "Salin",
        linkCopied: "Link testimoni disalin.",
        pendingTitle: "{count} Testimoni Menunggu Persetujuan",
        approved: "Disetujui",
        approvedDesc: "Testimoni ini sudah disetujui dan tampil di website.",
        approve: "Setujui",
        approveFailed: "Gagal menyetujui testimoni",
        rejected: "Ditolak",
        rejectedDesc: "Testimoni ini tidak disetujui.",
        reject: "Tolak",
        rejectFailed: "Gagal menolak testimoni",
        validationRequired: "Validasi diperlukan",
        added: "Testimoni berhasil ditambahkan.",
        addFailed: "Gagal menambahkan testimoni",
        add: "Tambah Manual",
        manualTitle: "Tambah Testimoni Manual",
        manualDesc: "Masukkan data testimoni secara langsung.",
        labelName: "Nama",
        labelRole: "Peran",
        labelQuote: "Testimoni",
        labelRating: "Rating",
        saving: "Menyimpan...",
        saveToSite: "Simpan ke Situs",
        cancel: "Batal",
        emptyDesc: "Belum ada testimoni. Klik Tambah Manual untuk menambahkan testimonial pertama.",
      },
      sitesKatalog: {
        loadFailed: "Gagal memuat katalog",
        saveFailed: "Gagal menyimpan katalog",
        saving: "Menyimpan...",
        saved: "Tersimpan",
        save: "Simpan",
        webLink: "Web",
        emojiPopular: "Populer",
        emojiFood: "Makanan",
        emojiServices: "Jasa",
        emojiSymbols: "Simbol",
        emojiSymbol: "Simbol Lainnya",
        pickEmojiTitle: "Pilih Emoji",
        close: "Tutup",
        sectionTitleMenu: "Menu",
        sectionTitleCatalog: "Katalog Produk",
        itemLabelMenu: "menu",
        itemLabelCatalog: "produk",
        itemCountLabel: "{count} item",
        noCategoriesTitle: "Belum ada kategori",
        noCategoriesDesc: "Klik + Tambah Kategori untuk memulai, atau tambahkan {itemLabel} langsung.",
        itemNumberLabel: "Item {number}",
        noItemsDesc: "Belum ada {itemLabel} di kategori ini.",
        labelSectionTitle: "Judul Bagian",
        labelEyebrow: "Eyebrow",
        labelSubtitle: "Subjudul",
        labelPhoto: "Foto",
        labelName: "Nama",
        labelPrice: "Harga",
        labelBadge: "Badge",
        badgeHint: "Badge menandai item sebagai unggulan dan menampilkan badge di showcase.",
        labelDescription: "Deskripsi",
        bulletList: "Bullet List",
        numberedList: "Numbered List",
        addItemLabel: "+ Tambah {label} ke {category}",
        addCategory: "+ Tambah Kategori",
        defaultCategory: "Kategori {number}",
        bannerTitle: "Kelola {itemLabel} situs Anda",
        bannerDesc1: "Tambah kategori dan {itemLabel} di sini. Anda bisa melengkapi foto, nama, deskripsi{itemPricePart}, dan badge.",
        bannerDesc2: "Item dengan badge otomatis ditandai sebagai unggulan di tampilan showcase.",
        bannerDesc3: "Pengunjung website dapat menambah {itemLabel} yang Anda mintinkan.",
        bannerPricePart: ", harga",
        addWord: "Tambah",
        aiPromptLabelPrefix: "Buat deskripsi untuk",
        itemFallback: "Item {number}",
        aiModalTitle: "Instruksi AI",
        aiModalDesc: "Apa deskripsi yang ingin Anda buat?",
        aiFailed: "AI gagal membuat deskripsi",
        generate: "Generate",
        processing: "Memproses...",
        cancel: "Batal",
        aiGenerateTitle: "Generate dengan AI",
        aiGenerateDesc: "Gunakan AI untuk menghasilkan deskripsi item secara otomatis.",
        optional: "Opsional",
        upgradeTitle: "Fitur AI — Plan Pro",
        upgradeDesc: "Generate deskripsi dengan AI tersedia tanpa batas di paket Pro.",
        upgradeNow: "Upgrade Sekarang",
        later: "Nanti",
        chipMenu: "Menu",
        chipCatalog: "Katalog",
        chipCategoryCount: "{count} kategori",
      },
      sitesBlog: {
        title: "Blog Postingan",
        webLink: "Web",
        addNew: "Tambah Baru",
        layoutLabel: "Tampilan Blog",
        aiPick: "Direkomendasikan AI untuk gaya situs Anda",
        nonPremiumText: "AI content generation tersedia di paket",
        upgrade: "Upgrade →",
        writePostTitle: "Tulis Postingan Baru",
        savePost: "Simpan Postingan",
        cancel: "Batal",
        aiCardTitle: "Buat Konten Blog dengan AI",
        generate: "Generate",
        generateLabel: "Generate",
        layoutGrid: "Grid",
        layoutGridDesc: "Kartu dalam 3 kolom",
        layoutList: "List",
        layoutListDesc: "Horizontal dengan gambar",
        layoutFeatured: "Unggulan",
        layoutFeaturedDesc: "Hero + grid di bawah",
        layoutMinimal: "Minimal",
        layoutMinimalDesc: "Daftar judul & tanggal",
        loadFailed: "Gagal memuat blog",
        draftCreated: "Draft blog berhasil dibuat",
        generateFailed: "Gagal generate blog",
        postCreated: "Postingan berhasil dibuat",
        createFailed: "Gagal membuat postingan",
        publishFailed: "Gagal menerbitkan",
        published: "Terbit",
        layoutSaved: "Tampilan blog diperbarui",
        layoutFailed: "Gagal menyimpan tampilan",
        publishedDate: "Terbit {date}",
        draftDate: "Draft · {date}",
        publishedBadge: "Terbit",
        draftBadge: "Draft",
        edit: "Edit",
        publish: "Terbitkan",
        emptyDesc1: "Belum ada konten blog. Klik",
        emptyDesc2: "untuk membuat postingan pertama.",
      },
      sitesBlogPost: {
        loadFailed: "Gagal memuat postingan",
        saveFailed: "Gagal menyimpan",
        bold: "Bold",
        italic: "Italic",
        heading2: "Heading 2",
        heading3: "Heading 3",
        bulletList: "Bullet List",
        orderedList: "Ordered List",
        blockquote: "Blockquote",
        link: "Link",
        uploadImage: "Upload Image",
        notFound: "Postingan tidak ditemukan",
        back: "Kembali",
        editor: "Editor",
        preview: "Preview",
        published: "Terbit",
        draft: "Draft",
        unsaved: "Belum tersimpan",
        savedAt: "Tersimpan {time}",
        save: "Simpan",
        excerpt: "Excerpt",
        seoTitle: "SEO Title",
        seoDescription: "SEO Description",
        noindex: "Noindex (Sembunyi dari Google)",
        noindexDesc: "Halaman ini tidak akan muncul di hasil pencarian Google.",
        cover: "Cover Image",
        aiFailed: "AI gagal",
        generating: "Generate...",
        generate: "Generate",
        aiCardTitle: "Buat Konten Blog dengan AI",
        aiPromptLabelPrefix: "Buat deskripsi untuk",
      },
      sitesEditor: {
        authenticating: "Mengautentikasi...",
        loading: "Memuat editor...",
        loadFailed: "Gagal memuat situs",
        loadMore: "Muat Lebih Banyak ({count} tersisa)",
        backToSites: "Kembali ke daftar situs",
        back: "Kembali",
        contentTab: "Konten",
        designTab: "Desain",
        styleLabel: "Gaya Situs",
        layoutLabel: "Tata Letak",
        sectionOrder: "Urutan section",
        sectionSpacing: "Jarak Seksi (Spacing)",
        cornerRadius: "Sudut Border (Radius)",
        cornerSharp: "Tajam (0px)",
        cornerSoft: "Lembut (8px)",
        cornerRounded: "Bulat (20px)",
        heroStyle: "Gaya Hero",
        heroCentered: "Hero: Centered",
        heroSplit: "Hero: Split Screen",
        heroFullBleed: "Hero: Full Bleed",
        heroMinimalist: "Hero: Minimalist",
        spacingCompact: "Rapat (Compact)",
        spacingRelaxed: "Longgar (Relaxed)",
        spacingCompactShort: "Rapat",
        spacingRelaxedShort: "Longgar",
        normal: "Normal",
        colorPalette: "Palet Warna",
        primaryColor: "Warna Utama (Primary)",
        accentColor: "Warna Aksen (Accent)",
        backgroundColor: "Warna Latar (Background)",
        surfaceColor: "Warna Permukaan (Surface)",
        textColor: "Warna Teks (Text)",
        primaryShort: "Primary",
        accentShort: "Accent",
        backgroundShort: "Latar",
        surfaceShort: "Surface",
        textShort: "Teks",
        visualCustomization: "Kustomisasi Visual",
        layoutStyle: "Tata Letak & Gaya",
        aiDesignPrompt: "AI Design Prompt",
        aiInstructionsTitle: "Instruksi AI",
        aiPromptDesc: "Apa yang ingin kamu ubah di bagian {label}?",
        generateAi: "Generate AI",
        regenerateWithAi: "Regenerate dengan AI",
        processing: "Memproses...",
        applyStyle: "Terapkan Gaya",
        cancel: "Batal",
        later: "Nanti",
        upgradeToPro: "Upgrade ke Pro",
        upgradeDefaultTitle: "Fitur AI Only untuk Pro",
        upgradeDefaultBody: "Fitur AI hanya tersedia untuk pengguna Pro.",
        upgradeProDesc: "Dengan Pro, kamu bisa menggunakan AI Generate untuk konten, gambar, SEO, dan desain website.",
        upgradeRegenTitle: "Regenerasi AI — fitur Pro",
        upgradeRegenBody: "Regenerasi ulang konten section dengan AI tersedia tanpa batas di paket Pro.",
        upgradeDesignTitle: "Desain ulang dengan AI — fitur Pro",
        upgradeDesignBody: "Minta AI mengubah gaya, warna, dan layout website Anda secara instan di paket Pro.",
        upgradeSuggestionTitle: "Saran instruksi AI — fitur Pro",
        upgradeSuggestionBody: "Gunakan saran instruksi siap pakai untuk mempercepat proses AI di paket Pro.",
        save: "Simpan",
        saving: "Menyimpan...",
        saved: "Tersimpan",
        saveSuccess: "Perubahan berhasil disimpan!",
        saveFailed: "Gagal menyimpan perubahan",
        autosaveFailed: "Gagal menyimpan",
        notFoundTitle: "Situs Tidak Ditemukan",
        notFoundDesc: "Kami tidak dapat menemukan situs yang Anda cari pada workspace saat ini.",
        preview: "Preview",
        previewDesktop: "Preview desktop",
        previewTablet: "Preview tablet",
        previewMobile: "Preview mobile",
        toggleDarkAria: "Toggle dark mode",
        light: "Light",
        dark: "Dark",
        switchLight: "Ganti ke mode terang",
        switchDark: "Ganti ke mode gelap",
        aiUsage: "AI Usage",
        generate: "Generate",
        sectionRegen: "Section Regen",
        designRegen: "Design Regen",
        qualityScore: "Kualitas: {score}%",
        qualityTitle: "Kelengkapan Konten ({score}%)",
        qualityDesc: "{count} field perlu diisi agar tampilan website kamu maksimal:",
        qualityWarning: "⚠️ {count} field perlu dicek",
        qualityFieldHint: "Field belum diisi atau berisi teks contoh",
        fill: "Isi",
        viewCompleteness: "Lihat kelengkapan konten",
        undo: "Undo",
        undoAllTitle: "Urungkan perubahan terakhir (teks, desain, atau urutan section)",
        undoDesign: "Undo Desain",
        undoDesignTitle: "Urungkan perubahan desain terakhir",
        noDesignChanges: "Belum ada perubahan desain",
        show: "Tampilkan",
        hide: "Sembunyikan",
        showSection: "Tampilkan section",
        hideSection: "Sembunyikan section",
        hidden: "Tersembunyi",
        showPageSections: "Tampilkan Bagian Halaman",
        expandEditArea: "Perluas area edit",
        variantOptions: "Variasi Tampilan",
        selectSectionAria: "Pilih Section",
        openSheet: "Buka sheet",
        closeSheet: "Tutup sheet",
        publish: "Publikasikan",
        publishShort: "Publish",
        publishSuccess: "Website berhasil dipublikasikan! 🚀",
        publishFailed: "Gagal memublikasikan website",
        applying: "Menerapkan...",
        applyLive: "Terapkan ke Live",
        apply: "Terapkan",
        live: "Live",
        draft: "Draft",
        aiProcessing: "AI sedang memproses...",
        aiReviewActive: "Review AI Sedang Aktif",
        aiReviewDesc1: "Silakan gunakan atau kembalikan perubahan AI pada seksi",
        aiReviewDesc2: "di bagian atas halaman preview terlebih dahulu.",
        diffAi: "Diff AI: {label}",
        diffChanges: "{count} perubahan",
        content: "Konten",
        old: "Lama:",
        new: "Baru:",
        use: "Gunakan",
        useThis: "Gunakan ini",
        revert: "Kembalikan",
        aiApplied: "Hasil AI untuk {label} dipakai.",
        aiCancelled: "Hasil AI dibatalkan.",
        aiReverted: "Perubahan AI pada {label} dikembalikan.",
        aiNoChange: "AI belum menghasilkan perubahan nyata.",
        aiNoChangeHint: "Coba instruksi yang lebih spesifik, misalnya: ubah jadi headline emosional, maksimal 8 kata, dan hilangkan teks input mentah.",
        aiSectionDone: "AI selesai menulis {label}. Cek diff sebelum dipakai.",
        aiSectionFailed: "AI gagal meregenerasi bagian ini.",
        aiStyleDone: "AI selesai mendesain ulang gaya situs. Cek hasil visual sebelum disimpan.",
        aiStyleFailed: "AI gagal meregenerasi gaya website.",
        aiStyleNoChange: "AI belum menghasilkan perubahan gaya yang nyata.",
        aiProcessFailed: "AI gagal memproses.",
        siteStyle: "gaya situs",
        aiDesignEngine: "AI Design Engine",
        latestAiGenerated: "Latest AI Generated",
        latest: "Terbaru",
        latestAiDesc: "Gaya visual unik buatan AI terbaru untuk website Anda.",
        aiResult: "Hasil AI",
        aiMoodCreated: "Nuansa {mood}. Dibuat pada {date}.",
        editLabel: "Edit — {label}",
        confirmPublishTitle: "Terapkan Perubahan ke Live?",
        confirmPublishDesc: "Pengunjung situs akan segera melihat versi terbaru.",
        confirmPublishBody: "Semua perubahan draf yang sudah disimpan akan diterapkan ke website live {subdomain}.webjoz.com.",
        confirmApply: "Ya, Terapkan",
        upgradeLabel: "Upgrade ke Pro",
        aiInstructionsPlaceholder: "cth. \"buat lebih persuasif dan emosional\"",
        aiDesignInstructionsPlaceholder: "cth: tema kopi vintage hangat...",
        aiDesignFailed: "Terjadi kesalahan saat membuat ulang desain dengan AI",
        aiHistory: "Riwayat AI",
        aiMadeFor: "Dibuat khusus berdasarkan info bisnis Anda",
        aiRecommendation: "Rekomendasi AI",
        aiTemplateCategory: "Kategori template",
        aiTemplateName: "Nama template",
        appearancePreset: "Paket Tampilan",
        bodyFont: "Font Body",
        colorPattern: "Corak Warna",
        headingFont: "Font Heading",
        headingWeight: "Ketebalan Heading",
        heroTitleSize: "Ukuran Hero Title",
        manualFineTune: "Fine-tune manual",
        orChoosePairing: "— atau pilih pasangan font favorit Anda —",
        orChoosePalette: "— atau pilih palet favorit Anda —",
        orChoosePreset: "— atau pilih paket tampilan favorit Anda —",
        pageSections: "Bagian Halaman",
        sizeLarge: "Besar",
        sizeMax: "Maksimal",
        sizeMedium: "Sedang",
        sizeSmall: "Kecil",
        sizeVeryLarge: "Sangat Besar",
        styleChoiceAria: "Pilih gaya visual",
        typographyStyle: "Gaya Tipografi",
        weightBold: "Bold",
        weightExtraBold: "Extra-Bold",
        weightMedium: "Medium",
        weightRegular: "Regular",
        weightSemiBold: "Semi-Bold",
      },
      wizard: {
        initialMessage: "Halo! Saya AI assistant Anda. Mari buat website bisnis Anda dalam 1 menit! Siapa nama bisnis atau usaha Anda?",
        nameAckVariants: [
          "Baik, nama bisnis telah dicatat.",
          "Nama bisnis berhasil disimpan.",
          "Oke, nama sudah tersimpan.",
          "Siap, nama bisnis tercatat.",
          "Nama usaha Anda sudah masuk sistem.",
          "Baik, nama bisnis terdaftar."
        ],
        nameConfirmVariants: [
          "Itu nama bisnis aslinya, atau masih nama sementara? Kalau sudah pas, ketik lagi untuk lanjut, atau ganti nama yang Anda mau pakai 😊",
          "Apakah itu nama sebenarnya? Ketik 'ya' untuk lanjut, atau masukkan nama lain jika ingin diganti.",
          "Nama tersebut terdengar seperti percobaan — pastikan ini yang Anda mau. Ketik 'ya' untuk lanjut, atau masukkan nama baru."
        ],
        descriptionPrompt: "Ceritakan bisnis Anda secara singkat — cukup 1-2 kalimat. Tekan Enter untuk lanjut jika ingin skip.",
        descriptionSkipKeyword: "lewat",
        descriptionInferenceHigh: "Saya lihat Anda bergerak di bidang {type} — {subType}. Langsung buat website-nya?",
        descriptionInferenceMedium: "Saya lihat bidang usaha Anda adalah {type}. Bisa pilih yang lebih spesifik?",
        descriptionInferenceNone: "Baik, silakan pilih jenis bisnis Anda:",
        selectMoodPrompt: "Pilih suasana (mood) yang cocok untuk website Anda:",
        selectLanguagePrompt: "Dalam bahasa apa website ini akan dibuat?",
        preparingWebsite: "Baik, AI sedang menyiapkan website Anda...",
        websiteReady: "🎉 Website Anda telah selesai dibuat! Silakan lihat pratinjau website Anda di samping atau klik tombol di bawah untuk lanjut.",
        confirmCardTitle: "Hampir jadi — cek dan lengkapi",
        confirmCardLabelName: "Nama",
        confirmCardLabelType: "Jenis",
        confirmCardLabelTypeHeader: "Jenis Bisnis",
        confirmCardLabelWA: "WA",
        confirmCardLabelArea: "Jangkauan",
        confirmCardLabelLang: "Bahasa Situs",
        confirmCardBtnChange: "Ubah",
        confirmCardBtnFill: "Isi",
        confirmCardBtnClose: "✕ tutup",
        confirmCardBtnGenerate: "Generate Website →",
        confirmCardBtnGenerateRedo: "Terapkan & Generate Ulang →",
        confirmCardBtnGenerating: "Sedang dibuat...",
        confirmCardBtnFinishEdit: "Selesai edit dulu ↑",
        successModalTitle: "Selamat! Website Anda Telah Siap 🎉",
        successModalDesc: "Website telah berhasil dibuat oleh AI. Silakan periksa hasil tampilannya terlebih dahulu. Jika ada bagian konten, gambar, warna, atau tata letak yang kurang pas, Anda bisa dengan mudah menyesuaikan semuanya di halaman Editor.",
        successModalBtnPreview: "Lihat Preview",
        successModalBtnEdit: "Edit & Publikasikan",
        errorModalRetry: "Coba lagi",
        errorModalCancel: "Batal",
        loadingBuildingTitle: "Membangun website...",
        loadingBuildingTitleWithName: "Membangun website {name} ✨",
        loadingBuildingTitleGeneral: "AI sedang membangun website Anda ✨",
        loadingPleaseWait: "Mohon tunggu sebentar...",
        loadingCharsWritten: "✍️ {count} karakter ditulis",
        loadingAiInsight: "AI Insight",
        loadingChecklist0: "Menulis headline & hero",
        loadingChecklist1: "Menyusun cerita bisnis",
        loadingChecklist2: "Menulis keunggulan & layanan",
        loadingChecklist3: "Menyiapkan testimoni & FAQ",
        loadingChecklist4: "Menyusun katalog & galeri",
        loadingChecklist5: "Optimasi SEO & finalisasi",
        inputPlaceholderName: "Masukkan nama bisnis Anda...",
        inputPlaceholderDesc: "Ceritakan singkat tentang bisnis Anda...",
        inputPlaceholderGeneral: "Ketik nama bisnis atau jawaban...",
        sttListening: "Mendengarkan...",
        sttUseVoice: "Gunakan Suara (STT)",
        btnNext: "Lanjut",
        btnSkip: "Lewati",
        btnChangeName: "Ganti Nama",
        btnYesContinue: "Ya, Lanjut",
        btnSeeOtherOptions: "Lihat Pilihan Lain",
        btnSave: "Simpan",
        btnCancel: "Batal",
        btnFinish: "Selesai",
        btnSaveAndApply: "Simpan & Terapkan",
        previewWebsiteTitle: "Pratinjau Website",
        openForm: "Buka Form",
        closeForm: "Tutup Form",
        businessDetailsTitle: "Detail Bisnis",
        businessDetailsSubtitle: "Dua data ini langsung dipakai AI untuk isi tombol kontak dan bikin copy yang lebih relevan.",
        waSaved: "WA tersimpan",
        waEmpty: "WA belum diisi",
        areaEmpty: "Area belum diisi",
        waHint: "Langsung jadi tombol chat di hero & footer",
        serviceAreaHint: "AI pakai ini untuk nulis copy yang lebih relevan",
        voiceNotAvailable: "Browser Anda tidak mendukung fitur Voice/STT.",
        chooseMoreAppropriate: "Baik, silakan pilih yang lebih tepat:",
        placeholderPhone: "cth. 081234567890",
        placeholderArea: "cth. Jogja, Jabodetabek, seluruh Indonesia",
        sttStopRecording: "Berhenti merekam",
        sttStartRecording: "Bicara dengan mic",
        backToChat: "Kembali ke chat",
        generationFailed: "Generate belum berhasil",
        generationErrorMessage: "Terjadi kesalahan saat membuat preview.",
        successToastTitle: "Website Anda Telah Siap!",
        successToastDesc: "Konten, warna, atau tata letak bisa diubah kapan saja di halaman Editor.",
        closeNotification: "Tutup notifikasi",
        btnLater: "Nanti saja",
        btnCompleteData: "Lengkapi Data",
        btnEditPublish: "Edit & Publikasikan",
        notThisType: "Bukan ini? Pilih jenis bisnis lain",
        moreSpecific: "Lebih spesifik:",
        chooseMoodHint: "Pilih mood yang sesuai dengan brand Anda",
        suggestedBadge: "✨ Disarankan",
        typeSelectedChooseSub: "✓ Dipilih — pilih jenis di bawah",
        wireframeAbout: "Tentang",
        wireframeFeatures: "Keunggulan",
        wireframeContact: "Kontak",
        statusWaitingInput: "Menunggu input...",
        statusAiGenerating: "AI sedang generate...",
        statusPreviewReady: "Preview siap ✓",
        statusPreparingAi: "Menyiapkan AI...",
        nameConfirmPlaceholder: "Ketik 'ya' untuk lanjut, atau nama yang benar...",
        descPlaceholder: "Contoh: Jual kopi spesial di Jogja, melayani pesanan partai besar",
        labelBusinessName: "Nama Bisnis",
        labelBusinessType: "Jenis Bisnis",
        labelBusinessSubType: "Sub Jenis Bisnis",
        labelDescription: "Deskripsi",
        labelWhatsapp: "Nomor WhatsApp",
        labelServiceArea: "Wilayah Layanan",
        labelMood: "Gaya & Suasana Website (Mood)",
        categories: {
          kuliner: "Kuliner",
          kulinerDesc: "Restoran & Cafe",
          tokoUmkm: "Toko & UMKM",
          tokoUmkmDesc: "Toko & UMKM",
          jasa: "Jasa",
          jasaDesc: "Agency",
          company: "Company",
          companyDesc: "Corporate",
        },
        moods: {
          modernClean: "Modern & Clean",
          modernCleanDesc: "Bersih, rapi, profesional",
          warmVintage: "Warm & Vintage",
          warmVintageDesc: "Hangat, klasik, berkarakter",
          boldEnergetic: "Bold & Energetic",
          boldEnergeticDesc: "Kontras tinggi, penuh energi",
          elegantLuxury: "Elegant & Luxury",
          elegantLuxuryDesc: "Mewah, eksklusif, anggun",
          playfulFun: "Playful & Fun",
          playfulFunDesc: "Ceria, ramah, berwarna",
          minimalistDark: "Minimalist Dark",
          minimalistDarkDesc: "Gelap, futuristik, modern",
        },
        subtypes: {
          "Restoran": "Restoran",
          "Kafe": "Kafe",
          "Bakery & Pastry": "Bakery",
          "Catering": "Catering",
          "Warung Makan": "Warung Makan",
          "Minuman & Bubble Tea": "Minuman",
          "Fashion & Pakaian": "Fashion",
          "Elektronik": "Elektronik",
          "Produk Lokal Handmade": "Handmade",
          "Toko Online": "Toko Online",
          "Minimarket": "Minimarket",
          "Perabot & Furnitur": "Furnitur",
          "Salon & Kecantikan": "Salon",
          "Barbershop": "Barbershop",
          "Laundry": "Laundry",
          "Otomotif & Bengkel": "Bengkel",
          "Klinik & Kesehatan": "Klinik",
          "Konsultan": "Konsultan",
          "Fotografer": "Fotografer",
          "Software & SaaS": "Software & SaaS",
          "Startup & Tech": "Startup & Tech",
          "Agency & Creative": "Agency",
          "Logistik & Ekspedisi": "Logistik",
          "Konstruksi & Properti": "Konstruksi",
          "Edukasi & Pelatihan": "Edukasi",
          "Properti & Real Estate": "Properti",
          "Konstruksi": "Konstruksi",
          "Pendidikan & Kursus": "Pendidikan",
          "Travel & Wisata": "Travel",
          "Hotel & Penginapan": "Hotel",
          "Manufaktur": "Manufaktur",
        },
        resumePrompt: "Lanjutkan sesi sebelumnya?",
        resumeSavedLabel: "Tersimpan {time}",
        resumeContinue: "Lanjutkan",
        resumeStartFresh: "Mulai baru",
        timeJustNow: "baru saja",
        timeMinutesAgo: "{count} menit lalu",
        timeHoursAgo: "{count} jam lalu",
        timeDaysAgo: "{count} hari lalu",
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
      footerBlog: "Blog",
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
      activeBadge: "Active",
      yearlySavings: "🎉 Save Rp {value}/year",
      websiteCount: "{n} Website",
      aiGenerate: "AI Generate {n}x/month",
      aiRegen: "AI Regen {n}x/month",
      aiDesign: "AI Design {n}x/month",
      noCustomDomain: "No custom domain",
      seoBooster: "SEO Booster",
      subdomainFeature: "Subdomain .webjoz.app",
      hostingFeature: "Free Hosting & SSL",
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
      upgradeLabel: "Upgrade",
      authenticated: "Authenticated",
      locked: "Locked",
      appearance: "Appearance",
      language: "Language",
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
        recentAccounts: "Recent Accounts",
        viewAll: "View all",
        noAccounts: "No accounts registered yet.",
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
        salesOverview: "Sales Overview",
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
        subdomainPlaceholder: "yourname",
        subdomainAvailable: "Available: {url}",
        subdomainInvalidHint: "Use lowercase letters, numbers, or hyphens (-)",
        subdomainHint: "Only lowercase letters, numbers, and hyphens. Subdomain cannot be changed after publishing.",
        connectCustomDomain: "Connect Custom Domain",
        customDomainDescPre: "Want a more professional brand like domainanda.com? You can set it up in",
        customDomainDescPost: "after your website is live.",
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
        linkEditor: "Editor",
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
        continueEditing: "Continue Editing",
      },
      leads: {
        loadFailed: "Failed to load leads inbox",
        loading: "Loading leads inbox...",
        filter: "Filter",
        allWebsites: "All Websites",
        emptyTitle: "Inbox Empty",
        emptyDesc: "No leads yet. Make sure the \"Show Contact Form\" option is enabled in your website configuration.",
        sender: "Sender",
        date: "Received At",
        sourceSite: "Source Website",
        actions: "Actions",
        siteId: "Site ID #{id}",
        detail: "Detail",
        leadDetail: "Customer Lead Detail",
        inquiryMessage: "Inquiry Message",
        receivedOn: "Received on",
        sourceUrl: "Source Page URL",
        selectPrompt: "Select a lead in the table to view the full message.",
      },
      team: {
        loadFailed: "Failed to load team data",
        inviteSent: "Invitation sent",
        inviteFailed: "Failed to send invitation",
        inviteRevoked: "Invitation revoked",
        revokeFailed: "Failed to revoke invitation",
        memberRemoved: "Member removed",
        removeFailed: "Failed to remove member",
        membersTitle: "Team Members ({count})",
        invitePending: "Invitation pending · role: {role}",
        pending: "Pending",
        inviteLinkCopied: "Invitation link copied",
        noMembers: "No team members yet.",
        inviteTitle: "Invite New Member",
        emailPlaceholder: "email@example.com",
        sendInvite: "Send Invitation",
        inviteHint: "Members with the editor role can edit site content. Viewers can only view.",
        limitTitle: "Team Member Limit Reached",
        later: "Later",
        upgradeToPro: "Upgrade to Pro",
        limitDesc: "Your current plan has a limit on the number of team members. Upgrade to add more collaborators.",
        role: {
          owner: "Owner",
          editor: "Editor",
          viewer: "Viewer",
        },
      },
      analytics: {
        loadFailed: "Failed to load analytics data",
        loading: "Loading analytics data...",
        noChartData: "No visit data for this time range yet.",
        chartAria: "Daily visits chart",
        srActivePoint: "Date {date}, {count} pageviews",
        selectSite: "Select website",
        preset7: "7 Days",
        preset30: "30 Days",
        preset90: "90 Days",
        to: "to",
        statPageviews: "Total Pageviews",
        up: "Up",
        down: "Down",
        fromPrevPeriod: "% vs previous period",
        prevPeriodComp: "Comparison with previous period",
        statUniqueVisitors: "Unique Visitors",
        visitorsEstimate: "Estimated based on IP + device",
        statAvgDuration: "Average Duration",
        durationNote: "Includes single-page visits (0 seconds)",
        dailyVisitsTitle: "Daily Visit Statistics",
        dailyVisitsDesc: "Visualization of daily visitor volume movement.",
        leadsIn: "Incoming Leads",
        leadsFromForms: "From contact forms on your sites",
        conversion: " · conversion {pct}%",
        viewAllLeads: "View all leads",
        trafficSources: "Traffic Sources",
        noReferrerData: "No referral data yet.",
        upsellTitle: "Unlock Full Analytics",
        later: "Later",
        upgradeToPro: "Upgrade to Pro",
        free7Days: "Free Plan — Max 7 Days",
        free7DaysDesc: "Free accounts can only view analytics up to 7 days back.",
        selectedRange: "You selected the range {from} to {to}.",
        proUpgrade: "Upgrade to Pro",
        proUpgradeDesc: "With the Pro plan, you can access up to 90 days of analytics, plus exclusive features like custom domains and unlimited AI content writer.",
      },
      domains: {
        loadFailed: "Failed to load domain data",
        loading: "Loading domain data...",
        added: "Custom domain connected! Set up the CNAME record at your DNS registrar.",
        addFailed: "Failed to add domain",
        invalidFormat: "Invalid domain format. Example: domainanda.com",
        verified: "Domain verified successfully!",
        verifyFailed: "DNS verification failed. Check your CNAME record.",
        confirmDelete: "Delete this domain?",
        deleted: "Domain deleted.",
        deleteFailed: "Failed to delete domain",
        continueConnect: "Continue Connecting",
        upgradeToPro: "Upgrade to Pro",
        close: "Close",
        upgradePlan: "Upgrade Plan",
        connectedTitle: "Connected Custom Domains ({count})",
        quotaTitle: "{plan} plan: max {max} domains per account, not per website",
        quota: "Quota: {used} / {max} custom domains",
        customDomainBadge: "Custom Domain",
        siteId: "Site #{id}",
        waitingPropagation: " · waiting for DNS propagation",
        active: "Active",
        pending: "Pending",
        checkDns: "Check DNS",
        delete: "Delete",
        connectTitle: "Connect Custom Domain",
        connectDesc: "Use your own domain to look more professional.",
        noPublished: "No published websites yet",
        noPublishedDesc: "Custom domains can only be connected to live websites. Publish your website first via the",
        myWebsites: "My Websites",
        linkToSite: "Link to Website",
        domainAddress: "Custom Domain Address",
        domainPlaceholder: "e.g. tokokamu.com or toko.domainanda.com",
        validFormat: "✓ Valid domain format",
        invalidFormatHint: "Invalid format — enter a domain without http:// or www.",
        dnsInstructions: "DNS Configuration Guide at Your Domain Provider",
        step1: "Log in to your Domain Registrar account where you bought the domain (such as Niagahoster, Rumahweb, Cloudflare, Namecheap, GoDaddy, etc.).",
        step2: "Find the domain you want to manage and open the DNS Management, DNS Zone Editor, or Manage DNS page.",
        step3: "Add a new DNS Record with type CNAME and fill in the columns according to the data below:",
        step4: "Save your DNS changes. Propagation and domain verification usually take from 5 minutes up to 24 hours.",
        dnsType: "Type",
        dnsHost: "Host / Name",
        dnsTarget: "Target / Value",
        note: "Note: If you want to use a custom subdomain like toko.domainanda.com, change the Host / Name column to toko.",
        verifyHint: "After saving the DNS configuration above, return to the dashboard and click the \"Check DNS\" (Refresh icon) button on your domain list to verify.",
        connectBtn: "Connect Custom Domain",
        upsellTitle: "✨ Boost Your Business Credibility",
        upsellDesc: "Custom Domain is a Pro feature that makes your brand look more professional, trustworthy to customers, and easier to find on Google (SEO).",
        upsellBranding: "Professional Branding",
        upsellBrandingDesc: "Use your own domain (e.g. tokomu.com) without the .webjoz.com suffix.",
        upsellSeo: "Better SEO",
        upsellSeoDesc: "Google prioritizes primary domains to rank at the top of search results.",
        upsellSsl: "Automatic SSL/HTTPS",
        upsellSslDesc: "Data security is guaranteed with free SSL encryption installed directly on your domain.",
        limitTitle: "Custom Domain Limit Reached",
        limitDesc: "Your {plan} plan only includes {max} custom domains (applies to the whole account, not per website).",
        limitDesc2: "To add more custom domains, please upgrade to a higher plan.",
      },
      settings: {
        tabProfile: "Profile",
        tabSecurity: "Security",
        tabDevices: "Active Devices",
        tabUsers: "Users",
        tabPermissions: "Role Permissions",
        tabLogs: "Audit Logs",
        tabInvestigate: "AI Investigator",
        groupAccount: "Account",
        groupAdmin: "System Admin",
        profileFailedLoad: "Failed to load profile",
        profilePhoneError: "Use international format, like +628123456789.",
        profileUpdated: "Profile updated.",
        profileFailedUpdate: "Failed to update profile",
        profileEyebrow: "Profile",
        profileTitle: "Profile Settings",
        email: "Email",
        name: "Name",
        saveProfile: "Save Profile",
        profileEmpty: "Profile data will appear here after authentication.",
        pwChanged: "Password changed. Please sign in again.",
        pwFailed: "Failed to change password",
        securityEyebrow: "Security",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        updatePassword: "Update Password",
        devicesFailedLoad: "Failed to load devices",
        deviceSignedOut: "Device signed out.",
        deviceSignOutFailed: "Failed to sign out device",
        trustRemoved: "Trusted device removed.",
        trustRemovalFailed: "Failed to remove trusted device",
        othersSignedOut: "Other devices signed out.",
        othersSignOutFailed: "Failed to sign out other devices",
        allSignedOut: "All devices signed out.",
        allSignOutFailed: "Failed to sign out all devices",
        browser: "Browser",
        unknownDevice: "Unknown device",
        unknownUserAgent: "Unknown user agent",
        devicesTitle: "Device & Session Management",
        refresh: "Refresh",
        signOutOthers: "Sign out others",
        signOutAll: "Sign out all",
        metricActiveSessions: "Active sessions",
        metricTrustedDevices: "Trusted devices",
        metricThisSession: "This session",
        noSessionsTitle: "No sessions yet",
        noSessionsText: "No active sessions or trusted devices associated with this account.",
        statusCurrent: "currently signed in",
        statusTrusted: "trusted device",
        statusUnknown: "unknown device",
        sessionId: "Session #{id}",
        deviceId: "Device {id}",
        ip: "IP: {ip}",
        lastUsed: "Last used: {date}",
        expires: "Expires: {date}",
        removeTrust: "Remove trust",
        revoke: "Revoke",
        usersFailedLoad: "Failed to load users",
        userUpdated: "User updated to {role}",
        userUpdateFailed: "Failed to update user role",
        userDeleteConfirm: "Are you sure you want to delete {name}?",
        userDeleted: "User {name} deleted successfully",
        userDeleteFailed: "Failed to delete user",
        usersTitle: "User Management",
        searchByNameEmail: "Search by name or email",
        roleFilter: "Role filter (user/sales/admin)",
        usersVisibleTitle: "Admin-visible users",
        noUsersMatch: "No users matched the current query.",
        roleUser: "User",
        roleSales: "Sales",
        roleAdmin: "Admin",
        roleSuperadmin: "Superadmin",
        delete: "Delete",
        permsFailedLoad: "Failed to load initial data",
        permsRoleFailedLoad: "Failed to load role permissions",
        permsSaved: "Permissions updated successfully",
        permsSaveFailed: "Failed to update permissions",
        rbacEyebrow: "RBAC Management",
        manageRolePermissions: "Manage Role Permissions",
        saving: "Saving...",
        saveChanges: "Save Changes",
        totalPermissions: "{count} Total",
        availablePermissions: "Available Permissions",
        activePermissions: "{count} Active",
        resourceSuffix: "{resource} Resource",
        logsRefreshed: "Audit feed refreshed.",
        logsFailedLoad: "Failed to load logs",
        logsTitle: "Real-time Audit Log Feed",
        autoRefreshOn: "Auto-refresh On",
        autoRefreshOff: "Auto-refresh Off",
        refreshNow: "Refresh Now",
        logFilterLabel: "IP / Search",
        dateFrom: "Date From",
        dateTo: "Date To",
        eventTable: "Event Table",
        noLogsMatch: "No audit logs matched the current filters.",
        logActionOn: "{action} on {resource}",
        noDescription: "No description",
        ipAddress: "IP Address",
        actorUserId: "Actor User ID",
        userAgent: "User Agent",
        investLoadHistoryFailed: "Failed to load history",
        investCompleted: "AI investigation completed.",
        investFailed: "Failed to investigate logs",
        investDetailFailed: "Failed to load detail",
        investLoading: [
          "Clustering matching audit events...",
          "Building incident timeline...",
          "Cross-checking suspicious signals...",
          "Drafting recommendations for the operator...",
        ],
        investEyebrow: "AI Powered",
        investTitle: "Investigate with AI",
        analyzing: "Analyzing...",
        runInvestigation: "Run Investigation",
        streamingAnalysis: "Streaming analysis",
        latestResult: "Latest result",
        investOutputTitle: "AI Investigation Output",
        aiProcessing: "AI Processing",
        riskLevel: "Risk Level",
        riskWeightNote: "Weighted by signals, urgency, log volume, and incident status",
        score: "Score {score}",
        timeline: "Timeline",
        suspiciousSignals: "Suspicious Signals",
        recommendations: "Recommendations",
        noItems: "No items returned.",
        readyTitle: "Ready for analysis",
        readyDesc: "Run an investigation to generate a summary, timeline, suspicious signals, and recommendations.",
        savedCount: "{count} saved",
        savedTitle: "Saved Investigations",
        noSavedTitle: "No saved investigations",
        noSavedDesc: "Completed investigations will appear here for quick review.",
        investigationId: "Investigation #{id}",
        previous: "Previous",
        pageOf: "Page {page} of {total}",
        next: "Next",
        investigationDetails: "Investigation Details",
        closeDetails: "Close investigation details",
        status: "Status",
        riskNoteHigh: "Escalate quickly. Multiple strong signals point to elevated risk.",
        riskNoteMedium: "Needs review. Suspicious patterns warrant operator follow-up.",
        riskNoteLow: "Monitor only. Lower-confidence incident.",
        noResultYet: "No investigation result loaded yet.",
      },
      upgrade: {
        snapLoadError: "Failed to load Midtrans Snap",
        loadPlansFailed: "Failed to load plans",
        pleaseLogin: "Please log in first",
        freeActive: "Free plan is already active",
        tokenFailed: "Failed to get payment token",
        waitingPayment: "Waiting for payment... Please complete it on the Midtrans page.",
        paymentFailed: "Payment failed, please try again",
        paymentCancelled: "Payment cancelled",
        redirecting: "Redirecting to payment page...",
        processFailed: "Failed to process payment",
        loadingPlans: "Loading plans...",
        backToDashboard: "Back to dashboard",
        title: "Upgrade Plan",
        subtitle: "Choose a subscription plan that fits your business scale.",
        paymentSuccess: "Payment Successful!",
        upgradingDesc: "Your plan is being upgraded. Redirecting to dashboard...",
        freePrice: "Free",
        currentPlan: "Current Plan",
        unavailable: "Not Available",
        websitesCount: "{n} Websites",
        aiGeneratePerMonth: "{n} AI Generate / mo",
        sectionRegenPerMonth: "{n} Section Regen / mo",
        designRegenPerMonth: "{n} Design Regen / mo",
        noCustomDomain: "No custom domain",
        basicSeo: "Basic SEO",
        popular: "Most Popular",
        perYear: "/yr",
        promoYearly: "Yearly Promo",
        equivalentPerMonth: "Equal to Rp {value} /mo",
        savingsPerYear: "🎉 Save Rp {value} / year",
        perMonth: "/mo",
        promoMonths: "Discount {n} months",
        choosePlan: "Choose {name} ({cycle})",
        yearly: "Yearly",
        monthly: "Monthly",
        customDomainCount: "{n} Custom Domains",
        seoOptimized: "SEO optimized",
      },
      adminPlans: {
        noAccess: "You do not have access to this page.",
        title: "Plan Management",
        subtitle: "Define and manage subscription plans for tenants.",
        newPlan: "New Plan",
        allPlans: "All Plans",
        noPlansYet: "No plans defined yet",
        createFirstPlan: "Create your first plan",
        perMonth: "/mo",
        perYear: "/yr",
        active: "Active",
        inactive: "Inactive",
        sitesCount: "{count} sites",
        aiCount: "{count} AI",
        membersCount: "{count} members",
        tablePlan: "Plan",
        tablePrice: "Price",
        tableSites: "Sites",
        tableAiGen: "AI Gen",
        tableMembers: "Members",
        tableDomains: "Domains",
        tableStatus: "Status",
        promoMonthly: "Promo: {price}/mo ({months} months)",
        promoMonthsShort: "mo",
        promoYearly: "Yearly Promo: {price}/yr",
        promoTag: "— {label}",
        editPlan: "Edit Plan",
        createPlan: "Create Plan",
        name: "Name",
        slug: "Slug",
        description: "Description",
        featuresLabel: "Features (JSON or text list)",
        featuresPlaceholder: "5 websites, 100 AI generates/month",
        priceMonthly: "Price (Monthly)",
        priceYearly: "Price (Yearly)",
        promoPricing: "Promo Pricing",
        promoPriceMonthly: "Promo Price (Monthly)",
        promoPriceYearly: "Promo Price (Yearly)",
        noPromo: "0 = no promo",
        durationMonths: "Duration (months, for monthly promo)",
        promoLabel: "Promo Label",
        promoLabelPlaceholder: "e.g. Intro Price, Launch Discount",
        maxSites: "Max Sites",
        aiGenerates: "AI Generates",
        sectionRegens: "Section Regens",
        designRegens: "Design Regens",
        maxMembers: "Max Members",
        customDomains: "Custom Domains",
        planActive: "Plan is active and available",
        cancel: "Cancel",
        saving: "Saving...",
        updatePlan: "Update Plan",
        createPlanBtn: "Create Plan",
        deleteConfirm: "Are you sure you want to delete this plan?",
        planDeleted: "Plan deleted",
        planUpdated: "Plan updated",
        planCreated: "Plan created",
        loadFailed: "Failed to load plans",
        saveFailed: "Failed to save plan",
        deleteFailed: "Failed to delete plan",
        required: "required",
      },
      adminHealth: {
        noAccess: "You do not have access to this page.",
        title: "System Health",
        subtitle: "Monitor platform service status and health.",
        refresh: "Refresh",
        loadFailed: "Failed to fetch health data",
        loadFailedTitle: "Failed to load data",
        retry: "Try Again",
        serviceDatabase: "Database",
        dbPostgres: "PostgreSQL connection",
        serviceCache: "Cache",
        redisConnection: "Redis connection",
        serviceAi: "AI Provider",
        geminiStatus: "Gemini API status",
        serviceVersion: "API Version",
        apiVersionDesc: "App version",
        statusHealthy: "Healthy",
        statusUnhealthy: "Unhealthy",
        statusUnknown: "Unknown",
        lastCheckedAt: "Last checked at",
        neverChecked: "Never checked",
        allSystemsUp: "All systems operational",
        someIssues: "Some systems have issues",
      },
      adminMetrics: {
        noAccess: "You do not have access to this page.",
        title: "AI Generation Metrics",
        subtitle: "Latency, concurrency, and quality metrics for AI content generation.",
        refresh: "Refresh",
        loadFailed: "Failed to load metrics",
        loadFailedTitle: "Failed to load data",
        retry: "Retry",
        avgDuration: "Avg Duration",
        avgDurationDesc: "Average generation time",
        p95: "P95 (last bucket)",
        p95Desc: "95th percentile latency",
        errorRate: "Error Rate",
        errorsOfRequests: "{errors} errors / {requests} requests",
        activeRequests: "Active Requests",
        activeRequestsDesc: "Concurrent AI generations",
        trendTitle: "Trend (24h)",
        trendDesc: "Hourly average duration and error rate",
        noTrendData: "No trend data available yet.",
        recentRequests: "Recent Requests (last 10)",
        recentRequestsDesc: "Latest generation attempts",
        noRequestsLogged: "No requests logged yet.",
      },
      adminTemplates: {
        seedLoadFailed: "Failed to fetch design token seeds",
        backfillConfirm: "Backfill scores for all template_library rows with score=0?",
        backfillDone: "Backfill complete — scores updated",
        backfillFailed: "Backfill failed",
        seedDeleteConfirm: "Are you sure you want to permanently delete this design token seed?",
        seedDeleted: "Design token seed deleted",
        seedDeleteFailed: "Failed to delete seed",
        accessDenied: "Access Denied",
        superadminOnly: "This page can only be accessed by accounts with the",
        superadmin: "Superadmin",
        title: "Template Gallery",
        subtitle: "Review system built-in templates and design token seeds from AI generator incubation.",
        backfillScores: "Backfill Scores",
        refreshSeeds: "Refresh Seeds",
        tabComponents: "Template Components",
        tabSeeds: "Design Token Seeds",
        searchComponentsPlaceholder: "Search template name, ID, or description...",
        searchSeedsPlaceholder: "Search business type, mood, or seed ID...",
        allCategories: "All Categories",
        allBusinessTypes: "All Business Types",
        allMoods: "All Moods",
        noTemplateMatch: "No templates matched your search.",
        resetFilter: "Reset Filter",
        score: "Score",
        defaultSeed: "Default Seed",
        heading: "Heading",
        normal: "Normal",
        bodyFont: "Body Font",
        body: "Body",
        designQuality: "Design Quality",
        previewFullscreen: "Fullscreen Preview",
        loginRequired: "A login session is required to view design token seeds.",
        loginSession: "Login Session",
        loadingSeeds: "Loading design token seeds from API...",
        superadminOnlyManage: "Only Superadmins Can Manage Design Token Seeds.",
        insufficientAccess: "Your current account role does not have sufficient administrative access.",
        noSeedsInDb: "No design token seeds in the database.",
        noSeedsMatch: "No seeds matched the search keywords.",
        resetSearch: "Reset Search",
        entriesCount: "{shown} of {total} entries in template_library",
        noPalette: "No Palette",
        base: "Base",
        view: "View",
        delete: "Delete",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        sortScoreAsc: "Lowest Score",
        sortScoreDesc: "Highest Score",
        scoreBelowPlaceholder: "Score below...",
        scoreFilterAll: "All",
        scoreFilterExcellent: "≥80",
        scoreFilterGood: "60–79",
        scoreFilterWeak: "<60",
        selectAllFiltered: "Select All ({count})",
        clearSelection: "Clear Selection",
        selectedCount: "{count} selected",
        deleteSelected: "Delete Selected",
        bulkDeleteConfirm: "Permanently delete {count} selected design token seeds?",
        bulkDeleted: "{count} seeds deleted",
        bulkDeletePartialFail: "{ok} deleted, {fail} failed — try again for the rest",
        critique: "AI Critique",
        critiqueRunning: "Analyzing...",
        critiqueDone: "AI critique completed — aesthetic score updated",
        critiqueFailed: "Failed to run AI critique",
        aestheticScore: "Aesthetic",
        needsReview: "Needs Review",
        critiqueTitle: "AI Critique",
        critiqueStrengths: "Strengths",
        critiqueImprovements: "Improvements",
        critiqueScreenshot: "screenshot",
        critiqueViewDetails: "View details",
        critiqueDetailsTitle: "AI Critique Details",
        critiqueDimensions: "Dimension Scores",
        critiqueScreenshotTitle: "Screenshot",
        critiqueOpenScreenshot: "Open in new tab",
        critiqueClose: "Close",
        critiqueNoScreenshot: "No screenshot",
        critiqueVerdict: "Verdict",
      },
      adminAnnouncements: {
        noAccess: "You do not have access to this page.",
        title: "Announcements",
        subtitle: "Broadcast messages to all tenants.",
        new: "New Announcement",
        all: "All Announcements",
        noItems: "No announcements yet",
        createFirst: "Create your first announcement",
        active: "Active",
        inactive: "Inactive",
        expires: "Expires",
        loadFailed: "Failed to load announcements",
        created: "Announcement created",
        createFailed: "Failed to create announcement",
        deleteConfirm: "Delete this announcement?",
        deleted: "Announcement deleted",
        deleteFailed: "Failed to delete announcement",
        titleField: "Title",
        severity: "Severity",
        sevInfo: "Info",
        sevWarning: "Warning",
        sevImportant: "Important",
        contentField: "Content",
        cancel: "Cancel",
        creating: "Creating...",
        create: "Create",
      },
      adminCommissions: {
        loadFailed: "Failed to load all commissions",
        tier1RangeError: "Tier 1 percentage must be between 0 and 100",
        tier2RangeError: "Tier 2 percentage must be between 0 and 100",
        configUpdated: "Commission updated: Tier 1 {t1}% · Tier 2 {t2}%",
        configUpdateFailed: "Failed to update commission",
        amountPositiveError: "Bonus amount must be a positive number",
        ruleUpdated: "Bonus rule updated",
        ruleUpdateFailed: "Failed to update bonus rule",
        loading: "Loading admin commission data...",
        accessRestricted: "Access Restricted",
        accessRestrictedDesc: "This page is for Admins with the `commission:read_all` permission.",
        title: "Sales Commission & Bonus Management (Admin)",
        subtitle: "Commission percentages, onboarding & milestone bonus schemes, and all sales partner transactions.",
        rateSettings: "Sales Commission Rate Settings",
        activeScheme: "Active Scheme",
        tieredScheme: "Tiered Commission Scheme",
        tier1FirstMonths: "tier 1 for the first {months} months",
        tier2After: "tier 2 afterwards (applies indefinitely)",
        tier1Label: "Tier 1 — first {months} months (%)",
        tier2Label: "Tier 2 — afterwards (%)",
        save: "Save",
        superadminOnlyEdit: "Only {superadmin} can edit the commission scheme.",
        superadmin: "Superadmin",
        bonusRulesSettings: "Bonus Rules Settings (Onboarding & Milestone)",
        tier: "Tier",
        onboardingDesc: "Flat bonus per new tenant on their first payment.",
        milestoneDesc: "Reach {threshold} newly activated tenants within 1 month.",
        bonusAmount: "Bonus Amount (Rp)",
        recurringCommissions: "Recurring Commissions ({count})",
        allBonuses: "All Sales Bonuses ({count})",
        allCommissionTxns: "All Commission Transactions ({count})",
        pendingOnPage: "Pending on This Page: Rp {amount}",
        noCommissions: "No commissions recorded in the system",
        colDate: "Date",
        colSalesUser: "Sales User ID",
        colTenantId: "Tenant ID",
        colOrderId: "Order ID",
        colGrossAmount: "Gross Amount",
        colRate: "Rate",
        colCommission: "Commission",
        colStatus: "Status",
        pageOf: "Page {page} of {total}",
        previous: "Previous",
        next: "Next",
        allBonusesTitle: "All Sales Bonuses ({count})",
        noBonuses: "No bonuses recorded in the system",
        colBonusType: "Bonus Type",
        colDetailPeriod: "Detail / Period",
        colBonusAmount: "Bonus Amount",
        bonus: "Bonus",
        tenant: "Tenant",
        period: "Period",
        markPaid: "Mark as Paid ({count})",
        bonusPayoutSuccess: "{count} bonuses marked as paid",
        bonusPayoutFailed: "Failed to mark bonuses as paid",
        filterAll: "All Statuses",
        filterPending: "Pending",
        filterPaid: "Paid",
        filterVoided: "Voided",
        selectAllPending: "Select all pending on this page",
      },
      adminDesignAssets: {
        accessDenied: "Access Denied",
        accessDeniedDesc: "This page can only be accessed by accounts with the {superadmin} role.",
        superadmin: "Superadmin",
        loading: "Loading design assets configuration...",
        title: "Design Assets",
        subtitle: "Manage the sections, typography, color palettes, and visual presets available in the website editor.",
        saving: "Saving...",
        resetAll: "Reset All",
        resetAllConfirm: "Reset all Design Assets settings to defaults?",
        resetAllSuccess: "All Design Assets settings have been reset to defaults.",
        resetAllFailed: "Failed to reset on the server.",
        saveLocalOnly: "Failed to save to the server. Changes saved locally.",
        tabSections: "Sections",
        tabTypography: "Typography",
        tabPalettes: "Color Palettes",
        tabPresets: "Visual Presets",
        hidden: "Hidden",
        active: "Active",
        optional: "Optional",
        required: "Required",
        show: "Show",
        hide: "Hide",
        require: "Make Required",
        unrequire: "Make Optional",
        custom: "Custom",
        sectionsVisibilityTitle: "Section Visibility",
        sectionsVisibilityDesc: "Hidden sections won't appear in the editor sidebar.",
        resetDefault: "Reset Default",
        variantsActive: "{active}/{total} active variants",
        variantsTitle: "Layout Variants",
        variantsDesc: "Manage layout variants per section. Hidden variants won't appear in the editor dropdown.",
        variantsCount: "{active}/{total} active",
        mapTilesTitle: "Map Styles",
        mapTilesDesc: "Manage the map style options that appear in the Contact section editor.",
        tileLabelLight: "Light",
        tileLabelDark: "Dark",
        tileLabelSatellite: "Satellite",
        tileDescOsm: "Standard OpenStreetMap, detailed and free.",
        tileDescCyclosm: "OSM with cycling routes, brighter colors.",
        tileDescLight: "Minimal light map from CartoCDN.",
        tileDescDark: "Elegant dark map from CartoCDN.",
        tileDescEsri: "Road map styled by Esri / ArcGIS.",
        tileDescSatellite: "Satellite imagery from Esri World Imagery.",
        addPairingTitle: "Add New Font Pairing",
        addPatternTitle: "Add New Color Palette",
        addPresetTitle: "Add New Visual Preset",
        name: "Name",
        description: "Description",
        headingFont: "Heading Font",
        bodyFont: "Body Font",
        weight: "Weight",
        heroSize: "Hero Size",
        emojiIcon: "Emoji Icon",
        fontPairing: "Font Pairing",
        colorPalette: "Color Palette",
        mode: "Mode",
        light: "Light",
        dark: "Dark",
        cancel: "Cancel",
        save: "Save",
        searchPairings: "Search font pairings...",
        searchPatterns: "Search color palettes...",
        searchPresets: "Search visual presets...",
        add: "Add",
        noPairingsMatch: "No matching font pairings.",
        noPatternsMatch: "No matching palettes.",
        noPresetsMatch: "No matching presets.",
        score: "Score: {score}",
        sectionRequiredError: 'Section "{key}" is required and cannot be hidden.',
        sectionHidden: 'Section "{key}" hidden.',
        sectionShown: 'Section "{key}" shown.',
        sectionRequired: 'Section "{key}" marked as required.',
        sectionOptional: 'Section "{key}" can now be hidden.',
        variantHidden: 'Variant "{variant}" in "{section}" hidden.',
        variantShown: 'Variant "{variant}" in "{section}" shown.',
        sectionsReset: "Section settings reset.",
        tileHidden: 'Map style "{tile}" hidden.',
        tileShown: 'Map style "{tile}" shown.',
        pairingHidden: "Font pairing hidden.",
        pairingShown: "Font pairing shown.",
        pairingAdded: 'Font pairing "{name}" added.',
        deletePairingConfirm: "Delete this custom font pairing?",
        pairingDeleted: "Font pairing deleted.",
        patternHidden: "Palette hidden.",
        patternShown: "Palette shown.",
        patternAdded: 'Palette "{name}" added.',
        deletePatternConfirm: "Delete this custom palette?",
        patternDeleted: "Palette deleted.",
        presetHidden: "Visual preset hidden.",
        presetShown: "Visual preset shown.",
        presetAdded: 'Preset "{name}" added.',
        deletePresetConfirm: "Delete this custom visual preset?",
        presetDeleted: "Visual preset deleted.",
      },
      notifications: {
        title: "Notifications",
        loading: "Loading notifications...",
        loadFailed: "Failed to load notifications",
        markReadFailed: "Failed to mark notification as read",
        allRead: "All notifications marked as read",
        markAllFailed: "Failed to mark all notifications as read",
        markAllRead: "Mark All as Read",
        markReadTooltip: "Mark as read",
        viewTooltip: "View details",
        unreadCount: "{count} unread notifications",
        noNew: "No new notifications",
        emptyTitle: "No Notifications",
        emptyDesc: "No notifications yet. You'll be notified when there's a new announcement or when a lead comes into your website.",
        justNow: "Just now",
        minutesAgo: "{n}m ago",
        hoursAgo: "{n}h ago",
        daysAgo: "{n}d ago",
        typeAnnouncement: "Announcement",
        typeLead: "Lead",
        typeSystem: "System",
      },
      investigate: {
        loadingClustering: "Clustering matching audit events...",
        loadingTimeline: "Building incident timeline...",
        loadingSignals: "Cross-checking suspicious signals...",
        loadingRecommendations: "Drafting recommendations for the operator...",
        loadHistoryFailed: "Failed to load investigation history",
        completed: "AI investigation completed.",
        runFailed: "Failed to investigate logs",
        loadDetailFailed: "Failed to load investigation detail",
        noResultNote: "No investigation result loaded yet.",
        noteHigh: "Escalate quickly. Multiple strong signals point to elevated account or access risk.",
        noteMedium: "Needs review. There are enough suspicious patterns to warrant operator follow-up.",
        noteLow: "Monitor only. The current evidence suggests a lower-confidence incident.",
        eyebrowAi: "AI Powered",
        title: "Investigate with AI",
        analyzing: "Analyzing...",
        runInvestigation: "Run Investigation",
        fieldResource: "Resource",
        fieldStatus: "Status",
        fieldAction: "Action",
        fieldSearch: "Search",
        fieldDateFrom: "Date From",
        fieldDateTo: "Date To",
        streamingAnalysis: "Streaming analysis",
        latestResult: "Latest result",
        outputTitle: "AI Investigation Output",
        aiProcessing: "AI Processing",
        riskLevel: "Risk Level",
        riskWeightedDesc: "Weighted by signals, urgency, log volume, and incident status",
        score: "Score {score}",
        listTimeline: "Timeline",
        listSignals: "Suspicious Signals",
        listRecommendations: "Recommendations",
        emptyTitle: "Ready for analysis",
        emptyDesc: "Run an investigation to generate a summary, timeline, suspicious signals, and recommendations.",
        savedCount: "{count} saved",
        savedTitle: "Saved Investigations",
        refresh: "Refresh",
        noSavedTitle: "No saved investigations",
        noSavedDesc: "Completed investigations will appear here for quick review.",
        investigationChip: "Investigation #{id}",
        previous: "Previous",
        pageOf: "Page {page} of {total}",
        next: "Next",
        detailsEyebrow: "Investigation Details",
        closeLabel: "Close investigation details",
        statusLabel: "Status",
        noItems: "No items returned.",
        errorEyebrow: "System Error",
        errorTitle: "Failed to Load Dashboard",
        errorHeading: "Something went wrong!",
        errorDesc: "We encountered an unexpected error while trying to load the investigation module. This could be a network issue or a temporary backend failure.",
        tryAgain: "Try Again",
      },
      sales: {
        loadFailed: "Failed to load referral code",
        codeCopied: "Referral code copied",
        linkCopied: "Referral link copied",
        regenerated: "New referral code created successfully!",
        regenerateFailed: "Failed to regenerate referral code",
        loading: "Loading referral data...",
        accessDeniedTitle: "Access Restricted",
        accessDeniedDesc: "This page is for Webjoz Sales Partners & Admins only. Please contact an admin if you are part of the sales team.",
        pageTitle: "Partner Referral Code",
        pageDesc: "Share your referral code or link with clients to earn commission on every paid transaction.",
        viewCommissions: "View My Commissions",
        codeCardTitle: "Your Referral Code",
        codeCardDesc: "Use this code when a new website/tenant signs up.",
        copied: "Copied",
        copyCode: "Copy Code",
        updatePrompt: "Want to update your code?",
        regenerateCode: "Regenerate Code",
        linkCardTitle: "Signup Referral Link",
        linkCardDesc: "Clients who sign up through this link are automatically connected to your account.",
        copyLink: "Copy Link",
        tipsLabel: "Tip:",
        tipsText: "Include this link in your proposal, WhatsApp message, or social media bio.",
        programTitle: "Sales Partner Commission Terms",
        commRatePrefix: "Commission of",
        commRateSuffix: "from every paid transaction completed by your referred tenant.",
        commRecurringPrefix: "Commission is",
        commRecurringSuffix: "for every monthly or yearly subscription renewal.",
        commEditorPrefix: "Every tenant who signs up with your code automatically adds you as an",
        commEditorSuffix: "member in that tenant's workspace.",
        dialogTitle: "Regenerate Referral Code",
        confirmPrefix: "Are you sure you want to create a new referral code? Your old code",
        confirmSuffix: "will no longer work for new signups.",
        cancel: "Cancel",
        processing: "Processing...",
        confirmRegenerate: "Yes, Create New Code",
      },
      salesOverview: {
        loadFailed: "Failed to load sales data",
        loading: "Loading summary...",
        accessDeniedTitle: "Access Restricted",
        accessDeniedDesc: "This page is for Sales Partners & Admins only. Contact an admin to enable access.",
        pageTitle: "Sales Overview",
        pageDesc: "Your earnings summary — Tier 1 {t1}% (first {months} months) → Tier 2 {t2}%, plus onboarding & milestone bonuses.",
        cardTotal: "Total Earnings",
        cardTotalDesc: "Accumulated Commission + Bonuses",
        cardCommission: "Recurring Commission",
        cardCommissionDesc: "Tier 1 {t1}% / Tier 2 {t2}%",
        cardBonus: "Total Bonuses",
        cardBonusDesc: "{onboarding} Onboarding · {milestone} Milestone",
        cardPending: "Pending Payout",
        cardPendingDesc: "Awaiting payout processing",
        refCardTitle: "Your Referral Code",
        refLinkLabel: "Referral Link",
        copyCode: "Copy Code",
        copyLink: "Copy Link",
        copied: "Copied!",
        manageRef: "Manage referral code",
        schemeTitle: "Active Commission Scheme",
        tier1Desc: "First {months} months after signup",
        tier2Desc: "After {months} months running",
        bonusSchemeTitle: "Additional Bonuses",
        bonusOnboarding: "Onboarding bonus per tenant",
        bonusMilestone: "Monthly milestone bonus",
        quickLinksTitle: "Quick Access",
        linkCommissionsTitle: "Commission & Bonus History",
        linkCommissionsDesc: "View all recorded commission and bonus transactions with their status.",
        linkReferralTitle: "Manage Referral Code",
        linkReferralDesc: "Copy, share, or regenerate your referral code.",
        codeCopied: "Code copied!",
        linkCopied: "Link copied!",
      },
      salesCommissions: {
        loadFailed: "Failed to load commission data",
        loading: "Loading earnings data...",
        accessDeniedTitle: "Access Restricted",
        accessDeniedDesc: "You don't have access to the commissions & bonuses page yet. Contact an admin to enable sales access.",
        pageTitle: "My Earnings",
        pageDesc: "Tiered commission Tier 1 {t1}% (first {months} months) → Tier 2 {t2}%, plus onboarding & milestone bonuses.",
        cardTotal: "Total Earnings",
        cardTotalDesc: "Accumulated Commission + Bonuses",
        cardCommission: "Recurring Commission",
        cardCommissionDesc: "Commission per payment: {t1}% (Tier 1) / {t2}% (Tier 2)",
        cardBonus: "Total Bonuses",
        cardBonusDesc: "{onboarding} Onboarding, {milestone} Milestone",
        cardPending: "Pending Payout",
        cardPendingDesc: "Awaiting payout processing",
        tabCommissions: "Recurring Commission ({count})",
        tabBonuses: "Onboarding & Milestone Bonuses ({count})",
        noCommissionsTitle: "No commissions recorded yet.",
        noCommissionsDesc: "Share your referral code to start earning commissions.",
        thDate: "Date",
        thOrderId: "Order ID",
        thTenantId: "Tenant ID",
        thGross: "Gross Amount",
        thRate: "Rate",
        thCommission: "Commission",
        thStatus: "Status",
        tierLabel: "Tier {tier}",
        pageOf: "Page {page} of {total}",
        previous: "Previous",
        next: "Next",
        noBonusesTitle: "No bonuses recorded yet.",
        noBonusesDesc: "Onboarding bonus (Rp 50.000) and monthly milestone bonuses are recorded automatically once the tenant is active.",
        thBonusType: "Bonus Type",
        thDetail: "Detail / Period",
        thAmount: "Bonus Amount",
        bonusTypeLabel: "{type} Bonus",
        bonusTenant: "Tenant #{id}",
        bonusPeriod: "Period {period} (Tier {tier})",
      },
      tenants: {
        loadFailed: "Failed to load tenants",
        accessDenied: "You don't have access to this page.",
        title: "All Tenants",
        emptyTitle: "No tenants found",
        thTenant: "Tenant",
        thPlan: "Plan",
        thMembers: "Members",
        thSites: "Sites",
        thCreated: "Created",
        manage: "Manage",
      },
      tenantDetail: {
        loadFailed: "Failed to load tenant details",
        planUpdated: "Plan updated",
        assignFailed: "Failed to assign plan",
        accessDenied: "You don't have access to this page.",
        notFoundTitle: "Tenant not found",
        backToTenants: "Back to Tenants",
        tenantInfoTitle: "Tenant Info",
        slugLabel: "Slug",
        ownerIdLabel: "Owner ID",
        planAssignmentTitle: "Plan Assignment",
        currentPlanLabel: "Current Plan",
        changePlanLabel: "Change Plan",
        selectPlan: "Select plan...",
        assign: "Assign",
        usageTitle: "AI Usage (this month)",
        usageGenerates: "Generates",
        usageSectionRegens: "Section Regens",
        usageDesignRegens: "Design Regens",
        usageTokenInput: "Token Input",
        usageTokenOutput: "Token Output",
        usageEmpty: "No usage data for this month",
        membersTitle: "Members ({count})",
        noMembers: "No members",
        thName: "Name",
        thEmail: "Email",
        thRole: "Role",
        thJoined: "Joined",
        viewSites: "View Sites",
        viewDomains: "View Domains",
        viewLeads: "View Leads",
      },
      logs: {
        refreshed: "Audit feed refreshed.",
        loadFailed: "Failed to load logs",
        title: "Real-time Audit Log Feed",
        autoRefreshOn: "Auto-refresh On",
        autoRefreshOff: "Auto-refresh Off",
        refreshNow: "Refresh Now",
        filterAction: "Action",
        filterResource: "Resource",
        filterStatus: "Status",
        filterIpSearch: "IP / Search",
        filterDateFrom: "Date From",
        filterDateTo: "Date To",
        eventTable: "Event Table",
        emptyDesc: "No audit logs matched the current filters.",
        actionOn: "{action} on {resource}",
        noDescription: "No description",
        detailIp: "IP Address",
        detailActor: "Actor User ID",
        detailAgent: "User Agent",
      },
      permissions: {
        loadInitialFailed: "Failed to load initial data",
        loadRoleFailed: "Failed to load role permissions",
        saveSuccess: "Permissions updated successfully",
        saveFailed: "Failed to update permissions",
        eyebrow: "RBAC Management",
        title: "Manage Role Permissions",
        saving: "Saving...",
        save: "Save Changes",
        totalCount: "{count} Total",
        availablePermissions: "Available Permissions",
        activeCount: "{count} Active",
        resourceLabel: "{resource} Resource",
      },
      sessions: {
        title: "Device & Session Management",
        refresh: "Refresh",
        refreshLabel: "Refresh devices",
        loadFailed: "Failed to load devices",
        signedOut: "Device signed out.",
        signOutFailed: "Failed to sign out device",
        trustRemoved: "Trusted device removed.",
        trustRemoveFailed: "Failed to remove trusted device",
        othersSignedOut: "Other devices signed out.",
        othersSignOutFailed: "Failed to sign out other devices",
        allSignedOut: "All devices signed out.",
        allSignOutFailed: "Failed to sign out all devices",
        signOutOthers: "Sign out others",
        signOutAll: "Sign out all",
        metricActive: "Active sessions",
        metricTrusted: "Trusted devices",
        metricCurrent: "This session",
        emptyTitle: "No sessions yet",
        emptyDesc: "No active sessions or trusted devices are currently associated with this account.",
        statusCurrent: "currently signed in",
        statusTrusted: "trusted device",
        statusUnknown: "unknown device",
        sessionChip: "Session #{id}",
        deviceChip: "Device {id}",
        trustChip: "Trust {id}",
        unknownDevice: "Unknown device",
        unknownAgent: "Unknown user agent",
        ipLabel: "IP: {ip}",
        lastUsed: "Last used: {date}",
        trustedUsed: "Trusted use: {date}",
        expires: "Expires: {date}",
        removeTrust: "Remove trust",
        revokeSession: "Revoke session",
      },
      users: {
        title: "User Management",
        refresh: "Refresh",
        searchPlaceholder: "Search by name or email",
        rolePlaceholder: "Role filter (user/sales/admin)",
        loadFailed: "Failed to load users",
        roleUpdated: "Role of {name} updated to {role}",
        roleUpdateFailed: "Failed to update user role",
        deleteConfirm: "Are you sure you want to delete {name}?",
        deleted: "User {name} deleted successfully",
        deleteFailed: "Failed to delete user",
        adminVisibleTitle: "Admin-visible users",
        emptyDesc: "No users matched the current query.",
        delete: "Delete",
      },
      upgradeSuccess: {
        confirmTimeout: "Confirming your payment...",
        backToDashboard: "Back to Dashboard",
        pendingTitle: "Payment Processing",
        pendingDesc: "We're verifying your payment. This page will refresh automatically once payment is confirmed.",
        successTitle: "Plan Upgraded Successfully!",
        successDesc: "Congrats! Your account is now on the Pro plan. Enjoy unlimited AI generates, custom domains, and automatic SEO.",
        errorTitle: "Payment Failed",
        errorDesc: "Your payment could not be processed. Please try again or check your payment method.",
        txDetails: "Transaction Details",
        orderIdLabel: "Order ID",
        totalLabel: "Total",
        methodLabel: "Method",
        timeLabel: "Time",
        goToDashboard: "Go to Dashboard",
        viewOtherPlans: "View Other Plans",
      },
      sitesNew: {
        connecting: "Connecting...",
        noWorkspaceTitle: "No Active Workspace",
        noWorkspaceDesc: "You need to join a workspace first to create a new website.",
        backToDashboard: "Back to Dashboard",
      },
      sitesSeo: {
        title: "SEO & Performance",
        webLink: "Web",
        saving: "Saving...",
        saved: "Saved",
        save: "Save",
        loadFailed: "Failed to load SEO settings",
        saveFailed: "Failed to save SEO",
        gscSaved: "Saved to Google Search Console",
        aiFailed: "AI failed to optimize SEO",
        upgradeTitle: "AI SEO — Pro Plan",
        upgradeDesc: "AI SEO optimization is available without limits on the Pro plan.",
        upgradeNow: "Upgrade Now",
        later: "Later",
      },
      sitesIntegrations: {
        title: "Integrations",
        webLink: "Web",
        loadFailed: "Failed to load integrations",
        saved: "Saved",
        saveFailed: "Failed to save integrations",
        save: "Save",
        saving: "Saving...",
        ga4Desc: "Connect Google Analytics 4 to track visitors, behavior, and conversions on your site.",
        metaPixelDesc: "Add the Meta Pixel to track ad conversions and build retargeting audiences on Instagram & Facebook.",
      },
      sitesTestimonials: {
        loadFailed: "Failed to load testimonials",
        shareTitle: "Share Testimonial",
        copy: "Copy",
        linkCopied: "Testimonial link copied.",
        pendingTitle: "{count} Testimonials Pending Approval",
        approved: "Approved",
        approvedDesc: "This testimonial has been approved and is now live on your site.",
        approve: "Approve",
        approveFailed: "Failed to approve testimonial",
        rejected: "Rejected",
        rejectedDesc: "This testimonial was not approved.",
        reject: "Reject",
        rejectFailed: "Failed to reject testimonial",
        validationRequired: "Validation required",
        added: "Testimonial added successfully.",
        addFailed: "Failed to add testimonial",
        add: "Add Manually",
        manualTitle: "Add Testimonial Manually",
        manualDesc: "Enter testimonial data directly.",
        labelName: "Name",
        labelRole: "Role",
        labelQuote: "Testimonial",
        labelRating: "Rating",
        saving: "Saving...",
        saveToSite: "Save to Site",
        cancel: "Cancel",
        emptyDesc: "No testimonials yet. Click Add Manually to add your first.",
      },
      sitesKatalog: {
        loadFailed: "Failed to load catalog",
        saveFailed: "Failed to save catalog",
        saving: "Saving...",
        saved: "Saved",
        save: "Save",
        webLink: "Web",
        emojiPopular: "Popular",
        emojiFood: "Food",
        emojiServices: "Services",
        emojiSymbols: "Symbols",
        emojiSymbol: "More symbols",
        pickEmojiTitle: "Pick an emoji",
        close: "Close",
        sectionTitleMenu: "Menu",
        sectionTitleCatalog: "Product Catalog",
        itemLabelMenu: "menu item",
        itemLabelCatalog: "product",
        itemCountLabel: "{count} item",
        noCategoriesTitle: "No categories yet",
        noCategoriesDesc: "Click + Add Category to start, or add {itemLabel} directly.",
        itemNumberLabel: "Item {number}",
        noItemsDesc: "No {itemLabel} in this category yet.",
        labelSectionTitle: "Section Title",
        labelEyebrow: "Eyebrow",
        labelSubtitle: "Subtitle",
        labelPhoto: "Photo",
        labelName: "Name",
        labelPrice: "Price",
        labelBadge: "Badge",
        badgeHint: "A badge marks items as featured and shows them in the showcase view.",
        labelDescription: "Description",
        bulletList: "Bullet List",
        numberedList: "Numbered List",
        addItemLabel: "+ Add {label} to {category}",
        addCategory: "+ Add Category",
        defaultCategory: "Category {number}",
        bannerTitle: "Manage your {itemLabel}",
        bannerDesc1: "Add categories and {itemLabel} here. Fill in a photo, name, description{itemPricePart}, and badge for each.",
        bannerDesc2: "Badged items are automatically featured in the showcase view.",
        bannerDesc3: "Visitors can add {itemLabel} that you request.",
        bannerPricePart: ", price",
        addWord: "Add",
        aiPromptLabelPrefix: "Make description for",
        itemFallback: "Item {number}",
        aiModalTitle: "AI Instructions",
        aiModalDesc: "What description would you like to create?",
        aiFailed: "AI failed to generate a description",
        generate: "Generate",
        processing: "Processing...",
        cancel: "Cancel",
        aiGenerateTitle: "Generate with AI",
        aiGenerateDesc: "Use AI to automatically generate an item description.",
        optional: "Optional",
        upgradeTitle: "AI Feature - Pro Plan",
        upgradeDesc: "AI-generated descriptions are available without limits on the Pro plan.",
        upgradeNow: "Upgrade Now",
        later: "Later",
        chipMenu: "Menu",
        chipCatalog: "Catalog",
        chipCategoryCount: "{count} categories",
      },
      sitesBlog: {
        title: "Blog Posts",
        webLink: "Web",
        addNew: "New Post",
        layoutLabel: "Blog Layout",
        aiPick: "AI-recommended for your site style",
        nonPremiumText: "AI content generation is only available on",
        upgrade: "Upgrade →",
        writePostTitle: "Write New Post",
        savePost: "Save Post",
        cancel: "Cancel",
        aiCardTitle: "Generate Blog Content with AI",
        generate: "Generate",
        generateLabel: "Generate",
        layoutGrid: "Grid",
        layoutGridDesc: "Cards in 3 columns",
        layoutList: "List",
        layoutListDesc: "Horizontal with image",
        layoutFeatured: "Featured",
        layoutFeaturedDesc: "Hero + grid below",
        layoutMinimal: "Minimal",
        layoutMinimalDesc: "Title & date list",
        loadFailed: "Failed to load blog",
        draftCreated: "Blog draft created",
        generateFailed: "Failed to generate blog",
        postCreated: "Post created",
        createFailed: "Failed to create post",
        publishFailed: "Failed to publish",
        published: "Published",
        layoutSaved: "Blog layout updated",
        layoutFailed: "Failed to save layout",
        publishedDate: "Published {date}",
        draftDate: "Draft · {date}",
        publishedBadge: "Published",
        draftBadge: "Draft",
        edit: "Edit",
        publish: "Publish",
        emptyDesc1: "No blog content yet. Click",
        emptyDesc2: "to create your first post.",
      },
      sitesBlogPost: {
        loadFailed: "Failed to load post",
        saveFailed: "Failed to save",
        bold: "Bold",
        italic: "Italic",
        heading2: "Heading 2",
        heading3: "Heading 3",
        bulletList: "Bullet List",
        orderedList: "Ordered List",
        blockquote: "Blockquote",
        link: "Link",
        uploadImage: "Upload Image",
        notFound: "Post not found",
        back: "Back",
        editor: "Editor",
        preview: "Preview",
        published: "Published",
        draft: "Draft",
        unsaved: "Unsaved changes",
        savedAt: "Saved {time}",
        save: "Save",
        excerpt: "Excerpt",
        seoTitle: "SEO Title",
        seoDescription: "SEO Description",
        noindex: "Noindex (Hide from Google)",
        noindexDesc: "This page will not appear in Google search results.",
        cover: "Cover Image",
        aiFailed: "AI failed",
        generating: "Generating...",
        generate: "Generate",
        aiCardTitle: "Generate Blog Content with AI",
        aiPromptLabelPrefix: "Make description for",
      },
      sitesEditor: {
        authenticating: "Authenticating...",
        loading: "Loading editor...",
        loadFailed: "Failed to load site",
        loadMore: "Load more ({count} remaining)",
        backToSites: "Back to websites list",
        back: "Back",
        contentTab: "Content",
        designTab: "Design",
        styleLabel: "Site Style",
        layoutLabel: "Layout",
        sectionOrder: "Section order",
        sectionSpacing: "Section Spacing",
        cornerRadius: "Corner Radius",
        cornerSharp: "Sharp (0px)",
        cornerSoft: "Soft (8px)",
        cornerRounded: "Rounded (20px)",
        heroStyle: "Hero Style",
        heroCentered: "Hero: Centered",
        heroSplit: "Hero: Split Screen",
        heroFullBleed: "Hero: Full Bleed",
        heroMinimalist: "Hero: Minimalist",
        spacingCompact: "Compact",
        spacingRelaxed: "Relaxed",
        spacingCompactShort: "Compact",
        spacingRelaxedShort: "Relaxed",
        normal: "Normal",
        colorPalette: "Color Palette",
        primaryColor: "Primary Color",
        accentColor: "Accent Color",
        backgroundColor: "Background Color",
        surfaceColor: "Surface Color",
        textColor: "Text Color",
        primaryShort: "Primary",
        accentShort: "Accent",
        backgroundShort: "Background",
        surfaceShort: "Surface",
        textShort: "Text",
        visualCustomization: "Visual Customization",
        layoutStyle: "Layout & Style",
        aiDesignPrompt: "AI Design Prompt",
        aiInstructionsTitle: "AI Instructions",
        aiPromptDesc: "What would you like to change in the {label} section?",
        generateAi: "Generate AI",
        regenerateWithAi: "Regenerate with AI",
        processing: "Processing...",
        applyStyle: "Apply Style",
        cancel: "Cancel",
        later: "Later",
        upgradeToPro: "Upgrade to Pro",
        upgradeDefaultTitle: "AI Features — Pro Only",
        upgradeDefaultBody: "AI features are only available for Pro users.",
        upgradeProDesc: "With Pro, you can use AI Generate for content, images, SEO, and website design.",
        upgradeRegenTitle: "Regenerate with AI — Pro feature",
        upgradeRegenBody: "Regenerate section content with AI without limits on the Pro plan.",
        upgradeDesignTitle: "Redesign with AI — Pro feature",
        upgradeDesignBody: "Let AI change your site style, colors, and layout instantly on the Pro plan.",
        upgradeSuggestionTitle: "AI prompt suggestions — Pro feature",
        upgradeSuggestionBody: "Use ready-made AI prompts to speed up your workflow on the Pro plan.",
        save: "Save",
        saving: "Saving...",
        saved: "Saved",
        saveSuccess: "Changes saved successfully!",
        saveFailed: "Failed to save changes",
        autosaveFailed: "Failed to save",
        notFoundTitle: "Site Not Found",
        notFoundDesc: "We couldn't find the site you're looking for in this workspace.",
        preview: "Preview",
        previewDesktop: "Preview desktop",
        previewTablet: "Preview tablet",
        previewMobile: "Preview mobile",
        toggleDarkAria: "Toggle dark mode",
        light: "Light",
        dark: "Dark",
        switchLight: "Switch to light mode",
        switchDark: "Switch to dark mode",
        aiUsage: "AI Usage",
        generate: "Generate",
        sectionRegen: "Section Regen",
        designRegen: "Design Regen",
        qualityScore: "Quality: {score}%",
        qualityTitle: "Content Completeness ({score}%)",
        qualityDesc: "{count} fields need filling so your site looks its best:",
        qualityWarning: "⚠️ {count} fields need attention",
        qualityFieldHint: "Field is empty or contains sample text",
        fill: "Fill",
        viewCompleteness: "View content completeness",
        undo: "Undo",
        undoAllTitle: "Undo last change (text, design, or section order)",
        undoDesign: "Undo Design",
        undoDesignTitle: "Undo last design change",
        noDesignChanges: "No design changes yet",
        show: "Show",
        hide: "Hide",
        showSection: "Show section",
        hideSection: "Hide section",
        hidden: "Hidden",
        showPageSections: "Show page sections",
        expandEditArea: "Expand edit area",
        variantOptions: "Layout Variants",
        selectSectionAria: "Select Section",
        openSheet: "Open sheet",
        closeSheet: "Close sheet",
        publish: "Publish",
        publishShort: "Publish",
        publishSuccess: "Website published successfully! 🚀",
        publishFailed: "Failed to publish website",
        applying: "Applying...",
        applyLive: "Apply to Live",
        apply: "Apply",
        live: "Live",
        draft: "Draft",
        aiProcessing: "AI is processing...",
        aiReviewActive: "AI Review Active",
        aiReviewDesc1: "Please apply or revert the AI changes to the",
        aiReviewDesc2: "section in the preview above first.",
        diffAi: "AI Diff: {label}",
        diffChanges: "{count} changes",
        content: "Content",
        old: "Old:",
        new: "New:",
        use: "Use",
        useThis: "Use this",
        revert: "Revert",
        aiApplied: "AI results for {label} applied.",
        aiCancelled: "AI results cancelled.",
        aiReverted: "AI changes to {label} reverted.",
        aiNoChange: "AI produced no meaningful changes.",
        aiNoChangeHint: "Try a more specific instruction, e.g. make it an emotional headline, max 8 words, and remove raw input text.",
        aiSectionDone: "AI finished writing {label}. Review the diff before applying.",
        aiSectionFailed: "AI failed to regenerate this section.",
        aiStyleDone: "AI finished redesigning the site style. Review the visual results before saving.",
        aiStyleFailed: "AI failed to regenerate the site style.",
        aiStyleNoChange: "AI produced no meaningful style changes.",
        aiProcessFailed: "AI failed to process.",
        siteStyle: "site style",
        aiDesignEngine: "AI Design Engine",
        latestAiGenerated: "Latest AI Generated",
        latest: "Latest",
        latestAiDesc: "Latest AI-generated unique visual style for your site.",
        aiResult: "AI Result",
        aiMoodCreated: "{mood} mood. Created on {date}.",
        editLabel: "Edit — {label}",
        confirmPublishTitle: "Apply changes to Live?",
        confirmPublishDesc: "Visitors will see the latest version shortly.",
        confirmPublishBody: "All saved draft changes will be applied to your live site at {subdomain}.webjoz.com.",
        confirmApply: "Yes, Apply",
        upgradeLabel: "Upgrade to Pro",
        aiInstructionsPlaceholder: "e.g. \"make it more persuasive and emotional\"",
        aiDesignInstructionsPlaceholder: "e.g. warm vintage coffee theme...",
        aiDesignFailed: "Failed to regenerate the design with AI",
        aiHistory: "AI History",
        aiMadeFor: "Made specifically from your business info",
        aiRecommendation: "AI Recommendation",
        aiTemplateCategory: "Template category",
        aiTemplateName: "Template name",
        appearancePreset: "Appearance Presets",
        bodyFont: "Body Font",
        colorPattern: "Color Patterns",
        headingFont: "Heading Font",
        headingWeight: "Heading Weight",
        heroTitleSize: "Hero Title Size",
        manualFineTune: "Manual fine-tune",
        orChoosePairing: "— or choose your favorite font pairing —",
        orChoosePalette: "— or choose your favorite palette —",
        orChoosePreset: "— or choose your favorite preset —",
        pageSections: "Page Sections",
        sizeLarge: "Large",
        sizeMax: "Maximum",
        sizeMedium: "Medium",
        sizeSmall: "Small",
        sizeVeryLarge: "Very Large",
        styleChoiceAria: "Choose a visual style",
        typographyStyle: "Typography Style",
        weightBold: "Bold",
        weightExtraBold: "Extra-Bold",
        weightMedium: "Medium",
        weightRegular: "Regular",
        weightSemiBold: "Semi-Bold",
      },
      wizard: {
        initialMessage: "Hello! I'm your AI assistant. Let's create your business website in 1 minute! What is the name of your business?",
        nameAckVariants: [
          "Got it, business name recorded.",
          "Business name saved successfully.",
          "Okay, the name is saved.",
          "Understood, business name noted.",
          "Your business name is registered.",
          "Great, business name saved."
        ],
        nameConfirmVariants: [
          "Is that your actual business name, or a temporary one? If it's ready, type it again to continue, or enter the name you want to use 😊",
          "Is that the real name? Type 'yes' to continue, or enter another name to change it.",
          "That name looks like a test — make sure it's what you want. Type 'yes' to continue, or enter a new name."
        ],
        descriptionPrompt: "Tell us briefly about your business — 1-2 sentences is enough. Press Enter or click Next to skip.",
        descriptionSkipKeyword: "skip",
        descriptionInferenceHigh: "I see you operate in {type} — {subType}. Shall we create the website directly?",
        descriptionInferenceMedium: "I see your business field is {type}. Could you pick a more specific category?",
        descriptionInferenceNone: "Alright, please select your business type:",
        selectMoodPrompt: "Choose a mood/vibe that fits your website:",
        selectLanguagePrompt: "What language should this website be in?",
        preparingWebsite: "Great! AI is preparing your website...",
        websiteReady: "🎉 Your website is ready! Check out the preview or click below to edit and publish.",
        confirmCardTitle: "Almost done — review and complete",
        confirmCardLabelName: "Name",
        confirmCardLabelType: "Type",
        confirmCardLabelTypeHeader: "Business Type",
        confirmCardLabelWA: "WA",
        confirmCardLabelArea: "Coverage",
        confirmCardLabelLang: "Site Language",
        confirmCardBtnChange: "Edit",
        confirmCardBtnFill: "Add",
        confirmCardBtnClose: "✕ close",
        confirmCardBtnGenerate: "Generate Website →",
        confirmCardBtnGenerateRedo: "Apply & Regenerate →",
        confirmCardBtnGenerating: "Generating...",
        confirmCardBtnFinishEdit: "Finish editing first ↑",
        successModalTitle: "Congratulations! Your Website is Ready 🎉",
        successModalDesc: "Your website has been successfully generated by AI. Feel free to review the layout and content. If you'd like to adjust any text, images, colors, or sections, you can easily customize everything in the Editor.",
        successModalBtnPreview: "View Preview",
        successModalBtnEdit: "Edit & Publish",
        errorModalRetry: "Try again",
        errorModalCancel: "Cancel",
        loadingBuildingTitle: "Building website...",
        loadingBuildingTitleWithName: "Building website for {name} ✨",
        loadingBuildingTitleGeneral: "AI is building your website ✨",
        loadingPleaseWait: "Please wait a moment...",
        loadingCharsWritten: "✍️ {count} characters written",
        loadingAiInsight: "AI Insight",
        loadingChecklist0: "Writing headline & hero",
        loadingChecklist1: "Structuring business story",
        loadingChecklist2: "Crafting benefits & services",
        loadingChecklist3: "Preparing testimonials & FAQ",
        loadingChecklist4: "Setting up catalog & gallery",
        loadingChecklist5: "SEO optimization & finalization",
        inputPlaceholderName: "Enter your business name...",
        inputPlaceholderDesc: "Briefly describe your business...",
        inputPlaceholderGeneral: "Type business name or answer...",
        sttListening: "Listening...",
        sttUseVoice: "Use Voice (STT)",
        btnNext: "Next",
        btnSkip: "Skip",
        btnChangeName: "Change Name",
        btnYesContinue: "Yes, Continue",
        btnSeeOtherOptions: "See Other Options",
        btnSave: "Save",
        btnCancel: "Cancel",
        btnFinish: "Finish",
        btnSaveAndApply: "Save & Apply",
        previewWebsiteTitle: "Website Preview",
        openForm: "Open Form",
        closeForm: "Close Form",
        businessDetailsTitle: "Business Details",
        businessDetailsSubtitle: "These two pieces of info are used by AI for contact buttons and generating relevant copy.",
        waSaved: "WA saved",
        waEmpty: "WA not set",
        areaEmpty: "Area not set",
        waHint: "Becomes instant chat button in hero & footer",
        serviceAreaHint: "AI uses this to write more relevant copy",
        voiceNotAvailable: "Your browser does not support Voice/STT features.",
        chooseMoreAppropriate: "Sure, please choose a more appropriate one:",
        placeholderPhone: "e.g. 081234567890",
        placeholderArea: "e.g. Yogyakarta, Jakarta, all of Indonesia",
        sttStopRecording: "Stop recording",
        sttStartRecording: "Speak into the microphone",
        backToChat: "Back to chat",
        generationFailed: "Generation failed",
        generationErrorMessage: "An error occurred while generating the preview.",
        successToastTitle: "Your website is ready!",
        successToastDesc: "Content, colors, and layout can be changed anytime in the Editor.",
        closeNotification: "Close notification",
        btnLater: "Later",
        btnCompleteData: "Complete Info",
        btnEditPublish: "Edit & Publish",
        notThisType: "Not this? Choose another business type",
        moreSpecific: "More specific:",
        chooseMoodHint: "Choose a mood that fits your brand",
        suggestedBadge: "✨ Suggested",
        typeSelectedChooseSub: "✓ Selected — choose type below",
        wireframeAbout: "About",
        wireframeFeatures: "Features",
        wireframeContact: "Contact",
        statusWaitingInput: "Waiting for input...",
        statusAiGenerating: "AI generating...",
        statusPreviewReady: "Preview ready ✓",
        statusPreparingAi: "Preparing AI...",
        nameConfirmPlaceholder: "Type 'yes' to continue, or enter correct name...",
        descPlaceholder: "Example: Selling specialty coffee in Jogja, serving bulk orders",
        labelBusinessName: "Business Name",
        labelBusinessType: "Business Type",
        labelBusinessSubType: "Sub Business Type",
        labelDescription: "Description",
        labelWhatsapp: "WhatsApp Number",
        labelServiceArea: "Service Area",
        labelMood: "Website Style & Vibe (Mood)",
        categories: {
          kuliner: "Culinary",
          kulinerDesc: "Restaurant & Cafe",
          tokoUmkm: "Store & MSME",
          tokoUmkmDesc: "Store & MSME",
          jasa: "Services",
          jasaDesc: "Agency",
          company: "Company",
          companyDesc: "Corporate",
        },
        moods: {
          modernClean: "Modern & Clean",
          modernCleanDesc: "Clean, tidy, professional",
          warmVintage: "Warm & Vintage",
          warmVintageDesc: "Warm, classic, characterful",
          boldEnergetic: "Bold & Energetic",
          boldEnergeticDesc: "High contrast, energetic",
          elegantLuxury: "Elegant & Luxury",
          elegantLuxuryDesc: "Luxurious, exclusive, graceful",
          playfulFun: "Playful & Fun",
          playfulFunDesc: "Cheerful, friendly, colorful",
          minimalistDark: "Minimalist Dark",
          minimalistDarkDesc: "Dark, futuristic, modern",
        },
        subtypes: {
          "Restoran": "Restaurant",
          "Kafe": "Cafe",
          "Bakery & Pastry": "Bakery & Pastry",
          "Catering": "Catering",
          "Warung Makan": "Food Stall",
          "Minuman & Bubble Tea": "Drinks & Boba",
          "Fashion & Pakaian": "Fashion & Apparel",
          "Elektronik": "Electronics",
          "Produk Lokal Handmade": "Handmade & Crafts",
          "Toko Online": "Online Store",
          "Minimarket": "Convenience Store",
          "Perabot & Furnitur": "Furniture",
          "Salon & Kecantikan": "Beauty & Salon",
          "Barbershop": "Barbershop",
          "Laundry": "Laundry",
          "Otomotif & Bengkel": "Auto & Repair",
          "Klinik & Kesehatan": "Clinic & Healthcare",
          "Konsultan": "Consulting",
          "Fotografer": "Photography",
          "Software & SaaS": "Software & SaaS",
          "Startup & Tech": "Startup & Tech",
          "Agency & Creative": "Agency & Creative",
          "Logistik & Ekspedisi": "Logistics & Freight",
          "Konstruksi & Properti": "Construction & Real Estate",
          "Edukasi & Pelatihan": "Education & Training",
          "Properti & Real Estate": "Property & Real Estate",
          "Konstruksi": "Construction",
          "Pendidikan & Kursus": "Education & Courses",
          "Travel & Wisata": "Travel & Tourism",
          "Hotel & Penginapan": "Hotel & Lodging",
          "Manufaktur": "Manufacturing",
        },
        resumePrompt: "Resume your previous session?",
        resumeSavedLabel: "Saved {time}",
        resumeContinue: "Resume",
        resumeStartFresh: "Start over",
        timeJustNow: "just now",
        timeMinutesAgo: "{count} min ago",
        timeHoursAgo: "{count} hr ago",
        timeDaysAgo: "{count} days ago",
      },
    },
  },
};
