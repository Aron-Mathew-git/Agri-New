export interface FarmData {
  soilMoisture: number; // percentage (e.g. 42)
  soilTemperature: number; // °C (e.g. 27)
  soilPh: number; // pH (e.g. 5.4)
  airTemperature: number; // °C (e.g. 28)
  humidity: number; // % (e.g. 78)
  nitrogen: number; // mg/kg (e.g. 76)
  phosphorus: number; // mg/kg (e.g. 28)
  potassium: number; // mg/kg (e.g. 54)
  currentWeather: string; // "Partly Cloudy"
  rainfallProbability: number; // % (e.g. 65)
  windSpeed: number; // km/h (e.g. 12)
  location: string;
  district: string;
  malayalamDistrict?: string;
  agroZone?: string;
  soilType?: string;
  elevationMeters?: number;
  latitude?: number;
  longitude?: number;
  weatherSource?: string;
  farmSize: number; // in acres
  currentCrop: string;
  cropStage: string;
  lastIrrigatedHoursAgo: number;
  preferredLanguage?: 'en' | 'ml';
}

export interface HourlyWeatherItem {
  time: string;
  temp: number;
  rainProb: number;
  condition: string;
  soilTemp?: number;
}

export interface SensorStatusItem {
  id: string;
  name: string;
  sensorType: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  optimalRange: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainProb: number;
  humidity: number;
  windSpeed: number;
}

export interface HistoricalDataPoint {
  timestamp: string;
  soilMoisture: number;
  soilTemp: number;
  airTemp: number;
  humidity: number;
  healthScore: number;
}

export interface SoilAnalysisResult {
  healthStatus: 'Optimal' | 'Good' | 'Fair' | 'Critical' | string;
  healthScore: number;
  nutrientStatus: {
    nitrogen: { level: string; comment: string };
    phosphorus: { level: string; comment: string };
    potassium: { level: string; comment: string };
    ph: { level: string; comment: string };
  };
  problemsDetected: string[];
  aiExplanation: string;
  recommendedActions: string[];
}

export interface WeatherIntelligenceResult {
  summary: string;
  irrigationGuidance: string;
  sprayingGuidance: string;
  heavyRainRisk: string;
  risksAndMitigation: string[];
  advisoryNote: string;
}

export interface CropRecommendationItem {
  cropName: string;
  suitabilityScore: number;
  expectedYield: string;
  waterRequirement: string;
  soilSuitability: string;
  reasonForRecommendation: string;
  potentialRisks: string[];
  basicRequirements: {
    season: string;
    durationDays: string;
    idealPh: string;
    spacing: string;
  };
}

export interface CropFeasibilityResult {
  crop: string;
  status: 'Suitable' | 'Moderately Suitable' | 'Needs Improvement' | string;
  overallScore: number;
  explanation: string;
  soilFeasibility: { status: string; detail: string };
  weatherFeasibility: { status: string; detail: string };
  waterFeasibility: { status: string; detail: string };
  nutrientFeasibility: { status: string; detail: string };
  suggestedAdjustments: string[];
}

export interface IrrigationAdviceResult {
  irrigationRequired: boolean;
  actionTitle: string;
  recommendedTiming: string;
  estimatedWaterQuantity: string;
  reason: string;
  soilMoistureThresholds: {
    current: number;
    recommended: number;
    wiltingPoint: number;
  };
  sevenDaySchedule: Array<{
    day: string;
    advice: string;
    waterMm: number;
  }>;
  disclaimer: string;
}

export interface FertilizerAdviceResult {
  deficiencyAnalysis: string;
  recommendedFertilizers: Array<{
    name: string;
    category: 'Organic' | 'Chemical' | 'Bio-fertilizer';
    dosagePerAcre: string;
    timingAndMethod: string;
  }>;
  agronomicRationale: string;
  overApplicationWarnings: string[];
  localGuidanceNotice: string;
}

export interface DiseaseRiskResult {
  crop: string;
  overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | string;
  detectedDiseases: Array<{
    diseaseName: string;
    pathogenType: string;
    likelihood: string;
    description: string;
  }>;
  symptomsToMonitor: string[];
  preventiveActions: string[];
  whenToSeekExpert: string;
  disclaimer: string;
}

export interface CropHealthResult {
  overallHealthScore: number;
  statusLabel: 'Excellent' | 'Good' | 'Moderate Stress' | 'High Stress' | string;
  growthStageEvaluation: string;
  stressFactors: Array<{
    factor: string;
    severity: 'Low' | 'Medium' | 'High' | string;
    description: string;
  }>;
  vitalMetrics: {
    soilConditionScore: number;
    weatherFitnessScore: number;
    waterBalanceScore: number;
    nutrientAdequacyScore: number;
  };
  aiActionPlan: string[];
}

export interface MarketPriceItem {
  commodity: string;
  variety: string;
  mandi: string;
  state: string;
  minPrice: number; // ₹ / quintal
  maxPrice: number; // ₹ / quintal
  modalPrice: number; // ₹ / quintal
  priceChangePercent: number; // +2.4%
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface ProfitAnalysisResult {
  estimatedProduction: number; // quintals/tons
  unit: string;
  estimatedRevenue: number;
  totalProductionCost: number;
  estimatedNetProfit: number;
  profitPerAcre: number;
  returnOnInvestmentPercent: number;
  breakEvenPrice: number;
  aiMarketStrategy: string;
}

export interface NotificationItem {
  id: string;
  category: 'rain' | 'irrigation' | 'fertilizer' | 'disease' | 'market';
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
