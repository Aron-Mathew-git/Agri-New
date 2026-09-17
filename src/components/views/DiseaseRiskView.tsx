import React, { useState, useRef } from 'react';
import { useFarm } from '../../context/FarmContext';
import { fetchDiseaseRisk } from '../../services/api';
import { DiseaseRiskResult } from '../../types';
import { translateCrop } from '../../translations';
import {
  ShieldAlert,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Loader2,
  Info,
  X,
  Bug,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const DiseaseRiskView: React.FC = () => {
  const { farmData, preferredLanguage } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [crop, setCrop] = useState(farmData.currentCrop);
  const [symptoms, setSymptoms] = useState(
    isMl
      ? 'ഇലകളിൽ മഞ്ഞ കലർന്ന തവിട്ടുനിറത്തിലുള്ള പാടുകൾ കാണപ്പെടുന്നു.'
      : 'Small brownish spots with yellow halos on lower foliage after cloudy morning.'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<DiseaseRiskResult>({
    crop: farmData.currentCrop,
    overallRiskLevel: 'Moderate',
    detectedDiseases: [
      {
        diseaseName: isMl ? 'അൾട്ടർനേറിയ ഇലപ്പുള്ളി രോഗം (Early Blight)' : 'Early Blight (Alternaria solani)',
        pathogenType: isMl ? 'കുമിൾ' : 'Fungal',
        likelihood: isMl ? 'മിതമായത് മുതൽ കൂടുതൽ' : 'Moderate to High',
        description: isMl
          ? 'ഉയർന്ന താപനിലയും (27-30°C) ഈർപ്പവും (>70%) ഇലകളിൽ ഈർപ്പം തങ്ങിനിൽക്കുന്നതും അൾട്ടർനേറിയ കുമിൾ വളരാൻ കാരണമാകുന്നു.'
          : 'Warm temperatures (27-30°C) coupled with high humidity (>70%) and prolonged leaf moisture create the exact microclimate needed for Alternaria fungal conidia to germinate and penetrate epidermal leaf cells.',
      },
      {
        diseaseName: isMl ? 'തക്കാളി കായതുരപ്പൻ പുഴു (Fruit Borer)' : 'Tomato Fruit Borer (Helicoverpa armigera)',
        pathogenType: isMl ? 'കീടം' : 'Insect Pest',
        likelihood: isMl ? 'മിതമായത്' : 'Moderate',
        description: isMl
          ? 'ഈർപ്പമുള്ള കാലാവസ്ഥയിൽ ശലഭങ്ങൾ തളിരിലകളിലും പൂക്കളിലും മുട്ടയിടുന്നു.'
          : 'Moths become active at dusk during warm, humid spells and deposit spherical yellow-white eggs on tender leaves and floral calyxes.',
      },
    ],
    symptomsToMonitor: isMl
      ? [
          'താഴത്തെ ഇലകളിൽ വൃത്താകൃതിയിലുള്ള തവിട്ടുനിറം',
          'പാടുകൾക്ക് ചുറ്റും മഞ്ഞനിറത്തിലുള്ള വലയം',
          'കായകളിൽ ചെറിയ സുഷിരങ്ങൾ',
          'ഇലകൾ അകാലത്തിൽ കൊഴിയുന്നത്',
        ]
      : [
          "Concentric circular 'target-board' brown ring spots on lower older foliage",
          'Yellow chlorotic halos expanding around individual lesions',
          'Pin-sized boreholes near fruit calyx with dark granular frass',
          'Premature defoliation exposing green fruit to sunscald',
        ],
    preventiveActions: isMl
      ? [
          'മണ്ണിൽ തട്ടുന്ന താഴത്തെ ഇലകൾ നീക്കം ചെയ്യുക',
          'തോട്ടത്തിൽ വായുസഞ്ചാരം ഉറപ്പാക്കാൻ ചെടികൾക്ക് താങ്ങ് നൽകുക',
          'ഏക്കറിന് 5 ഫെറമോൺ കെണികൾ സ്ഥാപിക്കുക',
        ]
      : [
          'Prune lower 15-20 cm foliage touching moist soil to cut off splash contamination',
          'Ensure tomato stakes and trellis wires are tightened to maximize airflow drying inside canopy',
          'Install 5 pheromone traps per acre for early adult Helicoverpa moth monitoring',
        ],
    whenToSeekExpert: isMl
      ? '20 ശതമാനത്തിലധികം ചെടികളിൽ രോഗലക്ഷണം കാണുകയോ തണ്ടുകൾ ചീയുകയോ ചെയ്താൽ അടുത്തുള്ള കൃഷിഭവനുമായോ കൃഷി വിജ്ഞാൻ കേന്ദ്രവുമായോ ഉടൻ ബന്ധപ്പെടുക.'
      : 'If concentric lesions appear on more than 20% of your plants or black sunken stem cankers develop at soil level, consult your local district agricultural extension officer or Krishi Vigyan Kendra immediately for laboratory smear testing.',
    disclaimer: isMl
      ? 'ഡാർത്തി AI നൽകുന്ന വിവരങ്ങൾ കാലാവസ്ഥാ ഘടകങ്ങളെയും റിപ്പോർട്ട് ചെയ്ത ലക്ഷണങ്ങളെയും അടിസ്ഥാനമാക്കിയുള്ളതാണ്. ഇത് ലാബ് പരിശോധനയ്ക്ക് പകരമല്ല.'
      : 'DARTHI AI provides early-warning disease assessments based on microclimatic humidity, temperature thresholds, and reported visual symptoms. This is an advisory tool and does not substitute for certified lab diagnostics.',
  });

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAnalyzeRisk = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDiseaseRisk({
        crop,
        symptoms,
        weather: {
          temp: farmData.airTemperature,
          humidity: farmData.humidity,
          rainfallProb: farmData.rainfallProbability,
        },
        hasImage: !!selectedImage,
        language: preferredLanguage,
      });
      setResult(data);
    } catch (err) {
      console.warn('Notice analyzing disease risk, using diagnostic baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level: 'Low' | 'Moderate' | 'High' | 'Severe') => {
    switch (level) {
      case 'Low':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isMl ? 'കുറഞ്ഞ രോഗ സാധ്യത' : 'Low Risk Level'}
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {isMl ? 'മിതമായ രോഗ സാധ്യത' : 'Moderate Disease Risk'}
          </span>
        );
      case 'High':
      case 'Severe':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            {isMl ? 'ഉയർന്ന രോഗ സാധ്യത മുന്നറിയിപ്പ്' : `${level} Disease Risk Warning`}
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
            <ShieldAlert className="w-6 h-6 text-emerald-600" />
            {isMl ? 'രോഗ - കീടബാധ സാധ്യത നിർണ്ണയം' : 'Disease & Pest Risk Detection'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'ഈർപ്പവും താപനിലയും ലക്ഷണങ്ങളും പരിശോധിച്ച് രോഗങ്ങളും കീടങ്ങളും മുൻകൂട്ടി തടയുക.'
              : 'Correlating warm humidity patterns and plant symptoms to prevent fungal and pest outbreaks.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
            {isMl
              ? `ഈർപ്പം: ${farmData.humidity}% (കുമിൾ രോഗ സാധ്യത >70%)`
              : `Humidity: ${farmData.humidity}% (Fungal Threat Threshold >70%)`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptom Input & Optional Image Upload */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            {isMl ? 'പാടത്തെ നിരീക്ഷണ വിവരങ്ങൾ' : 'Field Observation Inputs'}
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

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'കണ്ടെത്തിയ ലക്ഷണങ്ങൾ അല്ലെങ്കിൽ കീടങ്ങൾ' : 'Describe Visible Symptoms or Pest Signs'}
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={
                  isMl
                    ? 'ഉദാ: ഇലകളിൽ മഞ്ഞനിറം, ചുരുളൽ, വാട്ടം, വെളുത്ത പാടുകൾ, കായകളിൽ സുഷിരങ്ങൾ...'
                    : 'E.g., Yellowing between leaf veins, curled leaves, wilting stems, white powdery spots, holes in fruit...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-emerald-600 text-xs leading-relaxed"
              />
            </div>

            {/* Image Upload Area: Supports Drag and Drop + File Select */}
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {isMl ? 'വിളയുടെ ഫോട്ടോ (ഇല / തണ്ട് - ആവശ്യമെങ്കിൽ)' : 'Crop Photo (Optional leaf / stem photo)'}
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/80'
                    : selectedImage
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-gray-200 hover:border-emerald-400 bg-gray-50/50 hover:bg-emerald-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="space-y-2">
                    <img
                      src={selectedImage}
                      alt="Crop specimen"
                      className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-xs"
                    />
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-gray-600 truncate max-w-[200px]">{imageName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                          setImageName('');
                        }}
                        className="text-rose-600 hover:underline font-semibold cursor-pointer"
                      >
                        {isMl ? 'നീക്കം ചെയ്യുക' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-gray-800 text-xs">
                      {isMl ? 'ഇലയുടെ ഫോട്ടോ ഇവിടെ ഇടുക' : 'Drag and drop crop leaf photo here'}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {isMl ? 'അല്ലെങ്കിൽ ഫയൽ തിരഞ്ഞെടുക്കുക (JPG, PNG)' : 'or click to browse from device (JPG, PNG)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeRisk}
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isMl ? 'AI രോഗബാധ പരിശോധിക്കുന്നു...' : 'Diagnosing Pathogen Risk with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isMl ? 'രോഗ സാധ്യത പരിശോധിക്കുക' : 'Analyze Disease & Pest Risk'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Disease Diagnosis & Action Plan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-500 font-medium">
                  {isMl ? 'രോഗനിർണ്ണയ റിപ്പോർട്ട്:' : 'Diagnostic Report for'}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{translateCrop(result.crop, preferredLanguage)}</h3>
              </div>
              {getRiskBadge(result.overallRiskLevel)}
            </div>

            {/* Potential Pathogens list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5 flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-emerald-600" />
                {isMl ? 'കണ്ടെത്തിയ രോഗകാരികളും കീടങ്ങളും' : 'Identified Pathogens & Insect Threats'}
              </h4>
              <div className="space-y-2.5">
                {result.detectedDiseases.map((dis, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{dis.diseaseName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                        {isMl ? 'സാധ്യത: ' : 'Likelihood: '} {dis.likelihood}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">{dis.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptoms to monitor */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                {isMl ? 'പരിശോധിക്കേണ്ട ലക്ഷണങ്ങൾ' : 'Field Warning Signs to Inspect'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.symptomsToMonitor.map((symp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-gray-800 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span className="leading-snug">{symp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventive & Curative Actions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
                {isMl ? 'പ്രതിരോധവും പരിഹാര നടപടികളും' : 'Preventive & Curative Actions'}
              </h4>
              <div className="space-y-2">
                {result.preventiveActions.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-emerald-100 text-xs text-gray-800 flex items-start gap-2.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extension Officer Advice */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {isMl ? 'കൃഷി ഓഫീസറെ എപ്പോൾ സമീപിക്കണം:' : 'When to Seek Extension Support:'}
                </span>
                <p className="leading-relaxed">{result.whenToSeekExpert}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <p>{result.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
