import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDistrict } from "@/contexts/DistrictContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CloudSun, Sprout, Droplets, CalendarDays, TrendingUp,
  Bot, BarChart3, Cpu, Thermometer, Droplet, Wind, Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

function SensorCard({ icon: Icon, label, value, unit, color }: { icon: any; label: string; value: string; unit: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card border border-border/50">
      <div className={`p-2 rounded-md ${color}`}><Icon className="h-4 w-4" /></div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-heading font-bold text-foreground">{value}<span className="text-xs text-muted-foreground ml-1">{unit}</span></p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedDistrict } = useDistrict();
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<{ temperature: string; humidity: string; wind: string }[]>([]);

  const FEATURES = [
    { label: t("nav.climate"), icon: CloudSun, path: "/climate", color: "bg-agro-sky/15 text-agro-sky", desc: t("feat.climate") },
    { label: t("nav.cropPlanner"), icon: Sprout, path: "/crop-planner", color: "bg-primary/10 text-primary", desc: t("feat.cropPlanner") },
    { label: t("nav.irrigation"), icon: Droplets, path: "/irrigation", color: "bg-agro-sky/15 text-agro-sky", desc: t("feat.irrigation") },
    { label: t("nav.cropCalendar"), icon: CalendarDays, path: "/crop-calendar", color: "bg-agro-earth/15 text-agro-earth", desc: t("feat.cropCalendar") },
    { label: t("nav.yield"), icon: TrendingUp, path: "/yield", color: "bg-agro-success/15 text-agro-success", desc: t("feat.yield") },
    { label: t("nav.ai"), icon: Bot, path: "/ai-assistant", color: "bg-secondary/20 text-secondary", desc: t("feat.ai") },
    { label: t("nav.market"), icon: BarChart3, path: "/market", color: "bg-agro-warning/15 text-agro-warning", desc: t("feat.market") },
    { label: t("nav.iot"), icon: Cpu, path: "/iot", color: "bg-agro-earth/15 text-agro-earth", desc: t("feat.iot") },
  ];

  useEffect(() => {
    if (selectedDistrict) getWeather();
  }, [selectedDistrict]);

  if (!selectedDistrict) { navigate("/"); return null; }

  const rainfall = selectedDistrict.avgRainfall;
  const apiKey = "4b427b08ee9a0f90168aaa1628a1d4cd";

  const getWeather = async () => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedDistrict.name},IN&appid=${apiKey}&units=metric`);
      const data = await res.json();
      setWeatherData([{ temperature: String(data.main?.temp), humidity: String(data.main?.humidity), wind: String(data.wind?.speed) }]);
    } catch { setWeatherData([]); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {t("dashboard.welcome")} {selectedDistrict.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {selectedDistrict.region} • {t("dashboard.avgRainfall")}: {rainfall}mm • {t("dashboard.majorCrops")}: {selectedDistrict.majorCrops.slice(0, 3).join(", ")}
        </p>
      </motion.div>

      {weatherData.map((item, idx) => (
        <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SensorCard icon={Thermometer} label={t("sensor.temperature")} value={item.temperature} unit="°C" color="bg-destructive/10 text-destructive" />
          <SensorCard icon={Droplet} label={t("sensor.humidity")} value={item.humidity} unit="%" color="bg-agro-sky/15 text-agro-sky" />
          <SensorCard icon={Wind} label={t("sensor.wind")} value={item.wind} unit="km/h" color="bg-muted text-muted-foreground" />
          <SensorCard icon={Sun} label={t("sensor.rainfall")} value={String(rainfall)} unit="mm/yr" color="bg-agro-warning/15 text-agro-warning" />
        </div>
      ))}

      <div>
        <h2 className="font-heading font-semibold text-foreground mb-3">{t("dashboard.features")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.button key={f.path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(f.path)}
              className="group p-4 rounded-lg bg-card shadow-card hover:shadow-card-hover border border-border/50 text-left transition-all hover:-translate-y-0.5"
            >
              <div className={`p-2.5 rounded-lg ${f.color} w-fit mb-3 group-hover:scale-110 transition-transform`}><f.icon className="h-5 w-5" /></div>
              <p className="font-heading font-semibold text-sm text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-agro-warning/10 border border-agro-warning/30">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <CloudSun className="h-4 w-4 text-agro-warning" /> {t("dashboard.activeAlert")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard.alertMsg")}</p>
      </div>
    </div>
  );
}
