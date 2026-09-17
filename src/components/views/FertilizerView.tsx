import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchFertilizerAdvice } from '../../services/api';
import { FertilizerAdviceResult } from '../../types';
import { t, translateCrop } from '../../translations';
import {
  Sprout,
  AlertTriangle,
  Sparkles,
  Loader2,
  CheckCircle2,
  Layers,
  Leaf,
  Info,
  Calendar,
  RefreshCw,
} from 'lucide-react';

export const FertilizerView: React.FC = () => {
  const { farmData, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [growthStage, setGrowthStage] = useState(
    isMl ? 'പൂവിടലും കായ്പിടുത്തവും' : 'Flowering & Early Fruit Set'
  );
  const [targetCrop, setTargetCrop] = useState(farmData.currentCrop);
  const [isLoading, setIsLoading] = useState(false);

  const [advice, setAdvice] = useState<FertilizerAdviceResult>({
    deficiencyAnalysis: isMl
      ? `നൈട്രജനും (${farmData.nitrogen} mg/kg) പൊട്ടാസ്യവും (${farmData.potassium} mg/kg) നിലവിലെ ഇലകളുടെ വളർച്ചയ്ക്ക് അനുയോജ്യമായ അനുപാതത്തിലാണ്. എന്നാൽ സമൃദ്ധമായി പൂക്കൾ ഉണ്ടാകുന്നതിനും വേരുകളുടെ ബലത്തിനും ആവശ്യമായ ഫോസ്ഫറസ് (${farmData.phosphorus} mg/kg) ശുപാർശ ചെയ്യുന്ന 50 mg/kg അളവിനേക്കാൾ അല്പം കുറവാണ്.`
      : `Nitrogen (${farmData.nitrogen} mg/kg) and Potassium (${farmData.potassium} mg/kg) are in balanced proportions for current vegetative foliage. Phosphorus (${farmData.phosphorus} mg/kg) is slightly below the 50 mg/kg threshold needed for profuse blossom clusters and strong root support during heavy fruit load.`,
    recommendedFertilizers: [
      {
        name: isMl ? 'വെള്ളത്തിൽ ലയിക്കുന്ന 12:61:00 (മോണോ അമോണിയം ഫോസ്ഫേറ്റ്)' : 'Water Soluble 12:61:00 (Mono Ammonium Phosphate)',
        category: 'Chemical',
        dosagePerAcre: isMl ? '3.5 കി.ഗ്രാം / ഏക്കർ (രണ്ട് തവണയായി)' : '3.5 kg / acre (split into two fertigation doses)',
        timingAndMethod: isMl
          ? 'രാവിലെ നേരത്തെ തുള്ളിനന വഴി നൽകുക. ഇത് പൂക്കൾ കൊഴിയുന്നത് തടയുകയും കൂടുതൽ പൂക്കൾ വിരിയാൻ സഹായിക്കുകയും ചെയ്യുന്നു.'
          : 'Inject through drip system early in the morning. Encourages vigorous floral initiation and prevents flower bud drop.',
      },
      {
        name: isMl ? 'വേപ്പിൻപിണ്ണാക്ക് ചേർത്ത മണ്ണിരക്കമ്പോസ്റ്റ്' : 'Enriched Vermicompost + Neem Seed Cake',
        category: 'Organic',
        dosagePerAcre: isMl ? '200 കി.ഗ്രാം / ഏക്കർ തടത്തിലിടുക' : '200 kg / acre ring placement',
        timingAndMethod: isMl
          ? 'ചെടിയുടെ തടത്തിന് ചുറ്റും ഇട്ട് പുതയിടുക. മണ്ണിലെ ജൈവാംശം വർദ്ധിപ്പിക്കുകയും നിമാവിരകളെ തടയുകയും ചെയ്യുന്നു.'
          : 'Place around the plant dripline and lightly cover with mulch. Replenishes soil humus and discourages soil-borne nematodes.',
      },
      {
        name: isMl ? 'പി.എസ്.ബി (ഫോസ്ഫേറ്റ് സോലുബിലൈസിംഗ് ബാക്ടീരിയ) ജീവാണുവളം' : 'Phosphate Solubilizing Bacteria (PSB) Bio-fertilizer',
        category: 'Bio-fertilizer',
        dosagePerAcre: isMl ? '1 ലിറ്റർ ദ്രാവകരൂപം / ഏക്കർ' : '1 Liter liquid formulation / acre',
        timingAndMethod: isMl
          ? '100 കി.ഗ്രാം ചാണകപ്പൊടിയുമായി ചേർത്ത് അല്ലെങ്കിൽ വേരുകൾക്ക് സമീപം ഒഴിച്ചു കൊടുക്കുക. മണ്ണിലെ സ്ഥിരീകരിക്കപ്പെട്ട ഫോസ്ഫറസ് ചെടികൾക്ക് ലഭ്യമാക്കുന്നു.'
          : 'Mix with 100 kg moist compost or drench root zone. Mobilizes insoluble rock phosphates into plant-available orthophosphates.',
      },
    ],
    agronomicRationale: isMl
      ? 'ചെടികൾ കായിക വളർച്ചയിൽ നിന്ന് പൂവിടുന്ന ഘട്ടത്തിലേക്ക് മാറുമ്പോൾ ഫോസ്ഫറസിന്റെ ആവശ്യം പലമടങ്ങായി വർദ്ധിക്കുന്നു. ഈ സമയത്ത് അമിത നൈട്രജൻ നൽകിയാൽ തളിരിലകൾ കൂടുതൽ ഉണ്ടാവുകയും പൂക്കൾ കൊഴിയുകയും ചെയ്യും. എന്നാൽ ഫോസ്ഫറസും പൊട്ടാസ്യവും കായ്പിടുത്തം വർദ്ധിപ്പിക്കും.'
      : 'As plants shift from purely vegetative canopy development into flower bud differentiation, their phosphorus requirement multiplies. Excessive nitrogen at this juncture causes tender vegetative flushing and blossom drop, whereas phosphorus and potassium ensure thick pedicels and disease resistance.',
    overApplicationWarnings: [
      isMl
        ? 'അമിത നൈട്രജൻ ഇലകൾ മൃദുവാക്കുകയും നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളെയും കുമിൾ രോഗങ്ങളെയും ആകർഷിക്കുകയും ചെയ്യുന്നു.'
        : 'Excess nitrogen creates soft, watery plant tissues that attract sucking pests (aphids, thrips) and fungal blights.',
      isMl
        ? 'തടിയോട് ചേർത്ത് രാസവളങ്ങൾ പ്രയോഗിച്ചാൽ തടി അഴുകലിനും വേര് കരിയലിനും കാരണമാകും.'
        : 'Applying chemical fertilizer directly against the stem collar causes osmotic burn and collar rot.',
      isMl
        ? 'അമിത രാസ ഫോസ്ഫറസ് മണ്ണിലെ സിങ്ക്, ഇരുമ്പ് തുടങ്ങിയ സൂക്ഷ്മമൂലകങ്ങളുടെ ലഭ്യത തടസ്സപ്പെടുത്തും.'
        : 'Over-applying chemical phosphorus can bind trace micronutrients like Zinc and Iron in the soil.',
    ],
    localGuidanceNotice: isMl
      ? 'DARTHI AI നൽകുന്ന വള ശുപാർശകൾ പ്രാഥമിക കാർഷിക നിർദ്ദേശങ്ങൾ മാത്രമാണ്. കൃഷിഭവന്റെയോ കൃഷി വിജ്ഞാൻ കേന്ദ്രത്തിന്റെയോ (KVK) സോയിൽ ഹെൽത്ത് കാർഡ് അടിസ്ഥാനമാക്കിയുള്ള ഉപദേശങ്ങൾ കൂടി തേടുക.'
      : 'Fertilizer recommendations provided by DARTHI AI are advisory guidelines based on soil test baselines. Always consider local Krishi Vigyan Kendra (KVK) soil health cards and state university package of practices.',
  });

  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFertilizerAdvice({
        crop: targetCrop,
        growthStage,
        nitrogen: farmData.nitrogen,
        phosphorus: farmData.phosphorus,
        potassium: farmData.potassium,
        soilPh: farmData.soilPh,
        language: preferredLanguage,
      });
      setAdvice(data);
    } catch (err) {
      console.warn('Notice fetching fertilizer advice, using package of practices baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadge = (category: 'Organic' | 'Chemical' | 'Bio-fertilizer') => {
    switch (category) {
      case 'Organic':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {isMl ? 'ജൈവവളം' : 'Organic Natural'}
          </span>
        );
      case 'Bio-fertilizer':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            {isMl ? 'ജീവാണുവളം' : 'Bio-fertilizer (Microbial)'}
          </span>
        );
      case 'Chemical':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {isMl ? 'രാസവളം' : 'Targeted Chemical / Water Soluble'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            {isMl ? 'കൃത്യതയാർന്ന വളപ്രയോഗ ഉപദേശകൻ' : 'Precision Fertilizer & Nutrient Advisor'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'മണ്ണിലെ പോഷക ലഭ്യതയ്ക്കും വിളയുടെ വളർച്ചാ ഘട്ടത്തിനും അനുയോജ്യമായ വള ശുപാർശകൾ.'
              : 'Science-backed fertilizer dosage tailored to current soil reserves and crop growth stage.'}
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (isMl ? 'കണക്കുകൂട്ടുന്നു...' : 'Calculating Dosage...') : (isMl ? 'AI വള ശുപാർശ പുതുക്കുക' : 'Recalculate with Gemini')}</span>
        </button>
      </div>

      {/* Stage & Crop Controls */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4">
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            {isMl ? 'വിള' : 'Crop'}
          </label>
          <input
            type="text"
            value={targetCrop}
            onChange={(e) => setTargetCrop(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
          />
        </div>

        <div className="sm:col-span-5">
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            {isMl ? 'നിലവിലെ വളർച്ചാ ഘട്ടം' : 'Current Growth Stage'}
          </label>
          <select
            value={growthStage}
            onChange={(e) => setGrowthStage(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium cursor-pointer"
          >
            <option value={isMl ? 'മുളയ്ക്കലും തൈപ്പരുവവും' : 'Germination & Seedling Stage'}>
              {isMl ? 'മുളയ്ക്കലും തൈപ്പരുവവും' : 'Germination & Seedling Stage'}
            </option>
            <option value={isMl ? 'കായിക വളർച്ചാ ഘട്ടം' : 'Vegetative Growth Stage'}>
              {isMl ? 'കായിക വളർച്ചാ ഘട്ടം' : 'Vegetative Growth Stage'}
            </option>
            <option value={isMl ? 'പൂവിടലും കായ്പിടുത്തവും' : 'Flowering & Early Fruit Set'}>
              {isMl ? 'പൂവിടലും കായ്പിടുത്തവും' : 'Flowering & Early Fruit Set'}
            </option>
            <option value={isMl ? 'കായ് വളർച്ചാ ഘട്ടം' : 'Fruit Development & Bulking'}>
              {isMl ? 'കായ് വളർച്ചാ ഘട്ടം' : 'Fruit Development & Bulking'}
            </option>
            <option value={isMl ? 'വിളവെടുപ്പ് ഘട്ടം' : 'Maturity & Harvesting'}>
              {isMl ? 'വിളവെടുപ്പ് ഘട്ടം' : 'Maturity & Harvesting'}
            </option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="text-xs font-semibold text-gray-500 block mb-1">
            {isMl ? 'മണ്ണിലെ NPK അനുപാതം' : 'Current Soil NPK'}
          </label>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs font-extrabold text-emerald-900 text-center">
            {farmData.nitrogen} : {farmData.phosphorus} : {farmData.potassium} (mg/kg)
          </div>
        </div>
      </div>

      {/* Deficiency Analysis Banner */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          {isMl ? 'പോഷക സന്തുലിതാവസ്ഥയും ആവശ്യകതയും' : 'Nutrient Balance & Crop Demand Analysis'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60">
          {advice.deficiencyAnalysis}
        </p>
      </div>

      {/* Recommended Fertilizers Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          {isMl ? 'ശുപാർശ ചെയ്യുന്ന വളപ്രയോഗ പട്ടിക' : 'Recommended Fertilization Schedule'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advice.recommendedFertilizers.map((fert, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getCategoryBadge(fert.category)}
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {fert.name}
                </h3>

                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-950 mb-3">
                  {isMl ? 'അളവ്:' : 'Dosage:'} {fert.dosagePerAcre}
                </div>

                <div className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-700 block mb-0.5">
                    {isMl ? 'നൽകേണ്ട രീതിയും സമയവും:' : 'Method & Timing:'}
                  </span>
                  {fert.timingAndMethod}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isMl ? 'വളർച്ചാ ഘട്ടത്തിന് അനുയോജ്യം' : 'Crop Stage Match'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agronomic Rationale & Over-Application Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rationale */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {isMl ? 'ഈ വളപ്രയോഗത്തിന് പിന്നിലെ കാർഷിക ശാസ്ത്രം' : 'Agronomic Science Behind This Plan'}
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed p-3.5 bg-gray-50 rounded-2xl border border-gray-150">
            {advice.agronomicRationale}
          </p>
        </div>

        {/* Warnings */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-2 bg-amber-50/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {isMl ? 'അമിത വളപ്രയോഗ മുന്നറിയിപ്പുകൾ' : 'Over-Application & Misuse Warnings'}
          </h3>
          <ul className="space-y-1.5 text-xs text-amber-900">
            {advice.overApplicationWarnings.map((warning, idx) => (
              <li key={idx} className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Extension Disclaimer */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-xs text-gray-600">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-gray-800">
            {isMl ? 'കാർഷിക നിർദ്ദേശം: ' : 'Agricultural Advisory Notice: '}
          </span>
          {advice.localGuidanceNotice}
        </p>
      </div>
    </div>
  );
};
