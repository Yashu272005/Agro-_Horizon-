import React, { createContext, useContext, useState, ReactNode } from "react";
import { District, MAHARASHTRA_DISTRICTS } from "@/data/maharashtra";

interface DistrictContextType {
  selectedDistrict: District | null;
  setSelectedDistrict: (d: District | null) => void;
  districts: District[];
}

const DistrictContext = createContext<DistrictContextType | undefined>(undefined);

export function DistrictProvider({ children }: { children: ReactNode }) {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  return (
    <DistrictContext.Provider value={{ selectedDistrict, setSelectedDistrict, districts: MAHARASHTRA_DISTRICTS }}>
      {children}
    </DistrictContext.Provider>
  );
}

export function useDistrict() {
  const ctx = useContext(DistrictContext);
  if (!ctx) throw new Error("useDistrict must be used within DistrictProvider");
  return ctx;
}
