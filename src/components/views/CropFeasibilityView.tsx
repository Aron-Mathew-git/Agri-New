import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchCropFeasibility } from '../../services/api';
import { CropFeasibilityResult } from '../../types';
import { translateCrop, translateDistrict } from '../../translations';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Loader2,
  Droplets,
  Layers,
  Thermometer,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CropFeasibilityView: React.FC = () => {
  const { farmData, updateFarmData, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [selectedCrop, setSelectedCrop] = useState(farmData.currentCrop.split(' ')[0] || 'Tomato');
  const [customCrop, setCustomCrop] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<CropFeasibilityResult | null>({
    crop: 'Tomato',
    status: 'Suitable',
    overallScore: 89,
    explanation:
      'Tomato is highly compatible with your current farm telemetry. Your soil pH of 6.5 is ideal for preventing blossom-end rot, and potassium levels (58 mg/kg) ensure strong cellular walls and excellent fruit firmness. Adequate drainage is required during the upcoming rain.',
    soilFeasibility: {
      status: 'Good',
      detail: 'pH 6.5 and 42% moisture provide root aeration and adequate capillary water without root rot.',
    },
    weatherFeasibility: {
      status: 'Good',
      detail: '29°C daytime temp is optimal, though 74% humidity requires vigilant preventative fungal tracking.',
    },
    waterFeasibility: {
      status: 'Good',
      detail: 'Drip system and impending showers provide balanced hydration without water stress.',
    },
    nutrientFeasibility: {
      status: 'Good',
      detail: 'Nitrogen (65) and Potassium (58) satisfy vegetative needs; minor phosphorus booster will aid flowering.',
    },
    suggestedAdjustments: [
      'Prepare raised planting ridges or mounds to prevent collar rot during heavy rain showers',
      'Apply biological Trichoderma viride drench once sunny weather resumes',
      'Do not top-dress excess urea while atmospheric humidity remains high to avoid fruit borer infestation',
    ],
  });

  const commonCrops = [
    { key: 'Tomato', labelEn: 'Tomato', labelMl: 'തക്കാളി' },
    { key: 'Soybean', labelEn: 'Soybean', labelMl: 'സോയാബീൻ' },
    { key: 'Cotton', labelEn: 'Cotton', labelMl: 'പരുത്തി' },
    { key: 'Wheat', labelEn: 'Wheat', labelMl: 'ഗോതമ്പ്' },
    { key: 'Rice / Paddy', labelEn: 'Rice / Paddy', labelMl: 'നെല്ല്' },
    { key: 'Onion', labelEn: 'Onion', labelMl: 'സവാള / ഉള്ളി' },
    { key: 'Sugarcane', labelEn: 'Sugarcane', labelMl: 'കരിമ്പ്' },
    { key: 'Maize', labelEn: 'Maize', labelMl: 'മക്കച്ചോളം' },
    { key: 'Chili / Pepper', labelEn: 'Chili / Pepper', labelMl: 'കുരുമുളക് / മുളക്' },
    { key: 'Groundnut', labelEn: 'Groundnut', labelMl: 'നിലക്കടല' },
    { key: 'Mustard', labelEn: 'Mustard', labelMl: 'കടുക്' },
    { key: 'Potato', labelEn: 'Potato', labelMl: 'ഉരുളക്കിഴങ്ങ്' },
  ];

  const handleEvaluate = async (cropToTest?: string) => {
    const targetCrop = cropToTest || customCrop.trim() || selectedCrop;
    if (!targetCrop) return;

    setIsLoading(true);
    setSelectedCrop(targetCrop);

    try {
      const data = await fetchCropFeasibility(
        targetCrop,
        {
          moisture: farmData.soilMoisture,
          soilTemp: farmData.soilTemperature,
          soilPh: farmData.soilPh,
          nitrogen: farmData.nitrogen,
          phosphorus: farmData.phosphorus,
          potassium: farmData.potassium,
        },
        {
          airTemp: farmData.airTemperature,
          humidity: farmData.humidity,
          rainfallProb: farmData.rainfallProbability,
        },
        preferredLanguage
      );
      setResult(data);
    } catch (err) {
      console.warn('Notice checking feasibility, using agro-climatic baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: 'Suitable' | 'Moderately Suitable' | 'Needs Improvement' | string) => {
    if (status === 'Suitable' || status === 'അനുയോജ്യം') {
      return (
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          {isMl ? 'അനുയോജ്യം' : 'Suitable'}
        </span>
      );
    }
    if (status === 'Moderately Suitable' || status === 'ഇടത്തരം അനുയോജ്യം') {
      return (
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          {isMl ? 'ഇടത്തരം അനുയോജ്യം' : 'Moderately Suitable'}
        </span>
      );
    }
    return (
      <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5 shadow-2xs">
        <XCircle className="w-4 h-4 text-rose-700" />
        {isMl ? 'ശ്രദ്ധ ആവശ്യമാണ്' : 'Needs Improvement'}
      </span>
    );
  };

  const translatePillarStatus = (st: string) => {
    if (!isMl) return st;
    if (st === 'Good' || st === 'ഉത്തമം') return 'ഉത്തമം';
    if (st === 'Fair' || st === 'തൃപ്തികരം') return 'തൃപ്തികരം';
    if (st === 'Poor' || st === 'കുറവ്') return 'കുറവ്';
    return st;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          {isMl ? 'വിള സാധ്യത പരിശോധന' : 'Crop Feasibility Verifier'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isMl
            ? 'മണ്ണിലെ ഘടകങ്ങളും വെള്ളവും കാലാവസ്ഥയും നിങ്ങളുടെ വിളയ്ക്ക് അനുയോജ്യമാണോ എന്ന് പരിശോധിക്കുക.'
            : 'Select or enter any crop to see if your current soil, water, and weather will support healthy growth.'}
        </p>
      </div>

      {/* Crop Selector Card */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            {isMl ? 'പരിശോധിക്കേണ്ട വിള തിരഞ്ഞെടുക്കുക' : 'Choose Crop to Verify'}
          </h2>
          <span className="text-xs text-emerald-700 font-medium">
            {isMl
              ? `${translateDistrict(farmData.district || 'Wayanad', preferredLanguage)} വിവരങ്ങളുമായി താരതമ്യം ചെയ്യുന്നു`
              : `Benchmarking against ${farmData.location}`}
          </span>
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap gap-2">
          {commonCrops.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setSelectedCrop(c.key);
                setCustomCrop('');
                handleEvaluate(c.key);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                selectedCrop === c.key
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              {isMl ? c.labelMl : c.labelEn}
            </button>
          ))}
        </div>

        {/* Custom crop input */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <input
            type="text"
            placeholder={
              isMl
                ? 'അല്ലെങ്കിൽ മറ്റൊരു വിളയുടെ പേര് നൽകുക (ഉദാ: മഞ്ഞൾ, ഇഞ്ചി, ഏലം)...'
                : 'Or type another crop name (e.g., Turmeric, Pomegranate, Ginger)...'
            }
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600 bg-gray-50"
          />
          <button
            onClick={() => handleEvaluate()}
            disabled={isLoading || (!selectedCrop && !customCrop.trim())}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isMl ? 'സാധ്യത പരിശോധിക്കുക' : 'Check Feasibility'}</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
          {/* Top verdict banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 font-extrabold text-2xl flex items-center justify-center">
                {result.overallScore}%
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  {isMl ? 'വിലയിരുത്തൽ' : 'Evaluation for'}
                </span>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {translateCrop(result.crop, preferredLanguage)}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(result.status)}
              <button
                onClick={() => updateFarmData({ currentCrop: result.crop })}
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {isMl ? 'പ്രധാന വിളയായി മാറ്റുക' : 'Set as Active Crop'}
              </button>
            </div>
          </div>

          {/* AI Explanation paragraph */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed">
            <span className="font-bold block mb-1">
              {isMl ? 'കാർഷിക ശാസ്ത്ര വിശദീകരണം:' : 'Agronomic Reasoning:'}
            </span>
            {result.explanation}
          </div>

          {/* 4 Pillars Grid: Soil, Weather, Water, Nutrients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  {isMl ? 'മണ്ണിന്റെ അനുയോജ്യത' : 'Soil Suitability'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {translatePillarStatus(result.soilFeasibility.status)}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {result.soilFeasibility.detail}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  {isMl ? 'കാലാവസ്ഥാ പൊരുത്തം' : 'Weather Match'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {translatePillarStatus(result.weatherFeasibility.status)}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {result.weatherFeasibility.detail}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  {isMl ? 'ജല ലഭ്യത' : 'Water Supply'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {translatePillarStatus(result.waterFeasibility.status)}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {result.waterFeasibility.detail}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  {isMl ? 'പോഷക ലഭ്യത' : 'Nutrient Adequacy'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {translatePillarStatus(result.nutrientFeasibility.status)}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {result.nutrientFeasibility.detail}
              </p>
            </div>
          </div>

          {/* Suggested Adjustments */}
          {result.suggestedAdjustments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5">
                {isMl ? 'വിജയകരമായ വിളവെടുപ്പിന് ആവശ്യമായ മാറ്റങ്ങൾ' : 'Required Farm Adjustments to Maximize Success'}
              </h3>
              <div className="space-y-2">
                {result.suggestedAdjustments.map((adj, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-emerald-100 text-xs text-gray-800 flex items-start gap-2.5 shadow-2xs"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{adj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
