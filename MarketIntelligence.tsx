import { useState } from "react";
import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { CROPS_DATA } from "@/data/maharashtra";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function generatePriceData(crop: string) {
  const base = crop === "Rice" ? 2000 : crop === "Cotton" ? 6000 : crop === "Soybean" ? 4500 : 3000;
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => ({
    month: m,
    price: base + Math.floor(Math.random() * 1000 - 500),
    predicted: base + Math.floor(Math.random() * 800 - 200),
  }));
}

export default function MarketIntelligence() {
  const { selectedDistrict } = useDistrict();
  const crops = CROPS_DATA.filter(c => c.bestDistricts.includes(selectedDistrict?.id || "")).slice(0, 6);
  const cropNames = crops.length > 0 ? crops.map(c => c.name) : ["Rice", "Cotton", "Soybean"];
  const [selected, setSelected] = useState(cropNames[0]);
  const data = generatePriceData(selected);
  const trend = data[data.length - 1].predicted > data[0].price;

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Market Intelligence</h1>
        <p className="text-muted-foreground text-sm mt-1">Price trends for {selectedDistrict?.name}</p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {cropNames.map(c => (
          <button key={c} onClick={() => setSelected(c)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selected === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >{c}</button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-card shadow-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">{selected} — Price Chart (₹/quintal)</h3>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${trend ? "text-agro-success" : "text-destructive"}`}>
            {trend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend ? "Uptrend" : "Downtrend"}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 15% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150 10% 45%)" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(150 10% 45%)" }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="price" stroke="hsl(145 63% 28%)" strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(38 85% 55%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
