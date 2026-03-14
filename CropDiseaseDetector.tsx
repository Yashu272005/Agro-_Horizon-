import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, ShieldAlert, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiseaseResult {
  disease?: string;
  confidence?: string;
  description?: string;
  symptoms?: string[];
  treatment?: string[];
  prevention?: string[];
  severity?: string;
  error?: string;
}

export default function CropDiseaseDetector() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!preview) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("crop-disease", {
        body: { imageBase64: preview },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        setResult(data);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to analyze image", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const severityColor = (s?: string) => {
    if (s === "High") return "text-destructive bg-destructive/10";
    if (s === "Medium") return "text-agro-warning bg-agro-warning/10";
    return "text-agro-success bg-agro-success/10";
  };

  const labels = language === "mr" ? {
    title: "पीक रोग शोधक",
    subtitle: "तुमच्या पिकाचा फोटो अपलोड करा आणि AI रोग ओळखेल",
    upload: "फोटो अपलोड करा",
    analyze: "विश्लेषण करा",
    analyzing: "विश्लेषण होत आहे...",
    disease: "रोग",
    confidence: "विश्वास",
    severity: "तीव्रता",
    description: "वर्णन",
    symptoms: "लक्षणे",
    treatment: "उपचार",
    prevention: "प्रतिबंध",
    healthy: "पीक निरोगी आहे!",
    clear: "साफ करा",
  } : {
    title: "Crop Disease Detector",
    subtitle: "Upload a photo of your crop and AI will identify diseases",
    upload: "Upload Photo",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    disease: "Disease",
    confidence: "Confidence",
    severity: "Severity",
    description: "Description",
    symptoms: "Symptoms",
    treatment: "Treatment",
    prevention: "Prevention",
    healthy: "Crop is healthy!",
    clear: "Clear",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">{labels.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{labels.subtitle}</p>
      </motion.div>

      {/* Upload area */}
      <Card>
        <CardContent className="p-6">
          {!preview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              <div className="p-4 rounded-full bg-primary/10">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground">{labels.upload}</p>
              <p className="text-xs text-muted-foreground">JPG, PNG — max 5MB</p>
            </button>
          ) : (
            <div className="relative">
              <img src={preview} alt="Crop" className="w-full max-h-80 object-contain rounded-lg" />
              <button onClick={clear} className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-destructive/10">
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

          {preview && !result && (
            <Button onClick={analyze} disabled={loading} className="w-full mt-4">
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {labels.analyzing}</>
              ) : (
                <><Upload className="h-4 w-4" /> {labels.analyze}</>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {result && !result.error && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Header card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {result.disease === "Healthy" ? (
                    <CheckCircle className="h-5 w-5 text-agro-success" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                  )}
                  {result.disease === "Healthy" ? labels.healthy : result.disease}
                </CardTitle>
                {result.severity && result.disease !== "Healthy" && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor(result.severity)}`}>
                    {labels.severity}: {result.severity}
                  </span>
                )}
              </div>
              {result.confidence && (
                <p className="text-sm text-muted-foreground">{labels.confidence}: {result.confidence}</p>
              )}
            </CardHeader>
            {result.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-foreground">{result.description}</p>
              </CardContent>
            )}
          </Card>

          {/* Details */}
          {result.disease !== "Healthy" && (
            <div className="grid gap-4 md:grid-cols-3">
              {result.symptoms && result.symptoms.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-agro-warning" /> {labels.symptoms}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-agro-warning mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {result.treatment && result.treatment.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Leaf className="h-4 w-4 text-primary" /> {labels.treatment}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {result.treatment.map((t, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {result.prevention && result.prevention.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-agro-success" /> {labels.prevention}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {result.prevention.map((p, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-agro-success mt-0.5">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Button variant="outline" onClick={clear} className="w-full">{labels.clear}</Button>
        </motion.div>
      )}
    </div>
  );
}
