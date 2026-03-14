import { motion } from "framer-motion";
import { Settings, Users, MapPin, Sprout, AlertTriangle, Cpu } from "lucide-react";

const ADMIN_SECTIONS = [
  { label: "Manage Users", icon: Users, count: 1245, desc: "Farmers, Officers, Admins" },
  { label: "Manage Districts", icon: MapPin, count: 36, desc: "All Maharashtra districts" },
  { label: "Manage Crops", icon: Sprout, count: 48, desc: "Crop database entries" },
  { label: "Manage Alerts", icon: AlertTriangle, count: 12, desc: "Active climate alerts" },
  { label: "Manage Sensors", icon: Cpu, count: 89, desc: "Connected IoT devices" },
];

export default function Admin() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform management dashboard</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-3">
        {ADMIN_SECTIONS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-5 rounded-lg bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{s.count.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Full admin CRUD operations require backend integration. Connect Lovable Cloud to enable database management.
        </p>
      </div>
    </div>
  );
}
