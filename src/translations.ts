// DARTHI AI Comprehensive English & Malayalam Translation Dictionary

export type Language = 'en' | 'ml';

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    appTitle: 'DARTHI AI',
    appSubtitle: 'Predict. Protect. Prosper.',
    tagline: 'Kerala Precision Ag',
    demoData: 'Demo Data',
    liveIoT: 'Live IoT',
    iotStreaming: 'IoT Streaming',
    sensorsReady: 'Sensors Ready',
    rainChance: 'Rain Chance',
    changeLocation: 'Change',
    changeKeralaLocation: 'Change Kerala Location',
    notifications: 'Farm Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No new notifications',
    viewAllAlerts: 'View All Alerts in Notification Center',
    askDarthiAI: 'Ask DARTHI AI',
    voiceBadge: 'VOICE',
    speakOrChat: 'Speak or Chat',
    speak: 'Speak',
    farmingIntelligence: 'Farming Intelligence',
    voiceAssistantAndChat: 'Voice Assistant & Chat',
    listen: 'Listen',
    stop: 'Stop',

    // Navigation Tabs
    dashboard: 'Dashboard',
    soilAnalysis: 'Soil Analysis',
    weatherIntelligence: 'Weather Intelligence',
    cropRecommendation: 'Crop Recommendation',
    cropFeasibility: 'Crop Feasibility',
    smartIrrigation: 'Smart Irrigation',
    fertilizerRecommendation: 'Fertilizer Recommendation',
    diseaseRisk: 'Disease Risk',
    cropHealth: 'Crop Health',
    marketAnalysis: 'Profit & Market Analysis',
    notificationsTab: 'Notifications',
    settingsAndSensors: 'Settings & Sensors',

    // Location Modal
    locationModalTitle: 'Select Farm Location in Kerala',
    locationModalSubtitle: 'Choose from 14 districts, 77 taluks, or auto-detect via GPS for microclimate agromet data',
    searchLocationPlaceholder: 'Search district, taluk, town (e.g., Mananthavady, Kuttanad, Nedumangad)...',
    useGPS: 'Detect My Field GPS',
    detectingGPS: 'Acquiring GPS fix...',
    popularKeralaZones: 'Popular Kerala Agro-Ecological Zones',
    selectedZone: 'Selected Agro-Zone',
    elevation: 'Elevation',
    primarySoil: 'Primary Soil',
    majorCrops: 'Major Crops',
    selectLocationBtn: 'Set Farm Location',
    cancelBtn: 'Cancel',
    districtsHeading: 'All 14 Kerala Districts',

    // Dashboard
    dashboardTitle: 'Farmer Command Dashboard',
    sampleTelemetry: 'Sample / Demo Telemetry',
    monitoringSummary: 'Monitoring',
    acresOf: 'acres of',
    atLocation: 'at',
    agroZoneLabel: 'Agro-Zone',
    soilLabel: 'Soil',
    elevationLabel: 'Elevation',
    refreshAdvice: 'Refresh Advice',
    refreshing: 'Analyzing...',
    todayAIAdvice: "Today's AI Farming Advice",
    todayAdviceTitle: "Today's AI Farming Advice",
    actionItem: 'Action Item',
    actionItemLabel: 'Action Item:',
    askVoiceAssistant: 'Ask Voice Assistant',
    seeIrrigationSchedule: 'See Irrigation Schedule',
    sensorOverview: 'Farm Sensor Overview',
    farmSensorsOverview: 'Farm Sensor Overview',
    sampleSimulation: 'Sample IoT Simulation',
    connectedNodes: 'Connected Field Nodes',

    // Sensor Cards
    soilMoisture: 'Soil Moisture',
    soilTemperature: 'Soil Temperature',
    soilPh: 'Soil pH',
    airTempHumidity: 'Air Temp & Humidity',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    nitrogenN: 'Nitrogen (N)',
    phosphorusP: 'Phosphorus (P)',
    potassiumK: 'Potassium (K)',
    rainProbability: 'Rain Probability',
    adequate: 'Adequate',
    healthyRange: 'Healthy Range',
    neutralIdeal: 'Neutral / Ideal',
    highHumidity: 'High Humidity',
    optimalVegetative: 'Optimal Vegetative Vigor',
    needsBooster: 'Moderate • Needs Booster',
    highResistance: 'High Pest Resistance',
    thunderstormsLikely: 'Thunderstorms Likely',
    tomorrow: 'Tomorrow',
    sevenDayForecast: '7-Day Weather Forecast',
    weatherDetail: 'Weather Detail',
    soilNutrientBalance: 'Soil Nutrient Balance (NPK)',
    testValuesVsBench: 'Current test values vs recommended crop benchmarks',
    soilDiagnostics: 'Soil Diagnostics',
    realtimeTelemetry: 'Real-Time Sensor Telemetry',
    lastSync: 'Live hardware sensor data • Updated every 5 seconds',
    openIrrigationAdvisory: 'Open Irrigation Advisory',
    statusAdequate: 'Adequate',
    statusLow: 'Low',
    statusHigh: 'High',
    statusCritical: 'Critical',

    // Quick Action Cards
    farmStatusQuickActions: 'Farm Status & Quick Actions',
    diseaseRiskIndicator: 'Disease Risk Radar',
    highDiseaseRisk: 'High Fungal Risk',
    lowDiseaseRisk: 'Low Disease Risk',
    moderateDiseaseRisk: 'Moderate Risk',
    viewDiseaseProtocols: 'View Disease Protocols',
    marketPricesTitle: 'Kerala Mandi Prices',
    liveMandiRates: 'Live Kerala APMC mandi rates & trading trends',
    viewMarketAnalytics: 'View Market Analytics',
    waterSavedTitle: 'Water Saved This Month',
    waterSavedSubtitle: 'Preserved by delaying irrigation ahead of rain events',

    // Smart Irrigation View
    smartIrrigationTitle: 'Smart Irrigation & Water Management',
    smartIrrigationSubtitle: 'AI-driven irrigation planning correlating soil moisture sensors, root zone depth, and 7-day rainfall forecasts',
    irrigationStatusBanner: 'Irrigation Status',
    delayIrrigationTitle: 'Delay Irrigation: Rain Approaching & Moisture Adequate',
    irrigationNeededTitle: 'Irrigation Recommended: Soil Moisture Depleting',
    waterPreserved: 'Water Saved Today',
    nextIrrigationWindow: 'Recommended Timing',
    scheduleHeading: '7-Day Precision Irrigation Schedule',
    dayCol: 'Day',
    forecastCol: 'Forecast',
    guidanceCol: 'Guidance',
    waterAmountCol: 'Water Depth',
    sensorThresholds: 'Soil Moisture Thresholds',
    permanentWiltingPoint: 'Permanent Wilting Point',
    currentFieldMoisture: 'Current Field Moisture',
    fieldCapacity: 'Target Field Capacity',
    manualValveControl: 'IoT Irrigation Valve Control',
    valveOpen: 'Valve Open',
    valveClosed: 'Valve Closed',
    toggleValve: 'Toggle Solenoid Valve',
    valveNotice: 'Note: Valve overrides apply only when IoT hardware relay controller is paired.',

    // Soil View
    soilViewTitle: 'Soil Health & Nutrient Intelligence',
    soilViewSubtitle: 'Deep diagnosis of chemical, physical, and biological soil parameters calibrated to Kerala Agricultural University (KAU) standards',
    enterSoilParams: 'Field Soil Parameters',
    runDiagnostic: 'Run AI Soil Diagnostic',
    analyzingSoil: 'Analyzing Soil Health...',
    overallSoilScore: 'Overall Soil Health Score',
    nutrientStatusHeading: 'Nutrient Breakdown',
    deficienciesDetected: 'Deficiencies & Stress Factors',
    actionPlan: 'Recommended Agronomic Actions',
    fertilizerDosingPlan: 'Recommended Fertilizer Dosage',

    // Weather View
    weatherViewTitle: 'Agrometeorological Intelligence',
    weatherViewSubtitle: 'High-resolution hyperlocal weather analytics powered by IMD gridded telemetry and Kerala State Disaster Management warnings',
    hourlyForecastTitle: '24-Hour Microclimate Projection',
    agrometInsights: 'Agromet Operational Insights',
    sprayingAdvisory: 'Foliar Spraying Guidance',
    irrigationAdvisory: 'Irrigation Advisory',
    extremeWeatherRisk: 'Extreme Weather & Waterlogging Risk',
    monsoonAlert: 'Monsoon Alert',

    // Crop Recommendation View
    cropRecTitle: 'AI Crop Recommendation Engine',
    cropRecSubtitle: 'Discover high-yielding, climate-resilient crops scientifically tailored to your soil pH, NPK, elevation, and rainfall',
    recommendCropsBtn: 'Analyze & Recommend Crops',
    topMatches: 'Top Recommended Crops for Your Land',
    suitabilityScore: 'Suitability Match',
    expectedYield: 'Expected Yield',
    maturityPeriod: 'Maturity Days',
    marketDemand: 'Market Demand',
    whySuitable: 'Why this crop fits your farm:',

    // Crop Feasibility View
    cropFeasTitle: 'Crop Feasibility Diagnostic',
    cropFeasSubtitle: 'Test whether a specific cash crop or vegetable can thrive on your plot under current soil and weather parameters',
    selectCropToTest: 'Select Crop to Evaluate',
    testFeasibilityBtn: 'Evaluate Feasibility',
    feasibilityVerdict: 'Feasibility Verdict',
    suitable: 'Highly Suitable',
    conditionallySuitable: 'Conditionally Suitable',
    unsuitable: 'Not Recommended',

    // Fertilizer View
    fertilizerTitle: 'Precision Fertilizer & NPK Optimization',
    fertilizerSubtitle: 'Custom nutrient management calculating exact chemical and organic fertilizer requirements to minimize cost and prevent soil toxicity',
    calculateFertilizer: 'Calculate Fertilizer Requirements',
    organicAlternatives: 'Organic & Bio-Fertilizer Alternatives',
    chemicalSchedule: 'Chemical Fertilizer Schedule',
    applicationTiming: 'Application Stage & Technique',

    // Disease View
    diseaseTitle: 'Crop Disease & Pest Risk Radar',
    diseaseViewSubtitle: 'Predictive fungal, bacterial, and pest vulnerability models based on microclimate humidity, temperature, and rain saturation',
    activeRisks: 'Active Pathogen & Pest Alerts',
    symptomsToInspect: 'Early Symptoms to Look For',
    organicControl: 'Bio-Control / Organic Defense',
    chemicalControl: 'Recommended Fungicide / Pesticide',
    preventiveSteps: 'Immediate Preventive Action',

    // Crop Health View
    cropHealthTitle: 'Crop Health & Canopy Vitality Monitor',
    cropHealthSubtitle: 'Holistic health score synthesized from vegetative vigor, leaf moisture balance, and temperature stress factors',
    vitalityScore: 'Overall Canopy Vitality',
    growthStage: 'Current Growth Stage',
    limitingFactors: 'Growth Limiting Factors',
    interventionChecklist: 'Agronomic Intervention Checklist',

    // Market View
    marketTitle: 'Profit & Mandi Market Intelligence',
    marketSubtitle: 'Real-time Kerala mandi rates, harvesting timeline recommendations, and comprehensive farm economics calculator',
    farmEconomics: 'Farm Profit & Economics Calculator',
    areaAcre: 'Farm Area (Acres)',
    expectedYieldQtl: 'Expected Yield (Quintals/Acre)',
    costPerAcre: 'Production Cost per Acre (₹)',
    mandiPricePerQtl: 'Expected Mandi Price (₹/Quintal)',
    calculateProfit: 'Calculate Profit & ROI',
    estRevenue: 'Estimated Revenue',
    totalCost: 'Total Cost',
    netProfit: 'Estimated Net Profit',
    roi: 'Return on Investment (ROI)',
    breakEven: 'Break-Even Price',
    aiMarketStrategy: 'AI Market Strategy & Timing',
    keralaMandiTable: 'Kerala APMC Mandi Benchmark Prices',

    // Notifications View
    notifCenterTitle: 'Farm Notification & Alert Center',
    notifCenterSubtitle: 'Real-time warnings on severe weather, pest outbreaks, sensor battery, and irrigation schedules',
    allAlerts: 'All Alerts',
    urgentAlerts: 'Urgent Only',
    clearAll: 'Clear All Notifications',
    emptyAlerts: 'No active notifications. Your farm conditions are stable.',

    // Settings View
    settingsTitle: 'Farm Settings & Sensor Thresholds',
    settingsSubtitle: 'Configure farm parameters, IoT hardware alerts, language preferences, and measurement units',
    saveSettings: 'Save Settings',
    farmProfile: 'Farm Profile',
    farmName: 'Farm Name',
    currentCrop: 'Current Crop',
    farmSize: 'Farm Size (Acres)',
    languagePref: 'Preferred Language',
    sensorThresholdsTitle: 'IoT Sensor Warning Limits',
    moistureMin: 'Minimum Moisture Warning (%)',
    moistureMax: 'Maximum Moisture Warning (%)',
    resetDefaults: 'Reset to KAU Recommended Defaults',

    // Assistant Chat
    assistantGreeting: 'Hello! I am your DARTHI AI Assistant.',
    voiceCommandsHeading: 'Voice Commands',
    typeOrSpeak: 'Speak via mic or type your farm question...',
    send: 'Send',
    resetChat: 'Reset Chat',
  },

  ml: {
    // Brand & Header
    appTitle: 'ഡാർത്തി AI (DARTHI AI)',
    appSubtitle: 'കൃത്യതയോടെ പ്രവചിക്കുക • വിള സംരക്ഷിക്കുക • ലാഭം നേടുക',
    tagline: 'കേരള ഹൈടെക് കാർഷിക പ്ലാറ്റ്‌ഫോം',
    demoData: 'ഡെമോ ഡാറ്റ',
    liveIoT: 'തത്സമയ IoT',
    iotStreaming: 'IoT സ്ട്രീമിംഗ്',
    sensorsReady: 'സെൻസറുകൾ സജീവം',
    rainChance: 'മഴ സാധ്യത',
    changeLocation: 'മാറ്റുക',
    changeKeralaLocation: 'കേരള ലൊക്കേഷൻ മാറ്റുക',
    notifications: 'തോട്ട അറിയിപ്പുകൾ',
    markAllRead: 'എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക',
    noNotifications: 'പുതിയ അറിയിപ്പുകൾ ഒന്നുമില്ല',
    viewAllAlerts: 'എല്ലാ മുന്നറിയിപ്പുകളും അറിയിപ്പ് കേന്ദ്രത്തിൽ കാണുക',
    askDarthiAI: 'ഡാർത്തി AI സഹായി',
    voiceBadge: 'ശബ്ദം',
    speakOrChat: 'സംസാരിക്കൂ / ചാറ്റ്',
    speak: 'സംസാരിക്കൂ',
    farmingIntelligence: 'കാർഷിക ഇന്റലിജൻസ്',
    voiceAssistantAndChat: 'ശബ്ദ സഹായി & ചാറ്റ്',
    listen: 'കേൾക്കുക',
    stop: 'നിർത്തുക',

    // Navigation Tabs
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    soilAnalysis: 'മണ്ണ് പരിശോധന',
    weatherIntelligence: 'കാലാവസ്ഥ വിവരങ്ങൾ',
    cropRecommendation: 'വിള നിർദ്ദേശം',
    cropFeasibility: 'വിള അനുയോജ്യത',
    smartIrrigation: 'സ്മാർട്ട് നനയ്ക്കൽ (ഇറിഗേഷൻ)',
    fertilizerRecommendation: 'വളപ്രയോഗ ശുപാർശകൾ',
    diseaseRisk: 'രോഗ സാധ്യത & പ്രതിരോധം',
    cropHealth: 'വിള ആരോഗ്യം',
    marketAnalysis: 'വിപണി വില & ലാഭ വിശകലനം',
    notificationsTab: 'അറിയിപ്പുകൾ',
    settingsAndSensors: 'ക്രമീകരണങ്ങളും സെൻസറുകളും',

    // Location Modal
    locationModalTitle: 'കേരളത്തിലെ കൃഷിയിട സ്ഥലം തിരഞ്ഞെടുക്കുക',
    locationModalSubtitle: 'സൂക്ഷ്മ കാലാവസ്ഥാ വിവരങ്ങൾക്കായി 14 ജില്ലകളിൽ നിന്നോ 77 താലൂക്കുകളിൽ നിന്നോ ജിപിഎസ് വഴിയോ തിരഞ്ഞെടുക്കാം',
    searchLocationPlaceholder: 'ജില്ല, താലൂക്ക്, ഗ്രാമം തിരയുക (ഉദാഹരണത്തിന്: മാനന്തവാടി, കുട്ടനാട്, നെടുമങ്ങാട്)...',
    useGPS: 'തത്സമയ GPS ലൊക്കേഷൻ കണ്ടെത്തുക',
    detectingGPS: 'GPS കണ്ടെത്തുന്നു...',
    popularKeralaZones: 'കേരളത്തിലെ പ്രധാന കാർഷിക മേഖലകൾ',
    selectedZone: 'തിരഞ്ഞെടുത്ത കാർഷിക മേഖല',
    elevation: 'സമുദ്രനിരപ്പിൽ നിന്നുള്ള ഉയരം',
    primarySoil: 'പ്രധാന മണ്ണ് ഇനം',
    majorCrops: 'പ്രധാന വിളകൾ',
    selectLocationBtn: 'സ്ഥലം സ്ഥിരീകരിക്കുക',
    cancelBtn: 'റദ്ദാക്കുക',
    districtsHeading: 'കേരളത്തിലെ 14 ജില്ലകൾ',

    // Dashboard
    dashboardTitle: 'കർഷക കൺട്രോൾ ഡാഷ്‌ബോർഡ്',
    sampleTelemetry: 'മാതൃകാ / ഡെമോ സെൻസർ വിവരങ്ങൾ',
    monitoringSummary: 'നിരീക്ഷിക്കുന്നു:',
    acresOf: 'ഏക്കറിലെ',
    atLocation: 'കൃഷിയിടം:',
    agroZoneLabel: 'കാർഷിക മേഖല',
    soilLabel: 'മണ്ണ് ഇനം',
    elevationLabel: 'ഉയരം',
    refreshAdvice: 'ഉപദേശം പുതുക്കുക',
    refreshing: 'വിശകലനം ചെയ്യുന്നു...',
    todayAIAdvice: 'ഇന്നത്തെ AI കാർഷിക ഉപദേശം',
    todayAdviceTitle: 'ഇന്നത്തെ AI കാർഷിക ഉപദേശം',
    actionItem: 'ചെയ്യേണ്ട കാര്യം',
    actionItemLabel: 'ഉടൻ ചെയ്യേണ്ട കാര്യം:',
    askVoiceAssistant: 'ശബ്ദ സഹായിയോട് ചോദിക്കൂ',
    seeIrrigationSchedule: 'നനയ്ക്കൽ പട്ടിക കാണുക',
    sensorOverview: 'തോട്ടത്തിലെ സെൻസർ വിവരങ്ങൾ',
    farmSensorsOverview: 'തോട്ടത്തിലെ സെൻസറുകൾ',
    sampleSimulation: 'മാതൃകാ IoT സിമുലേഷൻ',
    connectedNodes: 'സജീവ ഫീൽഡ് സെൻസറുകൾ',

    // Sensor Cards
    soilMoisture: 'മണ്ണിലെ ഈർപ്പം',
    soilTemperature: 'മണ്ണിലെ താപനില',
    soilPh: 'മണ്ണിലെ pH നില',
    airTempHumidity: 'വായു താപനില & ആർദ്രത',
    nitrogen: 'നൈട്രജൻ (N)',
    phosphorus: 'ഫോസ്ഫറസ് (P)',
    potassium: 'പൊട്ടാസ്യം (K)',
    nitrogenN: 'നൈട്രജൻ (N)',
    phosphorusP: 'ഫോസ്ഫറസ് (P)',
    potassiumK: 'പൊട്ടാസ്യം (K)',
    rainProbability: 'മഴ സാധ്യത',
    adequate: 'തൃപ്തികരം',
    healthyRange: 'നല്ല അവസ്ഥ',
    neutralIdeal: 'ഉത്തമം (ന്യൂട്രൽ)',
    highHumidity: 'കൂടിയ ആർദ്രത',
    optimalVegetative: 'ഇല വളർച്ചയ്ക്ക് അനുയോജ്യം',
    needsBooster: 'മിതമായ അളവ് • കുറവ് നികത്തുക',
    highResistance: 'രോഗപ്രതിരോധ ശേഷി കൂടുതൽ',
    thunderstormsLikely: 'ഇടിമിന്നലോട് കൂടിയ മഴ സാധ്യത',
    tomorrow: 'നാളെ',
    sevenDayForecast: '7 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനം',
    weatherDetail: 'വിശദമായ കാലാവസ്ഥ',
    soilNutrientBalance: 'മണ്ണിലെ പോഷക സന്തുലനം (NPK)',
    testValuesVsBench: 'നിലവിലെ പരിശോധനാ ഫലവും ആവശ്യമായ ശുപാർശ അളവും',
    soilDiagnostics: 'മണ്ണ് പരിശോധനാ ഫലം',
    realtimeTelemetry: 'തത്സമയ സെൻസർ റീഡിംഗുകൾ',
    lastSync: 'തത്സമയ ഹാർഡ്‌വെയർ ഡാറ്റ • ഓരോ 5 സെക്കൻഡിലും പുതുക്കുന്നു',
    openIrrigationAdvisory: 'നനയ്ക്കൽ നിർദ്ദേശങ്ങൾ കാണുക',
    statusAdequate: 'തൃപ്തികരം',
    statusLow: 'കുറവ്',
    statusHigh: 'കൂടുതൽ',
    statusCritical: 'അപകടകരം',

    // Quick Action Cards
    farmStatusQuickActions: 'തോട്ടത്തിന്റെ അവസ്ഥ & ദ്രുത നടപടികൾ',
    diseaseRiskIndicator: 'രോഗ സാധ്യത റഡാർ',
    highDiseaseRisk: 'കുമിൾരോഗ സാധ്യത കൂടുതൽ',
    lowDiseaseRisk: 'രോഗ സാധ്യത കുറവാണ്',
    moderateDiseaseRisk: 'മിതമായ രോഗ സാധ്യത',
    viewDiseaseProtocols: 'പ്രതിരോധ മാർഗ്ഗങ്ങൾ കാണുക',
    marketPricesTitle: 'കേരള മാർക്കറ്റ് വിലകൾ',
    liveMandiRates: 'തത്സമയ വിപണി നിരക്കുകളും ട്രെൻഡുകളും',
    viewMarketAnalytics: 'വിപണി വിശകലനം കാണുക',
    waterSavedTitle: 'ഈ മാസം ലാഭിച്ച ജലം',
    waterSavedSubtitle: 'മഴയ്ക്ക് മുന്നോടിയായി നനയ്ക്കൽ ഒഴിവാക്കി ലാഭിച്ച കുടിവെള്ളവും വൈദ്യുതിയും',

    // Smart Irrigation View
    smartIrrigationTitle: 'സ്മാർട്ട് നനയ്ക്കൽ & ജല സംരക്ഷണം',
    smartIrrigationSubtitle: 'മണ്ണിലെ ഈർപ്പ സെൻസറുകൾ, വേരുകളുടെ ആഴം, 7 ദിവസത്തെ മഴ പ്രവചനം എന്നിവ കണക്കാക്കിയുള്ള AI നനയ്ക്കൽ പ്ലാൻ',
    irrigationStatusBanner: 'നനയ്ക്കൽ നില',
    delayIrrigationTitle: 'നനയ്ക്കൽ ഒഴിവാക്കുക: മഴ സാധ്യതയും മണ്ണിലെ ഈർപ്പവും തൃപ്തികരം',
    irrigationNeededTitle: 'നനയ്ക്കൽ ആവശ്യമാണ്: മണ്ണിലെ ഈർപ്പം കുറയുന്നു',
    waterPreserved: 'ഇന്ന് സംരക്ഷിച്ച ജലം',
    nextIrrigationWindow: 'അനുയോജ്യമായ സമയം',
    scheduleHeading: '7 ദിവസത്തെ കൃത്യതയാർന്ന നനയ്ക്കൽ പട്ടിക',
    dayCol: 'ദിവസം',
    forecastCol: 'കാലാവസ്ഥ',
    guidanceCol: 'മാർഗ്ഗനിർദ്ദേശം',
    waterAmountCol: 'നനയ്ക്കൽ അളവ്',
    sensorThresholds: 'മണ്ണിലെ ഈർപ്പ പരിധികൾ',
    permanentWiltingPoint: 'വാട്ട പരിധി (Wilting Point)',
    currentFieldMoisture: 'തോട്ടത്തിലെ നിലവിലെ ഈർപ്പം',
    fieldCapacity: 'ലക്ഷ്യ ഈർപ്പ നില (Field Capacity)',
    manualValveControl: 'IoT നനയ്ക്കൽ വാൽവ് നിയന്ത്രണം',
    valveOpen: 'വാൽവ് ഓൺ ആണ്',
    valveClosed: 'വാൽവ് ഓഫ് ആണ്',
    toggleValve: 'വാൽവ് പ്രവർത്തിപ്പിക്കുക',
    valveNotice: 'ശ്രദ്ധിക്കുക: IoT ഹാർഡ്‌വെയർ റിലേ ഘടിപ്പിച്ചിട്ടുണ്ടെങ്കിൽ മാത്രമേ വാൽവ് പ്രവർത്തിക്കൂ.',

    // Soil View
    soilViewTitle: 'മണ്ണ് പരിശോധനയും പോഷക വിശകലനവും',
    soilViewSubtitle: 'കേരള കാർഷിക സർവ്വകലാശാല (KAU) മാനദണ്ഡങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള രാസ, ഭൗതിക, ജൈവ മണ്ണ് പരിശോധന',
    enterSoilParams: 'മണ്ണ് പരിശോധനാ വിവരങ്ങൾ നൽകുക',
    runDiagnostic: 'AI മണ്ണ് പരിശോധന നടത്തുക',
    analyzingSoil: 'മണ്ണ് പരിശോധിക്കുന്നു...',
    overallSoilScore: 'മൊത്തം മണ്ണ് ആരോഗ്യ സ്കോർ',
    nutrientStatusHeading: 'പോഷകങ്ങളുടെ നില',
    deficienciesDetected: 'കണ്ടെത്തിയ കുറവുകളും പ്രശ്നങ്ങളും',
    actionPlan: 'ശുപാർശ ചെയ്യുന്ന കാർഷിക നടപടികൾ',
    fertilizerDosingPlan: 'വളപ്രയോഗ അളവ്',

    // Weather View
    weatherViewTitle: 'കാർഷിക കാലാവസ്ഥാ നിരീക്ഷണം',
    weatherViewSubtitle: 'ഐഎംഡി (IMD), കേരള ദുരന്ത നിവാരണ അതോറിറ്റി വിവരങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള മൈക്രോക്ലൈമറ്റ് അനലിറ്റിക്സ്',
    hourlyForecastTitle: '24 മണിക്കൂർ നേരത്തെ കാലാവസ്ഥാ പ്രവചനം',
    agrometInsights: 'കാർഷിക നിർദ്ദേശങ്ങൾ',
    sprayingAdvisory: 'മരുന്ന് തളിക്കൽ മാർഗ്ഗനിർദ്ദേശം',
    irrigationAdvisory: 'നനയ്ക്കൽ നിർദ്ദേശം',
    extremeWeatherRisk: 'കനത്ത മഴ & വെള്ളക്കെട്ട് സാധ്യത',
    monsoonAlert: 'മഴക്കാല മുന്നറിയിപ്പ്',

    // Crop Recommendation View
    cropRecTitle: 'AI വിള നിർദ്ദേശ സഹായി',
    cropRecSubtitle: 'നിങ്ങളുടെ കൃഷിയിടത്തിലെ മണ്ണ് pH, NPK, കാലാവസ്ഥ എന്നിവയ്ക്ക് ഏറ്റവും അനുയോജ്യമായ വിളകൾ കണ്ടെത്തുക',
    recommendCropsBtn: 'മികച്ച വിളകൾ ശുപാർശ ചെയ്യുക',
    topMatches: 'നിങ്ങളുടെ സ്ഥലത്തിന് ഏറ്റവും അനുയോജ്യമായ വിളകൾ',
    suitabilityScore: 'അനുയോജ്യത സ്കോർ',
    expectedYield: 'പ്രതീക്ഷിക്കുന്ന വിളവ്',
    maturityPeriod: 'വിളവെടുപ്പ് കാലയളവ്',
    marketDemand: 'മാർക്കറ്റ് ഡിമാൻഡ്',
    whySuitable: 'ഈ വിള അനുയോജ്യമാകാൻ കാരണം:',

    // Crop Feasibility View
    cropFeasTitle: 'വിള അനുയോജ്യതാ പരിശോധന',
    cropFeasSubtitle: 'നിങ്ങൾ ഉദ്ദേശിക്കുന്ന വിള നിങ്ങളുടെ കൃഷിയിടത്തിലെ മണ്ണിലും കാലാവസ്ഥയിലും വിജയിക്കുമോ എന്ന് പരിശോധിക്കുക',
    selectCropToTest: 'പരിശോധിക്കേണ്ട വിള തിരഞ്ഞെടുക്കുക',
    testFeasibilityBtn: 'അനുയോജ്യത വിലയിരുത്തുക',
    feasibilityVerdict: 'അനുയോജ്യതാ ഫലം',
    suitable: 'വളരെ അനുയോജ്യം',
    conditionallySuitable: 'വ്യവസ്ഥകൾക്ക് വിധേയമായി ചെയ്യാം',
    unsuitable: 'ശുപാർശ ചെയ്യുന്നില്ല',

    // Fertilizer View
    fertilizerTitle: 'കൃത്യതയാർന്ന വളപ്രയോഗവും NPK നിയന്ത്രണവും',
    fertilizerSubtitle: 'മണ്ണിലെ പോഷകങ്ങൾക്കനുസരിച്ച് ചെലവ് കുറച്ച് കൃത്യമായ അളവിൽ രാസ, ജൈവ വളങ്ങൾ നൽകുക',
    calculateFertilizer: 'ആവശ്യമായ വളത്തിന്റെ അളവ് കണക്കാക്കുക',
    organicAlternatives: 'ജൈവ വളങ്ങളും ബയോ ഫെർട്ടിലൈസറുകളും',
    chemicalSchedule: 'രാസവള പ്രയോഗ പട്ടിക',
    applicationTiming: 'വളം നൽകേണ്ട രീതിയും സമയവും',

    // Disease View
    diseaseTitle: 'രോഗ-കീട സാധ്യത റഡാർ',
    diseaseViewSubtitle: 'അന്തരീക്ഷത്തിലെ ആർദ്രതയും താപനിലയും അടിസ്ഥാനമാക്കി കുമിൾരോഗങ്ങളും കീടബാധകളും മുൻകൂട്ടി പ്രവചിക്കുന്നു',
    activeRisks: 'സജീവ രോഗ-കീട മുന്നറിയിപ്പുകൾ',
    symptomsToInspect: 'നിരീക്ഷിക്കേണ്ട പ്രാരംഭ ലക്ഷണങ്ങൾ',
    organicControl: 'ജൈവ കീടനിയന്ത്രണം / പ്രതിരോധം',
    chemicalControl: 'ശുപാർശ ചെയ്യുന്ന കുമിൾനാശിനി / മരുന്ന്',
    preventiveSteps: 'ഉടൻ ചെയ്യേണ്ട പ്രതിരോധ നടപടികൾ',

    // Crop Health View
    cropHealthTitle: 'വിളയുടെ ആരോഗ്യവും വളർച്ചാ നിലയും',
    cropHealthSubtitle: 'വിളയുടെ കരുത്ത്, ഇലകളുടെ ആരോഗ്യം, താപനില ആഘാതം എന്നിവ കണക്കാക്കിയുള്ള സമഗ്ര ആരോഗ്യ സ്കോർ',
    vitalityScore: 'വിളയുടെ സമഗ്ര ആരോഗ്യ സ്കോർ',
    growthStage: 'നിലവിലെ വളർച്ചാ ഘട്ടം',
    limitingFactors: 'വളർച്ചയെ തടസ്സപ്പെടുത്തുന്ന ഘടകങ്ങൾ',
    interventionChecklist: 'കർഷകർ ചെയ്യേണ്ട കാര്യങ്ങളുടെ പട്ടിക',

    // Market View
    marketTitle: 'വിപണി വിലയും ലാഭ വിശകലനവും',
    marketSubtitle: 'കേരളത്തിലെ പ്രധാന മാർക്കറ്റുകളിലെ വില വിവരങ്ങളും കൃത്യമായ വിളവെടുപ്പ് സാമ്പത്തിക വിശകലനവും',
    farmEconomics: 'കൃഷിയിട ലാഭ-സാമ്പത്തിക കാൽക്കുലേറ്റർ',
    areaAcre: 'കൃഷിസ്ഥലം (ഏക്കർ)',
    expectedYieldQtl: 'പ്രതീക്ഷിക്കുന്ന വിളവ് (ക്വിന്റൽ/ഏക്കർ)',
    costPerAcre: 'ഉത്പാദന ചെലവ് ഒരു ഏക്കറിന് (₹)',
    mandiPricePerQtl: 'പ്രതീക്ഷിക്കുന്ന വിപണി വില (₹/ക്വിന്റൽ)',
    calculateProfit: 'ലാഭവും നിക്ഷേപ നേട്ടവും കണക്കാക്കുക',
    estRevenue: 'പ്രതീക്ഷിക്കുന്ന മൊത്തം വരുമാനം',
    totalCost: 'മൊത്തം കൃഷി ചെലവ്',
    netProfit: 'പ്രതീക്ഷിക്കുന്ന അറ്റാദായം (ലാഭം)',
    roi: 'നിക്ഷേപ നേട്ടം (ROI)',
    breakEven: 'അടവുതുക / തുല്യതാ നിരക്ക് (Break-Even)',
    aiMarketStrategy: 'AI മാർക്കറ്റ് തന്ത്രവും വില്പന സമയവും',
    keralaMandiTable: 'കേരളത്തിലെ വിപണി നിരക്കുകൾ (APMC Mandi Prices)',

    // Notifications View
    notifCenterTitle: 'തോട്ട അറിയിപ്പുകളും മുന്നറിയിപ്പുകളും',
    notifCenterSubtitle: 'കാലാവസ്ഥ, രോഗസാധ്യത, സെൻസർ ബാറ്ററി, നനയ്ക്കൽ സമയം എന്നിവയെക്കുറിച്ചുള്ള തത്സമയ മുന്നറിയിപ്പുകൾ',
    allAlerts: 'എല്ലാ അറിയിപ്പുകളും',
    urgentAlerts: 'അടിയന്തിര അറിയിപ്പുകൾ മാത്രം',
    clearAll: 'എല്ലാ അറിയിപ്പുകളും നീക്കം ചെയ്യുക',
    emptyAlerts: 'പുതിയ അറിയിപ്പുകൾ ഒന്നുമില്ല. കൃഷിയിടം സുരക്ഷിതമാണ്.',

    // Settings View
    settingsTitle: 'ഫാം ക്രമീകരണങ്ങളും സെൻസർ പരിധികളും',
    settingsSubtitle: 'തോട്ടത്തിന്റെ വിവരങ്ങൾ, IoT സെൻസർ പരിധികൾ, ഭാഷ, അളവുകൾ എന്നിവ സജ്ജീകരിക്കുക',
    saveSettings: 'മാറ്റങ്ങൾ സൂക്ഷിക്കുക',
    farmProfile: 'കൃഷിയിട വിവരങ്ങൾ',
    farmName: 'തോട്ടത്തിന്റെ പേര്',
    currentCrop: 'നിലവിലെ പ്രധാന വിള',
    farmSize: 'കൃഷിസ്ഥലത്തിന്റെ വിസ്തൃതി (ഏക്കർ)',
    languagePref: 'ആശയവിനിമയ ഭാഷ',
    sensorThresholdsTitle: 'IoT സെൻസർ മുന്നറിയിപ്പ് പരിധികൾ',
    moistureMin: 'കുറഞ്ഞ ഈർപ്പ മുന്നറിയിപ്പ് (%)',
    moistureMax: 'കൂടിയ ഈർപ്പ മുന്നറിയിപ്പ് (%)',
    resetDefaults: 'KAU ശുപാർശ ചെയ്ത അളവുകളിലേക്ക് മാറ്റുക',

    // Assistant Chat
    assistantGreeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡാർത്തി AI അസിസ്റ്റന്റ്.',
    voiceCommandsHeading: 'ശബ്ദ കമാൻഡുകൾ',
    typeOrSpeak: 'മൈക്കിൽ സംസാരിക്കൂ അല്ലെങ്കിൽ ചോദ്യം ടൈപ്പ് ചെയ്യൂ...',
    send: 'അയക്കുക',
    resetChat: 'സംഭാഷണം പുനഃക്രമീകരിക്കുക',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.en;

// Helper to get translated string
export function t(key: TranslationKey, lang: Language = 'en'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || String(key);
}

// Crop Names Translation Map
export const CROP_TRANSLATIONS: Record<string, string> = {
  'Black Pepper': 'കുരുമുളക്',
  'Cardamom': 'ഏലക്ക',
  'Rubber': 'റബ്ബർ',
  'Coconut': 'തെങ്ങ്',
  'Arecanut': 'അടയ്ക്ക / പാക്ക്',
  'Banana': 'വാഴ (നേന്ത്രൻ / റോബസ്റ്റ)',
  'Ginger': 'ഇഞ്ചി',
  'Turmeric': 'മഞ്ഞൾ',
  'Nutmeg': 'ജാതിക്ക',
  'Coffee': 'കാപ്പി (റോബസ്റ്റ / അറബിക്ക)',
  'Tea': 'തേയില',
  'Paddy': 'നെല്ല്',
  'Rice': 'നെല്ല് / അരി',
  'Tapioca': 'കപ്പ (മരച്ചീനി)',
  'Cassava': 'കപ്പ (മരച്ചീനി)',
  'Cocoa': 'കൊക്കോ',
  'Vanilla': 'വാനില',
  'Pineapple': 'കൈതച്ചക്ക',
  'Vegetables': 'പച്ചക്കറികൾ',
  'Pepper': 'കുരുമുളക്',
};

export function translateCrop(cropName: string, lang: Language): string {
  if (lang !== 'ml') return cropName;
  for (const [en, ml] of Object.entries(CROP_TRANSLATIONS)) {
    if (cropName.toLowerCase().includes(en.toLowerCase())) {
      return ml;
    }
  }
  return cropName;
}

// District Malayalam Map
export const DISTRICT_ML: Record<string, string> = {
  Wayanad: 'വയനാട്',
  Idukki: 'ഇടുക്കി',
  Palakkad: 'പാലക്കാട്',
  Kottayam: 'കോട്ടയം',
  Alappuzha: 'ആലപ്പുഴ',
  Thrissur: 'തൃശ്ശൂർ',
  Ernakulam: 'എറണാകുളം',
  Kozhikode: 'കോഴിക്കോട്',
  Malappuram: 'മലപ്പുറം',
  Kannur: 'കണ്ണൂർ',
  Kasaragod: 'കാസർഗോഡ്',
  Kollam: 'കൊല്ലം',
  Pathanamthitta: 'പത്തനംതിട്ട',
  Thiruvananthapuram: 'തിരുവനന്തപുരം',
};

export function translateDistrict(districtName: string, lang: Language): string {
  if (lang !== 'ml') return districtName;
  return DISTRICT_ML[districtName] || districtName;
}

// Weather Conditions Translation Map
export const WEATHER_CONDITIONS_ML: Record<string, string> = {
  'Sunny': 'വെയിൽ നിറഞ്ഞത്',
  'Clear': 'തെളിഞ്ഞ ആകാശം',
  'Partly Cloudy': 'ഭാഗികമായി മേഘാവൃതം',
  'Cloudy': 'മേഘാവൃതം',
  'Overcast': 'കനത്ത മേഘം',
  'Light Rain': 'ചെറിയ മഴ',
  'Moderate Rain': 'മിതമായ മഴ',
  'Heavy Rain': 'കനത്ത മഴ',
  'Thunderstorms': 'ഇടിമിന്നലോടുകൂടിയ മഴ',
  'Showers': 'ഇടവിട്ട മഴ',
  'Humid': 'ഈർപ്പമുള്ള കാലാവസ്ഥ',
  'Scattered Showers': 'ചിതറിയ മഴ',
  'Thunderstorm': 'ഇടിമിന്നൽ മഴ',
};

export function translateWeather(cond: string, lang: Language): string {
  if (lang !== 'ml' || !cond) return cond;
  return WEATHER_CONDITIONS_ML[cond] || cond;
}

// Days of week
export const DAYS_ML: Record<string, string> = {
  Mon: 'തിങ്കൾ',
  Tue: 'ചൊവ്വ',
  Wed: 'ബുധൻ',
  Thu: 'വ്യാഴം',
  Fri: 'വെള്ളി',
  Sat: 'ശനി',
  Sun: 'ഞായർ',
  Monday: 'തിങ്കളാഴ്ച',
  Tuesday: 'ചൊവ്വാഴ്ച',
  Wednesday: 'ബുധനാഴ്ച',
  Thursday: 'വ്യാഴാഴ്ച',
  Friday: 'വെള്ളിയാഴ്ച',
  Saturday: 'ശനിയാഴ്ച',
  Sunday: 'ഞായറാഴ്ച',
  Today: 'ഇന്ന്',
  Tomorrow: 'നാളെ',
};

export function translateDay(dayStr: string, lang: Language): string {
  if (lang !== 'ml' || !dayStr) return dayStr;
  let translated = dayStr;
  for (const [en, ml] of Object.entries(DAYS_ML)) {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, 'g'), ml);
  }
  return translated;
}

// Translate system notifications to Malayalam
export function translateNotification(
  notif: { id?: string; title: string; message: string; timestamp?: string },
  lang: Language
): { title: string; message: string; timestamp: string } {
  const ts = notif.timestamp || '';
  if (lang !== 'ml') return { title: notif.title, message: notif.message, timestamp: ts };

  switch (notif.id) {
    case 'notif-1':
      return {
        title: 'കേരള GKMS കാർഷിക അലേർട്ട്: നാളെ കനത്ത മഴ സാധ്യത',
        message:
          '75-85% മഴയ്ക്ക് സാധ്യതയുണ്ടെന്ന് പ്രാദേശിക കാലാവസ്ഥാ കേന്ദ്രം പ്രവചിക്കുന്നു. ഇലകളിൽ തളിക്കുന്ന മരുന്നുകൾ മാറ്റിവെക്കുക, ചാലുകളിലെ തടസ്സങ്ങൾ നീക്കുക.',
        timestamp: '15 മിനിറ്റ് മുൻപ്',
      };
    case 'notif-2':
      return {
        title: 'ദ്രുതവാട്ടം & അഴുകൽ രോഗ നിരീക്ഷണം',
        message:
          'കൂടിയ ഈർപ്പവും (>80%) തണുത്ത ഇലകളും കുരുമുളകിൽ ദ്രുതവാട്ടത്തിനും കുമിൾ രോഗങ്ങൾക്കും കാരണമാകാം.',
        timestamp: '1 മണിക്കൂർ മുൻപ്',
      };
    case 'notif-3':
      return {
        title: 'സ്മാർട്ട് ഈർപ്പ സന്തുലിതാവസ്ഥ: നന മാറ്റിവെക്കുക',
        message:
          'മണ്ണിലെ ഈർപ്പം 48% ഉണ്ട്, മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ വേരുകൾക്ക് ആവശ്യമായ വെള്ളം സ്വാഭാവികമായി ലഭിക്കും.',
        timestamp: '2 മണിക്കൂർ മുൻപ്',
      };
    case 'notif-4':
      return {
        title: 'KAU സോയിൽ ഹെൽത്ത് കാർഡ്: അമ്ലതയും ഫോസ്ഫറസ് ലഭ്യതയും',
        message:
          'അമ്ലഗുണമുള്ള മണ്ണ് (pH 5.4) ഫോസ്ഫറസ് ലഭ്യത കുറയ്ക്കും. ഏക്കറിന് 250 കി.ഗ്രാം ഡോളോമൈറ്റും കമ്പോസ്റ്റും ചേർക്കുക.',
        timestamp: 'ഇന്നലെ',
      };
    case 'notif-5':
      return {
        title: 'കേരള ചന്തവില കുതിപ്പ്: കുരുമുളകിനും ഏലത്തിനും ഉയർന്ന വില',
        message:
          'സുൽത്താൻ ബത്തേരിയിൽ MG-1 കുരുമുളക് വില ക്വിന്റലിന് ₹67,200 ആയി ഉയർന്നു (+3.4%). കയറ്റുമതി ആവശ്യക്കാർ വർദ്ധിച്ചു.',
        timestamp: 'ഇന്നലെ',
      };
    default: {
      // General fallback if alert starts with GKMS
      if (notif.title.includes('GKMS')) {
        return {
          title: `GKMS കാലാവസ്ഥാ മുന്നറിയിപ്പ്`,
          message: notif.message,
          timestamp: ts,
        };
      }
      return { title: notif.title, message: notif.message, timestamp: ts };
    }
  }
}
