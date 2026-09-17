import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { t, translateDistrict, translateCrop } from '../../translations';
import {
  Settings,
  Sliders,
  Radio,
  Cpu,
  Save,
  CheckCircle2,
  Info,
  Layers,
  Droplets,
  Thermometer,
  CloudSun,
  Key,
  Database,
  ExternalLink,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    farmData,
    updateFarmData,
    sensors,
    updateSensorValue,
    demoMode,
    setDemoMode,
    autoSimulateSensors,
    setAutoSimulateSensors,
    preferredLanguage,
  } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [farmName, setFarmName] = useState(isMl ? 'ഗ്രീൻ ഏക്കർ ഫാം' : 'Green Acre Farms');
  const [farmerName, setFarmerName] = useState(isMl ? 'ആനന്ദ് കുൽക്കർണി' : 'Anand Kulkarni');
  const [location, setLocation] = useState(farmData.location);
  const [farmSize, setFarmSize] = useState(farmData.farmSize);
  const [currentCrop, setCurrentCrop] = useState(farmData.currentCrop);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmData({
      location,
      farmSize,
      currentCrop,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getTranslatedSensorName = (id: string, defaultName: string) => {
    if (!isMl) return defaultName;
    switch (id) {
      case 's-moisture': return 'മണ്ണിലെ ഈർപ്പം';
      case 's-soiltemp': return 'മണ്ണിലെ താപനില';
      case 's-airtemp': return 'അന്തരീക്ഷ താപനില';
      case 's-soilph': return 'മണ്ണിലെ pH';
      case 's-humidity': return 'അന്തരീക്ഷ ഈർപ്പം';
      case 's-solar': return 'സൂര്യപ്രകാശം';
      default: return defaultName;
    }
  };

  const getTranslatedStatus = (status: string) => {
    if (!isMl) return status;
    switch (status.toLowerCase()) {
      case 'optimal': return 'മികച്ചത്';
      case 'favorable': return 'അനുയോജ്യം';
      case 'neutral': return 'സാധാരണം';
      case 'high': return 'കൂടുതൽ';
      case 'low': return 'കുറവ്';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            {isMl ? 'ഫാം ക്രമീകരണങ്ങളും IoT ടെലിമെട്രി ഹബ്ബും' : 'Farm Settings & IoT Telemetry Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'ഫാം വിവരങ്ങൾ ക്രമീകരിക്കുക, IoT സെൻസറുകൾ നിയന്ത്രിക്കുക, സിസ്റ്റം സവിശേഷതകൾ കാണുക.'
              : 'Configure farm parameters, control simulated IoT sensor inputs, and view external API specifications.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Farm Profile Settings */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              {isMl ? 'ഫാം പ്രൊഫൈലും സ്ഥലവും' : 'Farm Profile & Location'}
            </h2>
            {isSaved && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> {isMl ? 'പ്രൊഫൈൽ പുതുക്കി' : 'Profile Updated'}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'ഫാമിന്റെ പേര്' : 'Farm Name'}
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'കർഷകന്റെ / നടത്തിപ്പുകാരന്റെ പേര്' : 'Farmer / Operator Name'}
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {isMl ? 'സ്ഥലം / ജില്ല' : 'Location / District'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {isMl ? 'ആകെ വിസ്തീർണ്ണം (ഏക്കർ)' : 'Total Acreage (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'നിലവിലെ പ്രധാന വിള' : 'Current Primary Crop'}
              </label>
              <input
                type="text"
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isMl ? 'ഫാം വിവരങ്ങൾ സംരക്ഷിക്കുക' : 'Save Farm Details'}</span>
            </button>
          </form>

          {/* Demo Mode Toggle */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900">
                  {isMl ? 'ഡെമോ ടെലിമെട്രി മോഡ്' : 'Demo Telemetry Mode'}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {isMl
                    ? 'കൃത്രിമ വിള, മണ്ണ്, കാലാവസ്ഥാ വിവരങ്ങൾ ഉപയോഗിച്ച് പ്രവർത്തിക്കുക'
                    : 'Operate with realistic simulated crop, soil, and weather inputs'}
                </p>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  demoMode ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    demoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live IoT Sensor Interactive Simulator */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              {isMl ? 'തത്സമയ സെൻസർ സിമുലേറ്റർ' : 'Live Sensor Simulator (Real-time Tuning)'}
            </h2>
            <button
              onClick={() => setAutoSimulateSensors(!autoSimulateSensors)}
              className={`text-xs px-3 py-1 rounded-full font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                autoSimulateSensors
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${autoSimulateSensors ? 'animate-pulse text-teal-600' : ''}`} />
              <span>
                {autoSimulateSensors
                  ? (isMl ? 'സ്ട്രീമിംഗ് ഓൺ' : 'Streaming On')
                  : (isMl ? 'ഓട്ടോ സ്ട്രീം തുടങ്ങുക' : 'Start Auto Stream')}
              </span>
            </button>
          </div>

          <p className="text-xs text-gray-600">
            {isMl
              ? 'സെൻസർ അളവുകൾ മാറ്റുമ്പോൾ ഡാഷ്‌ബോർഡിൽ ഉണ്ടാകുന്ന മാറ്റങ്ങൾ തത്സമയം കാണാം:'
              : 'Drag the sliders below to see DARTHI AI react immediately across the entire dashboard:'}
          </p>

          <div className="space-y-4">
            {sensors.map((sensor) => {
              if (typeof sensor.value !== 'number') return null;

              let min = 0;
              let max = 100;
              let step = 1;
              if (sensor.id === 's-moisture') { min = 10; max = 90; }
              if (sensor.id === 's-soiltemp' || sensor.id === 's-airtemp') { min = 10; max = 48; }
              if (sensor.id === 's-soilph') { min = 4.5; max = 9.0; step = 0.1; }
              if (sensor.id === 's-humidity') { min = 20; max = 98; }

              return (
                <div key={sensor.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-150">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>{getTranslatedSensorName(sensor.id, sensor.name)}</span>
                    <span className="font-extrabold text-emerald-800">
                      {sensor.value} {sensor.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={sensor.value}
                    onChange={(e) => updateSensorValue(sensor.id, Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>{isMl ? 'കുറഞ്ഞത്:' : 'Min:'} {min}{sensor.unit}</span>
                    <span className="text-emerald-700 font-medium">
                      {isMl ? 'നില:' : 'Status:'} {getTranslatedStatus(sensor.status)}
                    </span>
                    <span>{isMl ? 'കൂടിയത്:' : 'Max:'} {max}{sensor.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hardware Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">
                {isMl ? 'ഹാർഡ്‌വെയർ കണക്റ്റിവിറ്റി അറിയിപ്പ്: ' : 'Hardware Connectivity Note: '}
              </span>
              {isMl
                ? 'ഈ പ്രിവ്യൂ മോഡിൽ, കൃത്രിമമായി സൃഷ്ടിച്ച സെൻസർ വിവരങ്ങളാണ് ഉപയോഗിക്കുന്നത്. യഥാർത്ഥ കൃഷിയിടങ്ങളിൽ ESP32/Arduino മൈക്രോകൺട്രോളറുകളിൽ നിന്ന് MQTT/LoRaWAN വഴി തത്സമയ ഡാറ്റ ലഭ്യമാക്കാം.'
                : 'In this preview mode, IoT sensor readings are modeled via high-fidelity simulated telemetry. In physical production deployments, data streams over MQTT/LoRaWAN from ESP32/Arduino microcontroller nodes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Integration Guide Section */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          {isMl ? 'DARTHI AI സിസ്റ്റം ആർക്കിടെക്ചറും സേവനങ്ങളും' : 'DARTHI AI System Architecture & Integrations'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <Key className="w-4 h-4 text-emerald-700" />
              {isMl ? 'Google Gemini 2.5 ഇന്റലിജൻസ്' : 'Google Gemini 2.5 Intelligence'}
            </div>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              {isMl
                ? 'കാർഷിക നിർദ്ദേശങ്ങൾ, മണ്ണു പരിശോധന, കാലാവസ്ഥാ വിശകലനം, കർഷക ചാറ്റ്ബോട്ട് എന്നിവ സെർവർ സൈഡിൽ @google/genai SDK വഴിയാണ് പ്രവർത്തിക്കുന്നത്.'
                : 'All agronomic reasoning, soil diagnosis, weather risk, and farmer chatbot responses are powered server-side via the modern @google/genai SDK using structured JSON schema output.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <CloudSun className="w-4 h-4 text-blue-700" />
              {isMl ? 'മൈക്രോക്ലൈമറ്റും കാലാവസ്ഥാ റഡാറും' : 'Microclimate & Weather Radar'}
            </div>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              {isMl
                ? 'മഴസാധ്യത, അന്തരീക്ഷ ഈർപ്പം, കാറ്റിന്റെ വേഗത എന്നിവ കണക്കാക്കി കൃത്യമായ ജലസേചന നിർദ്ദേശങ്ങൾ നൽകുന്നു.'
                : 'Weather telemetry models precipitation probabilities, humidity indexes, and wind gusts to calculate precise evapotranspiration rates and delay unneeded irrigation cycles.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-950">
              <Database className="w-4 h-4 text-teal-700" />
              {isMl ? 'അഗ്മാർക്ക്‌നെറ്റ് APMC മണ്ഡി ഫീഡ്' : 'Agmarknet APMC Mandi Feed'}
            </div>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              {isMl
                ? 'മാർക്കറ്റ് വിലകളും വരവും ഉത്പാദനച്ചെലവുമായി താരതമ്യം ചെയ്ത് കർഷകർക്ക് മികച്ച ലാഭം നേടാനുള്ള നിർദ്ദേശങ്ങൾ നൽകുന്നു.'
                : 'Commodity modal prices and daily arrivals correlate with production costs to provide actionable harvest staging advice and ROI forecasting for smallholder farmers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
