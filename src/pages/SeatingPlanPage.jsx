import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Move } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { applyGuestSeatingInState, getSeatingGroups, getTableOverview, readWeddingState, writeWeddingState } from "@/lib/aimeWeddingCore";

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

export default function SeatingPlanPage() {
  const [state, setState] = useState(() => readWeddingState());

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const groups = useMemo(() => getSeatingGroups(state), [state]);
  const tables = useMemo(() => getTableOverview(state), [state]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draft = groups.map((group) => ({ ...group, guests: [...group.guests] }));
    const sourceGroup = draft.find((group) => group.id === source.droppableId);
    const destinationGroup = draft.find((group) => group.id === destination.droppableId);
    if (!sourceGroup || !destinationGroup) return;

    const [moved] = sourceGroup.guests.splice(source.index, 1);
    destinationGroup.guests.splice(destination.index, 0, moved);

    const assignments = draft.flatMap((group) =>
      group.guests.map((guest, index) => ({ id: guest.id, tableCode: group.id === "Sans table" ? null : group.id, seatOrder: index })),
    );

    setState((current) => applyGuestSeatingInState(current, assignments));
    toast.success("Plan de table mis à jour");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="hestia"
            eyebrow="Hestia · plan de table"
            title="Placer les invités, sans friction."
            description="La sous-page détaillée du plan de table : glisser-déposer, lecture par table et impacts directs sur le dîner."
            stats={[
              { label: "Tables", value: tables.length, detail: "actives" },
              { label: "Sans table", value: groups.find((g) => g.id === "Sans table")?.guests.length || 0, detail: "à placer" },
              { label: "Confirmés", value: tables.reduce((sum, item) => sum + item.guestCount, 0), detail: "présents" },
            ]}
            actions={[
              { to: "/invites?role=planner", label: "Module invités" },
              { to: "/univers/hestia", label: "Retour Hestia" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Vue service</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">Lecture par table</h2>
            <div className="mt-5 space-y-3">
              {tables.map((table) => (
                <div key={table.id} className="rounded-[22px] border border-black/8 bg-[var(--color-warm-white)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-950">{table.id}</div>
                    <div className="text-sm text-zinc-700">{table.guestCount} invités</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-zinc-700">
                    {table.allergies > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1">{table.allergies} allergies</span>}
                    {table.vegetarian > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1">{table.vegetarian} végé</span>}
                    {table.children > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1">{table.children} enfants</span>}
                    {table.pmr > 0 && <span className="rounded-full border border-black/8 bg-white px-2.5 py-1">{table.pmr} PMR</span>}
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <div className="aime-label text-zinc-500 mb-2">Drag & drop</div>
            <h2 className="text-[1.55rem] md:text-[1.8rem] font-display leading-[1.02] text-zinc-950">Placement détaillé</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => (
                  <Droppable key={group.id} droppableId={group.id}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`rounded-[24px] border p-4 min-h-[180px] ${snapshot.isDraggingOver ? "border-black bg-black/[0.03]" : "border-black/8 bg-[var(--color-warm-white)]"}`}>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div>
                            <div className="text-sm font-semibold text-zinc-950">{group.label}</div>
                            <div className="text-xs uppercase tracking-[0.16em] text-zinc-500 mt-2">{group.guests.length} place(s)</div>
                          </div>
                          <Move className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="space-y-3">
                          {group.guests.map((guest, index) => (
                            <Draggable key={guest.id} draggableId={guest.id} index={index}>
                              {(dragProvided, dragSnapshot) => (
                                <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} className={`rounded-[18px] border p-3 ${dragSnapshot.isDragging ? "border-black bg-black text-white" : "border-black/8 bg-white"}`}>
                                  <div className="text-sm font-semibold">{guest.firstName} {guest.lastName}</div>
                                  <div className={`mt-2 text-xs uppercase tracking-[0.16em] ${dragSnapshot.isDragging ? "text-white/60" : "text-zinc-500"}`}>{guest.household}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </Surface>
        </div>
      </div>
    </div>
  );
}
