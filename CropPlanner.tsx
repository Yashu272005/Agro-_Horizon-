import { useState } from "react";
import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { CROPS_DATA, Season } from "@/data/maharashtra";
import { Sprout, Calendar, Droplet, CheckCircle2 } from "lucide-react";

const SOIL_TYPES = ["Black", "Red", "Laterite", "Alluvial", "Medium Black"];
const SEASONS: Season[] = ["Kharif", "Rabi", "Summer"];

export default function CropPlanner() {
  const { selectedDistrict } = useDistrict();
  const [soil, setSoil] = useState(selectedDistrict?.soilTypes[0] || "Black");
  const [season, setSeason] = useState<Season>("Kharif");

  const recommended = CROPS_DATA.filter((c) => {
    const matchSeason = c.season === season;
    const matchDistrict = c.bestDistricts.includes(selectedDistrict?.id || "");
    return matchSeason && (matchDistrict || Math.random() > 0.5);
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Crop Planner</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Smart recommendations for {selectedDistrict?.name || "your district"}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Soil Type</label>
          <div className="flex gap-2">
            {SOIL_TYPES.map((s) => (
              <button key={s} onClick={() => setSoil(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  soil === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Season</label>
          <div className="flex gap-2">
            {SEASONS.map((s) => (
              <button key={s} onClick={() => setSeason(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  season === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-3">
        {recommended.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-2">No crops found for the selected combination. Try changing the filters.</p>
        )}
        {recommended.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-lg bg-card shadow-card border border-border/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">{c.name}</h3>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                c.waterNeed === "High" ? "bg-agro-sky/15 text-agro-sky" :
                c.waterNeed === "Medium" ? "bg-agro-warning/15 text-agro-warning" :
                "bg-primary/10 text-primary"
              }`}>{c.waterNeed} Water</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Sow: {c.sowingMonth}</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Harvest: {c.harvestMonth}</div>
              <div className="flex items-center gap-1.5"><Droplet className="h-3 w-3" /> Water: {c.waterNeed}</div>
              <div className="flex items-center gap-1.5"><Sprout className="h-3 w-3" /> Season: {c.season}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
