"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

const FALLBACK_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6334.449767824081!2d-98.84201442904536!3d19.261204329788868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce18ab560fc0b7%3A0xf18fa0c2df554486!2sCBT%20N%C3%BAmero%205%20Chalco!5e0!3m2!1ses!2smx!4v1777535021958!5m2!1ses!2smx";

export default function ContactoMap() {
  const { config } = useAdminConfig();
  const mapUrl = config.contacto.mapaUrl || FALLBACK_MAP_URL;

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm flex-grow min-h-[400px]">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "400px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación CBT Núm. 5 Chalco"
      />
    </div>
  );
}

