import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Leaf, LogIn } from "lucide-react";
import { useDistrict } from "@/contexts/DistrictContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MAHARASHTRA_DISTRICTS, REGIONS, District } from "@/data/maharashtra";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";

export default function DistrictSelection() {
  const { setSelectedDistrict } = useDistrict();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState<string>("All");

  const filtered = MAHARASHTRA_DISTRICTS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.nameMarathi.includes(search);
    const matchesRegion = activeRegion === "All" || d.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  const handleSelect = (d: District) => {
    setSelectedDistrict(d);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-hero px-4 py-12 md:py-20 text-center relative">
        {/* Top actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="bg-card/90 border-border text-foreground text-xs gap-1.5"
          >
            <LogIn className="h-3.5 w-3.5" />
            {t("auth.login")}
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">
              {t("app.name")}
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            {t("district.title")}
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("district.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-0 shadow-card text-foreground"
            />
          </div>
        </motion.div>
      </div>

      {/* Region tabs */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 max-w-5xl mx-auto">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeRegion === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pb-12 max-w-5xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} {t("district.count")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              onClick={() => handleSelect(d)}
              className="group p-4 rounded-lg bg-card shadow-card hover:shadow-card-hover border border-border/50 text-left transition-all hover:-translate-y-0.5"
            >
              <MapPin className="h-4 w-4 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-heading font-semibold text-sm text-foreground">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.nameMarathi}</p>
              <p className="text-xs text-primary/70 mt-1">{d.region}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
