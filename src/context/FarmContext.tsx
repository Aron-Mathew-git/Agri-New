import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  FarmData,
  SensorStatusItem,
  NotificationItem,
  WeatherDay,
  HourlyWeatherItem,
  MarketPriceItem,
} from '../types';
import {
  initialFarmData,
  initialSensors,
  initialNotifications,
  sevenDayForecast as defaultSevenDayForecast,
  initialMarketPrices,
} from '../data/defaultData';
import {
  KERALA_DISTRICTS,
  KeralaDistrictInfo,
  KERALA_MANDI_PRICES,
} from '../data/keralaAgroData';
import { fetchFarmingAdvice, fetchLiveKeralaWeather } from '../services/api';

interface TodayAdvice {
  headline: string;
  advice: string;
  urgency: 'high' | 'medium' | 'low';
  actionItem: string;
  waterSavedEstimateLiters: number;
}

interface FarmContextType {
  farmData: FarmData;
  setFarmData: React.Dispatch<React.SetStateAction<FarmData>>;
  updateFarmData: (partial: Partial<FarmData>) => void;
  sensors: SensorStatusItem[];
  updateSensorValue: (sensorId: string, value: number) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  autoSimulateSensors: boolean;
  setAutoSimulateSensors: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  todayAdvice: TodayAdvice | null;
  refreshTodayAdvice: () => Promise<void>;
  isRefreshingAdvice: boolean;

  // Kerala Specific Location & Live Government API Integration
  selectedDistrict: string;
  districtInfo: KeralaDistrictInfo;
  isLocationLoading: boolean;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  changeKeralaLocation: (
    districtName: string,
    customLocationLabel?: string,
    customLat?: number,
    customLon?: number
  ) => Promise<void>;
  weatherForecast: WeatherDay[];
  hourlyForecast: HourlyWeatherItem[];
  marketPrices: MarketPriceItem[];
  refreshLiveWeather: () => Promise<void>;

  // Communication Language (English & Malayalam)
  preferredLanguage: 'en' | 'ml';
  setPreferredLanguage: (lang: 'en' | 'ml') => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Wayanad');
  const [farmData, setFarmData] = useState<FarmData>(initialFarmData);
  const [preferredLanguage, setPreferredLanguageState] = useState<'en' | 'ml'>(() => {
    try {
      const saved = localStorage.getItem('darthi_lang');
      if (saved === 'ml' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setPreferredLanguage = useCallback((lang: 'en' | 'ml') => {
    setPreferredLanguageState(lang);
    try {
      localStorage.setItem('darthi_lang', lang);
    } catch {
      // ignore
    }
    setFarmData((prev) => ({ ...prev, preferredLanguage: lang }));
  }, []);
  const [sensors, setSensors] = useState<SensorStatusItem[]>(initialSensors);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [autoSimulateSensors, setAutoSimulateSensors] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [todayAdvice, setTodayAdvice] = useState<TodayAdvice | null>(null);
  const [isRefreshingAdvice, setIsRefreshingAdvice] = useState<boolean>(false);

  // Kerala state
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [weatherForecast, setWeatherForecast] = useState<WeatherDay[]>(defaultSevenDayForecast);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeatherItem[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(KERALA_MANDI_PRICES);

  const districtInfo: KeralaDistrictInfo =
    KERALA_DISTRICTS[selectedDistrict] || KERALA_DISTRICTS['Wayanad'];

  const updateFarmData = useCallback((partial: Partial<FarmData>) => {
    setFarmData((prev) => ({ ...prev, ...partial }));
  }, []);

  // Update sensor item and synchronize with farmData
  const updateSensorValue = useCallback((sensorId: string, value: number) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === sensorId) {
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          if (sensorId === 's-moisture' && (value < 28 || value > 75)) status = 'warning';
          if (sensorId === 's-airtemp' && (value > 36 || value < 14)) status = 'warning';
          if (sensorId === 's-humidity' && value > 80) status = 'warning';
          if (sensorId === 's-soilph' && (value < 5.0 || value > 7.5)) status = 'warning';
          return { ...s, value, status, lastUpdated: 'Just now' };
        }
        return s;
      })
    );

    // Sync to farmData
    setFarmData((prev) => {
      switch (sensorId) {
        case 's-moisture':
          return { ...prev, soilMoisture: value };
        case 's-soiltemp':
          return { ...prev, soilTemperature: value };
        case 's-soilph':
          return { ...prev, soilPh: value };
        case 's-airtemp':
          return { ...prev, airTemperature: value };
        case 's-humidity':
          return { ...prev, humidity: value };
        default:
          return prev;
      }
    });
  }, []);

  // Refresh advice dynamically from Gemini API
  const refreshTodayAdvice = useCallback(async () => {
    setIsRefreshingAdvice(true);
    try {
      const advice = await fetchFarmingAdvice(farmData, preferredLanguage);
      setTodayAdvice(advice);
    } catch (err) {
      console.warn('Notice while refreshing advice, using baseline advisory:', err);
    } finally {
      setIsRefreshingAdvice(false);
    }
  }, [farmData, preferredLanguage]);

  // Fetch live weather from localized government agrometeorological model
  const loadWeatherForCoordinates = useCallback(
    async (lat: number, lon: number, distName: string) => {
      try {
        const liveWeather = await fetchLiveKeralaWeather(lat, lon, distName);
        if (liveWeather) {
          if (Array.isArray(liveWeather.sevenDayForecast) && liveWeather.sevenDayForecast.length > 0) {
            setWeatherForecast(liveWeather.sevenDayForecast);
          }
          if (Array.isArray(liveWeather.hourlyForecast) && liveWeather.hourlyForecast.length > 0) {
            setHourlyForecast(liveWeather.hourlyForecast);
          }

          setFarmData((prev) => ({
            ...prev,
            airTemperature: liveWeather.currentTemp ?? prev.airTemperature,
            humidity: liveWeather.humidity ?? prev.humidity,
            rainfallProbability: liveWeather.rainProbability ?? prev.rainfallProbability,
            windSpeed: liveWeather.windSpeedKmH ?? prev.windSpeed,
            currentWeather: liveWeather.condition ?? prev.currentWeather,
            weatherSource: liveWeather.source || 'IMD / KAU Agrometeorological Model',
          }));

          // Sync sensors to live weather
          setSensors((prev) =>
            prev.map((s) => {
              if (s.id === 's-airtemp') {
                return { ...s, value: liveWeather.currentTemp ?? s.value, lastUpdated: 'Live from IMD/Open-Meteo' };
              }
              if (s.id === 's-humidity') {
                return {
                  ...s,
                  value: liveWeather.humidity ?? s.value,
                  status: (liveWeather.humidity ?? 75) > 80 ? 'warning' : 'normal',
                  lastUpdated: 'Live from IMD/Open-Meteo',
                };
              }
              return s;
            })
          );
        }
      } catch (err) {
        console.warn('Could not load live weather:', err);
      }
    },
    []
  );

  // Change Kerala Location function: switches location and fetches all localized data
  const changeKeralaLocation = useCallback(
    async (
      districtName: string,
      customLocationLabel?: string,
      customLat?: number,
      customLon?: number
    ) => {
      setIsLocationLoading(true);
      try {
        const targetDistrict = KERALA_DISTRICTS[districtName] || KERALA_DISTRICTS['Wayanad'];
        setSelectedDistrict(targetDistrict.name);

        const lat = customLat !== undefined ? customLat : targetDistrict.latitude;
        const lon = customLon !== undefined ? customLon : targetDistrict.longitude;
        const locLabel = customLocationLabel || `${targetDistrict.name}, Kerala`;

        // Flagship crop for that district
        const flagship = targetDistrict.dominantCrops.find((c) => c.isFlagship) || targetDistrict.dominantCrops[0];

        // 1. Update FarmData with district baseline & KAU Soil Card
        setFarmData((prev) => ({
          ...prev,
          location: locLabel,
          district: targetDistrict.name,
          malayalamDistrict: targetDistrict.malayalamName,
          agroZone: targetDistrict.agroZone,
          soilType: targetDistrict.primarySoilType,
          elevationMeters: targetDistrict.elevationMeters,
          latitude: lat,
          longitude: lon,
          soilPh: targetDistrict.soilBaseline.ph,
          nitrogen: targetDistrict.soilBaseline.nitrogen,
          phosphorus: targetDistrict.soilBaseline.phosphorus,
          potassium: targetDistrict.soilBaseline.potassium,
          currentCrop: `${flagship.name} (${flagship.variety})`,
        }));

        // 2. Update Sensors with KAU District Soil baseline
        setSensors((prev) =>
          prev.map((s) => {
            if (s.id === 's-soilph') {
              return {
                ...s,
                value: targetDistrict.soilBaseline.ph,
                status: targetDistrict.soilBaseline.ph < 5.2 ? 'warning' : 'normal',
                optimalRange: targetDistrict.soilBaseline.phRange,
                lastUpdated: 'KAU Soil Health Card',
              };
            }
            if (s.id === 's-npk') {
              return {
                ...s,
                value: `${targetDistrict.soilBaseline.nitrogen}:${targetDistrict.soilBaseline.phosphorus}:${targetDistrict.soilBaseline.potassium}`,
                lastUpdated: 'KAU Soil Health Card',
              };
            }
            return s;
          })
        );

        // 3. Fetch live weather from Government Agromet model
        await loadWeatherForCoordinates(lat, lon, targetDistrict.name);

        // 4. Update Mandi prices to prioritize mandis in/near this district
        const prioritizedPrices = [...KERALA_MANDI_PRICES].sort((a, b) => {
          const aMatch = a.mandi.toLowerCase().includes(targetDistrict.name.toLowerCase());
          const bMatch = b.mandi.toLowerCase().includes(targetDistrict.name.toLowerCase());
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        });
        setMarketPrices(prioritizedPrices);

        // 5. Add regional GKMS Agromet Alert to notifications
        const gkmsAlert: Omit<NotificationItem, 'id' | 'timestamp'> = {
          category: 'rain',
          title: `GKMS ${targetDistrict.name} Advisory: ${targetDistrict.gkmsAdvisory.pestDiseaseWarning.slice(0, 50)}...`,
          message: `${targetDistrict.gkmsAdvisory.agrometAdvice} (${targetDistrict.gkmsAdvisory.issuedBy})`,
          severity: 'warning',
          read: false,
        };
        addNotification(gkmsAlert);
      } catch (error) {
        console.warn('Notice changing Kerala location, applying default baseline:', error);
      } finally {
        setIsLocationLoading(false);
      }
    },
    [loadWeatherForCoordinates]
  );

  // Refresh live weather for current location
  const refreshLiveWeather = useCallback(async () => {
    if (farmData.latitude && farmData.longitude) {
      await loadWeatherForCoordinates(farmData.latitude, farmData.longitude, farmData.district);
    }
  }, [farmData.latitude, farmData.longitude, farmData.district, loadWeatherForCoordinates]);

  // Initial load: fetch live weather for initial Wayanad location
  useEffect(() => {
    refreshLiveWeather();
    refreshTodayAdvice();
  }, []);

  // Update todayAdvice when preferredLanguage changes
  useEffect(() => {
    refreshTodayAdvice();
  }, [preferredLanguage, refreshTodayAdvice]);

  // IoT Simulation: subtle live sensor fluctuations when enabled
  useEffect(() => {
    if (!autoSimulateSensors) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          if (typeof s.value === 'number') {
            const delta = (Math.random() - 0.5) * (s.id === 's-soilph' ? 0.05 : 0.6);
            let newVal = Number((s.value + delta).toFixed(s.id === 's-soilph' ? 2 : 1));
            // Keep in realistic bounds
            if (s.id === 's-moisture') newVal = Math.min(75, Math.max(30, newVal));
            if (s.id === 's-airtemp') newVal = Math.min(38, Math.max(18, newVal));
            if (s.id === 's-humidity') newVal = Math.min(95, Math.max(50, newVal));
            return {
              ...s,
              value: newVal,
              lastUpdated: 'Live IoT reading',
            };
          }
          return s;
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [autoSimulateSensors]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <FarmContext.Provider
      value={{
        farmData,
        setFarmData,
        updateFarmData,
        sensors,
        updateSensorValue,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        addNotification,
        demoMode,
        setDemoMode,
        autoSimulateSensors,
        setAutoSimulateSensors,
        activeTab,
        setActiveTab,
        isChatOpen,
        setIsChatOpen,
        todayAdvice,
        refreshTodayAdvice,
        isRefreshingAdvice,

        // Kerala features
        selectedDistrict,
        districtInfo,
        isLocationLoading,
        isLocationModalOpen,
        setIsLocationModalOpen,
        changeKeralaLocation,
        weatherForecast,
        hourlyForecast,
        marketPrices,
        refreshLiveWeather,

        // Communication Language
        preferredLanguage,
        setPreferredLanguage,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) throw new Error('useFarm must be used within FarmProvider');
  return context;
};

