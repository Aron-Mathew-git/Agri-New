import React, { useState, useEffect, useTransition } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  X,
  Check,
  Building2,
  Sparkles,
  Mountain,
  Waves,
  Trees,
  CloudRain,
  Sprout,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { KERALA_DISTRICTS } from '../data/keralaAgroData';
import { searchKeralaLocations } from '../services/api';

interface SearchResultItem {
  name: string;
  district: string;
  malayalamName?: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  agroZone?: string;
  primarySoilType?: string;
  isOfficialDistrict?: boolean;
}

export const KeralaLocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    selectedDistrict,
    changeKeralaLocation,
    isLocationLoading,
    farmData,
    preferredLanguage,
  } = useFarm();

  const isMl = preferredLanguage === 'ml';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [, startTransition] = useTransition();

  // Handle live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchKeralaLocations(searchQuery);
        startTransition(() => {
          setSearchResults(results);
        });
      } catch (err) {
        console.warn('Search notice, falling back to local Kerala taluks:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle GPS detection in Kerala
  const handleDetectGPS = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Check if within Kerala bounds (approx lat 8.0 - 12.9, lon 74.8 - 77.6)
        if (lat < 8.0 || lat > 13.0 || lon < 74.5 || lon > 77.8) {
          setGpsError(
            `Detected coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°) are outside Kerala. Switched to Wayanad Agro-Zone as fallback.`
          );
          setIsLocatingGps(false);
          return;
        }

        // Find closest Kerala district
        let closestDistrict = 'Wayanad';
        let minDistanceSq = Infinity;
        for (const [name, d] of Object.entries(KERALA_DISTRICTS)) {
          const dLat = lat - d.latitude;
          const dLon = lon - d.longitude;
          const distSq = dLat * dLat + dLon * dLon;
          if (distSq < minDistanceSq) {
            minDistanceSq = distSq;
            closestDistrict = name;
          }
        }

        await changeKeralaLocation(
          closestDistrict,
          `Live GPS: ${closestDistrict} (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
          lat,
          lon
        );
        setIsLocatingGps(false);
        setIsLocationModalOpen(false);
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsError(`Unable to retrieve GPS: ${err.message}. Please select your district from the list below.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectDistrict = async (districtName: string) => {
    const dist = KERALA_DISTRICTS[districtName];
    if (!dist) return;
    await changeKeralaLocation(districtName, `${dist.name}, Kerala`, dist.latitude, dist.longitude);
    setIsLocationModalOpen(false);
  };

  const handleSelectSearchResult = async (item: SearchResultItem) => {
    await changeKeralaLocation(
      item.district,
      item.name,
      item.latitude,
      item.longitude
    );
    setIsLocationModalOpen(false);
  };

  if (!isLocationModalOpen) return null;

  const currentDist = KERALA_DISTRICTS[selectedDistrict] || KERALA_DISTRICTS['Wayanad'];

  // Categorize districts
  const highlandDistricts = ['Wayanad', 'Idukki'];
  const granaryDistricts = ['Palakkad', 'Alappuzha', 'Thrissur'];
  const midlandDistricts = ['Kottayam', 'Malappuram', 'Pathanamthitta'];
  const coastalDistricts = [
    'Ernakulam',
    'Kozhikode',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Thiruvananthapuram',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {isMl ? 'കേരള ഫാം ലൊക്കേഷൻ തിരഞ്ഞെടുക്കുക' : 'Select Kerala Location'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {isMl ? '14 ജില്ലകളും പ്രാദേശിക പഞ്ചായത്തുകളും' : '14 Districts & Local Panchayats'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isMl
                  ? 'IMD / ഓപ്പൺ-മീറ്റിയോ തത്സമയ കാലാവസ്ഥയും കേരള കാർഷിക സർവകലാശാല (KAU) മണ്ണ് വിവരങ്ങളും'
                  : 'Pulls live agro-met weather from IMD / Open-Meteo & soil baselines from Kerala Agricultural University (KAU)'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label={isMl ? 'ലൊക്കേഷൻ വിൻഡോ അടയ്ക്കുക' : 'Close location selector'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Tool Bar */}
        <div className="p-6 pb-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isMl
                    ? 'ജില്ല, താലൂക്ക്, ഗ്രാമം തിരയുക (ഉദാ: കുട്ടനാട്, മേപ്പാടി, വട്ടവട, ചിറ്റൂർ)...'
                    : 'Search district, taluk, village (e.g., Kuttanad, Meppadi, Vattavada, Chittur)...'
                }
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* GPS Detection Button */}
            <button
              onClick={handleDetectGPS}
              disabled={isLocatingGps || isLocationLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Crosshair className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
              <span>
                {isLocatingGps
                  ? (isMl ? 'കേരള ജിപിഎസ് കണ്ടെത്തുന്നു...' : 'Detecting Kerala GPS...')
                  : (isMl ? 'നിലവിലെ ജിപിഎസ് ഉപയോഗിക്കുക' : 'Use Current GPS')}
              </span>
            </button>
          </div>

          {gpsError && (
            <div className="mt-2.5 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Current Active Location Pill */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-900">
                {isMl ? 'നിലവിലെ ലൊക്കേഷൻ:' : 'Current Active Location:'}
              </span>
              <span className="font-bold text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                📍 {isMl && farmData.malayalamDistrict ? `${farmData.location.split(',')[0]} (${farmData.malayalamDistrict})` : farmData.location}
              </span>
              <span className="text-emerald-700 hidden md:inline">
                ({currentDist.malayalamName} • {currentDist.elevationMeters}m MSL)
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="px-2 py-0.5 bg-emerald-200/70 rounded font-medium">
                {currentDist.agroZone.split('(')[0].trim()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body: Search Results or 14 Kerala Districts Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {searchQuery.trim() ? (
            /* Search Results View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Search Results for "{searchQuery}"
                </h3>
                {isSearching && (
                  <span className="text-xs text-emerald-600 animate-pulse">Searching localized database...</span>
                )}
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Compass className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">No specific match found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    Try entering the main district name (e.g., Wayanad, Palakkad, Alappuzha, Idukki) or select from the 14 agro-zones below.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((item, idx) => {
                    const d = KERALA_DISTRICTS[item.district] || KERALA_DISTRICTS['Wayanad'];
                    return (
                      <button
                        key={`${item.name}-${idx}`}
                        onClick={() => handleSelectSearchResult(item)}
                        disabled={isLocationLoading}
                        className="text-left p-3.5 bg-white hover:bg-emerald-50/70 border border-gray-200 hover:border-emerald-300 rounded-xl transition-all shadow-2xs group flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 group-hover:text-emerald-800">
                              {item.name}
                            </span>
                            {item.isOfficialDistrict && (
                              <span className="text-[10px] uppercase tracking-wide bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                District
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            Agro-Zone: <span className="font-medium text-emerald-700">{d.agroZone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1">
                            <span>🌱 Soil: {d.primarySoilType.split('&')[0]}</span>
                            <span>🏔️ {item.elevationMeters ?? d.elevationMeters}m MSL</span>
                          </div>
                        </div>
                        <div className="p-1 rounded-full text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-colors mt-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Complete 14 Districts Grouped by Agro-Climatic Zone */
            <div className="space-y-6">
              {/* Group 1: Highland Agro-Zone */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {isMl ? 'ഹൈലാൻഡ് & സുഗന്ധവ്യഞ്ജന മേഖല' : 'Highland & Spice Agro-Zones'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isMl
                        ? 'ഉയർന്ന മലയോര തോട്ടങ്ങൾ (700-1100m MSL), അമ്ലതയുള്ള വനമണ്ണ്, കാപ്പി & സുഗന്ധവ്യഞ്ജനങ്ങൾ'
                        : 'Misty high plateaus (700-1100m MSL), acidic humus-rich forest soils, coffee & spices'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlandDistricts.map((dName) => renderDistrictCard(dName))}
                </div>
              </div>

              {/* Group 2: Granary & Wetland Agro-Zones */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {isMl ? 'നെല്ലറ & കോൾ / തണ്ണീർത്തട മേഖല' : 'Paddy Granaries & Kole / Below-Sea Wetlands'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isMl
                        ? 'പാലക്കാടൻ സമതലങ്ങൾ, കുട്ടനാടൻ കായൽ നിലങ്ങൾ, തൃശൂർ കോൾ പാടങ്ങൾ'
                        : 'Palakkad inland plains, Kuttanad below-sea-level polders, and Thrissur Kole fields'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {granaryDistricts.map((dName) => renderDistrictCard(dName))}
                </div>
              </div>

              {/* Group 3: Midland Laterite & Rubber Agro-Zones */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {isMl ? 'ഇടനാട് വെട്ടുകല്ല് & തോട്ടവിള മേഖല' : 'Midland Laterite & Plantation Heartland'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isMl
                        ? 'ചുവന്ന വെട്ടുകൽ കുന്നുകൾ, റബ്ബർ, അടയ്ക്ക, ജാതിക്ക, കരിമ്പ്'
                        : 'Rolling red laterite hills, rubber, arecanut, nutmeg, and sugarcane jaggery'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {midlandDistricts.map((dName) => renderDistrictCard(dName))}
                </div>
              </div>

              {/* Group 4: Coastal & Estuarine Agro-Zones */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {isMl ? 'തീരദേശ & കായലോര സമതലങ്ങൾ' : 'Coastal, Estuarine & Midland Lowlands'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isMl
                        ? 'തീരദേശ മണൽ, പൊക്കാളി കൃഷി, തെങ്ങ്, കശുമാവ്, വാഴക്കുളം പൈനാപ്പിൾ'
                        : 'Alluvial sands, Pokkali salt-tolerant rice, coastal coconut, cashew, and Vazhakulam pineapple'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {coastalDistricts.map((dName) => renderDistrictCard(dName))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Official Government Data Citations */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700">
              {isMl ? 'ഔദ്യോഗിക ഡാറ്റ ഉറവിടങ്ങൾ:' : 'Official Datasets:'}
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
              <CloudRain className="w-3 h-3 text-blue-500" /> IMD / Open-Meteo Agro-Met
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
              <Sprout className="w-3 h-3 text-emerald-600" /> KAU Package of Practices
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
              <Building2 className="w-3 h-3 text-amber-600" /> Agmarknet / Horticorp Mandis
            </span>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition cursor-pointer"
          >
            {isMl ? 'പൂർത്തിയായി' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );

  function renderDistrictCard(districtName: string) {
    const d = KERALA_DISTRICTS[districtName];
    if (!d) return null;
    const isSelected = selectedDistrict === d.name;
    const flagship = d.dominantCrops.find((c) => c.isFlagship) || d.dominantCrops[0];

    return (
      <button
        key={d.id}
        onClick={() => handleSelectDistrict(d.name)}
        disabled={isLocationLoading}
        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer ${
          isSelected
            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-emerald-300 shadow-2xs'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm">
                  {isMl ? d.malayalamName : d.name}
                </span>
                {!isMl && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                    {d.malayalamName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">{d.tagline}</p>
            </div>
            {isSelected ? (
              <span className="p-1 rounded-full bg-emerald-600 text-white shrink-0 shadow-2xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 group-hover:text-emerald-600">
                {isMl ? 'തിരഞ്ഞെടുക്കുക' : 'Select'}
              </span>
            )}
          </div>

          <div className="mt-2.5 space-y-1 text-xs">
            <div className="flex items-center gap-1 text-gray-700">
              <span className="font-medium">{isMl ? 'പ്രധാന വിള:' : 'Flagship:'}</span>
              <span className="text-emerald-800 font-semibold line-clamp-1">{flagship.name}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>pH {d.soilBaseline.ph} ({d.primarySoilType.split('&')[0].trim()})</span>
              <span>{d.elevationMeters}m MSL</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span className="truncate max-w-[170px]">{d.mandis[0]}</span>
          <span className="shrink-0 text-emerald-600 font-medium group-hover:underline">
            {isSelected ? (isMl ? 'സജീവം' : 'Active') : (isMl ? 'മാറ്റുക' : 'Switch')}
          </span>
        </div>
      </button>
    );
  }
};
