import { motion } from "framer-motion";
import { useDistrict } from "@/contexts/DistrictContext";
import { CROPS_DATA } from "@/data/maharashtra";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_MAP: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

const STAGE_COLORS = [
  "bg-primary/70", "bg-primary/50", "bg-agro-success/60", "bg-agro-warning/60", "bg-secondary/60",
];

export default function CropCalendar() {
  const { selectedDistrict } = useDistrict();
  const crops = CROPS_DATA.filter(c => c.bestDistricts.includes(selectedDistrict?.id || "") || Math.random() > 0.6).slice(0, 8);

  function getSpan(sow: string, harvest: string) {
    const s = MONTH_MAP[sow] ?? 0;
    const h = MONTH_MAP[harvest] ?? 11;
    return { start: s, end: h >= s ? h : h + 12 };
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Crop Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">Timeline from sowing to harvest for {selectedDistrict?.name}</p>
      </motion.div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month headers */}
          <div className="grid grid-cols-[140px_repeat(12,1fr)] gap-0 mb-2">
            <div className="text-xs text-muted-foreground font-medium">Crop</div>
            {MONTHS.map(m => (
              <div key={m} className="text-xs text-muted-foreground text-center font-medium">{m}</div>
            ))}
          </div>

          {/* Crop rows */}
          {crops.map((c, ci) => {
            const { start, end } = getSpan(c.sowingMonth, c.harvestMonth);
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.05 }}
                className="grid grid-cols-[140px_repeat(12,1fr)] gap-0 py-1.5 border-b border-border/50"
              >
                <div className="text-sm font-medium text-foreground truncate pr-2">{c.name}</div>
                {MONTHS.map((_, mi) => {
                  const isActive = start <= end
                    ? mi >= start && mi <= end
                    : mi >= start || mi <= end;
                  return (
                    <div key={mi} className="px-0.5">
                      {isActive ? (
                        <div className={`h-6 rounded-sm ${STAGE_COLORS[ci % STAGE_COLORS.length]}`} />
                      ) : (
                        <div className="h-6" />
                      )}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
