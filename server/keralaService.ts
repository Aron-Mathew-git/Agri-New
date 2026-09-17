export interface KeralaLocationResult {
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

export const KERALA_DISTRICTS_DATA: Record<string, {
  name: string;
  malayalamName: string;
  tagline: string;
  agroZone: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  primarySoilType: string;
  ph: number;
  phRange: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  limingKgPerAcre: number;
  soilNote: string;
  dominantCrop: string;
  cropVariety: string;
  mandis: string[];
  keyTaluks: string[];
  advisory: {
    title: string;
    warning: string;
    action: string;
  };
}> = {
  Wayanad: {
    name: "Wayanad",
    malayalamName: "വയനാട്",
    tagline: "Highland Spice & Robusta Coffee",
    agroZone: "High Range Malabar Agro-Zone (AEZ 11)",
    latitude: 11.6854,
    longitude: 76.1320,
    elevationMeters: 780,
    primarySoilType: "Forest Loam & Acidic Laterite",
    ph: 5.4,
    phRange: "4.8 - 6.0",
    nitrogen: 76,
    phosphorus: 28,
    potassium: 54,
    organicCarbon: 1.85,
    limingKgPerAcre: 250,
    soilNote: "Humus-rich forest loam with high natural nitrogen; phosphorus easily locked by iron oxides.",
    dominantCrop: "Coffee (Robusta Wayanad GI)",
    cropVariety: "CxR / S.274",
    mandis: ["Sulthan Bathery Mandi", "Kalpetta Horticorp", "Mananthavady APMC"],
    keyTaluks: ["Sulthan Bathery", "Vythiri", "Mananthavady", "Meppadi", "Ambalavayal", "Pulpally", "Panamaram"],
    advisory: {
      title: "Phytophthora Foot Rot Alert",
      warning: "Prolonged leaf wetness (>80% humidity) promotes Quick Wilt in Black Pepper and berry rot in Coffee.",
      action: "Drench vine basins with 1% Bordeaux mixture. Clear lower shade trees to improve under-canopy ventilation.",
    },
  },
  Palakkad: {
    name: "Palakkad",
    malayalamName: "പാലക്കാട്",
    tagline: "The Rice Bowl & Granary of Kerala",
    agroZone: "Palakkad Eastern Plains & Gap Zone (AEZ 10)",
    latitude: 10.7867,
    longitude: 76.6548,
    elevationMeters: 84,
    primarySoilType: "Black Cotton & Red Alluvial Loam",
    ph: 6.8,
    phRange: "6.2 - 7.6",
    nitrogen: 68,
    phosphorus: 46,
    potassium: 66,
    organicCarbon: 0.85,
    limingKgPerAcre: 0,
    soilNote: "Neutral to mildly alkaline fertile loams; rich in calcium and potassium.",
    dominantCrop: "Paddy / Matta Rice (Jyothi/Uma)",
    cropVariety: "Jyothi / Uma (MO-16)",
    mandis: ["Palakkad APMC Big Bazar", "Chittur Market", "Alathur Mandi", "Mannarkkad Horticorp"],
    keyTaluks: ["Palakkad", "Chittur", "Alathur", "Ottapalam", "Mannarkkad", "Pattambi", "Kollengode"],
    advisory: {
      title: "Brown Plant Hopper (BPH) Watch",
      warning: "Warm gap winds and standing paddy water encourage rapid BPH colonies at plant base.",
      action: "Practice alternate wetting and drying (AWD) in paddy fields. Avoid excessive urea application.",
    },
  },
  Idukki: {
    name: "Idukki",
    malayalamName: "ഇടുക്കി",
    tagline: "Cardamom Hills & Cool Highlands",
    agroZone: "High Ranges Southern Zone (AEZ 12)",
    latitude: 9.8500,
    longitude: 76.9667,
    elevationMeters: 1050,
    primarySoilType: "Humus-Rich Acidic Mountain Loam",
    ph: 5.1,
    phRange: "4.6 - 5.6",
    nitrogen: 82,
    phosphorus: 26,
    potassium: 56,
    organicCarbon: 2.2,
    limingKgPerAcre: 350,
    soilNote: "Organic humus-rich mountain loam on slopes; needs contour bunding and dolomite application.",
    dominantCrop: "Small Cardamom (Green Bold)",
    cropVariety: "Njallani Green Gold / PV-1",
    mandis: ["Nedumkandam Spices Mandi", "Kattappana Horticorp", "Adimali Market", "Kumily Spices Board"],
    keyTaluks: ["Udumbanchola", "Devikulam", "Peerumade", "Thodupuzha", "Idukki", "Nedumkandam", "Munnar", "Vattavada"],
    advisory: {
      title: "Azhukal Capsule Rot Threat",
      warning: "Heavy mist and 90%+ humidity trigger capsule decay and fungal sheath rot in cardamom clumps.",
      action: "Apply 1% Bordeaux mixture spray to panicles. Clear rotting leaf trash from plant base.",
    },
  },
  Alappuzha: {
    name: "Alappuzha",
    malayalamName: "ആലപ്പുഴ",
    tagline: "Kuttanad Below-Sea-Level Wetland Farming",
    agroZone: "Kuttanad & Coastal Wet Lowlands (AEZ 4)",
    latitude: 9.4981,
    longitude: 76.3388,
    elevationMeters: 1,
    primarySoilType: "Acid Saline / Kari & Kayal Peat Soils",
    ph: 4.6,
    phRange: "4.0 - 5.2",
    nitrogen: 74,
    phosphorus: 22,
    potassium: 40,
    organicCarbon: 2.1,
    limingKgPerAcre: 500,
    soilNote: "Severely acidic Kari/Kayal soils with iron toxicity; requires heavy burnt lime / dolomite before sowing.",
    dominantCrop: "Kuttanad Punja Rice (Uma)",
    cropVariety: "Uma (MO-16) / Prathyasha",
    mandis: ["Alappuzha Municipal Mandi", "Haripad Horticorp", "Mavelikkara Market", "Kayamkulam APMC"],
    keyTaluks: ["Kuttanad (Mankombu)", "Ambalappuzha", "Cherthala", "Karthikappally", "Mavelikkara", "Chengannur"],
    advisory: {
      title: "Bacterial Leaf Blight (BLB) Advisory",
      warning: "Waterlogged polders and high atmospheric moisture trigger rapid BLB transmission.",
      action: "Apply potash in split doses to strengthen plant cell walls. Check drainage bund pumps.",
    },
  },
  Thrissur: {
    name: "Thrissur",
    malayalamName: "തൃശ്ശൂർ",
    tagline: "Kole Wetland Granary & Nendran Banana",
    agroZone: "Kole Wetlands & Central Midland (AEZ 5)",
    latitude: 10.5276,
    longitude: 76.2144,
    elevationMeters: 22,
    primarySoilType: "Riverine Alluvial & Midland Laterite",
    ph: 5.8,
    phRange: "5.2 - 6.4",
    nitrogen: 64,
    phosphorus: 42,
    potassium: 54,
    organicCarbon: 1.15,
    limingKgPerAcre: 200,
    soilNote: "Fertile alluvial basin in Kole wetlands; responsive to balanced fertilization and mulching.",
    dominantCrop: "Banana (Chengazhikodu Nendran GI)",
    cropVariety: "Chengazhikodu Nendran",
    mandis: ["Thrissur Shakthan Market", "Wadakkanchery Mandi", "Chalakudy Horticorp", "Irinjalakuda APMC"],
    keyTaluks: ["Thrissur", "Mukundapuram", "Chalakudy", "Kodungallur", "Thalapilly", "Chavakkad", "Kunnamkulam"],
    advisory: {
      title: "Sigatoka Leaf Spot Prevention",
      warning: "Moisture films on banana leaves trigger Pseudocercospora leaf streaking.",
      action: "Prune and burn heavily spotted lower leaves. Spray 1% light mineral oil or propiconazole.",
    },
  },
  Ernakulam: {
    name: "Ernakulam",
    malayalamName: "എറണാകുളം",
    tagline: "Pineapple City & Pokkali Coastal Wetlands",
    agroZone: "Central Coastal & Midland Agro-Zone (AEZ 3)",
    latitude: 9.9816,
    longitude: 76.2999,
    elevationMeters: 10,
    primarySoilType: "Red Sandy Loam & Acid Saline Pokkali",
    ph: 5.7,
    phRange: "5.0 - 6.3",
    nitrogen: 62,
    phosphorus: 44,
    potassium: 58,
    organicCarbon: 1.25,
    limingKgPerAcre: 200,
    soilNote: "Deep well-drained loams around Vazhakulam; saline Pokkali clay on coastal islands.",
    dominantCrop: "Pineapple (Vazhakulam Mauritius GI)",
    cropVariety: "Mauritius / Kew",
    mandis: ["Ernakulam Wholesale Market", "Aluva Mandi", "Muvattupuzha Horticorp", "Vazhakulam Pineapple Market"],
    keyTaluks: ["Aluva", "Kunnathunad", "Muvattupuzha", "Kothamangalam", "Kanayannur", "Paravur", "Piravom"],
    advisory: {
      title: "Pineapple Heart Rot Surveillance",
      warning: "Rainwater stagnation in plant leaf axils induces Phytophthora cinnamomi heart rot.",
      action: "Ensure raised planting ridges with 15 cm drainage furrow. Drench base with copper oxychloride if rot shows.",
    },
  },
  Kottayam: {
    name: "Kottayam",
    malayalamName: "കോട്ടയം",
    tagline: "The Natural Rubber Capital of India",
    agroZone: "Midland Laterite & Hill Slopes (AEZ 7)",
    latitude: 9.5916,
    longitude: 76.5222,
    elevationMeters: 35,
    primarySoilType: "Deep Midland Laterite Gravelly Loam",
    ph: 5.3,
    phRange: "4.8 - 5.8",
    nitrogen: 70,
    phosphorus: 34,
    potassium: 62,
    organicCarbon: 1.4,
    limingKgPerAcre: 300,
    soilNote: "Deep brick-red laterite with high iron oxide content; moderate potassium and acidic reaction.",
    dominantCrop: "Natural Rubber (RSS-4)",
    cropVariety: "RRII 105 / 430",
    mandis: ["Kottayam Rubber Market", "Changanassery APMC", "Pala Spices Mandi", "Kanjirappally Horticorp"],
    keyTaluks: ["Kottayam", "Changanassery", "Meenachil (Pala)", "Kanjirappally", "Vaikom", "Ettumanoor"],
    advisory: {
      title: "Rubber Rainguarding Notice",
      warning: "Frequent precipitation interrupts tree tapping and encourages Phytophthora Abnormal Leaf Fall.",
      action: "Fix polythene rainguards over tapping cuts on dry days. Spray copper dispersion if canopy thinning starts.",
    },
  },
  Kozhikode: {
    name: "Kozhikode",
    malayalamName: "കോഴിക്കോട്",
    tagline: "Historic Malabar Coast & Kuttiyadi Coconut",
    agroZone: "Northern Coastal & Midland Zone (AEZ 2)",
    latitude: 11.2588,
    longitude: 75.7804,
    elevationMeters: 12,
    primarySoilType: "Coastal Alluvium & Laterite Loam",
    ph: 5.6,
    phRange: "5.0 - 6.2",
    nitrogen: 60,
    phosphorus: 38,
    potassium: 52,
    organicCarbon: 1.05,
    limingKgPerAcre: 250,
    soilNote: "Sandy loam on coast, rich laterite in midlands; mulching prevents moisture loss.",
    dominantCrop: "Coconut (Kuttiyadi WCT)",
    cropVariety: "Kuttiyadi West Coast Tall",
    mandis: ["Vengeri APMC World Market", "Koyilandy Mandi", "Vatakara Copra Market", "Thamarassery Spices"],
    keyTaluks: ["Kozhikode", "Vatakara", "Koyilandy", "Thamarassery"],
    advisory: {
      title: "Coconut Bud Rot & Rhinoceros Beetle Alert",
      warning: "Heavy downpours create water stagnation in crown buds leading to Phytophthora bud rot.",
      action: "Place sand and naphthalene balls in leaf axils. Clean crown debris and apply 1% Bordeaux paste.",
    },
  },
  Malappuram: {
    name: "Malappuram",
    malayalamName: "മലപ്പുറം",
    tagline: "Eranad Agricultural Valleys & Arecanut",
    agroZone: "Northern Midland Agricultural Zone (AEZ 6)",
    latitude: 11.0732,
    longitude: 76.0740,
    elevationMeters: 38,
    primarySoilType: "Red Laterite Clay Loam",
    ph: 5.4,
    phRange: "4.8 - 6.0",
    nitrogen: 65,
    phosphorus: 38,
    potassium: 54,
    organicCarbon: 1.1,
    limingKgPerAcre: 250,
    soilNote: "Acidic red laterite; apply agricultural lime with green manure during inter-cultivation.",
    dominantCrop: "Arecanut (Supari)",
    cropVariety: "Mangala / Sumangala",
    mandis: ["Manjeri APMC Market", "Tirur Betel & Copra Mandi", "Perinthalmanna Horticorp", "Malappuram Market"],
    keyTaluks: ["Eranad (Manjeri)", "Tirur", "Perinthalmanna", "Nilambur", "Ponnani", "Tirurangadi", "Kondotty"],
    advisory: {
      title: "Arecanut Mahali (Koleroga) Warning",
      warning: "Continuous monsoon moisture induces premature nut shedding caused by Phytophthora meadii.",
      action: "Spray 1% Bordeaux mixture on areca bunches or fix polythene hoods over bunches.",
    },
  },
  Kasaragod: {
    name: "Kasaragod",
    malayalamName: "കാസർഗോഡ്",
    tagline: "Plantation Research Hub & Cashew Coast",
    agroZone: "North Malabar Laterite Belt (AEZ 1)",
    latitude: 12.5102,
    longitude: 74.9852,
    elevationMeters: 19,
    primarySoilType: "High Laterite & Coastal Sandy Alluvium",
    ph: 5.5,
    phRange: "5.0 - 6.2",
    nitrogen: 58,
    phosphorus: 40,
    potassium: 50,
    organicCarbon: 0.95,
    limingKgPerAcre: 250,
    soilNote: "Gravelly laterite on slopes, good permeability but low cation exchange capacity.",
    dominantCrop: "Arecanut & Cashew",
    cropVariety: "Mohitnagar Areca / Madakkathara Cashew",
    mandis: ["Kasaragod APMC Mandi", "Kanhangad Market", "Nileshwar Horticorp"],
    keyTaluks: ["Kasaragod", "Hosdurg (Kanhangad)", "Manjeshwar", "Vellarikundu"],
    advisory: {
      title: "Cashew Tea Mosquito Bug (TMB) Watch",
      warning: "Emerging tender shoots and inflorescence flushes are susceptible to TMB necrosis.",
      action: "Spray recommended bio-pesticide or lambda cyhalothrin during dry morning spells.",
    },
  },
  Kannur: {
    name: "Kannur",
    malayalamName: "കണ്ണൂർ",
    tagline: "Panniyur Pepper Heritage & Cashew Belt",
    agroZone: "North Malabar Midland & Coastal (AEZ 1)",
    latitude: 11.8745,
    longitude: 75.3704,
    elevationMeters: 16,
    primarySoilType: "Coastal Alluvium & Midland Laterite",
    ph: 5.6,
    phRange: "5.1 - 6.2",
    nitrogen: 62,
    phosphorus: 40,
    potassium: 52,
    organicCarbon: 1.05,
    limingKgPerAcre: 250,
    soilNote: "Deep red laterite with clayey sub-soil; highly suited for spice vines and tree crops.",
    dominantCrop: "Black Pepper (Panniyur Varieties)",
    cropVariety: "Panniyur 1 to 9",
    mandis: ["Thalassery Copra & Pepper Mandi", "Kannur Municipal Market", "Payyanur Horticorp", "Mattannur APMC"],
    keyTaluks: ["Kannur", "Thalassery", "Taliparamba", "Payyanur", "Iritty"],
    advisory: {
      title: "Pepper Quick Wilt (Foot Rot) Vigilance",
      warning: "Root collar moisture invites Phytophthora capsici attacks on vine bases.",
      action: "Apply Trichoderma enriched neem cake (2 kg/vine) and maintain drainage furrows.",
    },
  },
  Kollam: {
    name: "Kollam",
    malayalamName: "കൊല്ലം",
    tagline: "Global Cashew Capital & Tapioca Belt",
    agroZone: "Southern Coastal & Midland Zone (AEZ 8)",
    latitude: 8.8932,
    longitude: 76.6141,
    elevationMeters: 14,
    primarySoilType: "Red Loam & Coastal Sand Alluvium",
    ph: 5.7,
    phRange: "5.2 - 6.3",
    nitrogen: 62,
    phosphorus: 36,
    potassium: 56,
    organicCarbon: 1.0,
    limingKgPerAcre: 200,
    soilNote: "Sandy on coast, fertile red loam inland; warm humid micro-climate.",
    dominantCrop: "Tapioca / Cassava & Cashew",
    cropVariety: "M-4 / Vellayani Hraswa",
    mandis: ["Kollam Big Bazar Mandi", "Karunagappally APMC", "Kottarakkara Market", "Punalur Horticorp"],
    keyTaluks: ["Kollam", "Kottarakkara", "Karunagappally", "Kunnathur", "Pathanapuram", "Punalur"],
    advisory: {
      title: "Cassava Mosaic Virus Vector Control",
      warning: "Whitefly populations spread mosaic disease on tender cassava foliage.",
      action: "Rogue out and destroy virus-infected plants immediately. Spray 2% neem soap emulsion.",
    },
  },
  Pathanamthitta: {
    name: "Pathanamthitta",
    malayalamName: "പത്തനംതിട്ട",
    tagline: "Pilgrim River Valleys & Sugarcane Jaggery",
    agroZone: "Southern Midland & Forest Slopes (AEZ 9)",
    latitude: 9.2648,
    longitude: 76.7870,
    elevationMeters: 45,
    primarySoilType: "Forest Loam & Riverine Laterite",
    ph: 5.4,
    phRange: "4.9 - 6.0",
    nitrogen: 70,
    phosphorus: 36,
    potassium: 58,
    organicCarbon: 1.45,
    limingKgPerAcre: 300,
    soilNote: "Alluvial silt loam in Pamba river basin, acidic gravelly laterite on surrounding ridges.",
    dominantCrop: "Rubber & Sugarcane (Travancore Jaggery)",
    cropVariety: "RRII 105 / Co 86032",
    mandis: ["Pathanamthitta APMC", "Adoor Market", "Thiruvalla Horticorp", "Ranni Mandi"],
    keyTaluks: ["Kozhencherry (Pathanamthitta)", "Adoor", "Thiruvalla", "Ranni", "Mallappally", "Konni"],
    advisory: {
      title: "Sugarcane Early Shoot Borer Protection",
      warning: "Warm post-rain spells encourage shoot borer larva boring into central whorls.",
      action: "Mulch furrows with dry sugarcane trash (10 cm thick) to conserve moisture and hinder borer egg-laying.",
    },
  },
  Thiruvananthapuram: {
    name: "Thiruvananthapuram",
    malayalamName: "തിരുവനന്തപുരം",
    tagline: "Capital Agro-Zone & Red Banana Capital",
    agroZone: "Southern Coastal & Midland Zone (AEZ 8)",
    latitude: 8.5241,
    longitude: 76.9366,
    elevationMeters: 24,
    primarySoilType: "Deep Red Loam & Coastal Sand",
    ph: 5.8,
    phRange: "5.2 - 6.5",
    nitrogen: 60,
    phosphorus: 44,
    potassium: 58,
    organicCarbon: 0.98,
    limingKgPerAcre: 200,
    soilNote: "Well structured red loam with good nutrient capacity; responds strongly to organic compost.",
    dominantCrop: "Red Banana (Chenkadali / Kappavazha)",
    cropVariety: "Red Banana / Chenkadali",
    mandis: ["Anayara World Market (Trivandrum)", "Nedumangad Horticorp Mandi", "Kattakada APMC", "Neyyattinkara Market"],
    keyTaluks: ["Thiruvananthapuram", "Nedumangad", "Neyyattinkara", "Chirayinkeezhu", "Varkala", "Kattakada"],
    advisory: {
      title: "Banana Pseudostem Weevil Vigilance",
      warning: "Adult weevils oviposit inside leaf sheaths of Chenkadali plants over 4 months old.",
      action: "Set cosmos or pseudostem split-trap logs in field. Swab stem with neem based biopesticide.",
    },
  },
};

// Open-Meteo weather code decoder
export function decodeWeatherWmoCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear Sky (Sunny)", icon: "sun" };
  if (code === 1) return { condition: "Mainly Clear", icon: "cloud-sun" };
  if (code === 2) return { condition: "Partly Cloudy", icon: "cloud-sun" };
  if (code === 3) return { condition: "Overcast", icon: "cloud" };
  if (code >= 45 && code <= 48) return { condition: "Misty / Foggy", icon: "cloud" };
  if (code >= 51 && code <= 55) return { condition: "Light Monsoon Drizzle", icon: "cloud-drizzle" };
  if (code >= 61 && code <= 63) return { condition: "Moderate Rain Showers", icon: "cloud-rain" };
  if (code >= 65 && code <= 67) return { condition: "Heavy Rain", icon: "cloud-rain" };
  if (code >= 80 && code <= 82) return { condition: "Passing Rain Showers", icon: "cloud-rain" };
  if (code >= 95 && code <= 99) return { condition: "Thunderstorms Likely", icon: "cloud-lightning" };
  return { condition: "Passing Showers", icon: "cloud-rain" };
}

// Fetch real-time live agro-met weather from Open-Meteo for exact Kerala coordinates
export async function fetchLiveKeralaWeather(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,soil_temperature_0cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP status ${response.status}`);
    }
    const data = await response.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const weatherCode = current.weather_code ?? 2;
    const decoded = decodeWeatherWmoCode(weatherCode);

    // Build 7-day forecast
    const forecastDays: any[] = [];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const dateObj = new Date(daily.time[i]);
        const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[dateObj.getDay()];
        const dateStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
        const code = daily.weather_code?.[i] ?? 2;
        const dDecoded = decodeWeatherWmoCode(code);

        forecastDays.push({
          day: dayLabel,
          date: dateStr,
          tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 30),
          tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 22),
          condition: dDecoded.condition,
          icon: dDecoded.icon,
          rainProb: Math.round(daily.precipitation_probability_max?.[i] ?? 50),
          humidity: Math.min(95, Math.max(55, Math.round(current.relative_humidity_2m ?? 75))),
          windSpeed: Math.round(daily.wind_speed_10m_max?.[i] ?? 12),
        });
      }
    }

    // Next 12 hours
    const hourlyData: any[] = [];
    if (Array.isArray(hourly.time)) {
      const now = new Date();
      let count = 0;
      for (let j = 0; j < hourly.time.length && count < 12; j++) {
        const hTime = new Date(hourly.time[j]);
        if (hTime >= now || j >= 12) {
          const hourLabel = hTime.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
          const hCode = hourly.weather_code?.[j] ?? 2;
          hourlyData.push({
            time: hourLabel,
            temp: Math.round(hourly.temperature_2m?.[j] ?? 28),
            rainProb: Math.round(hourly.precipitation_probability?.[j] ?? 40),
            condition: decodeWeatherWmoCode(hCode).condition,
            soilTemp: Math.round(hourly.soil_temperature_0cm?.[j] ?? 26),
          });
          count++;
        }
      }
    }

    const rainProbTomorrow = daily.precipitation_probability_max?.[1] ?? (daily.precipitation_probability_max?.[0] ?? 60);

    return {
      success: true,
      source: "Government Agrometeorological Model (IMD / ECMWF via Open-Meteo)",
      currentTemp: Math.round(current.temperature_2m ?? 28),
      apparentTemp: Math.round(current.apparent_temperature ?? 31),
      humidity: Math.round(current.relative_humidity_2m ?? 75),
      precipitationMm: current.precipitation ?? 0,
      rainProbability: Math.round(rainProbTomorrow),
      windSpeedKmH: Math.round(current.wind_speed_10m ?? 10),
      windDirection: current.wind_direction_10m ?? 240,
      weatherCode,
      condition: decoded.condition,
      icon: decoded.icon,
      sevenDayForecast: forecastDays,
      hourlyForecast: hourlyData,
    };
  } catch (err) {
    console.warn("Failed to fetch live Open-Meteo weather for Kerala, falling back to regional seasonal norms:", err);
    return null;
  }
}

// Search Kerala locations (districts, taluks, panchayats, towns)
export async function searchKeralaLocations(query: string): Promise<KeralaLocationResult[]> {
  const cleanQ = (query || "").trim().toLowerCase();
  if (!cleanQ) return [];

  const results: KeralaLocationResult[] = [];

  // 1. Check official 14 Kerala districts
  for (const [key, d] of Object.entries(KERALA_DISTRICTS_DATA)) {
    if (
      d.name.toLowerCase().includes(cleanQ) ||
      d.malayalamName.includes(cleanQ) ||
      cleanQ.includes(d.name.toLowerCase())
    ) {
      results.push({
        name: d.name,
        district: d.name,
        malayalamName: d.malayalamName,
        latitude: d.latitude,
        longitude: d.longitude,
        elevationMeters: d.elevationMeters,
        agroZone: d.agroZone,
        primarySoilType: d.primarySoilType,
        isOfficialDistrict: true,
      });
    }
  }

  // 2. Check key taluks and towns
  for (const [distName, d] of Object.entries(KERALA_DISTRICTS_DATA)) {
    for (const taluk of d.keyTaluks) {
      if (taluk.toLowerCase().includes(cleanQ)) {
        // Avoid duplicate if district already matched exactly
        if (!results.some((r) => r.name.toLowerCase() === taluk.toLowerCase())) {
          results.push({
            name: `${taluk} (${distName})`,
            district: distName,
            malayalamName: d.malayalamName,
            latitude: d.latitude,
            longitude: d.longitude,
            elevationMeters: d.elevationMeters,
            agroZone: d.agroZone,
            primarySoilType: d.primarySoilType,
            isOfficialDistrict: false,
          });
        }
      }
    }
  }

  // 3. If query has length >= 3 and results are sparse, search Open-Meteo Geocoding API for exact village/panchayat in Kerala
  if (cleanQ.length >= 3 && results.length < 5) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQ)}&count=8&language=en&format=json`;
      const res = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          for (const item of data.results) {
            // Filter strictly for Kerala or within Kerala bounding box (Lat 8.0 - 13.0, Lon 74.8 - 77.5)
            const isKerala =
              item.admin1 === "Kerala" ||
              item.country === "India" &&
              (item.latitude >= 8.1 && item.latitude <= 12.9 && item.longitude >= 74.8 && item.longitude <= 77.6);

            if (isKerala) {
              // Deduce nearest district if admin2 exists or by coordinate distance
              const matchedDistrict = findClosestKeralaDistrict(item.latitude, item.longitude, item.admin2);
              const districtData = KERALA_DISTRICTS_DATA[matchedDistrict] || KERALA_DISTRICTS_DATA["Palakkad"];

              results.push({
                name: `${item.name}, Kerala`,
                district: matchedDistrict,
                latitude: Number(item.latitude.toFixed(4)),
                longitude: Number(item.longitude.toFixed(4)),
                elevationMeters: item.elevation ? Math.round(item.elevation) : districtData.elevationMeters,
                agroZone: districtData.agroZone,
                primarySoilType: districtData.primarySoilType,
                isOfficialDistrict: false,
              });
            }
          }
        }
      }
    } catch (err) {
      // Ignore geocoding network errors, fallback to local matches
    }
  }

  return results.slice(0, 8);
}

// Find closest Kerala district given lat/lon or admin2 name
export function findClosestKeralaDistrict(lat: number, lon: number, admin2?: string): string {
  if (admin2) {
    for (const dName of Object.keys(KERALA_DISTRICTS_DATA)) {
      if (admin2.toLowerCase().includes(dName.toLowerCase()) || dName.toLowerCase().includes(admin2.toLowerCase())) {
        return dName;
      }
    }
  }

  let closestDist = "Palakkad";
  let minDistanceSq = Infinity;

  for (const [dName, d] of Object.entries(KERALA_DISTRICTS_DATA)) {
    const dLat = lat - d.latitude;
    const dLon = lon - d.longitude;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestDist = dName;
    }
  }

  return closestDist;
}
