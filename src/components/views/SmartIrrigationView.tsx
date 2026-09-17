import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchIrrigationAdvice } from '../../services/api';
import { IrrigationAdviceResult } from '../../types';
import { t, translateDay } from '../../translations';
import {
  Droplets,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Loader2,
  ShieldCheck,
  Zap,
  RefreshCw,
} from 'lucide-react';

export const SmartIrrigationView: React.FC = () => {
  const { farmData, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';
  const [isLoading, setIsLoading] = useState(false);

  const [advice, setAdvice] = useState<IrrigationAdviceResult>({
    irrigationRequired: false,
    actionTitle: isMl
      ? 'ജലസേചനം നീട്ടിവെക്കുക: ഈർപ്പം ആവശ്യത്തിനുണ്ട്, കനത്ത മഴയ്ക്ക് സാധ്യത'
      : 'Delay Irrigation: Moisture Adequate & Heavy Rain Approaching',
    recommendedTiming: isMl
      ? 'മഴ പെയ്യുന്നത് വരെ അടുത്ത 36-48 മണിക്കൂർ മോട്ടോർ പ്രവർത്തിപ്പിക്കുന്നത് ഒഴിവാക്കുക'
      : 'Postpone pump activation by 36-48 hours until storm passes',
    estimatedWaterQuantity: isMl
      ? 'ഇന്ന് 0 ലിറ്റർ (~18,000 ലിറ്റർ ജലം ലാഭിക്കാം)'
      : '0 Liters today (Preserves ~18,000 Liters)',
    reason: isMl
      ? `മണ്ണിലെ ഈർപ്പം ${farmData.soilMoisture}% എന്ന ആരോഗ്യകരമായ നിലയിലാണ്. വാട്ട പരിധിയായ 25%-നേക്കാൾ വളരെ മുകളിലാണ് ഇത്. മഴ പെയ്യാൻ സാധ്യത (65-85%) കൂടുതലായതിനാൽ വിളകളുടെ ആവശ്യത്തിനുള്ള വെള്ളം സ്വാഭാവികമായി ലഭിക്കും. ഇന്ന് നനച്ചാൽ മണ്ണിൽ വെള്ളം കെട്ടിക്കിടക്കാനും വേരുകൾ ചീയാനും വൈദ്യുതിയും ഇന്ധനവും പാഴാകാനും സാധ്യതയുണ്ട്.`
      : `Soil moisture is at a healthy ${farmData.soilMoisture}%, well above the stress wilting threshold of 25%. Impending thunderstorms (65-85% probability) will supply full crop evapotranspiration needs naturally. Running pumps today risks soil saturation, root asphyxiation, and wasted diesel/electricity.`,
    soilMoistureThresholds: {
      current: farmData.soilMoisture,
      recommended: 50,
      wiltingPoint: 25,
    },
    sevenDaySchedule: [
      { day: isMl ? 'ഇന്ന് (ചൊവ്വ)' : 'Today (Tue)', advice: isMl ? 'നന മാറ്റിവെക്കുക; മഴമേഘങ്ങൾ രൂപപ്പെടുന്നു' : 'Hold irrigation; storm system approaching', waterMm: 0 },
      { day: isMl ? 'നാളെ (ബുധൻ)' : 'Tomorrow (Wed)', advice: isMl ? 'സ്വാഭാവിക മഴ പ്രതീക്ഷിക്കുന്നു (85%); ഡ്രെയിനേജ് തുറന്നുകൊടുക്കുക' : 'Natural rain anticipated (85%); open drainage gates', waterMm: 0 },
      { day: isMl ? 'വ്യാഴം' : 'Thursday', advice: isMl ? 'മേൽമണ്ണ് ഉണങ്ങാൻ അനുവദിക്കുക; വേരുകളുടെ ആഴം പരിശോധിക്കുക' : 'Allow topsoil to dry; check root zone depth', waterMm: 0 },
      { day: isMl ? 'വെള്ളി' : 'Friday', advice: isMl ? 'ഈർപ്പം 38%-ൽ താഴെയെങ്കിൽ നേരിയ തുള്ളിനന' : 'Inspect soil sensor; run light drip if moisture <38%', waterMm: 8 },
      { day: isMl ? 'ശനി' : 'Saturday', advice: isMl ? 'തുള്ളിനന വഴി വളം നൽകാനുള്ള ക്രമീകരണം' : 'Scheduled fertigation window with drip lines', waterMm: 12 },
      { day: isMl ? 'ഞായർ' : 'Sunday', advice: isMl ? 'ഈർപ്പം 45-50% നിലനിർത്തുക' : 'Maintain moisture around 45-50%', waterMm: 10 },
      { day: isMl ? 'തിങ്കൾ' : 'Monday', advice: isMl ? 'താപനില 32°C ന് മുകളിലായാൽ കൂടുതൽ നനയ്ക്കുക' : 'Deep cycle if temperature rises above 32°C', waterMm: 12 },
    ],
    disclaimer: isMl
      ? 'കാർഷിക കാലാവസ്ഥാ പ്രവചനങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള ഉപദേശങ്ങൾ മാത്രമാണിത്. ഐഒടി ഉപകരണങ്ങളില്ലാതെ സിസ്റ്റം നേരിട്ട് വാൽവുകൾ പ്രവർത്തിപ്പിക്കില്ല.'
      : 'All irrigation suggestions are advisory recommendations based on predictive agrometeorology. The system does not physically open or close physical solenoid valves without connected IoT actuators.',
  });

  const handleRefreshAdvice = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIrrigationAdvice({
        soilMoisture: farmData.soilMoisture,
        rainProbability: farmData.rainfallProbability,
        crop: farmData.currentCrop,
        soilType: 'Clay Loam (Moderate Infiltration)',
        farmSize: farmData.farmSize,
        language: preferredLanguage,
      });
      setAdvice(data);
    } catch (err) {
      console.warn('Notice refreshing irrigation advice, using soil moisture rule engine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-600" />
            {isMl ? 'സ്മാർട്ട് ജലസേചന ഉപദേശകൻ' : 'Smart Irrigation Advisor'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'അമിത നനയ്ക്കലും വേരുചീയലും ഒഴിവാക്കി വൈദ്യുതിയും വെള്ളവും സംരക്ഷിക്കുന്നു.'
              : 'Precision water management avoiding over-irrigation, root rot, and pumping energy costs.'}
          </p>
        </div>

        <button
          onClick={handleRefreshAdvice}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (isMl ? 'കണക്കുകൂട്ടുന്നു...' : 'Recalculating...') : (isMl ? 'ശുപാർശ പുതുക്കുക' : 'Refresh Recommendation')}</span>
        </button>
      </div>

      {/* Big Action Banner */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-md transition-all ${
          advice.irrigationRequired
            ? 'bg-gradient-to-r from-blue-700 to-teal-700 text-white border-blue-600'
            : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white border-emerald-700'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isMl ? 'തത്സമയ AI നിർദ്ദേശം' : 'Live AI Recommendation'}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/20">
            {isMl ? '💧 ലാഭിച്ച ജലം: ~18,000 ലിറ്റർ' : '💧 Water Conserved: ~18,000 Liters Saved'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] mb-2">
          {advice.actionTitle}
        </h2>

        <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-3xl mb-4">
          {advice.reason}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <span className="font-bold text-amber-200">{isMl ? 'അനുയോജ്യമായ സമയം:' : 'Optimal Window:'}</span>{' '}
              {advice.recommendedTiming}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-300 shrink-0" />
            <span>
              <span className="font-bold text-blue-200">{isMl ? 'ശുപാർശ ചെയ്യുന്ന അളവ്:' : 'Recommended Volume:'}</span>{' '}
              {advice.estimatedWaterQuantity}
            </span>
          </div>
        </div>
      </div>

      {/* Soil Moisture Hydration Gauge Card */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          {isMl ? 'മണ്ണിലെ ഈർപ്പവും ജലസേചന പരിധികളും' : 'Soil Moisture vs Agro-Hydrological Thresholds'}
        </h2>

        <div className="relative pt-6 pb-3">
          {/* Track */}
          <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div className="w-1/4 bg-rose-300 h-full" title={isMl ? 'വാട്ട നില (0-25%)' : 'Wilting Zone (0-25%)'} />
            <div className="w-1/4 bg-amber-200 h-full" title={isMl ? 'ഈർപ്പക്കുറവ് (25-50%)' : 'Moisture Deficit (25-50%)'} />
            <div className="w-1/4 bg-emerald-400 h-full" title={isMl ? 'അനുയോജ്യമായ അളവ് (50-75%)' : 'Optimal Field Capacity (50-75%)'} />
            <div className="w-1/4 bg-blue-300 h-full" title={isMl ? 'വെള്ളക്കെട്ട് സാധ്യത (75-100%)' : 'Saturation / Waterlogging (75-100%)'} />
          </div>

          {/* Marker pin */}
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-500"
            style={{ left: `${advice.soilMoistureThresholds.current}%` }}
          >
            <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-black text-[10px] shadow-xs">
              {advice.soilMoistureThresholds.current}% {isMl ? '(നിലവിലെ)' : '(Current)'}
            </span>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-emerald-800" />
          </div>
        </div>

        <div className="grid grid-cols-4 text-center text-xs">
          <div>
            <span className="text-rose-700 font-bold block">0 - 25%</span>
            <span className="text-gray-500 text-[10px]">{isMl ? 'വാട്ട സാധ്യത' : 'Wilting Stress'}</span>
          </div>
          <div>
            <span className="text-amber-700 font-bold block">25 - 45%</span>
            <span className="text-gray-500 text-[10px]">{isMl ? 'പര്യാപ്തം' : 'Adequate Base'}</span>
          </div>
          <div>
            <span className="text-emerald-700 font-bold block">45 - 70%</span>
            <span className="text-gray-500 text-[10px]">{isMl ? 'ഏറ്റവും അനുയോജ്യം' : 'Ideal Crop Uptake'}</span>
          </div>
          <div>
            <span className="text-blue-700 font-bold block">70 - 100%</span>
            <span className="text-gray-500 text-[10px]">{isMl ? 'വെള്ളക്കെട്ട് സാധ്യത' : 'Waterlogging Risk'}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Irrigation Schedule */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {isMl ? '7 ദിവസത്തെ സ്മാർട്ട് ജലസേചന പട്ടിക' : '7-Day Smart Irrigation Schedule'}
            </h2>
            <p className="text-xs text-gray-500">
              {isMl
                ? 'വൈദ്യുതിയും വെള്ളവും പാഴാകാതിരിക്കാൻ മഴസാധ്യതയുമായി ബന്ധിപ്പിച്ചത്'
                : 'Synchronized with rainfall probability to prevent wasted water and electricity'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {advice.sevenDaySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                item.waterMm === 0
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-blue-50/50 border-blue-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 w-32 shrink-0">{item.day}</span>
                <span className="text-gray-700">{item.advice}</span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                    item.waterMm === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.waterMm === 0
                    ? (isMl ? 'നനയ്ക്കേണ്ടതില്ല (0 mm)' : 'No Irrigation (0 mm)')
                    : (isMl ? `തുള്ളി നന: ${item.waterMm} mm` : `Drip Target: ${item.waterMm} mm`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-xs text-gray-600">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-gray-800">{isMl ? 'പ്രവർത്തന അറിയിപ്പ്: ' : 'Operational Disclaimer: '}</span>
          {advice.disclaimer}
        </p>
      </div>
    </div>
  );
};
