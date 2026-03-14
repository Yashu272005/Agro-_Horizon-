import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { Droplets, AlertTriangle, CheckCircle2, Gauge } from "lucide-react";

export default function Irrigation() {
  const { selectedDistrict } = useDistrict();
  const soilMoisture = Math.floor(30 + Math.random() * 50);
  const threshold = 40;
  const needsIrrigation = soilMoisture < threshold;

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Smart Irrigation Advisor</h1>
        <p className="text-muted-foreground text-sm mt-1">{selectedDistrict?.name || "District"} water management</p>
      </motion.div>

      {/* Status card */}
      <div className={`p-6 rounded-xl border-2 ${
        needsIrrigation ? "border-destructive/50 bg-destructive/5" : "border-primary/50 bg-primary/5"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {needsIrrigation ? (
            <AlertTriangle className="h-8 w-8 text-destructive" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-primary" />
          )}
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">
              {needsIrrigation ? "Irrigation Recommended" : "Soil Moisture Adequate"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {needsIrrigation
                ? "Soil moisture is below threshold. Irrigate within 6 hours."
                : "Conditions are good. No irrigation needed right now."}
            </p>
          </div>
        </div>

        {/* Gauge */}
        <div className="flex items-center gap-4">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Soil Moisture</span>
              <span>{soilMoisture}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  soilMoisture < 30 ? "bg-destructive" : soilMoisture < 50 ? "bg-agro-warning" : "bg-primary"
                }`}
                style={{ width: `${soilMoisture}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Dry</span>
              <span className="text-destructive">Threshold: {threshold}%</span>
              <span>Wet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: "Water Saved Today", value: "1,200 L", icon: Droplets, color: "text-agro-sky" },
          { label: "Next Irrigation", value: needsIrrigation ? "Now" : "In 18 hrs", icon: Gauge, color: needsIrrigation ? "text-destructive" : "text-primary" },
          { label: "Efficiency Score", value: "87%", icon: CheckCircle2, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-lg bg-card shadow-card border border-border/50">
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
