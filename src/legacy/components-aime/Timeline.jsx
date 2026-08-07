import React, { useMemo, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import SmartTimelineLog from "@/components/aime/timeline/SmartTimelineLog";
import TimelineDayActions from "@/components/aime/timeline/TimelineDayActions";
import TimelineDateGroup from "@/components/aime/timeline/TimelineDateGroup";
import TimelineWalletDropdown from "@/components/aime/timeline/TimelineWalletDropdown";
import TimelineScaleToggle from "@/components/aime/timeline/TimelineScaleToggle";
import TimelineProgrammeView from "@/components/aime/timeline/TimelineProgrammeView";
import TimelineGroupHeader from "@/components/aime/timeline/TimelineGroupHeader";
import TimelineMilestones from "@/components/aime/timeline/TimelineMilestones";
import TimelineRecurringLinks from "@/components/aime/timeline/TimelineRecurringLinks";
import { buildTimelineScaled, detectMilestones, detectRecurringEmployers } from "@/lib/timelineScale";
import { filterPrestationsByWallet } from "@/lib/walletFilter";

const VISIBLE_LIMIT = 3;

export default function Timeline({ prestations = [], events = [], wallets = [], onAdd, onRefresh }) {
  const [activeWallet, setActiveWallet] = useState("smart:all");
  const [scale, setScale] = useState("year");
  const [expandedKey, setExpandedKey] = useState(null);
  const [expandedItems, setExpandedItems] = useState({}); // { [groupKey]: true } -> tout déplier

  // Filtre wallet appliqué AVANT le regroupement
  const filteredPrestations = useMemo(
    () => filterPrestationsByWallet(prestations, activeWallet),
    [prestations, activeWallet]
  );

  // Données dérivées (sur le set filtré pour rester cohérent)
  const groups = useMemo(
    () => buildTimelineScaled(filteredPrestations, events, scale),
    [filteredPrestations, events, scale]
  );
  const milestones = useMemo(() => detectMilestones(filteredPrestations), [filteredPrestations]);
  const recurring = useMemo(() => detectRecurringEmployers(filteredPrestations), [filteredPrestations]);

  // Vue programme : on prend le jour du jour ou la prestation la plus récente
  const programmeAnchor = useMemo(() => {
    if (scale !== "programme") return null;
    const today = new Date().toISOString().slice(0, 10);
    const todays = filteredPrestations.filter((p) => p.date === today);
    if (todays.length) return today;
    const next = [...filteredPrestations].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
    return next?.date || today;
  }, [filteredPrestations, scale]);

  const programmePrestations = useMemo(() => {
    if (scale !== "programme" || !programmeAnchor) return [];
    return filteredPrestations.filter((p) => p.date === programmeAnchor);
  }, [filteredPrestations, scale, programmeAnchor]);

  return (
    <section id="prestations" className="bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 md:px-8 py-12 md:py-20 overflow-x-hidden">
        {/* Titre centré au-dessus */}
        <div className="text-center mb-10 mt-4">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-900">
            Activité Timeline
          </h2>
          <p className="mt-3 text-sm md:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Vos prestations, jalons 507h et événements de scellement,
            organisés par année, mois, jour ou programme.
          </p>
        </div>

        {/* Header timeline : scale centré, dropdown filtres à droite */}
        <div className="relative mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 overflow-x-auto">
            <TimelineScaleToggle scale={scale} onChange={setScale} />
          </div>
          <div className="sm:ml-auto">
            <TimelineWalletDropdown
              wallets={wallets}
              prestations={prestations}
              activeKey={activeWallet}
              onChange={setActiveWallet}
            />
          </div>
        </div>

        {/* Vue Programme */}
        {scale === "programme" ? (
          <TimelineProgrammeView prestations={programmePrestations} anchorDate={programmeAnchor} />
        ) : !groups || groups.length === 0 ? (
          <div className="bg-white rounded-3xl ring-1 ring-zinc-100 p-10 text-center">
            <p className="text-sm text-zinc-500">Aucune prestation pour cette vue.</p>
            <button
              onClick={onAdd}
              className="mt-5 inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer ma première fiche
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-[76px] sm:left-[84px] top-0 bottom-0 w-px bg-zinc-200" aria-hidden />

            {/* Fils conducteurs employeurs récurrents */}
            <TimelineRecurringLinks recurring={recurring} />

            {/* Jalons 507h */}
            <TimelineMilestones milestones={milestones} />

            {groups.map((group) => {
              const isExpanded = expandedKey === group.key;
              const prestaCount = group.items.filter((i) => i.type === "prestation").length;
              const hasPrestations = prestaCount > 0;
              return (
                <div key={group.key} className="mb-8 last:mb-0">
                  <TimelineGroupHeader
                    label={group.label}
                    count={prestaCount}
                    isCurrent={group.isCurrent}
                    isExpanded={isExpanded}
                    disabled={!hasPrestations}
                    onClick={() => hasPrestations && setExpandedKey(isExpanded ? null : group.key)}
                  />

                  {isExpanded && hasPrestations && (
                    <TimelineDayActions items={group.items} onChanged={onRefresh} />
                  )}

                  <ul className="space-y-1">
                    {(() => {
                      // 1. Regrouper les prestations consécutives par date
                      const all = [];
                      let bucket = null;
                      const flush = () => {
                        if (bucket && bucket.prestations.length) {
                          all.push({
                            type: "dategroup",
                            date: bucket.date,
                            prestations: bucket.prestations,
                          });
                        }
                        bucket = null;
                      };
                      group.items.forEach((item) => {
                        if (item.type === "prestation") {
                          const d = item.prestation.date;
                          if (!bucket || bucket.date !== d) {
                            flush();
                            bucket = { date: d, prestations: [] };
                          }
                          bucket.prestations.push(item.prestation);
                        } else {
                          flush();
                          all.push({ type: "log", event: item.event });
                        }
                      });
                      flush();

                      // 2. Limiter à VISIBLE_LIMIT sauf si déplié
                      const isExpandedItems = !!expandedItems[group.key];
                      const hidden = all.length - VISIBLE_LIMIT;
                      const visible = isExpandedItems ? all : all.slice(0, VISIBLE_LIMIT);

                      const rendered = visible.map((it, idx) => {
                        if (it.type === "dategroup") {
                          return (
                            <TimelineDateGroup
                              key={`g-${it.date}-${idx}`}
                              date={it.date}
                              prestations={it.prestations}
                              onChanged={onRefresh}
                            />
                          );
                        }
                        return <SmartTimelineLog key={`l-${it.event.id}`} event={it.event} />;
                      });

                      // 3. Bouton "Voir N de plus" / "Réduire"
                      if (hidden > 0 || isExpandedItems) {
                        rendered.push(
                          <li key="toggle" className="pl-20 sm:pl-24 pt-2">
                            <button
                              onClick={() =>
                                setExpandedItems((s) => ({ ...s, [group.key]: !isExpandedItems }))
                              }
                              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5 rounded-full hover:bg-zinc-100"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isExpandedItems ? "rotate-180" : ""
                                }`}
                              />
                              {isExpandedItems
                                ? "Réduire"
                                : `Voir ${hidden} de plus`}
                            </button>
                          </li>
                        );
                      }

                      return rendered;
                    })()}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}