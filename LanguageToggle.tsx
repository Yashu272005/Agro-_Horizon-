import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "mr" : "en")}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card hover:bg-accent transition-colors ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-primary" />
      {t("lang.switch")}
    </button>
  );
}
