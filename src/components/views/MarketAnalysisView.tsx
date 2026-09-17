import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchMarketAdvice } from '../../services/api';
import { ProfitAnalysisResult, MarketPriceItem } from '../../types';
import { t, translateCrop, translateDistrict } from '../../translations';
import {
  TrendingUp,
  DollarSign,
  Calculator,
  Store,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Info,
  RefreshCw,
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

export const MarketAnalysisView: React.FC = () => {
  const { farmData, marketPrices, districtInfo, setIsLocationModalOpen, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [crop, setCrop] = useState(
    districtInfo?.dominantCrops[0]?.name || farmData.currentCrop.split(' ')[0] || 'Robusta Coffee'
  );
  const [farmSize, setFarmSize] = useState(farmData.farmSize);
  const [estimatedYield, setEstimatedYield] = useState(18); // quintals or tons per acre
  const [productionCost, setProductionCost] = useState(32000); // INR per acre
  const [currentPrice, setCurrentPrice] = useState(
    marketPrices[0]?.modalPrice || 21500
  ); // INR per quintal
  const [isLoading, setIsLoading] = useState(false);

  // Sync crop when district changes
  React.useEffect(() => {
    if (districtInfo?.dominantCrops && districtInfo.dominantCrops.length > 0) {
      const topCrop = districtInfo.dominantCrops[0].name;
      setCrop(topCrop);
      const matchingMandi = marketPrices.find(
        (m) => m.commodity.toLowerCase().includes(topCrop.toLowerCase())
      );
      if (matchingMandi) {
        setCurrentPrice(matchingMandi.modalPrice);
      }
    }
  }, [farmData.district, districtInfo, marketPrices]);

  const [profitResult, setProfitResult] = useState<ProfitAnalysisResult>({
    estimatedProduction: 63,
    unit: isMl ? 'ക്വിന്റൽ' : 'Quintals',
    estimatedRevenue: 1354500,
    totalProductionCost: 112000,
    estimatedNetProfit: 1242500,
    profitPerAcre: 355000,
    returnOnInvestmentPercent: 1109,
    breakEvenPrice: 1777,
    aiMarketStrategy: isMl
      ? 'കേരളത്തിലെ പ്രാദേശിക മൊത്തവ്യാപാര ചന്തകളിൽ നിലവിലെ ശരാശരി വിലകൾ ഉൽപ്പാദനച്ചെലവിനേക്കാൾ വളരെ മികച്ച ലാഭം നൽകുന്നു. അയൽ സംസ്ഥാനങ്ങളിൽ നിന്നുള്ള വരവ് കുറവായതിനാലും ഗുണമേന്മയുള്ള വിളകൾക്ക് മികച്ച ആവശ്യക്കാരുള്ളതിനാലും ഉത്പന്നങ്ങൾ ഘട്ടംഘട്ടമായി വിപണിയിലെത്തിക്കുന്നത് കൂടുതൽ ലാഭം നൽകും.'
      : 'At current wholesale rates in regional Kerala mandis, modal prices are commanding strong premiums above typical break-even production costs. Because arrivals from neighboring states remain constrained and export demand for GI-certified produce is firm, stagger drying and wholesale dispatch into 2-week batches.',
  });

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMarketAdvice({
        crop,
        farmSize,
        estimatedYield,
        productionCost,
        currentMarketPrice: currentPrice,
        language: preferredLanguage,
      });
      setProfitResult(data);
    } catch (err) {
      console.warn('Notice calculating market profit, using Kerala Agmarknet price baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mandiChartData = (marketPrices || []).slice(0, 8).map((m) => ({
    name: translateCrop(m.commodity.split(' ')[0], preferredLanguage),
    price: m.modalPrice,
    mandi: m.mandi.split(' ')[0],
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              {isMl ? 'കേരള ചന്ത വിലവിവരങ്ങളും ലാഭ കണക്കുകൂട്ടലും' : 'Kerala Mandi Market Intelligence & Profit Engine'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {isMl ? 'അഗ്മാർക്ക്നെറ്റ് & ഹോർട്ടികോർപ്പ് മൊത്തവില' : 'Agmarknet & Horticorp Wholesale'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? `${farmData.location}-ലെ മൊത്തവ്യാപാര നിരക്കുകൾ (${districtInfo?.mandis.join(', ')}).`
              : `Tracking wholesale prices in ${farmData.location} (${districtInfo?.mandis.join(', ')}).`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            {t('changeLocation', preferredLanguage)}
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] text-gray-500 font-medium block">
            {isMl ? 'ആകെ വിളവ്' : 'Total Harvest'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            {profitResult.estimatedProduction}
          </span>
          <span className="text-[10px] text-gray-400 block">{isMl ? 'ക്വിന്റൽ' : profitResult.unit}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] text-gray-500 font-medium block">
            {isMl ? 'ആകെ വരുമാനം' : 'Gross Revenue'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{profitResult.estimatedRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            {isMl ? 'ആകെ വരവ്' : 'Total Inflow'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] text-gray-500 font-medium block">
            {isMl ? 'ആകെ ചെലവ്' : 'Total Cost'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{profitResult.totalProductionCost.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 block">
            {isMl ? 'വളം + കൂലി' : 'Inputs + Labor'}
          </span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] text-emerald-900 font-semibold block">
            {isMl ? 'അറ്റാദായം' : 'Net Profit'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-950">
            ₹{profitResult.estimatedNetProfit.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block">
            {isMl ? 'കൈയിൽ ലഭിക്കുന്നത്' : 'Take-Home'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] text-gray-500 font-medium block">
            {isMl ? 'ഏക്കറിന് ലാഭം' : 'Profit / Acre'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{profitResult.profitPerAcre.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            {isMl ? 'പ്രതി ഏക്കർ ആദായം' : 'Per Acre Yield'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] text-gray-500 font-medium block">
            {isMl ? 'ലാഭശതമാനവും അടവുതുകയും' : 'ROI & Break-even'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {profitResult.returnOnInvestmentPercent}%
          </span>
          <span className="text-[10px] text-gray-500 block">
            {isMl
              ? `അടവുതുക: ₹${profitResult.breakEvenPrice}/ക്വി`
              : `Break-even: ₹${profitResult.breakEvenPrice}/qtl`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Financial Calculator */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            {isMl ? 'കാർഷിക ലാഭ കണക്കുകൂട്ടൽ യന്ത്രം' : 'Farm Profitability Calculator'}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'വിള' : 'Crop'}
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {isMl ? 'വിസ്തൃതി (ഏക്കർ)' : 'Farm Size (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {isMl ? 'പ്രതീക്ഷിക്കുന്ന വിളവ് (ക്വി/ഏക്കർ)' : 'Est. Yield (Qtl/Acre)'}
                </label>
                <input
                  type="number"
                  value={estimatedYield}
                  onChange={(e) => setEstimatedYield(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'ഏക്കറിന് ആകെ ഉത്പാദന ചെലവ് (₹)' : 'Total Production Cost Per Acre (₹)'}
              </label>
              <input
                type="number"
                step="500"
                value={productionCost}
                onChange={(e) => setProductionCost(Number(e.target.value))}
                placeholder={isMl ? 'വിത്ത്, വളം, കൂലി, നനയ്ക്കൽ ഉൾപ്പെടെ' : 'Includes seeds, fertilizer, labor, irrigation'}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                {isMl ? 'സാധാരണ ശരാശരി: ₹25,000 - ₹35,000 / ഏക്കർ' : 'Typical regional average: ₹25,000 - ₹35,000 / acre'}
              </span>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'പ്രതീക്ഷിക്കുന്ന വിൽപനവില (ക്വിന്റലിന് ₹)' : 'Expected Selling Price (₹ per Quintal)'}
              </label>
              <input
                type="number"
                step="50"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isMl ? 'AI കണക്കുകൂട്ടുന്നു...' : 'Computing Financial Margins with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isMl ? 'ലാഭവും വിപണന തന്ത്രവും കണക്കാക്കുക' : 'Calculate Profit & AI Market Strategy'}</span>
                </>
              )}
            </button>
          </div>

          {/* AI Strategy output */}
          {profitResult.aiMarketStrategy && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1 mt-3">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {isMl ? 'AI വിപണന തന്ത്രം:' : 'AI Mandi Selling Strategy:'}
              </span>
              <p className="leading-relaxed">{profitResult.aiMarketStrategy}</p>
            </div>
          )}
        </div>

        {/* Right Column: Live Mandi Price Feed & Comparative Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparative Chart */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              {isMl ? 'മേഖലയിലെ ശരാശരി ചന്തവിലകൾ (₹ / ക്വിന്റൽ)' : 'Regional Mandi Modal Prices (₹ / Quintal)'}
            </h2>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mandiChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} / ${isMl ? 'ക്വിന്റൽ' : 'Quintal'}`, isMl ? 'ശരാശരി വില' : 'Modal Price']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="price" name={isMl ? 'ശരാശരി വില' : 'Modal Price'} fill="#059669" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mandi Price Table */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                {isMl ? 'ചന്തകളിലെ മൊത്തവ്യാപാര വിലവിവരം' : 'APMC Mandi Wholesale Price Bulletin'}
              </h2>
              <span className="text-[11px] text-gray-500">
                {isMl ? 'ഇന്ന് രാവിലെ 08:30 ന് പുതുക്കിയത്' : 'Updated: Today 08:30 AM'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="pb-2">{isMl ? 'വിള' : 'Crop'}</th>
                    <th className="pb-2">{isMl ? 'ചന്ത' : 'Market / Mandi'}</th>
                    <th className="pb-2">{isMl ? 'ശരാശരി വില' : 'Modal Price'}</th>
                    <th className="pb-2">{isMl ? 'കുറഞ്ഞത് - കൂടിയത്' : 'Min - Max'}</th>
                    <th className="pb-2 text-right">{isMl ? 'മാറ്റം' : 'Trend'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {marketPrices.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                      onClick={() => {
                        setCrop(item.commodity);
                        setCurrentPrice(item.modalPrice);
                      }}
                    >
                      <td className="py-2.5 font-bold text-gray-900">{translateCrop(item.commodity, preferredLanguage)}</td>
                      <td className="py-2.5 text-gray-600">{item.mandi}</td>
                      <td className="py-2.5 font-extrabold text-emerald-800">
                        ₹{item.modalPrice} <span className="font-normal text-gray-500">/{isMl ? 'ക്വി' : 'qtl'}</span>
                      </td>
                      <td className="py-2.5 text-gray-500">
                        ₹{item.minPrice} - ₹{item.maxPrice}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            item.trend === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.trend === 'down'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                          {item.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                          {item.priceChangePercent > 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-gray-500 pt-1">
              {isMl
                ? 'സൂചന: കാൽക്കുലേറ്ററിലേക്ക് വിവരങ്ങൾ ചേർക്കാൻ ഏതെങ്കിലും നിരയിൽ ക്ലിക്ക് ചെയ്യുക.'
                : 'Tip: Click any row to automatically load that crop and current mandi price into your Profit Calculator.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
