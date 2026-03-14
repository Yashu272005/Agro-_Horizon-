import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Phone, Eye, EyeOff, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";
type InputMethod = "email" | "mobile";

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<InputMethod>("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const identifier = method === "email" ? { email } : { phone: `+91${mobile}` };
        const { error } = await supabase.auth.signUp({
          ...identifier,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: mode === "register" ? "Account created!" : "",
          description: method === "email"
            ? "Check your email for a verification link."
            : "Account created successfully!",
        });
        if (method === "mobile") {
          navigate("/");
        }
      } else {
        const identifier = method === "email"
          ? { email, password }
          : { phone: `+91${mobile}`, password };
        const { error } = await supabase.auth.signInWithPassword(identifier);
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-heading font-bold text-sm text-foreground">{t("app.name")}</span>
        </div>
        <LanguageToggle />
      </div>

      {/* Auth card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Leaf className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              {mode === "login" ? t("auth.farmerLogin") : t("auth.register")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("auth.subtitle")}</p>
          </div>

          {/* Method toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-5">
            <button
              onClick={() => setMethod("mobile")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
                method === "mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              {t("auth.useMobile")}
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${
                method === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              {t("auth.useEmail")}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t("auth.name")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("auth.name")}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {method === "email" ? (
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t("auth.email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t("auth.mobile")}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                  <Input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="pl-[4.5rem]"
                    required
                    minLength={10}
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">{t("auth.password")}</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : mode === "login" ? t("auth.loginBtn") : t("auth.registerBtn")}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? t("auth.registerBtn") : t("auth.loginBtn")}
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Guest */}
          <Button variant="outline" className="w-full" onClick={handleGuestContinue}>
            {t("auth.continueAsGuest")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
