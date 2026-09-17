import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchCropRecommendations } from '../../services/api';
import { CropRecommendationItem } from '../../types';
import { t, translateCrop, translateDistrict } from '../../translations';
import {
  Sparkles,
  Loader2,
  Droplets,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  TrendingUp,
} from 'lucide-react';

export const CropRecommendationView: React.FC = () => {
  const { farmData, updateFarmData, districtInfo, setIsLocationModalOpen, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [location, setLocation] = useState(farmData.location);
  const [soilPh, setSoilPh] = useState(farmData.soilPh);
  const [nitrogen, setNitrogen] = useState(farmData.nitrogen);
  const [phosphorus, setPhosphorus] = useState(farmData.phosphorus);
  const [potassium, setPotassium] = useState(farmData.potassium);
  const [soilMoisture, setSoilMoisture] = useState(farmData.soilMoisture);
  const [temperature, setTemperature] = useState(farmData.airTemperature);
  const [rainfall, setRainfall] = useState(isMl ? 'ഉയർന്ന മൺസൂൺ (2200-3600 മി.മീ)' : 'High Monsoon (2200-3600 mm)');
  const [season, setSeason] = useState(isMl ? 'വിരിപ്പ് (ഒന്നാം വിള മൺസൂൺ)' : 'Virippu (First Crop Monsoon)');
  const [availableWater, setAvailableWater] = useState(isMl ? 'ധാരാളം (കനാൽ / പുഴ / കിണർ)' : 'High (Canal / River / Perennial Open Well)');
  const [farmSize, setFarmSize] = useState(farmData.farmSize);

  // Sync when location changes
  React.useEffect(() => {
    setLocation(farmData.location);
    setSoilPh(farmData.soilPh);
    setNitrogen(farmData.nitrogen);
    setPhosphorus(farmData.phosphorus);
    setPotassium(farmData.potassium);
    setSoilMoisture(farmData.soilMoisture);
    setTemperature(farmData.airTemperature);

    // Populate KAU Package of Practices crops for this district
    if (districtInfo?.dominantCrops && districtInfo.dominantCrops.length > 0) {
      const kauRecommendations: CropRecommendationItem[] = districtInfo.dominantCrops.map((c) => ({
        cropName: `${c.name} (${c.variety})`,
        suitabilityScore: c.isFlagship ? 96 : 90,
        expectedYield: c.typicalYield,
        waterRequirement: c.waterNeed,
        soilSuitability: isMl
          ? `pH ${districtInfo.soilBaseline.ph} ഉള്ള ${districtInfo.primarySoilType} മണ്ണിന് അനുയോജ്യം`
          : `Adapted to ${districtInfo.primarySoilType} at pH ${districtInfo.soilBaseline.ph}`,
        reasonForRecommendation: isMl
          ? `${districtInfo.malayalamName || districtInfo.name}-ലെ ${districtInfo.agroZone} കാർഷിക മേഖലയ്ക്കായി കേരള കാർഷിക സർവ്വകലാശാല (KAU) ശുപാർശ ചെയ്യുന്നത്. ${districtInfo.mandis[0]} വിപണിയിൽ മികച്ച സ്ഥിരത.`
          : `Recommended by Kerala Agricultural University (KAU) Package of Practices for ${districtInfo.agroZone}. High market stability in ${districtInfo.mandis[0]}.`,
        potentialRisks: isMl
          ? ['മഴക്കാലത്ത് ഇലപ്പുള്ളി രോഗം', 'ഈർപ്പമുള്ള കാലാവസ്ഥയിൽ തണ്ടുതുരപ്പൻ പുഴു / ദ്രുതവാട്ടം']
          : ['Leaf blotch during active monsoon', 'Stem borer / Quick wilt in humid season'],
        basicRequirements: {
          season: c.season,
          durationDays: c.duration,
          idealPh: districtInfo.soilBaseline.phRange,
          spacing: isMl ? 'KAU മാനദണ്ഡം' : 'Standard KAU Spacing',
        },
      }));
      setRecommendations(kauRecommendations);
      setSummary(
        isMl
          ? `${districtInfo.malayalamName || districtInfo.name} (${districtInfo.agroZone}) KAU ശുപാർശ: തിരഞ്ഞെടുത്ത വിളകൾ പ്രാദേശിക മണ്ണിലും മൺസൂൺ കാലാവസ്ഥയിലും മികച്ച രീതിയിൽ വളരുന്നവയാണ്.`
          : `KAU Agro-Zone Recommendation for ${districtInfo.name} (${districtInfo.agroZone}): Selected crops excel in ${districtInfo.primarySoilType} and withstand regional monsoon humidity.`
      );
    }
  }, [farmData.district, districtInfo, preferredLanguage]);

  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>([
    {
      cropName: isMl ? 'സോയാബീൻ (JS 335)' : 'Soybean (JS 335 / NRC 37)',
      suitabilityScore: 94,
      expectedYield: isMl ? '10-12 ക്വിന്റൽ/ഏക്കർ' : '10-12 quintals/acre',
      waterRequirement: isMl ? 'മിതമായത് (450-600 മി.മീ)' : 'Moderate (450-600 mm)',
      soilSuitability: isMl
        ? 'നല്ല നീർവാർച്ചയുള്ള പശിമരാശി മണ്ണിൽ pH 6.5 ന് അനുയോജ്യം. സ്വാഭാവികമായി നൈട്രജൻ നൽകുന്നു.'
        : 'Excellent match for pH 6.5 with well-drained loam. Fixes nitrogen naturally.',
      reasonForRecommendation: isMl
        ? 'കുറഞ്ഞ ചെലവ്, മിതമായ മഴയിൽ മികച്ച വിളവ്, അടുത്ത വിളയ്ക്കായി മണ്ണിൽ നൈട്രജൻ നിക്ഷേപിക്കുന്നു.'
        : 'High domestic industrial crushing demand, low input cost, thrives under moderate rain, and leaves nitrogen in the soil for the next rabi cycle.',
      potentialRisks: isMl ? ['വെള്ളീച്ച മൂലമുള്ള മഞ്ഞളിപ്പ് രോഗം', 'വിളവെടുപ്പ് വേളയിൽ കനത്ത മഴ'] : ['Yellow Mosaic Virus if whitefly occurs', 'Excessive rain during final harvest week'],
      basicRequirements: {
        season: isMl ? 'ഖാരിഫ് / വിരിപ്പ്' : 'Kharif',
        durationDays: isMl ? '95-105 ദിവസങ്ങൾ' : '95-105 days',
        idealPh: '6.0 - 7.5',
        spacing: '45 cm x 10 cm',
      },
    },
    {
      cropName: isMl ? 'തക്കാളി (ഹൈബ്രിഡ് അഭിനവ്)' : 'Tomato (Hybrid Abhinav)',
      suitabilityScore: 91,
      expectedYield: isMl ? '20-25 ടൺ/ഏക്കർ' : '20-25 tons/acre',
      waterRequirement: isMl ? 'മിതമായത് (തുള്ളിനന അനുയോജ്യം)' : 'Moderate (Drip irrigation recommended)',
      soilSuitability: isMl
        ? 'pH 6.5 ഉം പൊട്ടാസ്യത്തിന്റെ ലഭ്യതയും കട്ടിയുള്ള തൊലിയും ദീർഘകാല സംഭരണശേഷിയും ഉറപ്പാക്കുന്നു.'
        : 'Optimal pH 6.5 and strong potassium reserves guarantee firm fruit skin and high transport shelf-life.',
      reasonForRecommendation: isMl
        ? 'സ്ഥിരമായ വരുമാനം. 2 മാസത്തേക്ക് ഓരോ 4-5 ദിവസത്തിലും വിളവെടുക്കാം. വിപണിയിൽ മികച്ച വില.'
        : 'Fast recurring cash flow with harvest every 4-5 days over 2 months. Strong nearby wholesale APMC mandi prices.',
      potentialRisks: isMl ? ['തുടർച്ചയായ മേഘാവൃത കാലാവസ്ഥയിൽ കുമിൾ രോഗം', 'പൂവിടുന്ന ഘട്ടത്തിൽ കായതുരപ്പൻ പുഴു'] : ['Early Blight during continuous cloud cover', 'Fruit borer in early flowering'],
      basicRequirements: {
        season: isMl ? 'വിരിപ്പ് / മുണ്ടകൻ' : 'Kharif / Rabi',
        durationDays: isMl ? '120-140 ദിവസങ്ങൾ' : '120-140 days',
        idealPh: '6.0 - 7.0',
        spacing: '90 cm x 60 cm',
      },
    },
    {
      cropName: isMl ? 'മക്കച്ചോളം (ഹൈബ്രിഡ് HQPM-1)' : 'Maize (Hybrid HQPM-1 / Bio 9681)',
      suitabilityScore: 88,
      expectedYield: isMl ? '22-26 ക്വിന്റൽ/ഏക്കർ' : '22-26 quintals/acre',
      waterRequirement: isMl ? 'മിതമായത് (500-700 മി.മീ)' : 'Moderate (500-700 mm)',
      soilSuitability: isMl
        ? 'മണ്ണിലെ നൈട്രജനും പൊട്ടാസ്യവും കാര്യക്ഷമമായി ഉപയോഗിക്കുന്നു.'
        : 'Efficient consumer of existing soil Nitrogen and Potassium.',
      reasonForRecommendation: isMl
        ? 'പ്രതികൂല കാലാവസ്ഥയെ അതിജീവിക്കാനുള്ള കരുത്ത്, കാലിത്തീറ്റ നിർമ്മാണത്തിനുള്ള സ്ഥിരമായ ആവശ്യം.'
        : 'Hardy against erratic rains, assured procurement for poultry feed and starch mills, easy mechanization.',
      potentialRisks: isMl ? ['ആദ്യ ഘട്ടങ്ങളിൽ പടയപ്പ പുഴു'] : ['Fall Armyworm in early vegetative phase'],
      basicRequirements: {
        season: isMl ? 'വിരിപ്പ് / പുഞ്ച' : 'Kharif / Zaid',
        durationDays: isMl ? '100-115 ദിവസങ്ങൾ' : '100-115 days',
        idealPh: '5.8 - 7.2',
        spacing: '60 cm x 20 cm',
      },
    },
  ]);
  const [summary, setSummary] = useState(
    isMl
      ? 'നിങ്ങളുടെ മണ്ണിന്റെ pH 6.5 ഉം ജലലഭ്യതയും അടിസ്ഥാനമാക്കി, പയറുവർഗ്ഗ-പച്ചക്കറി വിളകൾ മണ്ണിന്റെ ഘടന നിലനിർത്തുന്നതിനൊപ്പം മികച്ച ലാഭവും നൽകും.'
      : 'Based on your neutral soil pH of 6.5 and moderate water access, legume-vegetable rotations like Soybean or Tomato will maximize net profit per acre while preserving soil organic structure.'
  );

  const handleRecommend = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCropRecommendations({
        location,
        soilPh,
        nitrogen,
        phosphorus,
        potassium,
        soilMoisture,
        temperature,
        rainfall,
        season,
        availableWater,
        farmSize,
        language: preferredLanguage,
      });
      setRecommendations(data.recommendations);
      setSummary(data.overallSummary);
    } catch (err) {
      console.warn('Notice generating recommendations, using regional crop database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCropForFarm = (cropName: string) => {
    updateFarmData({ currentCrop: cropName });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              {isMl ? 'AI വിള ശുപാർശ സംവിധാനം' : 'AI Crop Recommendation Engine'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {isMl ? 'KAU കാർഷിക രീതികൾ' : 'KAU Package of Practices'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? `${farmData.location}-ലേക്ക് അനുയോജ്യമായ വിളകൾ (${districtInfo?.malayalamName || districtInfo?.agroZone}).`
              : `Recommending crops for ${farmData.location} (${districtInfo?.agroZone}).`}
          </p>
        </div>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('changeLocation', preferredLanguage)}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Farmer Input Parameters */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            {isMl ? 'തോട്ടത്തിന്റെ വിവരങ്ങളും ഘടകങ്ങളും' : 'Farm Conditions & Inputs'}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'സ്ഥലം / പ്രദേശം' : 'Farm Location / Region'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'സീസൺ' : 'Season'}</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option>{isMl ? 'വിരിപ്പ് / വർഷകാലം' : 'Kharif / Monsoon'}</option>
                  <option>{isMl ? 'മുണ്ടകൻ / ശീതകാലം' : 'Rabi / Winter'}</option>
                  <option>{isMl ? 'പുഞ്ച / വേനൽക്കാലം' : 'Zaid / Summer'}</option>
                  <option>{isMl ? 'ദീർഘകാല വിള' : 'Perennial'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'വിസ്തൃതി (ഏക്കർ)' : 'Farm Size (Acres)'}</label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'ലഭ്യമായ ജലസ്രോതസ്സ്' : 'Available Water Source'}
              </label>
              <select
                value={availableWater}
                onChange={(e) => setAvailableWater(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
              >
                <option>{isMl ? 'ധാരാളം (കനാൽ / പുഴ / കിണർ)' : 'Abundant (Canal / River + Borewell)'}</option>
                <option>{isMl ? 'മിതമായത് (ബോർവെൽ / തുള്ളിനന)' : 'Moderate (Borewell / Drip system)'}</option>
                <option>{isMl ? 'പരിമിതം (മഴയെ ആശ്രയിച്ച്)' : 'Scarce (Rainfed / Limited Tanker)'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'മണ്ണിന്റെ pH' : 'Soil pH'}</label>
                <input
                  type="number"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'മണ്ണിലെ ഈർപ്പം (%)' : 'Soil Moisture (%)'}</label>
                <input
                  type="number"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">N (mg/kg)</label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">P (mg/kg)</label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">K (mg/kg)</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'ശരാശരി താപനില (°C)' : 'Avg Temp (°C)'}</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">{isMl ? 'പ്രതീക്ഷിക്കുന്ന മഴ' : 'Rainfall Expectation'}</label>
                <select
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 text-xs"
                >
                  <option>{isMl ? 'കുറഞ്ഞത് (<500 മി.മീ)' : 'Low (<500 mm)'}</option>
                  <option>{isMl ? 'മിതമായത് (650-850 മി.മീ)' : 'Moderate (650-850 mm)'}</option>
                  <option>{isMl ? 'കൂടുതൽ (>1000 മി.മീ)' : 'High (>1000 mm)'}</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isMl ? 'AI പരിശോധിക്കുന്നു...' : 'Evaluating with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isMl ? 'വിള ശുപാർശ നേടുക' : 'Recommend Crop'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Recommendations Cards */}
        <div className="lg:col-span-8 space-y-4">
          {summary && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {isMl ? 'കാർഷിക വിദഗ്ദ്ധന്റെ കുറിപ്പ്: ' : 'Agronomist Recommendation Note: '}
                </span>
                {summary}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {recommendations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{item.cropName}</h3>
                      <p className="text-xs text-emerald-700 font-medium">
                        {isMl ? 'പ്രതീക്ഷിക്കുന്ന വിളവ്: ' : 'Expected Yield: '} {item.expectedYield}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                      <span>{item.suitabilityScore}% {isMl ? 'അനുയോജ്യം' : 'Match'}</span>
                    </div>
                    <button
                      onClick={() => handleSelectCropForFarm(item.cropName)}
                      className="px-3 py-1 rounded-full bg-gray-100 hover:bg-emerald-700 hover:text-white text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isMl ? 'നിലവിലെ വിളയായി തിരഞ്ഞെടുക്കുക' : 'Set As Current Crop'}
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-800">
                      {isMl ? 'എന്തുകൊണ്ട് ശുപാർശ ചെയ്തു: ' : 'Why recommended: '}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{item.reasonForRecommendation}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-150">
                      <span className="font-bold text-blue-800 flex items-center gap-1 mb-0.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        {isMl ? 'ജലാവശ്യകത' : 'Water Requirement'}
                      </span>
                      <span className="text-gray-700">{item.waterRequirement}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-150">
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        {isMl ? 'മണ്ണിന്റെ അനുയോജ്യത' : 'Soil Suitability'}
                      </span>
                      <span className="text-gray-700">{item.soilSuitability}</span>
                    </div>
                  </div>

                  {/* Basic farming requirements */}
                  <div className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/70">
                    <p className="font-bold text-emerald-950 mb-1.5">
                      {isMl ? 'കൃഷി വിവരങ്ങൾ:' : 'Farming Specifications:'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-700">
                      <div>
                        <span className="text-gray-500 block">{isMl ? 'സീസൺ:' : 'Season:'}</span>
                        <span className="font-semibold">{item.basicRequirements.season}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">{isMl ? 'വിള ദൈർഘ്യം:' : 'Crop Duration:'}</span>
                        <span className="font-semibold">{item.basicRequirements.durationDays}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">{isMl ? 'അനുയോജ്യമായ pH:' : 'Ideal pH:'}</span>
                        <span className="font-semibold">{item.basicRequirements.idealPh}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">{isMl ? 'ചെടികൾ തമ്മിലുള്ള അകലം:' : 'Plant Spacing:'}</span>
                        <span className="font-semibold">{item.basicRequirements.spacing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Potential risks */}
                  {item.potentialRisks.length > 0 && (
                    <div className="flex items-start gap-2 text-amber-900 bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{isMl ? 'സാധ്യതയുള്ള അപകടങ്ങൾ: ' : 'Potential Field Risks: '}</span>
                        <span>{item.potentialRisks.join(' • ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
