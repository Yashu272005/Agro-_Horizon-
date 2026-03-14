import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "mr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // App
  "app.name": { en: "AgroHorizon Maharashtra", mr: "अ‍ॅग्रोहॉरिझन महाराष्ट्र" },
  "app.tagline": { en: "Smart Farming Platform", mr: "स्मार्ट शेती प्लॅटफॉर्म" },

  // Nav
  "nav.dashboard": { en: "Dashboard", mr: "डॅशबोर्ड" },
  "nav.climate": { en: "Climate Alerts", mr: "हवामान सूचना" },
  "nav.cropPlanner": { en: "Crop Planner", mr: "पीक नियोजक" },
  "nav.diseaseDetector": { en: "Disease Detector", mr: "रोग शोधक" },
  "nav.irrigation": { en: "Irrigation", mr: "सिंचन" },
  "nav.cropCalendar": { en: "Crop Calendar", mr: "पीक दिनदर्शिका" },
  "nav.yield": { en: "Yield Prediction", mr: "उत्पादन अंदाज" },
  "nav.ai": { en: "AI Assistant", mr: "AI सहाय्यक" },
  "nav.market": { en: "Market Intel", mr: "बाजार माहिती" },
  "nav.iot": { en: "IoT Monitor", mr: "IoT मॉनिटर" },
  "nav.admin": { en: "Admin", mr: "प्रशासन" },

  // District Selection
  "district.title": { en: "Select your district to get personalized smart farming insights", mr: "तुमच्या जिल्ह्याची निवड करा आणि स्मार्ट शेतीची माहिती मिळवा" },
  "district.search": { en: "Search district... (e.g. Pune, पुणे)", mr: "जिल्हा शोधा... (उदा. पुणे, Pune)" },
  "district.count": { en: "districts", mr: "जिल्हे" },

  // Dashboard
  "dashboard.welcome": { en: "Welcome to", mr: "स्वागत आहे" },
  "dashboard.avgRainfall": { en: "Average Rainfall", mr: "सरासरी पाऊस" },
  "dashboard.majorCrops": { en: "Major Crops", mr: "प्रमुख पिके" },
  "dashboard.features": { en: "Features", mr: "वैशिष्ट्ये" },
  "dashboard.activeAlert": { en: "Active Weather Alert", mr: "सध्याची हवामान सूचना" },
  "dashboard.alertMsg": { en: "Moderate rainfall expected over the next 48 hours. Ensure proper drainage for standing crops.", mr: "पुढील 48 तासांत मध्यम पाऊस अपेक्षित आहे. उभ्या पिकांसाठी योग्य निचरा सुनिश्चित करा." },

  // Feature descriptions
  "feat.climate": { en: "Weather warnings & forecasts", mr: "हवामान इशारे आणि अंदाज" },
  "feat.cropPlanner": { en: "Smart crop recommendations", mr: "स्मार्ट पीक शिफारसी" },
  "feat.irrigation": { en: "Water management advisor", mr: "पाणी व्यवस्थापन सल्लागार" },
  "feat.cropCalendar": { en: "Sowing to harvest timeline", mr: "पेरणी ते कापणी वेळापत्रक" },
  "feat.yield": { en: "AI harvest forecasting", mr: "AI कापणी अंदाज" },
  "feat.ai": { en: "Marathi voice chatbot", mr: "मराठी व्हॉइस चॅटबॉट" },
  "feat.market": { en: "Price trends & predictions", mr: "भाव कल आणि अंदाज" },
  "feat.iot": { en: "Live sensor dashboard", mr: "लाइव्ह सेन्सर डॅशबोर्ड" },

  // Sensors
  "sensor.temperature": { en: "Temperature", mr: "तापमान" },
  "sensor.humidity": { en: "Humidity", mr: "आर्द्रता" },
  "sensor.wind": { en: "Wind Speed", mr: "वाऱ्याचा वेग" },
  "sensor.rainfall": { en: "Avg Rainfall", mr: "सरासरी पाऊस" },

  // Auth
  "auth.login": { en: "Login", mr: "लॉगिन" },
  "auth.register": { en: "Create Account", mr: "खाते तयार करा" },
  "auth.email": { en: "Email", mr: "ईमेल" },
  "auth.mobile": { en: "Mobile Number", mr: "मोबाइल नंबर" },
  "auth.password": { en: "Password", mr: "पासवर्ड" },
  "auth.name": { en: "Full Name", mr: "पूर्ण नाव" },
  "auth.loginBtn": { en: "Sign In", mr: "साइन इन करा" },
  "auth.registerBtn": { en: "Sign Up", mr: "साइन अप करा" },
  "auth.noAccount": { en: "Don't have an account?", mr: "खाते नाही?" },
  "auth.hasAccount": { en: "Already have an account?", mr: "आधीच खाते आहे?" },
  "auth.useEmail": { en: "Use Email", mr: "ईमेल वापरा" },
  "auth.useMobile": { en: "Use Mobile", mr: "मोबाइल वापरा" },
  "auth.farmerLogin": { en: "Farmer Login", mr: "शेतकरी लॉगिन" },
  "auth.subtitle": { en: "Access your smart farming dashboard", mr: "तुमचे स्मार्ट शेती डॅशबोर्ड ऍक्सेस करा" },
  "auth.or": { en: "or", mr: "किंवा" },
  "auth.continueAsGuest": { en: "Continue as Guest", mr: "अतिथी म्हणून पुढे जा" },

  // Language
  "lang.switch": { en: "मराठी", mr: "English" },

  // Common
  "common.loading": { en: "Loading...", mr: "लोड होत आहे..." },
  "common.save": { en: "Save", mr: "जतन करा" },
  "common.cancel": { en: "Cancel", mr: "रद्द करा" },
  "common.submit": { en: "Submit", mr: "सबमिट करा" },
  "common.back": { en: "Back", mr: "मागे" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("agro-lang");
    return (saved === "mr" ? "mr" : "en") as Language;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("agro-lang", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
