import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, ShieldCheck, Filter } from "lucide-react";
import { EVENTS } from "../data/events";
import type { Event } from "../types";
import { EventModal } from "./EventModal";
import { getPublishedEvents } from "../services/events";
import { Section, SectionHeading } from "./Section";
import { SectionReveal } from "./SectionReveal";

import { getAssetUrl } from "../utils/assetHelper";

function mapSupabaseEventToPublicEvent(dbEvent: any): Event {
  const staticMatch = EVENTS.find(
    (ev) => ev.id === dbEvent.id || ev.slug === dbEvent.slug || ev.title?.toLowerCase().trim() === dbEvent.title?.toLowerCase().trim()
  );
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    subtitle: dbEvent.subtitle || staticMatch?.subtitle || undefined,
    slug: dbEvent.slug,
    date: dbEvent.event_date || staticMatch?.date || undefined,
    displayDate: dbEvent.display_date || dbEvent.event_date || staticMatch?.displayDate || undefined,
    year: dbEvent.year || staticMatch?.year || new Date(dbEvent.event_date || Date.now()).getFullYear(),
    category: dbEvent.category || staticMatch?.category || "General",
    status: (dbEvent.status === "published" ? "completed" : "upcoming") as any,
    location: dbEvent.venue || dbEvent.city || staticMatch?.location || undefined,
    description: dbEvent.description || staticMatch?.description || "",
    shortDescription: dbEvent.short_description || dbEvent.description || staticMatch?.shortDescription || "",
    image: getAssetUrl(
      (dbEvent.cover_image_url && dbEvent.cover_image_url.trim() !== "")
        ? dbEvent.cover_image_url
        : (staticMatch?.image || "/assets/events/the-one.jpg")
    ),
    featured: Boolean(dbEvent.featured),
    organizerType: dbEvent.organizer_type || staticMatch?.organizerType || "LIA",
    liaRole: dbEvent.lia_role || staticMatch?.liaRole || "ORGANIZER",
    organizer: dbEvent.organizer || staticMatch?.organizer || undefined,
    collaborators: dbEvent.collaborators || staticMatch?.collaborators || [],
    tags: dbEvent.tags || staticMatch?.tags || [],
    source: dbEvent.source_platform ? {
      platform: dbEvent.source_platform as any,
      url: dbEvent.source_url || undefined,
      verified: Boolean(dbEvent.source_verified),
    } : staticMatch?.source,
  };
}

export const Events = () => {
  const [eventsList, setEventsList] = useState<Event[]>(EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    let isMounted = true;
    getPublishedEvents()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setEventsList(data.map(mapSupabaseEventToPublicEvent));
        }
      })
      .catch((err) => {
        console.warn("Could not load events from database, using static fallback:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = [
    { label: "ALL", value: "ALL" },
    { label: "2026–27", value: "2026" },
    { label: "2025–26", value: "2025" },
    { label: "LEADERSHIP", value: "LEADERSHIP" },
    { label: "SPORTS", value: "SPORTS" },
    { label: "HEALTH", value: "HEALTH" },
    { label: "PROFESSIONAL DEV", value: "PROFESSIONAL DEVELOPMENT" },
    { label: "DISTRICT EVENTS", value: "DISTRICT EVENTS" },
  ];

  const filteredEvents = eventsList.filter((ev) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "2026") return ev.year === 2026;
    if (activeFilter === "2025") return ev.year === 2025;
    return ev.category.toUpperCase().includes(activeFilter);
  });

  const featuredEvent = eventsList.find((ev) => ev.featured) || eventsList[0];

  return (
    <Section id="events" className="bg-[#07111F] border-t border-white/5">
      <SectionReveal>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <SectionHeading
              badge="Verified Club Activities"
              title="EVENTS & INITIATIVES"
              centered={false}
              className="mb-0"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-md text-[#8E9DAE] text-sm sm:text-base font-normal">
              Chronological records of verified club installations, district seminars, youth sports tournaments, and public health initiatives.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0E1F38] hover:bg-[#152A4A] border border-[#C9A961]/30 text-xs font-semibold text-[#C9A961] shrink-0 transition-colors shadow-sm"
            >
              <span>Explore All Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Featured Event Spotlight: THE ONE */}
        {featuredEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => setSelectedEvent(featuredEvent)}
            className="mb-14 glass-primary glass-card-hover glass-shine rounded-3xl overflow-hidden border border-[#D7B65A]/35 group cursor-pointer shadow-2xl transition-all relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative h-56 sm:h-72 lg:h-96 overflow-hidden">
                <img
                  src={getAssetUrl(featuredEvent.image)}
                  alt={featuredEvent.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050B14]/90 via-[#050B14]/30 lg:via-transparent to-transparent lg:to-[#050B14]" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#D7B65A] text-[#07111F] shadow-lg">
                    Featured Installation
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider glass-floating text-[#E8D89A] border border-[#D7B65A]/40 backdrop-blur-md">
                    Rotary Year 2026–27
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-4 h-4 text-[#D7B65A]" />
                  <span className="font-semibold text-white">{featuredEvent.displayDate}</span>
                  <span>•</span>
                  <span>{featuredEvent.location}</span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#E8D89A] transition-colors leading-tight">
                  {featuredEvent.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#D7B65A]">
                  {featuredEvent.subtitle}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {featuredEvent.shortDescription}
                </p>

                <div className="pt-3 sm:pt-4 flex items-center justify-between text-xs font-semibold text-white border-t border-white/10">
                  <span className="flex items-center space-x-1.5 text-[#10B981] text-[11px] sm:text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">LIA Organized • Afternoon Newspaper Featured</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#D7B65A] group-hover:text-[#07111F] flex items-center justify-center transition-colors shrink-0 ml-2">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-3.5 h-3.5 text-[#D7B65A]" />
            <span>Filter Events</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all ${
                  activeFilter === f.value
                    ? "btn-liquid-primary shadow-lg shadow-[#D7B65A]/25"
                    : "glass-subtle text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((ev) => {
              const roleStyles: Record<string, string> = {
                ORGANIZER: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30",
                CO_ORGANIZER: "text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30",
                PARTICIPANT: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
                REPRESENTATIVE: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30",
              };
              const roleLabel: Record<string, string> = {
                ORGANIZER: "LIA Organized",
                CO_ORGANIZER: "Joint Event",
                PARTICIPANT: "Participation",
                REPRESENTATIVE: "District Rep",
              };

              return (
                <motion.div
                  layout
                  key={ev.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedEvent(ev)}
                  className="glass-secondary glass-card-hover glass-shine rounded-2xl overflow-hidden border border-white/10 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getAssetUrl(ev.image || "/assets/events/the-one.jpg")}
                      alt={ev.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${roleStyles[ev.liaRole] || "text-white bg-white/10"}`}>
                        {roleLabel[ev.liaRole] || ev.liaRole}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D7B65A]" />
                        <span>{ev.displayDate}</span>
                      </span>
                      {ev.location && (
                        <span className="flex items-center space-x-1 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-[#06B6D4]" />
                          <span>{ev.location.split(",")[0]}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D7B65A] mb-1">
                        {ev.category}
                      </div>

                      <h4 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-[#E8D89A] transition-colors leading-snug">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-3 mb-4">
                        {ev.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white">
                      <span>View Event Record</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D7B65A]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        </SectionReveal>

      {/* Event Details Dialog */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </Section>
  );
};
