"use client";

import { useState, useEffect, useCallback } from "react";
import { CarouselSlide } from "@/app/context/AdminConfigContext";

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80&fit=crop",
    alt: "Alumnos estudiando juntos en salón de clases",
    label: "Formación técnica de calidad",
  },
  {
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1600&q=80&fit=crop",
    alt: "Laboratorio de cómputo con alumnos",
    label: "Laboratorios de Informática equipados",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&fit=crop",
    alt: "Taller de gastronomía",
    label: "Taller de Gastronomía profesional",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&fit=crop",
    alt: "Instalaciones educativas modernas",
    label: "Instalaciones modernas en Chalco",
  },
  {
    src: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1600&q=80&fit=crop",
    alt: "Alumnos en graduación",
    label: "Egresados listos para el futuro",
  },
];

interface HeroCarouselProps {
  slides?: CarouselSlide[];
}

export default function HeroCarousel({ slides = DEFAULT_SLIDES }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt=""
            role="presentation"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay degradado azul institucional */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-blue-900/40" />

      {/* Controles de navegación */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
      </button>

      {/* Indicadores + label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/80 text-xs font-medium tracking-wide drop-shadow">
          {slides[current].label}
        </span>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
