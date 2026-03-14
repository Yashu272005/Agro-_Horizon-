import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { CloudRain, Sun, Wind, AlertTriangle, Thermometer, Snowflake } from "lucide-react";

const ALERT_TYPES = [
  { type: "Heavy Rain", icon: CloudRain, severity: "High", color: "bg-destructive/10 text-destructive border-destructive/30" },
  { type: "Heatwave", icon: Thermometer, severity: "Medium", color: "bg-agro-warning/10 text-agro-warning border-agro-warning/30" },
  { type: "Drought Risk", icon: Sun, severity: "Low", color: "bg-secondary/10 text-secondary border-secondary/30" },
  { type: "Strong Winds", icon: Wind, severity: "Medium", color: "bg-agro-sky/10 text-agro-sky border-agro-sky/30" },
  { type: "Frost Warning", icon: Snowflake, severity: "Low", color: "bg-muted text-muted-foreground border-border" },
  { type: "Pest Outbreak", icon: AlertTriangle, severity: "High", color: "bg-destructive/10 text-destructive border-destructive/30" },
];

export default function ClimateAlerts() {
  const { selectedDistrict } = useDistrict();

  // Simulate alerts based on district
  const alerts = ALERT_TYPES.filter((_, i) => {
    const hash = (selectedDistrict?.id.charCodeAt(0) || 0) + i;
    return hash % 3 !== 0;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Climate Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time weather warnings for {selectedDistrict?.name || "your district"} • Auto-refreshes every 3 hours
        </p>
      </motion.div>

      {/* Current conditions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Temperature", value: `${(28 + Math.random() * 8).toFixed(1)}°C` },
          { label: "Humidity", value: `${(60 + Math.random() * 20).toFixed(0)}%` },
          { label: "Wind", value: `${(5 + Math.random() * 15).toFixed(0)} km/h` },
          { label: "Rainfall (24h)", value: `${(Math.random() * 30).toFixed(1)} mm` },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-lg bg-card shadow-card border border-border/50">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <motion.div
            key={a.type}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-lg border ${a.color} flex items-start gap-3`}
          >
            <a.icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-sm">{a.type}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.severity === "High" ? "bg-destructive/20 text-destructive" :
                  a.severity === "Medium" ? "bg-agro-warning/20 text-agro-warning" :
                  "bg-muted text-muted-foreground"
                }`}>{a.severity}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Expected in {selectedDistrict?.name || "selected district"} region. Take necessary precautions for standing crops.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
