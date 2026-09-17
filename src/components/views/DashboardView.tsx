import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  t,
  translateCrop,
  translateDistrict,
  translateWeather,
  translateDay,
} from '../../translations';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Wind,
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Activity,
  Layers,
  HeartPulse,
  MapPin,
  Trees,
  Sprout,
  Bot,
  Mic,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    farmData,
    sensors,
    todayAdvice,
    refreshTodayAdvice,
    isRefreshingAdvice,
    setActiveTab,
    demoMode,
    weatherForecast,
    districtInfo,
    setIsLocationModalOpen,
    isLocationLoading,
    refreshLiveWeather,
    setIsChatOpen,
    preferredLanguage,
  } = useFarm();

  const isMl = preferredLanguage === 'ml';

  const npkChartData = [
    { name: isMl ? 'നൈട്രജൻ (N)' : 'Nitrogen (N)', current: farmData.nitrogen, benchmark: 70, unit: 'mg/kg' },
    { name: isMl ? 'ഫോസ്ഫറസ് (P)' : 'Phosphorus (P)', current: farmData.phosphorus, benchmark: 50, unit: 'mg/kg' },
    { name: isMl ? 'പൊട്ടാസ്യം (K)' : 'Potassium (K)', current: farmData.potassium, benchmark: 60, unit: 'mg/kg' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Farm Context Banner with Kerala Location Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit']">
              {t('dashboardTitle', preferredLanguage)}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {isMl && farmData.malayalamDistrict ? farmData.malayalamDistrict : farmData.district}
            </span>
            {demoMode && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                {isMl ? 'മാതൃകാ ടെലിമെട്രി ഡാറ്റ' : 'Sample / Demo Telemetry'}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl ? (
              <>
                <span className="font-semibold text-emerald-950">{farmData.farmSize} ഏക്കർ</span> വിസ്തൃതിയിലുള്ള{' '}
                <span className="font-semibold text-emerald-950">{translateCrop(farmData.currentCrop, preferredLanguage)}</span> കൃഷി{' '}
                (<span className="font-semibold text-emerald-950">{farmData.malayalamDistrict || farmData.location}</span>) തത്സമയം നിരീക്ഷിക്കുന്നു.
              </>
            ) : (
              <>
                Monitoring <span className="font-semibold text-emerald-950">{farmData.farmSize} acres</span> of{' '}
                <span className="font-semibold text-emerald-950">{farmData.currentCrop}</span> at{' '}
                <span className="font-semibold text-emerald-950">{farmData.location}</span>.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-emerald-800">
            <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🌱 {isMl ? 'മേഖല:' : 'Agro-Zone:'} {districtInfo?.agroZone || farmData.agroZone}
            </span>
            <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🧪 {isMl ? 'മണ്ണ്:' : 'Soil:'} {farmData.soilType} (KAU pH {farmData.soilPh})
            </span>
            <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🏔️ {isMl ? 'സമുദ്രനിരപ്പ്:' : 'Elevation:'} {farmData.elevationMeters}m MSL
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            disabled={isLocationLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <MapPin className={`w-3.5 h-3.5 ${isLocationLoading ? 'animate-spin' : ''}`} />
            <span>{t('changeLocation', preferredLanguage)}</span>
          </button>

          <button
            onClick={() => refreshTodayAdvice()}
            disabled={isRefreshingAdvice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isRefreshingAdvice ? 'animate-spin' : ''}`} />
            <span>
              {isRefreshingAdvice
                ? (isMl ? 'വിശകലനം ചെയ്യുന്നു...' : 'Reasoning...')
                : (isMl ? 'AI ഉപദേശം പുതുക്കുക' : 'Refresh AI Advice')}
            </span>
          </button>
        </div>
      </div>

      {/* Prominent Section: Today's AI Farming Advice */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-emerald-950 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {t('todayAdviceTitle', preferredLanguage)}
              </span>
              <span className="text-[11px] text-emerald-200/90 hidden sm:inline">
                {isMl ? 'ജെമിനി ലൈവ് കാർഷിക ബുദ്ധി നൽകുന്നത്' : 'Powered by Gemini Live Ag Reasoning'}
              </span>
            </div>
            {todayAdvice && todayAdvice.waterSavedEstimateLiters > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-700/60 border border-emerald-500/40 text-emerald-100">
                💧 {isMl ? 'ലാഭിക്കാവുന്ന ജലം:' : 'Estimated Water Saved:'} {todayAdvice.waterSavedEstimateLiters.toLocaleString()} {isMl ? 'ലിറ്റർ' : 'Liters'}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
            {todayAdvice?.headline || (isMl ? 'മഴ സാധ്യത: ഇന്ന് നനയ്ക്കൽ ഒഴിവാക്കുക' : 'Rain Imminent: Hold Off Irrigation Today')}
          </h2>

          <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-3xl mb-4">
            {todayAdvice?.advice || (isMl
              ? `മഴ പെയ്യാൻ ${farmData.rainfallProbability}% സാധ്യതയുണ്ട്. മണ്ണിലെ ഈർപ്പം ${farmData.soilMoisture}% നിലയിലായതിനാൽ ഇന്ന് നനച്ചാൽ വേരുകൾ ചീയാനും വൈദ്യുതി നഷ്ടപ്പെടാനും സാധ്യതയുണ്ട്.`
              : `Rainfall probability is ${farmData.rainfallProbability}%. With soil moisture already at ${farmData.soilMoisture}%, irrigation today will cause waterlogging and waste valuable electricity. Save water for post-rain assessment.`)}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-700/60 text-xs">
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-600/30">
              <span className="font-bold text-amber-300">{t('actionItem', preferredLanguage)}:</span>
              <span className="text-emerald-100">
                {todayAdvice?.actionItem || (isMl ? 'വാട്ടർ പമ്പ് ഓഫ് ചെയ്യുകയും ചാലുകൾ വൃത്തിയാക്കുകയും ചെയ്യുക' : 'Turn off water pump and clean field discharge ditches')}
              </span>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/25 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>
                {isMl
                  ? 'ശബ്ദ സഹായിയോട് ചോദിക്കൂ'
                  : 'Ask Voice Assistant'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('irrigation')}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              {isMl ? 'നനയ്ക്കൽ കലണ്ടർ കാണുക' : 'See Irrigation Schedule'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Farm Overview Cards (Realistic sample sensor data) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            {t('farmSensorsOverview', preferredLanguage)}
          </h2>
          <span className="text-xs text-gray-500">
            {isMl
              ? (demoMode ? 'മാതൃകാ ഐഒടി സിമുലേഷൻ' : 'കണക്റ്റ് ചെയ്ത സെൻസറുകൾ')
              : (demoMode ? 'Sample IoT Simulation' : 'Connected Field Nodes')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Soil Moisture */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('soilMoisture', preferredLanguage)}</span>
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.soilMoisture}%</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">{isMl ? 'പര്യാപ്തം' : 'Adequate'}</span>
              <span className="text-gray-600 font-medium">{isMl ? 'അനുയോജ്യം: 40-60%' : 'Opt: 40-60%'}</span>
            </div>
          </div>

          {/* Soil Temperature */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('soilTemperature', preferredLanguage)}</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.soilTemperature}°C</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">{isMl ? 'ആരോഗ്യകരം' : 'Healthy Range'}</span>
              <span className="text-gray-600 font-medium">{isMl ? 'അനുയോജ്യം: 20-30°C' : 'Opt: 20-30°C'}</span>
            </div>
          </div>

          {/* Soil pH */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('soilPh', preferredLanguage)}</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.soilPh}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">{isMl ? 'ന്യൂട്രൽ / അനുയോജ്യം' : 'Neutral / Ideal'}</span>
              <span className="text-gray-600 font-medium">{isMl ? 'അനുയോജ്യം: 6.0-7.2' : 'Opt: 6.0-7.2'}</span>
            </div>
          </div>

          {/* Air Temp & Humidity */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('airTempHumidity', preferredLanguage)}</span>
              <Wind className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.airTemperature}°C</span>
              <span className="text-xs font-semibold text-gray-500">| {farmData.humidity}% RH</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-amber-600 font-semibold">{isMl ? 'ഉയർന്ന ആർദ്രത' : 'High Humidity'}</span>
              <span className="text-gray-600 font-medium">
                {isMl ? `കാറ്റ്: ${farmData.windSpeed} കി.മീ/മണിക്കൂർ` : `Wind: ${farmData.windSpeed} km/h`}
              </span>
            </div>
          </div>

          {/* NPK Nitrogen */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('nitrogen', preferredLanguage)}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.nitrogen}</span>
              <span className="text-xs text-gray-500">{isMl ? 'മില്ലിഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
              {isMl ? 'മികച്ച സസ്യവളർച്ച' : 'Optimal Vegetative Vigor'}
            </div>
          </div>

          {/* NPK Phosphorus */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('phosphorus', preferredLanguage)}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.phosphorus}</span>
              <span className="text-xs text-gray-500">{isMl ? 'മില്ലിഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-600 font-semibold">
              {isMl ? 'മിതമായ അളവ് • വർദ്ധിപ്പിക്കണം' : 'Moderate • Needs Booster'}
            </div>
          </div>

          {/* NPK Potassium */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">{t('potassium', preferredLanguage)}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{farmData.potassium}</span>
              <span className="text-xs text-gray-500">{isMl ? 'മില്ലിഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
              {isMl ? 'ഉയർന്ന കീടപ്രതിരോധം' : 'High Pest Resistance'}
            </div>
          </div>

          {/* Rainfall Probability */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs bg-gradient-to-br from-blue-50/50 to-white">
            <div className="flex items-center justify-between text-xs text-blue-900 mb-1">
              <span className="font-medium">{t('rainChance', preferredLanguage)}</span>
              <CloudRain className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-900">{farmData.rainfallProbability}%</span>
              <span className="text-xs text-blue-700 font-medium">{isMl ? 'നാളെ' : 'Tomorrow'}</span>
            </div>
            <div className="mt-2 text-[11px] text-blue-800 font-semibold">
              {isMl ? 'ഇടിമിന്നലോടു കൂടിയ മഴ സാധ്യത' : 'Thunderstorms Likely'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 7-Day Weather & Soil Health Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-day Weather Overview */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-emerald-600" />
                    {t('sevenDayForecast', preferredLanguage)}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {farmData.weatherSource || 'IMD / Agromet Model'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {isMl ? `${farmData.location} തത്സമയ കാലാവസ്ഥാ പ്രവചനം` : `Microclimate forecast for ${farmData.location}`}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isMl ? 'കാലാവസ്ഥ വിശദാംശങ്ങൾ' : 'Weather Detail'} <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {weatherForecast.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-center border transition-all ${
                    idx === 0
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : idx === 1
                      ? 'bg-blue-50/80 border-blue-200 shadow-xs'
                      : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-800">
                    {translateDay(day.day, preferredLanguage)}
                  </p>
                  <p className="text-[10px] text-gray-500 mb-2">{day.date}</p>

                  <div className="text-xs font-extrabold text-gray-900">
                    {day.tempMax}° / {day.tempMin}°
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-blue-600 font-semibold">
                    <Droplets className="w-3 h-3" />
                    <span>{day.rainProb}%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    {translateWeather(day.condition, preferredLanguage)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Kerala GKMS District Agromet Alert */}
          {districtInfo?.gkmsAdvisory && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {isMl
                    ? `GKMS കാർഷിക ഉപദേശം (${districtInfo.malayalamName || districtInfo.name}):`
                    : `GKMS Advisory (${districtInfo.name}):`}
                </span>{' '}
                {districtInfo.gkmsAdvisory.agrometAdvice}{' '}
                <span className="font-semibold text-amber-950">({districtInfo.gkmsAdvisory.pestDiseaseWarning})</span>
              </div>
            </div>
          )}
        </div>

        {/* Soil NPK & Health Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  {t('soilNutrientBalance', preferredLanguage)}
                </h2>
                <p className="text-xs text-gray-500">
                  {isMl
                    ? 'നിലവിലെ പരിശോധനാ മൂല്യവും ശുപാർശ ചെയ്ത അളവും'
                    : 'Current test values vs recommended crop benchmarks'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('soil')}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isMl ? 'മണ്ണ് പരിശോധിക്കുക' : 'Analyze Soil'} <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npkChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} mg/kg`, '']}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="current"
                    name={isMl ? 'നിലവിലെ അളവ്' : 'Current Value'}
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="benchmark"
                    name={isMl ? 'ആവശ്യമായ അളവ്' : 'Optimal Need'}
                    fill="#93c5fd"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 text-emerald-900">
            <span className="font-semibold">
              {isMl ? 'മണ്ണിന്റെ ആരോഗ്യ സൂചിക: 82/100' : 'Soil Health Index: 82/100'}
            </span>
            <span className="text-emerald-700">
              {isMl ? 'ഫോസ്ഫറസ് വർദ്ധിപ്പിക്കാൻ ശുപാർശ' : 'Phosphorus booster recommended'}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-Cards: Crop Health, Smart Irrigation, Disease Risk, Market Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Crop Health Widget */}
        <div
          onClick={() => setActiveTab('health')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('cropHealth', preferredLanguage)}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-900">84%</span>
            <span className="text-xs font-semibold text-emerald-700">
              {isMl ? 'മികച്ച ആരോഗ്യം' : 'Good Health'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {isMl
              ? 'ഇലകളുടെ വളർച്ച മികച്ചതാണ്. സമ്മർദ്ദ ലക്ഷണങ്ങളൊന്നുമില്ല.'
              : 'Canopy vegetative vigor is strong. Internodal spacing is balanced without stress signs.'}
          </p>
          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>{isMl ? 'ട്രെൻഡ് ഗ്രാഫുകൾ' : 'View Trend Graphs'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Irrigation Recommendation Widget */}
        <div
          onClick={() => setActiveTab('irrigation')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('smartIrrigation', preferredLanguage)}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-amber-600">
              {isMl ? 'നനയ്ക്കൽ നീട്ടിവെയ്ക്കുക' : 'Delay Watering'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {isMl
              ? 'മണ്ണിലെ ഈർപ്പം 42% ആണ്, 24 മണിക്കൂറിനുള്ളിൽ മഴ പ്രതീക്ഷിക്കുന്നു.'
              : 'Moisture is at 42% and rain is expected within 24h. Save water and electricity.'}
          </p>
          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
            <span>{isMl ? 'നനയ്ക്കൽ ഷെഡ്യൂൾ' : 'Irrigation Schedule'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Disease Risk Widget */}
        <div
          onClick={() => setActiveTab('disease')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('diseaseRisk', preferredLanguage)}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-amber-700">
              {isMl ? 'മിതമായ സാധ്യത' : 'Moderate Risk'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {isMl
              ? '74% ആർദ്രത ഇലപ്പുള്ളി രോഗത്തിന് കാരണമായേക്കാം. ഇലകൾ പരിശോധിക്കുക.'
              : '74% relative humidity creates conditions for early blight. Inspect lower leaf collars.'}
          </p>
          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>{isMl ? 'പ്രതിരോധ നിർദ്ദേശങ്ങൾ' : 'Check Prevention Tips'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Market & Profit Widget */}
        <div
          onClick={() => setActiveTab('market')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('marketAnalysis', preferredLanguage)}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">₹2,400</span>
            <span className="text-xs font-semibold text-emerald-700">
              {isMl ? '+4.8% മാർക്കറ്റ്' : '+4.8% Mandi'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {isMl
              ? `${translateCrop(farmData.currentCrop, preferredLanguage)} വില വിപണിയിൽ ഉയരുന്നു. കണക്കാക്കിയ ലാഭം: ₹86,800.`
              : 'Tomato prices surging at Pimpalgaon. Est. net profit: ₹86,800 on 3.5 acres.'}
          </p>
          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-teal-800 font-semibold">
            <span>{isMl ? 'ലാഭ കാൽക്കുലേറ്റർ' : 'Profit Calculator'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
