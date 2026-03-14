import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDistrict } from "@/contexts/DistrictContext";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const RESPONSES: Record<string, string> = {
  default: "I'm your AgroHorizon AI assistant. I can help with crop diseases, fertilizer recommendations, pest detection, and farming advice. Ask me anything!",
  disease: "Based on common patterns in your district, leaf yellowing can indicate Nitrogen deficiency or early blight. Recommended: Apply Urea 50kg/ha or spray Mancozeb 0.25% solution. Upload a photo for more accurate diagnosis.",
  fertilizer: "For your soil type, I recommend: DAP 100kg/ha during sowing, Urea 50kg/ha at 30 days, and MOP 50kg/ha. Consider adding micronutrients like Zinc Sulphate 25kg/ha for improved yield.",
  pest: "Common pests in your region include Bollworm (Cotton), Stem borer (Rice), and Pod borer (Tur). Use integrated pest management: Neem-based sprays first, chemical pesticides only if infestation exceeds economic threshold.",
  weather: "Current forecast shows moderate rainfall expected. Ensure proper drainage. Avoid spraying pesticides before rain. Good time for top-dressing nitrogen fertilizer.",
  irrigation: "Based on soil moisture readings, irrigation is recommended every 3-4 days for current crops. Use drip irrigation for 40% water savings. Mulching can reduce water requirement by 25%.",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("disease") || lower.includes("yellow") || lower.includes("leaf") || lower.includes("रोग")) return RESPONSES.disease;
  if (lower.includes("fertilizer") || lower.includes("खत") || lower.includes("urea")) return RESPONSES.fertilizer;
  if (lower.includes("pest") || lower.includes("कीटक") || lower.includes("insect")) return RESPONSES.pest;
  if (lower.includes("weather") || lower.includes("rain") || lower.includes("हवामान")) return RESPONSES.weather;
  if (lower.includes("irrigation") || lower.includes("water") || lower.includes("पाणी")) return RESPONSES.irrigation;
  return RESPONSES.default;
}

export default function AIAssistant() {
  const { selectedDistrict } = useDistrict();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: `नमस्कार! मी तुमचा AgroHorizon AI सहाय्यक आहे. ${selectedDistrict?.name || ""} जिल्ह्यासाठी शेतीबद्दल काहीही विचारा! (Hello! I'm your AI assistant. Ask me anything about farming!)` },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", text: getResponse(userMsg) }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">AI Assistant</h1>
        <p className="text-muted-foreground text-sm mt-1">Marathi + English farming chatbot</p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-2">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && (
              <div className="p-1.5 rounded-full bg-primary/10 h-fit">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-card shadow-card border border-border/50 text-foreground rounded-bl-sm"
            }`}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="p-1.5 rounded-full bg-muted h-fit">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <button className="p-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors">
          <Mic className="h-5 w-5" />
        </button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about crops, diseases, weather... (English or मराठी)"
          className="flex-1"
        />
        <button onClick={send} className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
