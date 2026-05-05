"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";
import AdmisionHeroSection from "@/components/sections/AdmisionHeroSection";
import AdmisionStepsSection from "@/components/sections/AdmisionStepsSection";
import AdmisionRequirementsSection from "@/components/sections/AdmisionRequirementsSection";
import AdmisionFAQSection from "@/components/sections/AdmisionFAQSection";

export default function AdmisionContent() {
  const { config } = useAdminConfig();
  const habilitada = config.admision.habilitada;

  return (
    <>
      <AdmisionHeroSection />
      {habilitada && (
        <>
          <AdmisionStepsSection />
          <AdmisionRequirementsSection />
          <AdmisionFAQSection />
        </>
      )}
    </>
  );
}
