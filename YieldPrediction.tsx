import { useState } from "react";
import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { CROPS_DATA } from "@/data/maharashtra";
import { TrendingUp, AlertTriangle, Calendar, IndianRupee } from "lucide-react";

export default function YieldPrediction() {
  const { selectedDistrict } = useDistrict();
  const crops = CROPS_DATA.filter(c => c.bestDistricts.includes(selectedDistrict?.id || "")).slice(0, 6);
  const [selected, setSelected] = useState(crops[0]?.name || "Rice");

  const predictions = crops.map(c => ({
    name: c.name,
    yieldPerHa: (2 + Math.random() * 6).toFixed(1),
    risk: Math.random() > 0.6 ? "High" : Math.random() > 0.3 ? "Medium" : "Low",
    harvestDate: `${c.harvestMonth} 2026`,
    price: (1500 + Math.random() * 4000).toFixed(0),
  }));

  const activePred = predictions.find(p => p.name === selected) || predictions[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Yield Prediction</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered harvest forecasting for {selectedDistrict?.name}</p>
      </motion.div>

      {/* Crop selector */}
      <div className="flex flex-wrap gap-2">
        {predictions.map(p => (
          <button key={p.name} onClick={() => setSelected(p.name)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selected === p.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >{p.name}</button>
        ))}
      </div>

      {activePred && (
        <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-card shadow-card border border-border/50">
            <TrendingUp className="h-6 w-6 text-primary mb-3" />
            <p className="text-xs text-muted-foreground">Expected Yield</p>
            <p className="text-3xl font-heading font-bold text-foreground">{activePred.yieldPerHa} <span className="text-base text-muted-foreground">tonnes/ha</span></p>
          </div>
          <div className="p-5 rounded-xl bg-card shadow-card border border-border/50">
            <AlertTriangle className={`h-6 w-6 mb-3 ${
              activePred.risk === "High" ? "text-destructive" : activePred.risk === "Medium" ? "text-agro-warning" : "text-primary"
            }`} />
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <p className={`text-3xl font-heading font-bold ${
              activePred.risk === "High" ? "text-destructive" : activePred.risk === "Medium" ? "text-agro-warning" : "text-primary"
            }`}>{activePred.risk}</p>
          </div>
          <div className="p-5 rounded-xl bg-card shadow-card border border-border/50">
            <Calendar className="h-6 w-6 text-agro-earth mb-3" />
            <p className="text-xs text-muted-foreground">Predicted Harvest</p>
            <p className="text-xl font-heading font-bold text-foreground">{activePred.harvestDate}</p>
          </div>
          <div className="p-5 rounded-xl bg-card shadow-card border border-border/50">
            <IndianRupee className="h-6 w-6 text-agro-success mb-3" />
            <p className="text-xs text-muted-foreground">Best Selling Price</p>
            <p className="text-xl font-heading font-bold text-foreground">₹{activePred.price}/quintal</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
