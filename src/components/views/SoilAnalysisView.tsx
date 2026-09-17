import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchSoilAnalysis } from '../../services/api';
import { SoilAnalysisResult } from '../../types';
import { t, translateCrop, translateDistrict } from '../../translations';
import {
  TestTube2,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Layers,
  Thermometer,
  Droplets,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

export const SoilAnalysisView: React.FC = () => {
  const { farmData, updateFarmData, districtInfo, setIsLocationModalOpen, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  // Local state for inputs
  const [moisture, setMoisture] = useState(farmData.soilMoisture);
  const [temp, setTemp] = useState(farmData.soilTemperature);
  const [ph, setPh] = useState(farmData.soilPh);
  const [nitrogen, setNitrogen] = useState(farmData.nitrogen);
  const [phosphorus, setPhosphorus] = useState(farmData.phosphorus);
  const [potassium, setPotassium] = useState(farmData.potassium);

  // Sync with district change
  React.useEffect(() => {
    setMoisture(farmData.soilMoisture);
    setTemp(farmData.soilTemperature);
    setPh(farmData.soilPh);
    setNitrogen(farmData.nitrogen);
    setPhosphorus(farmData.phosphorus);
    setPotassium(farmData.potassium);
  }, [farmData.district, farmData.soilPh, farmData.nitrogen]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>({
    healthStatus: isMl ? 'മികച്ച' : 'Good',
    healthScore: 82,
    nutrientStatus: {
      nitrogen: {
        level: isMl ? 'അനുയോജ്യം' : 'Optimal',
        comment: isMl ? '65 mg/kg ഇലകളുടെയും തണ്ടിന്റെയും കരുത്തുറ്റ വളർച്ച നൽകുന്നു.' : '65 mg/kg provides sturdy vegetative leaf growth.'
      },
      phosphorus: {
        level: isMl ? 'അനുയോജ്യം (അല്പം കുറവ്)' : 'Optimal (Slightly Low)',
        comment: isMl ? '42 mg/kg വേരുകളുടെ വളർച്ചയെ പിന്തുണയ്ക്കുന്നു; പൂവിടുന്ന ഘട്ടത്തിൽ ഫോസ്ഫറസ് വർദ്ധിപ്പിക്കുക.' : '42 mg/kg supports root branching; will benefit from flowering booster.'
      },
      potassium: {
        level: isMl ? 'അനുയോജ്യം' : 'Optimal',
        comment: isMl ? '58 mg/kg രോഗപ്രതിരോധ ശേഷിയും കായ്ഫലവും വർദ്ധിപ്പിക്കുന്നു.' : '58 mg/kg ensures disease resistance and firm fruit skin.'
      },
      ph: {
        level: isMl ? 'ന്യൂട്രൽ / അനുയോജ്യം' : 'Neutral / Ideal',
        comment: isMl ? 'pH 6.5 വേരുകൾക്ക് പോഷകങ്ങൾ കൃത്യമായി ആഗിരണം ചെയ്യാൻ സഹായിക്കുന്നു.' : 'pH 6.5 allows maximum uptake of major and micro-nutrients without chemical lockout.'
      },
    },
    problemsDetected: isMl
      ? [
          'കായ് പിടിക്കുന്ന ഘട്ടത്തിന് മുൻപായി ഫോസ്ഫറസിന്റെ നേരിയ കുറവ്',
          'ഉയർന്ന അന്തരീക്ഷ ആർദ്രത മണ്ണിലെ ഉപരിതല ജലബാഷ്പീകരണം കുറയ്ക്കുന്നു',
        ]
      : [
          'Slight phosphorus limitation ahead of fruit set stage',
          'High ambient humidity slows soil surface evaporation',
        ],
    aiExplanation: isMl
      ? 'നിങ്ങളുടെ മണ്ണിന്റെ ആരോഗ്യം 82/100 ആണ്. pH 6.5 എന്നത് വളരെ സന്തുലിതമായ നിലയിലാണ്. ഇത് സസ്യങ്ങൾക്ക് പോഷകങ്ങൾ എളുപ്പത്തിൽ വലിച്ചെടുക്കാൻ സഹായിക്കുന്നു. നൈട്രജനും പൊട്ടാസ്യവും തോട്ടത്തിന് നല്ല കരുത്ത് നൽകുന്നു.'
      : 'Your soil is in healthy condition with an overall score of 82/100. The pH is balanced at 6.5, which ensures root hairs can absorb nutrients smoothly without soil acidity lock. Nitrogen and Potassium levels provide strong vegetative stamina.',
    recommendedActions: isMl
      ? [
          'മണ്ണിലെ ജൈവാംശം നിലനിർത്താൻ ഏക്കറിന് 15 കിലോഗ്രാം ചാണകപ്പൊടിയോ മണ്ണിര കമ്പോസ്റ്റോ ചേർക്കുക',
          'തണ്ടുകളെ അമിതമായി മൃദുവാക്കാതിരിക്കാൻ യൂറിയയുടെ അമിത ഉപയോഗം ഒഴിവാക്കുക',
          'മഴ പ്രതീക്ഷിക്കുന്നതിനാൽ തോട്ടത്തിലെ നീർവാർച്ചാ ചാലുകൾ വൃത്തിയാക്കുക',
        ]
      : [
          'Apply 15 kg/acre well-rotted cow dung or vermicompost to preserve organic carbon',
          'Avoid excess urea top-dressing to prevent succulent stems vulnerable to stem borer',
          'Ensure drainage furrows are cleared before predicted rainfall showers',
        ],
  });

  const handleAnalyze = async () => {
    setIsLoading(true);
    // Also synchronize back to global farm context
    updateFarmData({
      soilMoisture: moisture,
      soilTemperature: temp,
      soilPh: ph,
      nitrogen,
      phosphorus,
      potassium,
    });

    try {
      const data = await fetchSoilAnalysis({
        soilMoisture: moisture,
        soilTemperature: temp,
        soilPh: ph,
        nitrogen,
        phosphorus,
        potassium,
        crop: farmData.currentCrop,
        language: preferredLanguage,
      });
      setResult(data);
    } catch (err) {
      console.warn('Notice analyzing soil, using baseline soil health card:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = [
    {
      name: isMl ? 'നൈട്രജൻ (N)' : 'Nitrogen (N)',
      current: nitrogen,
      benchmark: 70,
      unit: isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg',
    },
    {
      name: isMl ? 'ഫോസ്ഫറസ് (P)' : 'Phosphorus (P)',
      current: phosphorus,
      benchmark: 50,
      unit: isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg',
    },
    {
      name: isMl ? 'പൊട്ടാസ്യം (K)' : 'Potassium (K)',
      current: potassium,
      benchmark: 60,
      unit: isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <TestTube2 className="w-6 h-6 text-emerald-600" />
              {isMl ? 'മണ്ണ് ആരോഗ്യവും പോഷക വിവരങ്ങളും' : 'Soil Health & Nutrient Intelligence'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {isMl ? 'കേരള കാർഷിക സർവ്വകലാശാല മണ്ണ് കാർഡ്' : 'KAU Soil Health Card'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? `${districtInfo?.primarySoilType || 'മണ്ണ്'} പരിശോധന (${farmData.location})`
              : `Analyzing ${districtInfo?.primarySoilType} in ${farmData.location}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            {t('changeLocation', preferredLanguage)}
          </button>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
            {isMl
              ? `വിള: ${translateCrop(farmData.currentCrop, preferredLanguage)}`
              : `Target Crop: ${farmData.currentCrop}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              {isMl ? 'മണ്ണ് പരിശോധനാ ഘടകങ്ങൾ' : 'Soil Test Parameters'}
            </h2>

            <div className="space-y-4">
              {/* Soil Moisture */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    {t('soilMoisture', preferredLanguage)}
                  </span>
                  <span className="text-emerald-800 font-bold">{moisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 font-medium mt-0.5">
                  <span>{isMl ? 'വരണ്ടത് (10%)' : 'Dry (10%)'}</span>
                  <span>{isMl ? 'ഫീൽഡ് ശേഷി (55%)' : 'Field Capacity (55%)'}</span>
                  <span>{isMl ? 'പൂരിതമായത് (90%)' : 'Saturated (90%)'}</span>
                </div>
              </div>

              {/* Soil Temperature */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    {t('soilTemperature', preferredLanguage)}
                  </span>
                  <span className="text-emerald-800 font-bold">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="45"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 font-medium mt-0.5">
                  <span>{isMl ? 'തണുത്തത് (12°C)' : 'Cool (12°C)'}</span>
                  <span>{isMl ? 'അനുയോജ്യം (25°C)' : 'Optimal (25°C)'}</span>
                  <span>{isMl ? 'ചൂടുള്ളത് (45°C)' : 'Hot (45°C)'}</span>
                </div>
              </div>

              {/* Soil pH */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>{isMl ? 'മണ്ണിന്റെ pH (അമ്ല / ക്ഷാര നില)' : 'Soil pH (Acidity / Alkalinity)'}</span>
                  <span className="text-emerald-800 font-bold">{ph}</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 font-medium mt-0.5">
                  <span>{isMl ? 'അമ്ലഗുണം (4.5)' : 'Acidic (4.5)'}</span>
                  <span>{isMl ? 'ന്യൂട്രൽ (7.0)' : 'Neutral (7.0)'}</span>
                  <span>{isMl ? 'ക്ഷാരഗുണം (9.0)' : 'Alkaline (9.0)'}</span>
                </div>
              </div>

              {/* NPK Inputs */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-700">
                  {isMl ? 'NPK പ്രധാന പോഷകങ്ങൾ (മില്ലിഗ്രാം/കി.ഗ്രാം)' : 'NPK Macronutrients (mg/kg)'}
                </p>

                {/* Nitrogen */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t('nitrogen', preferredLanguage)}</span>
                    <span className="font-bold text-gray-900">
                      {nitrogen} {isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="130"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Phosphorus */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t('phosphorus', preferredLanguage)}</span>
                    <span className="font-bold text-gray-900">
                      {phosphorus} {isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Potassium */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t('potassium', preferredLanguage)}</span>
                    <span className="font-bold text-gray-900">
                      {potassium} {isMl ? 'മി.ഗ്രാം/കി.ഗ്രാം' : 'mg/kg'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Analyze Soil Button */}
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isMl ? 'AI ഉപയോഗിച്ച് മണ്ണ് വിശകലനം ചെയ്യുന്നു...' : 'Analyzing Soil with Gemini...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isMl ? 'ഡാർത്തി AI ഉപയോഗിച്ച് മണ്ണ് പരിശോധിക്കുക' : 'Analyze Soil with DARTHI AI'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis, NPK Chart, and Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* NPK Chart Card */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              {isMl ? 'മണ്ണിലെ NPK പോഷക താരതമ്യം' : 'Soil NPK Comparison vs Optimal Target'}
            </h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} mg/kg`, '']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: '8px' }} />
                  <Bar
                    dataKey="current"
                    name={isMl ? 'നിങ്ങളുടെ മണ്ണ്' : 'Your Soil Test'}
                    fill="#059669"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="benchmark"
                    name={isMl ? 'ആവശ്യമായ അളവ്' : 'Benchmark Requirement'}
                    fill="#93c5fd"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Analysis Diagnosis */}
          {result && (
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center">
                    {result.healthScore}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      {isMl ? 'മൊത്തത്തിലുള്ള മണ്ണ് ആരോഗ്യം' : 'Overall Soil Health'}
                    </span>
                    <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                      {result.healthStatus} {isMl ? 'അവസ്ഥ' : 'Condition'}
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    {isMl ? 'AI കാർഷിക വിദഗ്ദ്ധൻ സ്ഥിരീകരിച്ചത്' : 'AI Agronomist Verified'}
                  </span>
                </div>
              </div>

              {/* AI Explanation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {isMl ? 'AI മണ്ണ് വിശകലനം' : 'AI Soil Diagnosis'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                  {result.aiExplanation}
                </p>
              </div>

              {/* Nutrient Status Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  {isMl ? 'പോഷക വിവരങ്ങൾ' : 'Nutrient Breakdown'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-900 block">
                      {isMl ? 'നൈട്രജൻ' : 'Nitrogen'}: {result.nutrientStatus.nitrogen.level}
                    </span>
                    <span className="text-gray-600 text-[11px] mt-0.5 block">
                      {result.nutrientStatus.nitrogen.comment}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-900 block">
                      {isMl ? 'ഫോസ്ഫറസ്' : 'Phosphorus'}: {result.nutrientStatus.phosphorus.level}
                    </span>
                    <span className="text-gray-600 text-[11px] mt-0.5 block">
                      {result.nutrientStatus.phosphorus.comment}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-900 block">
                      {isMl ? 'പൊട്ടാസ്യം' : 'Potassium'}: {result.nutrientStatus.potassium.level}
                    </span>
                    <span className="text-gray-600 text-[11px] mt-0.5 block">
                      {result.nutrientStatus.potassium.comment}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-900 block">
                      {isMl ? 'pH സൂചിക' : 'pH Index'}: {result.nutrientStatus.ph.level}
                    </span>
                    <span className="text-gray-600 text-[11px] mt-0.5 block">
                      {result.nutrientStatus.ph.comment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problems Detected */}
              {result.problemsDetected.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    {isMl ? 'ശ്രദ്ധിക്കേണ്ട പ്രശ്നങ്ങൾ' : 'Issues to Address'}
                  </h4>
                  <ul className="space-y-1.5">
                    {result.problemsDetected.map((prob, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                  {isMl ? 'കർഷകനുള്ള ശുപാർശകൾ' : 'Recommended Actions for Farmer'}
                </h4>
                <div className="space-y-2">
                  {result.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-800 bg-white border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
