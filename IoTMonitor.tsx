import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { Cpu, Thermometer, Droplet, CloudRain, FlaskConical, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

interface SensorReading {
  label: string;
  icon: any;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  color: string;
}

function generateSensors(): SensorReading[] {
  const temp =35.4;
  const humidity = 40 + Math.random() * 45;
  const soilMoisture = 20 + Math.random() * 60;
  const rain = Math.random() > 0.7 ? 1 : 0;
  const ph = 5.5 + Math.random() * 3;
  return [
    { label: "Temperature (DHT22)", icon: Thermometer, value: +temp.toFixed(1), unit: "°C", status: temp > 38 ? "critical" : temp > 33 ? "warning" : "normal", color: temp > 38 ? "text-destructive" : temp > 33 ? "text-agro-warning" : "text-primary" },
    { label: "Humidity (DHT22)", icon: Droplet, value: +humidity.toFixed(0), unit: "%", status: humidity < 30 ? "warning" : "normal", color: "text-agro-sky" },
    { label: "Soil Moisture", icon: Droplet, value: +soilMoisture.toFixed(0), unit: "%", status: soilMoisture < 35 ? "critical" : soilMoisture < 45 ? "warning" : "normal", color: soilMoisture < 35 ? "text-destructive" : "text-primary" },
  ];
}

export default function IoTMonitor() {
  const { selectedDistrict } = useDistrict();
  const [sensors, setSensors] = useState(generateSensors);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(generateSensors());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">IoT Monitoring Panel</h1>
        <p className="text-muted-foreground text-sm mt-1">Live sensor data for {selectedDistrict?.name} • ESP32 Connected</p>
      </motion.div>

      {/* Device status */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-card shadow-card border border-border/50">
        <Cpu className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-foreground">ESP32 NodeMCU</span>
        <div className={`ml-auto flex items-center gap-1.5 text-xs font-medium ${online ? "text-agro-success" : "text-destructive"}`}>
          {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {online ? "Online" : "Offline"}
        </div>
        <div className={`h-2 w-2 rounded-full ${online ? "bg-agro-success animate-pulse-soft" : "bg-destructive"}`} />
      </div>

      {/* Sensor cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {sensors.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-lg bg-card shadow-card border ${
              s.status === "critical" ? "border-destructive/50" : s.status === "warning" ? "border-agro-warning/50" : "border-border/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-sm font-medium text-foreground">{s.label}</span>
              </div>
              {s.status !== "normal" && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.status === "critical" ? "bg-destructive/15 text-destructive" : "bg-agro-warning/15 text-agro-warning"
                }`}>{s.status}</span>
              )}
            </div>
            <p className="text-3xl font-heading font-bold text-foreground">
              {s.label === "Rain Sensor" ? "" : s.value}
              <span className="text-base text-muted-foreground ml-1">{s.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Auto irrigation trigger */}
      {sensors.find(s => s.label === "Soil Moisture" && s.status === "critical") && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="font-heading font-semibold text-foreground text-sm">⚠ Auto Irrigation Triggered</p>
          <p className="text-xs text-muted-foreground mt-1">Soil moisture below threshold. Irrigation pump activated automatically.</p>
        </div>
      )}
    </div>
  );
}
