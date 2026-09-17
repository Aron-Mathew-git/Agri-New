import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { historicalData } from '../../data/defaultData';
import { fetchCropHealth } from '../../services/api';
import { CropHealthResult } from '../../types';
import {
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Droplets,
  Layers,
  Thermometer,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const CropHealthView: React.FC = () => {
  const { farmData, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';
  const [isLoading, setIsLoading] = useState(false);

  const [healthData, setHealthData] = useState<CropHealthResult>({
    overallHealthScore: 84,
    statusLabel: isMl ? 'നല്ലത്' : 'Good',
    growthStageEvaluation: isMl
      ? 'വിള നല്ല രീതിയിലുള്ള വളർച്ചയും ആരോഗ്യകരമായ ഇലപ്പടർപ്പുകളും പ്രകടിപ്പിക്കുന്നു. ഇലകളുടെ നിറം സജീവമായ ക്ലോറോഫിൽ പ്രവർത്തനത്തെ സൂചിപ്പിക്കുന്നു.'
      : 'The tomato crop is currently progressing with robust vegetative vigor and uniform branch canopy with balanced internodal spacing. Foliage color indicates active chlorophyll synthesis without chlorosis.',
    stressFactors: [
      {
        factor: isMl ? 'ഉയർന്ന അന്തരീക്ഷ ഈർപ്പം (74%)' : 'High Ambient Humidity (74%)',
        severity: isMl ? 'ഇടത്തരം' : 'Medium',
        description: isMl
          ? 'ഉയർന്ന അന്തരീക്ഷ ഈർപ്പം ഇലകളിലൂടെയുള്ള സ്വാഭാവിക ബാഷ്പീകരണത്തെ മന്ദഗതിയിലാക്കുകയും കുമിൾ രോഗങ്ങൾക്ക് അനുകൂല സാഹചര്യമുണ്ടാക്കുകയും ചെയ്യുന്നു.'
          : 'Elevated atmospheric humidity slows transpiration cooling and creates conditions favorable for foliar pathogens. Ensure canopy spacing remains open.',
      },
      {
        factor: isMl ? 'മണ്ണിലെ ഈർപ്പ സംതുലിതാവസ്ഥ (42%)' : 'Soil Saturation Buffer (42%)',
        severity: isMl ? 'കുറവ്' : 'Low',
        description: isMl
          ? 'മണ്ണിലെ ഈർപ്പം സുരക്ഷിതമായ അളവിലാണ്. വരാനിരിക്കുന്ന മഴയ്ക്ക് മുൻപ് വേരുകൾക്ക് ആവശ്യമായ സംരക്ഷണം നൽകുന്നു.'
          : 'Current soil moisture is in a safe reserve range, providing good resilience against soil compaction before incoming rains.',
      },
    ],
    vitalMetrics: {
      soilConditionScore: 86,
      weatherFitnessScore: 80,
      waterBalanceScore: 88,
      nutrientAdequacyScore: 82,
    },
    aiActionPlan: isMl
      ? [
          'വരാനിരിക്കുന്ന കനത്ത മഴയ്ക്ക് മുൻപായി തോട്ടത്തിലെ വെള്ളച്ചാലുകൾ വൃത്തിയാക്കുക',
          'മണ്ണിൽ ഈർപ്പമുള്ളപ്പോൾ വേരുകൾക്ക് കേടുപാടുകൾ ഉണ്ടാകാതിരിക്കാൻ ഉഴുകയോ കിളയ്ക്കുകയോ ചെയ്യരുത്',
          'മഴ മാറിയ ശേഷം പൂക്കൾ കൊഴിയാതിരിക്കാൻ ഫോസ്ഫറസ് സ്പ്രേ (12:61:00) നൽകാൻ തയ്യാറെടുക്കുക',
          'നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളുടെ സാന്നിധ്യമുണ്ടോയെന്ന് ഇലകളുടെ അടിവശം പരിശോധിക്കുക',
        ]
      : [
          'Inspect field drainage channels before the Wednesday thunderstorm event',
          'Refrain from mechanical tractor weeding while topsoil is damp to preserve fine root hairs',
          'Prepare foliar soluble phosphorus booster (12:61:00) once dry conditions return to maximize floral clusters',
          'Check lower leaf undersides twice weekly for early sucking pest colonies',
        ],
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCropHealth(farmData, preferredLanguage);
      setHealthData(data);
    } catch (err) {
      console.warn('Notice refreshing crop health, using sensor and weather telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const translateStatus = (label: string) => {
    if (!isMl) return label;
    if (label === 'Good' || label === 'നല്ലത്') return 'നല്ലത്';
    if (label === 'Excellent' || label === 'മികച്ചത്') return 'മികച്ചത്';
    if (label === 'Moderate Stress' || label === 'ഇടത്തരം പ്രതിസന്ധി') return 'ഇടത്തരം പ്രതിസന്ധി';
    if (label === 'High Stress' || label === 'ഉയർന്ന പ്രതിസന്ധി') return 'ഉയർന്ന പ്രതിസന്ധി';
    return label;
  };

  const translateSeverity = (sev: string) => {
    if (!isMl) return sev;
    if (sev === 'Low' || sev === 'കുറവ്') return 'കുറവ്';
    if (sev === 'Medium' || sev === 'ഇടത്തരം') return 'ഇടത്തരം';
    if (sev === 'High' || sev === 'കൂടിയത്') return 'കൂടിയത്';
    return sev;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-emerald-600" />
            {isMl ? 'വിള ആരോഗ്യ സൂചിക' : 'Crop Health & Vitality Index'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'മണ്ണ്, കാലാവസ്ഥ, ജലം, പോഷക വിവരങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള സമഗ്ര വിള ആരോഗ്യ വിശകലനം.'
              : 'Holistic plant condition index fusing live soil, weather, water, and nutrient telemetry.'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
          <span>
            {isLoading
              ? isMl
                ? 'വിശകലനം ചെയ്യുന്നു...'
                : 'Assessing Vitals...'
              : isMl
              ? 'പുതുക്കുക'
              : 'Refresh Health Index'}
          </span>
        </button>
      </div>

      {/* Main Score & Sub-Vitals Banner */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main gauge card */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 text-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-600 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthData.overallHealthScore / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-emerald-950 font-['Outfit']">
                  {healthData.overallHealthScore}%
                </span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {translateStatus(healthData.statusLabel)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 max-w-[200px]">
              {isMl
                ? 'ലഭ്യമായ വിവരങ്ങൾ പ്രകാരം വളർച്ചയ്ക്ക് അനുയോജ്യമായ അന്തരീക്ഷം.'
                : 'Combined agro-telemetry shows optimal growth conditions.'}
            </p>
          </div>

          {/* Sub-scores grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 text-center">
              <Layers className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium block">
                {isMl ? 'മണ്ണിന്റെ ആരോഗ്യം' : 'Soil Vitals'}
              </span>
              <span className="text-2xl font-black text-gray-900">
                {healthData.vitalMetrics.soilConditionScore}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                {isMl ? 'pH ഉം NPK യും സമതുലിതം' : 'Balanced pH & NPK'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 text-center">
              <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium block">
                {isMl ? 'കാലാവസ്ഥാ പൊരുത്തം' : 'Weather Fitness'}
              </span>
              <span className="text-2xl font-black text-gray-900">
                {healthData.vitalMetrics.weatherFitnessScore}%
              </span>
              <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                {isMl ? 'കൂടിയ ഈർപ്പം' : 'High Humidity'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 text-center">
              <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium block">
                {isMl ? 'ജല സംതുലിതാവസ്ഥ' : 'Water Balance'}
              </span>
              <span className="text-2xl font-black text-gray-900">
                {healthData.vitalMetrics.waterBalanceScore}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                {isMl ? 'ഈർപ്പം സുരക്ഷിതം' : 'Moisture Safe'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 text-center">
              <ShieldCheck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium block">
                {isMl ? 'പോഷക സൂചിക' : 'Nutrient Index'}
              </span>
              <span className="text-2xl font-black text-gray-900">
                {healthData.vitalMetrics.nutrientAdequacyScore}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                {isMl ? 'ആവശ്യത്തിന് സംഭരണം' : 'Adequate Reserve'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Graphs: 14-day telemetry */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {isMl ? '14 ദിവസത്തെ വിള ആരോഗ്യ വിവരങ്ങൾ' : '14-Day Historical Vitality Trends'}
            </h2>
            <p className="text-xs text-gray-500">
              {isMl
                ? 'വിള ആരോഗ്യ സ്കോർ, മണ്ണിന്റെ ഈർപ്പം, താപനില എന്നിവയുടെ മാറ്റങ്ങൾ'
                : 'Tracking crop health score, soil moisture, and humidity progression'}
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
              <YAxis domain={[20, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="healthScore"
                name={isMl ? 'വിള ആരോഗ്യ സ്കോർ (%)' : 'Crop Health Score (%)'}
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                name={isMl ? 'മണ്ണിലെ ഈർപ്പം (%)' : 'Soil Moisture (%)'}
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="airTemp"
                name={isMl ? 'അന്തരീക്ഷ താപനില (°C)' : 'Air Temp (°C)'}
                stroke="#f97316"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Stage Evaluation & Stress Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Growth stage */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            {isMl ? 'വിളയുടെ വളർച്ചാ ഘട്ട വിലയിരുത്തൽ' : 'Canopy Growth Stage Evaluation'}
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            {healthData.growthStageEvaluation}
          </p>
        </div>

        {/* Stress Factors */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {isMl ? 'കാലാവസ്ഥാ വെല്ലുവിളികൾ' : 'Active Microclimate Stress Factors'}
          </h3>
          <div className="space-y-2">
            {healthData.stressFactors.map((stress, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{stress.factor}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    {isMl ? `തീവ്രത: ${translateSeverity(stress.severity)}` : `Severity: ${stress.severity}`}
                  </span>
                </div>
                <p className="text-amber-900/90 text-[11px] leading-relaxed">
                  {stress.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Action Plan */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          {isMl ? 'ആരോഗ്യം നിലനിർത്താനുള്ള നിർദ്ദേശങ്ങൾ' : 'Recommended Actions to Maintain & Maximize Health'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {healthData.aiActionPlan.map((action, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-gray-50 border border-gray-150 text-gray-800 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
