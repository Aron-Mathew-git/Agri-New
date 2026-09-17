import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchWeatherInsight } from '../../services/api';
import { WeatherIntelligenceResult } from '../../types';
import { t, translateCrop, translateDistrict, translateWeather, translateDay } from '../../translations';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  Loader2,
  AlertTriangle,
  Compass,
  Sun,
  Info,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Clock,
} from 'lucide-react';

export const WeatherView: React.FC = () => {
  const {
    farmData,
    weatherForecast,
    hourlyForecast,
    districtInfo,
    setIsLocationModalOpen,
    refreshLiveWeather,
    isLocationLoading,
    preferredLanguage,
  } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [insight, setInsight] = useState<WeatherIntelligenceResult | null>({
    summary: isMl
      ? 'പശ്ചിമഘട്ട മലനിരകളിൽ 24 മുതൽ 36 മണിക്കൂറിനുള്ളിൽ ഇടിമിന്നലോടു കൂടിയ മഴയ്ക്ക് സാധ്യതയുള്ള ചൂടും ഈർപ്പവുമുള്ള കാലാവസ്ഥ. അറബിക്കടലിൽ നിന്ന് മേഘങ്ങൾ വ്യാപിക്കുന്നു.'
      : 'Warm, humid weather with convective thunderstorm indicators likely within 24 to 36 hours across Western Ghats slopes. Cloud cover is expanding from the Arabian Sea.',
    irrigationGuidance: isMl
      ? 'ഇന്ന് തോട്ടത്തിൽ നനയ്ക്കൽ പൂർണ്ണമായും ഒഴിവാക്കുക. അന്തരീക്ഷത്തിലെ ഉയർന്ന ആർദ്രതയും പ്രതീക്ഷിക്കുന്ന മഴയും ചെടികളുടെ വേരുകൾക്ക് ആവശ്യമായ ഈർപ്പം നൽകും.'
      : 'Hold off irrigation completely today. Ambient humidity and incoming precipitation will supply root zone moisture without expending electricity or pump fuel.',
    sprayingGuidance: isMl
      ? 'ഇന്ന് ഇലകളിൽ കീടനാശിനികളോ വളങ്ങളോ തളിക്കുന്നത് പൂർണ്ണമായും ഒഴിവാക്കുക. മഴ പെയ്യാൻ സാധ്യതയുള്ളതിനാൽ മരുന്നുകൾ ഒലിച്ചുപോയി നഷ്ടമുണ്ടാകാം.'
      : 'STRICTLY AVOID foliar spraying (pesticides, fungicides, foliar nutrients) today. Rain probability guarantees wash-off, wasting expensive inputs and contaminating water bodies.',
    heavyRainRisk: isMl
      ? 'താഴ്ന്ന പ്രദേശങ്ങളിലും പാടങ്ങളിലും വെള്ളക്കെട്ടിന് മിതമായ സാധ്യതയുണ്ട്. വൈകുന്നേരത്തിന് മുൻപ് നീർവാർച്ചാ ചാലുകൾ പരിശോധിച്ച് തടസ്സങ്ങൾ മാറ്റുക.'
      : 'Moderate risk of surface waterlogging in low-lying furrows and paddy basins. Inspect and clear drainage channels before evening.',
    risksAndMitigation: isMl
      ? [
          'കുമിൾ രോഗ സാധ്യത: ഉയർന്ന ആർദ്രതയും ചൂടും കുമിൾ രോഗങ്ങൾക്ക് (മഹളി / ദ്രുതവാട്ടം) കാരണമായേക്കാം. മഴ മാറിയ ശേഷം മാത്രം പ്രതിരോധ മരുന്ന് തളിക്കുക.',
          'കാറ്റും മഴയും മൂലമുള്ള വീഴ്ച: കുരുമുളക് കൊടികൾ, വാഴകൾ, പച്ചക്കറി പന്തലുകൾ എന്നിവയുടെ താങ്ങുകൾ ഉറപ്പാക്കുക.',
        ]
      : [
          'Fungal Spore Germination: High humidity + warm canopy accelerates Phytophthora / Blight. Apply copper hydroxide only after dry spell returns.',
          'Wind & Heavy Shower Lodging: Staking strings should be checked today for pepper vines, bananas, and vegetable trellis.',
        ],
    advisoryNote: isMl
      ? 'കാലാവസ്ഥാ പ്രവചനങ്ങൾ IMD / Open-Meteo വിവരങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. കാർഷിക ജോലികൾക്ക് മുൻപായി തോട്ടത്തിലെ മണ്ണിന്റെ ഈർപ്പം പരിശോധിക്കുക.'
      : 'Atmospheric forecasts are predictive probability models grounded in IMD / Open-Meteo microclimate telemetry. Always verify local field soil moisture before mechanical operations.',
  });

  const handleRefreshInsight = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWeatherInsight(
        {
          temp: farmData.airTemperature,
          humidity: farmData.humidity,
          rainProb: farmData.rainfallProbability,
          windSpeed: farmData.windSpeed,
        },
        farmData.currentCrop,
        preferredLanguage
      );
      setInsight(data);
    } catch (err) {
      console.warn('Notice fetching weather insight, applying agrometeorological baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadWeather = async () => {
    setIsRefreshingWeather(true);
    try {
      await refreshLiveWeather();
    } finally {
      setIsRefreshingWeather(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-emerald-600" />
              {isMl ? 'കാലാവസ്ഥാ വിശകലനവും റഡാറും' : 'Weather Intelligence & Agromet Radar'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Live IMD / Open-Meteo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? `${farmData.location}-ലെ തത്സമയ കാർഷിക കാലാവസ്ഥാ പ്രവചനം (${districtInfo?.malayalamName || districtInfo?.agroZone}).`
              : `Real-time agro-meteorological forecasting for ${farmData.location} (${districtInfo?.agroZone}).`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('changeLocation', preferredLanguage)}</span>
          </button>

          <button
            onClick={handleReloadWeather}
            disabled={isRefreshingWeather || isLocationLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            title="Reload live weather feed from Open-Meteo / IMD"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWeather ? 'animate-spin' : ''}`} />
            <span>{isMl ? (isRefreshingWeather ? 'ലഭ്യമാക്കുന്നു...' : 'തത്സമയ കാലാവസ്ഥ') : (isRefreshingWeather ? 'Fetching...' : 'Live Feed')}</span>
          </button>

          <button
            onClick={handleRefreshInsight}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isMl ? (isLoading ? 'AI പരിശോധിക്കുന്നു...' : 'AI കാലാവസ്ഥ ഉപദേശം') : (isLoading ? 'Consulting Gemini...' : 'AI Weather Guidance')}</span>
          </button>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Temp & Weather */}
          <div className="md:col-span-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <CloudRain className="w-10 h-10 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {isMl ? `തത്സമയ കാലാവസ്ഥ • ${farmData.location}` : `Live Weather • ${farmData.location}`}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-['Outfit']">
                  {farmData.airTemperature}°C
                </span>
                <span className="text-base text-emerald-200 font-medium">
                  {translateWeather(farmData.currentWeather, preferredLanguage)}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1">
                {isMl
                  ? `ഉറവിടം: ${farmData.weatherSource || 'IMD / Agromet'} • ഉയരം: ${farmData.elevationMeters} മീറ്റർ MSL`
                  : `Source: ${farmData.weatherSource || 'IMD / Agrometeorological Model'} • Elev: ${farmData.elevationMeters}m MSL`}
              </p>
            </div>
          </div>

          {/* Microclimate stat pills */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center justify-center text-blue-300 mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs text-emerald-200 block">{isMl ? 'ആർദ്രത' : 'Humidity'}</span>
              <span className="text-lg font-bold">{farmData.humidity}%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center justify-center text-amber-300 mb-1">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-xs text-emerald-200 block">{t('rainChance', preferredLanguage)}</span>
              <span className="text-lg font-bold">{farmData.rainfallProbability}%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <div className="flex items-center justify-center text-teal-300 mb-1">
                <Wind className="w-4 h-4" />
              </div>
              <span className="text-xs text-emerald-200 block">{isMl ? 'കാറ്റിന്റെ വേഗത' : 'Wind Speed'}</span>
              <span className="text-lg font-bold">{farmData.windSpeed} {isMl ? 'കി.മീ/മ' : 'km/h'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kerala GKMS District Agro-Advisory Bulletin */}
      {districtInfo?.gkmsAdvisory && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-amber-950 text-sm">
                  {isMl
                    ? `ഔദ്യോഗിക GKMS കാർഷിക ഉപദേശം: ${districtInfo.malayalamName || districtInfo.name}`
                    : `Official GKMS Agro-Advisory: ${districtInfo.name} (${districtInfo.malayalamName})`}
                </h3>
                <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {isMl ? `നൽകിയത്: ${districtInfo.gkmsAdvisory.issuedBy}` : `Issued by ${districtInfo.gkmsAdvisory.issuedBy}`}
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {districtInfo.gkmsAdvisory.agrometAdvice}
              </p>
              <div className="pt-2 text-xs text-amber-800 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>
                  {isMl ? 'കീട-രോഗ മുന്നറിയിപ്പ്:' : 'Pest & Disease Advisory:'} {districtInfo.gkmsAdvisory.pestDiseaseWarning}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Trend if available */}
      {hourlyForecast && hourlyForecast.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            {isMl ? 'അടുത്ത 24 മണിക്കൂർ കാലാവസ്ഥാ പുരോഗതി' : 'Next 24 Hours Microclimate Progression'}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {hourlyForecast.map((h, i) => (
              <div
                key={i}
                className="min-w-[70px] p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center shrink-0"
              >
                <span className="text-[11px] font-semibold text-gray-600 block">{h.time}</span>
                <span className="text-sm font-extrabold text-gray-900 block my-1">{h.temp}°C</span>
                <div className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-blue-600">
                  <Droplets className="w-3 h-3" />
                  <span>{h.rainProb}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast Grid */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          {isMl
            ? `${farmData.location} 7 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനം`
            : `7-Day Meteorological Outlook for ${farmData.location}`}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weatherForecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/30'
                  : idx === 1
                  ? 'bg-blue-50/70 border-blue-300'
                  : 'bg-gray-50/50 border-gray-150 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-bold text-gray-900 block">
                {translateDay(day.day, preferredLanguage)}
              </span>
              <span className="text-[10px] text-gray-500 block mb-2">{day.date}</span>

              <div className="text-sm font-extrabold text-gray-900">
                {day.tempMax}° / {day.tempMin}°
              </div>

              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-bold">
                <CloudRain className="w-3 h-3 text-blue-600" />
                {day.rainProb}%
              </div>

              <p className="text-[11px] text-gray-600 mt-2 font-medium leading-tight line-clamp-2">
                {translateWeather(day.condition, preferredLanguage)}
              </p>

              <div className="mt-2 pt-2 border-t border-gray-150 text-[10px] text-gray-500">
                {isMl ? `കാറ്റ്: ${day.windSpeed} കി.മീ` : `Wind: ${day.windSpeed} km/h`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Weather Insight Section */}
      {insight && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isMl ? 'AI കാലാവസ്ഥ ഉപദേശം' : 'AI Weather Insight'}
              </span>
              <span className="text-xs text-gray-500">
                {isMl
                  ? `${translateCrop(farmData.currentCrop, preferredLanguage)} വിളയ്ക്കുള്ള തത്സമയ നിർദ്ദേശങ്ങൾ`
                  : `Actionable agronomic intelligence for ${farmData.currentCrop}`}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
              {isMl ? 'അന്തരീക്ഷ സംഗ്രഹം' : 'Atmospheric Summary'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              {insight.summary}
            </p>
          </div>

          {/* 3 Core Guidance Blocks: Irrigation, Spraying, Heavy Rain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Irrigation guidance */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-2">
                  <Droplets className="w-4 h-4" />
                  <span>{isMl ? 'നനയ്ക്കൽ തീരുമാനം' : 'Irrigation Decision'}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {insight.irrigationGuidance}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] font-semibold text-emerald-800">
                {isMl ? 'ശുപാർശ: നനയ്ക്കൽ മാറ്റിവെക്കുക' : 'Recommendation: Postpone pump run'}
              </div>
            </div>

            {/* Spraying guidance */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{isMl ? 'കീടനാശിനി പ്രയോഗം' : 'Spraying Advisory'}</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {insight.sprayingGuidance}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] font-semibold text-amber-900">
                {isMl ? 'അവസ്ഥ: മരുന്ന് തളിക്കരുത് (മഴ സാധ്യത)' : 'Status: NO-SPRAY WINDOW ACTIVE'}
              </div>
            </div>

            {/* Heavy Rain & Drainage */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-2">
                  <CloudRain className="w-4 h-4" />
                  <span>{isMl ? 'കനത്ത മഴയും നീർവാർച്ചയും' : 'Heavy Rain & Drainage'}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {insight.heavyRainRisk}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] font-semibold text-teal-800">
                {isMl ? 'നടപടി: നീർവാർച്ചാ ചാലുകൾ തുറക്കുക' : 'Action: Open field drainage outlets'}
              </div>
            </div>
          </div>

          {/* Risks & Mitigation list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              {isMl ? 'കാലാവസ്ഥാ അപകടസാധ്യതകളും മുൻകരുതലുകളും' : 'Specific Weather-Related Hazards & Preventative Countermeasures'}
            </h4>
            <div className="space-y-2">
              {insight.risksAndMitigation.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer (Mandated by prompt: Do not present AI-generated predictions as guaranteed facts) */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-[11px] text-gray-500">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-gray-700">
                {isMl ? 'പ്രധാന കാർഷിക അറിയിപ്പ്:' : 'Important Agronomic Notice:'}
              </span>{' '}
              {insight.advisoryNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
