import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
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

export default function Timeline({
  prestations = [],
  events = [],
  wallets = [],
  onAdd,
  onRefresh,
  selectedPrestationId = null,
  selectedEventId = null,
  onSelectPrestation,
  onSelectEvent,
}) {
  const [activeWallet, setActiveWallet] = useState("smart:all");
  const [scale, setScale] = useState("year");
  const [expandedKey, setExpandedKey] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const filteredPrestations = useMemo(
    () => filterPrestationsByWallet(prestations, activeWallet),
    [prestations, activeWallet]
  );

  const groups = useMemo(
    () => buildTimelineScaled(filteredPrestations, events, scale),
    [filteredPrestations, events, scale]
  );
  const milestones = useMemo(() => detectMilestones(filteredPrestations), [filteredPrestations]);
  const recurring = useMemo(() => detectRecurringEmployers(filteredPrestations), [filteredPrestations]);

  const programmeAnchor = useMemo(() => {
    if (scale !== "programme") return null;
    const today = new Date().toISOString().slice(0, 10);
    const todays = filteredPrestations.filter((item) => item.date === today);
    if (todays.length) return today;
    const next = [...filteredPrestations].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
    return next?.date || today;
  }, [filteredPrestations, scale]);

  const programmePrestations = useMemo(() => {
    if (scale !== "programme" || !programmeAnchor) return [];
    return filteredPrestations.filter((item) => item.date === programmeAnchor);
  }, [filteredPrestations, scale, programmeAnchor]);

  useEffect(() => {
    if (selectedPrestationId) return;
    const firstPrestation = filteredPrestations[0];
    if (firstPrestation) onSelectPrestation?.(firstPrestation);
  }, [filteredPrestations, onSelectPrestation, selectedPrestationId]);

  return (
    <section id="prestations" className="bg-[#FAFAFA] h-full min-h-0">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_25px_80px_-45px_rgba(0,0,0,0.25)]">
        <div className="border-b border-zinc-100 px-6 py-6 md:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aime-red">Timeline</div>
              <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">
                Activité, documents et jalons.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 md:text-base">
                La timeline devient la scène principale. Cliquez sur une fiche à gauche : les éléments de contexte, QR, organismes et l'assistant se synchronisent à droite.
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-3 xl:flex-nowrap">
              <TimelineWalletDropdown
                wallets={wallets}
                prestations={prestations}
                activeKey={activeWallet}
                onChange={setActiveWallet}
              />
              <div className="hidden xl:block">
                <TimelineScaleToggle scale={scale} onChange={setScale} orientation="vertical" />
              </div>
            </div>
          </div>

          <div className="mt-4 xl:hidden">
            <TimelineScaleToggle scale={scale} onChange={setScale} />
          </div>
        </div>

        <div className="relative flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-5 md:px-7">
          {scale === "programme" ? (
            <TimelineProgrammeView prestations={programmePrestations} anchorDate={programmeAnchor} />
          ) : !groups || groups.length === 0 ? (
            <div className="rounded-3xl ring-1 ring-zinc-100 p-10 text-center bg-zinc-50">
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
              <div className="absolute left-[76px] sm:left-[84px] top-0 bottom-0 w-px bg-zinc-200" aria-hidden />
              <TimelineRecurringLinks recurring={recurring} />
              <TimelineMilestones milestones={milestones} />

              {groups.map((group) => {
                const isExpanded = expandedKey === group.key;
                const prestaCount = group.items.filter((item) => item.type === "prestation").length;
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
                        const all = [];
                        let bucket = null;
                        const flush = () => {
                          if (bucket && bucket.prestations.length) {
                            all.push({ type: "dategroup", date: bucket.date, prestations: bucket.prestations });
                          }
                          bucket = null;
                        };

                        group.items.forEach((item) => {
                          if (item.type === "prestation") {
                            const date = item.prestation.date;
                            if (!bucket || bucket.date !== date) {
                              flush();
                              bucket = { date, prestations: [] };
                            }
                            bucket.prestations.push(item.prestation);
                          } else {
                            flush();
                            all.push({ type: "log", event: item.event });
                          }
                        });
                        flush();

                        const isExpandedItems = !!expandedItems[group.key];
                        const hidden = all.length - VISIBLE_LIMIT;
                        const visible = isExpandedItems ? all : all.slice(0, VISIBLE_LIMIT);

                        const rendered = visible.map((item, idx) => {
                          if (item.type === "dategroup") {
                            return (
                              <TimelineDateGroup
                                key={`g-${item.date}-${idx}`}
                                date={item.date}
                                prestations={item.prestations}
                                onChanged={onRefresh}
                                selectedPrestationId={selectedPrestationId}
                                onSelectPrestation={onSelectPrestation}
                              />
                            );
                          }
                          return (
                            <SmartTimelineLog
                              key={`l-${item.event.id}`}
                              event={item.event}
                              selected={selectedEventId === item.event.id}
                              onSelect={onSelectEvent}
                            />
                          );
                        });

                        if (hidden > 0 || isExpandedItems) {
                          rendered.push(
                            <li key="toggle" className="pl-20 sm:pl-24 pt-2">
                              <button
                                onClick={() => setExpandedItems((state) => ({ ...state, [group.key]: !isExpandedItems }))}
                                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5 rounded-full hover:bg-zinc-100"
                              >
                                {isExpandedItems ? "Réduire" : `Voir ${hidden} de plus`}
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
      </div>
    </section>
  );
}
