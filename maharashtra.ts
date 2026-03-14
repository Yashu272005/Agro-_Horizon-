export interface District {
  id: string;
  name: string;
  nameMarathi: string;
  region: string;
  avgRainfall: number;
  soilTypes: string[];
  majorCrops: string[];
  lat: number; 
  lng: number;
}

export const MAHARASHTRA_DISTRICTS: District[] = [
  { id: "ahmednagar", name: "Ahmednagar", nameMarathi: "अहमदनगर", region: "Western Maharashtra", avgRainfall: 578, soilTypes: ["Black", "Red"], majorCrops: ["Sugarcane", "Bajra", "Wheat"], lat: 19.09, lng: 74.74 },
  { id: "akola", name: "Akola", nameMarathi: "अकोला", region: "Vidarbha", avgRainfall: 820, soilTypes: ["Black"], majorCrops: ["Cotton", "Soybean", "Tur"], lat: 20.71, lng: 77.0 },
  { id: "amravati", name: "Amravati", nameMarathi: "अमरावती", region: "Vidarbha", avgRainfall: 875, soilTypes: ["Black", "Laterite"], majorCrops: ["Cotton", "Soybean", "Orange"], lat: 20.93, lng: 77.78 },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar", nameMarathi: "छत्रपती संभाजीनगर", region: "Marathwada", avgRainfall: 670, soilTypes: ["Black", "Medium Black"], majorCrops: ["Cotton", "Bajra", "Jowar"], lat: 19.88, lng: 75.34 },
  { id: "beed", name: "Beed", nameMarathi: "बीड", region: "Marathwada", avgRainfall: 650, soilTypes: ["Black"], majorCrops: ["Cotton", "Sugarcane", "Jowar"], lat: 18.99, lng: 75.76 },
  { id: "bhandara", name: "Bhandara", nameMarathi: "भंडारा", region: "Vidarbha", avgRainfall: 1200, soilTypes: ["Alluvial", "Black"], majorCrops: ["Rice", "Wheat", "Orange"], lat: 21.17, lng: 79.65 },
  { id: "buldhana", name: "Buldhana", nameMarathi: "बुलढाणा", region: "Vidarbha", avgRainfall: 780, soilTypes: ["Black"], majorCrops: ["Cotton", "Soybean", "Jowar"], lat: 20.53, lng: 76.18 },
  { id: "chandrapur", name: "Chandrapur", nameMarathi: "चंद्रपूर", region: "Vidarbha", avgRainfall: 1300, soilTypes: ["Black", "Red"], majorCrops: ["Rice", "Cotton", "Soybean"], lat: 19.95, lng: 79.3 },
  { id: "dhule", name: "Dhule", nameMarathi: "धुळे", region: "North Maharashtra", avgRainfall: 580, soilTypes: ["Black", "Red"], majorCrops: ["Cotton", "Bajra", "Maize"], lat: 20.9, lng: 74.78 },
  { id: "gadchiroli", name: "Gadchiroli", nameMarathi: "गडचिरोली", region: "Vidarbha", avgRainfall: 1500, soilTypes: ["Red", "Laterite"], majorCrops: ["Rice", "Bamboo", "Teak"], lat: 20.18, lng: 80.0 },
  { id: "gondia", name: "Gondia", nameMarathi: "गोंदिया", region: "Vidarbha", avgRainfall: 1350, soilTypes: ["Alluvial", "Black"], majorCrops: ["Rice", "Wheat", "Soybean"], lat: 21.46, lng: 80.2 },
  { id: "hingoli", name: "Hingoli", nameMarathi: "हिंगोली", region: "Marathwada", avgRainfall: 850, soilTypes: ["Black"], majorCrops: ["Soybean", "Cotton", "Tur"], lat: 19.72, lng: 77.15 },
  { id: "jalgaon", name: "Jalgaon", nameMarathi: "जळगाव", region: "North Maharashtra", avgRainfall: 700, soilTypes: ["Black", "Alluvial"], majorCrops: ["Banana", "Cotton", "Bajra"], lat: 21.01, lng: 75.57 },
  { id: "jalna", name: "Jalna", nameMarathi: "जालना", region: "Marathwada", avgRainfall: 680, soilTypes: ["Black"], majorCrops: ["Cotton", "Jowar", "Sweet Lime"], lat: 19.84, lng: 75.88 },
  { id: "kolhapur", name: "Kolhapur", nameMarathi: "कोल्हापूर", region: "Western Maharashtra", avgRainfall: 1200, soilTypes: ["Laterite", "Alluvial"], majorCrops: ["Sugarcane", "Rice", "Jowar"], lat: 16.7, lng: 74.24 },
  { id: "latur", name: "Latur", nameMarathi: "लातूर", region: "Marathwada", avgRainfall: 750, soilTypes: ["Black"], majorCrops: ["Soybean", "Tur", "Jowar"], lat: 18.4, lng: 76.57 },
  { id: "mumbai_city", name: "Mumbai City", nameMarathi: "मुंबई शहर", region: "Konkan", avgRainfall: 2200, soilTypes: ["Laterite"], majorCrops: ["Rice", "Vegetables"], lat: 18.98, lng: 72.84 },
  { id: "mumbai_suburban", name: "Mumbai Suburban", nameMarathi: "मुंबई उपनगर", region: "Konkan", avgRainfall: 2400, soilTypes: ["Laterite"], majorCrops: ["Rice", "Vegetables"], lat: 19.18, lng: 72.85 },
  { id: "nagpur", name: "Nagpur", nameMarathi: "नागपूर", region: "Vidarbha", avgRainfall: 1100, soilTypes: ["Black", "Red"], majorCrops: ["Orange", "Cotton", "Soybean"], lat: 21.15, lng: 79.09 },
  { id: "nanded", name: "Nanded", nameMarathi: "नांदेड", region: "Marathwada", avgRainfall: 900, soilTypes: ["Black"], majorCrops: ["Soybean", "Cotton", "Tur"], lat: 19.16, lng: 77.3 },
  { id: "nandurbar", name: "Nandurbar", nameMarathi: "नंदुरबार", region: "North Maharashtra", avgRainfall: 750, soilTypes: ["Black", "Red"], majorCrops: ["Cotton", "Bajra", "Rice"], lat: 21.37, lng: 74.24 },
  { id: "nashik", name: "Nashik", nameMarathi: "नाशिक", region: "North Maharashtra", avgRainfall: 900, soilTypes: ["Red", "Black"], majorCrops: ["Grapes", "Onion", "Tomato"], lat: 20.0, lng: 73.78 },
  { id: "osmanabad", name: "Dharashiv", nameMarathi: "धाराशिव", region: "Marathwada", avgRainfall: 700, soilTypes: ["Black"], majorCrops: ["Jowar", "Tur", "Sugarcane"], lat: 18.18, lng: 76.04 },
  { id: "palghar", name: "Palghar", nameMarathi: "पालघर", region: "Konkan", avgRainfall: 2500, soilTypes: ["Laterite", "Alluvial"], majorCrops: ["Rice", "Chikoo", "Coconut"], lat: 19.7, lng: 72.77 },
  { id: "parbhani", name: "Parbhani", nameMarathi: "परभणी", region: "Marathwada", avgRainfall: 850, soilTypes: ["Black"], majorCrops: ["Cotton", "Soybean", "Tur"], lat: 19.27, lng: 76.77 },
  { id: "pune", name: "Pune", nameMarathi: "पुणे", region: "Western Maharashtra", avgRainfall: 1400, soilTypes: ["Red", "Laterite", "Alluvial"], majorCrops: ["Sugarcane", "Grapes", "Vegetables"], lat: 18.52, lng: 73.86 },
  { id: "raigad", name: "Raigad", nameMarathi: "रायगड", region: "Konkan", avgRainfall: 3000, soilTypes: ["Laterite"], majorCrops: ["Rice", "Mango", "Coconut"], lat: 18.52, lng: 73.13 },
  { id: "ratnagiri", name: "Ratnagiri", nameMarathi: "रत्नागिरी", region: "Konkan", avgRainfall: 3200, soilTypes: ["Laterite"], majorCrops: ["Mango", "Cashew", "Rice"], lat: 16.99, lng: 73.3 },
  { id: "sangli", name: "Sangli", nameMarathi: "सांगली", region: "Western Maharashtra", avgRainfall: 600, soilTypes: ["Black", "Alluvial"], majorCrops: ["Sugarcane", "Grapes", "Turmeric"], lat: 16.85, lng: 74.56 },
  { id: "satara", name: "Satara", nameMarathi: "सातारा", region: "Western Maharashtra", avgRainfall: 900, soilTypes: ["Laterite", "Black"], majorCrops: ["Sugarcane", "Rice", "Strawberry"], lat: 17.68, lng: 74.0 },
  { id: "sindhudurg", name: "Sindhudurg", nameMarathi: "सिंधुदुर्ग", region: "Konkan", avgRainfall: 3300, soilTypes: ["Laterite"], majorCrops: ["Mango", "Cashew", "Kokum"], lat: 16.35, lng: 73.76 },
  { id: "solapur", name: "Solapur", nameMarathi: "सोलापूर", region: "Western Maharashtra", avgRainfall: 550, soilTypes: ["Black"], majorCrops: ["Sugarcane", "Pomegranate", "Jowar"], lat: 17.68, lng: 75.91 },
  { id: "thane", name: "Thane", nameMarathi: "ठाणे", region: "Konkan", avgRainfall: 2500, soilTypes: ["Laterite", "Alluvial"], majorCrops: ["Rice", "Vegetables", "Flowers"], lat: 19.22, lng: 72.97 },
  { id: "wardha", name: "Wardha", nameMarathi: "वर्धा", region: "Vidarbha", avgRainfall: 1000, soilTypes: ["Black"], majorCrops: ["Cotton", "Soybean", "Orange"], lat: 20.74, lng: 78.6 },
  { id: "washim", name: "Washim", nameMarathi: "वाशिम", region: "Vidarbha", avgRainfall: 850, soilTypes: ["Black"], majorCrops: ["Soybean", "Cotton", "Tur"], lat: 20.11, lng: 77.13 },
  { id: "yavatmal", name: "Yavatmal", nameMarathi: "यवतमाळ", region: "Vidarbha", avgRainfall: 950, soilTypes: ["Black", "Red"], majorCrops: ["Cotton", "Soybean", "Tur"], lat: 20.39, lng: 78.12 },
];

export const REGIONS = ["All", "Konkan", "Western Maharashtra", "North Maharashtra", "Marathwada", "Vidarbha"] as const;

export type Season = "Kharif" | "Rabi" | "Summer";

export interface CropInfo {
  name: string;
  season: Season;
  sowingMonth: string;
  harvestMonth: string;
  waterNeed: "Low" | "Medium" | "High";
  bestDistricts: string[];
}

export const CROPS_DATA: CropInfo[] = [
  { name: "Rice", season: "Kharif", sowingMonth: "June", harvestMonth: "October", waterNeed: "High", bestDistricts: ["raigad", "ratnagiri", "sindhudurg", "palghar", "bhandara", "gondia", "gadchiroli", "chandrapur"] },
  { name: "Cotton", season: "Kharif", sowingMonth: "June", harvestMonth: "December", waterNeed: "Medium", bestDistricts: ["yavatmal", "amravati", "akola", "washim", "buldhana", "aurangabad", "jalgaon", "nanded"] },
  { name: "Soybean", season: "Kharif", sowingMonth: "June", harvestMonth: "October", waterNeed: "Medium", bestDistricts: ["latur", "nanded", "hingoli", "parbhani", "washim", "amravati", "nagpur"] },
  { name: "Sugarcane", season: "Kharif", sowingMonth: "February", harvestMonth: "January", waterNeed: "High", bestDistricts: ["kolhapur", "sangli", "pune", "ahmednagar", "solapur", "satara"] },
  { name: "Wheat", season: "Rabi", sowingMonth: "November", harvestMonth: "March", waterNeed: "Medium", bestDistricts: ["ahmednagar", "pune", "nashik", "jalgaon", "dhule"] },
  { name: "Jowar", season: "Rabi", sowingMonth: "October", harvestMonth: "February", waterNeed: "Low", bestDistricts: ["solapur", "osmanabad", "beed", "sangli", "ahmednagar"] },
  { name: "Bajra", season: "Kharif", sowingMonth: "June", harvestMonth: "September", waterNeed: "Low", bestDistricts: ["ahmednagar", "dhule", "nashik", "jalgaon", "aurangabad"] },
  { name: "Tur (Pigeon Pea)", season: "Kharif", sowingMonth: "June", harvestMonth: "December", waterNeed: "Low", bestDistricts: ["latur", "nanded", "parbhani", "hingoli", "osmanabad"] },
  { name: "Grapes", season: "Rabi", sowingMonth: "October", harvestMonth: "March", waterNeed: "Medium", bestDistricts: ["nashik", "sangli", "pune", "solapur", "satara"] },
  { name: "Onion", season: "Rabi", sowingMonth: "November", harvestMonth: "April", waterNeed: "Medium", bestDistricts: ["nashik", "ahmednagar", "pune", "solapur"] },
  { name: "Banana", season: "Kharif", sowingMonth: "June", harvestMonth: "March", waterNeed: "High", bestDistricts: ["jalgaon", "nandurbar", "dhule", "solapur"] },
  { name: "Orange", season: "Kharif", sowingMonth: "July", harvestMonth: "December", waterNeed: "Medium", bestDistricts: ["nagpur", "amravati", "wardha", "bhandara"] },
];
