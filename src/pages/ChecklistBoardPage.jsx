import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "sonner";
import WeddingModuleHeader from "@/components/aime/WeddingModuleHeader";
import { filterDocumentsByRole, readWeddingState, writeWeddingState } from "@/lib/aimeWeddingCore";

function Surface({ children, className = "" }) {
  return <section className={`rounded-[30px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(12,12,12,0.06)] ${className}`}>{children}</section>;
}

function Column({ title, items, onDone = null }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-[var(--color-warm-white)] p-4">
      <div className="text-sm font-semibold text-zinc-950">{title}</div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-[18px] border border-black/8 bg-white p-4">
            <div className="text-sm font-semibold text-zinc-950">{item.title}</div>
            <div className="mt-2 text-sm text-zinc-600">{item.detail}</div>
            {onDone && item.kind === "reminder" && (
              <button onClick={() => onDone(item.id)} className="mt-4 rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 inline-flex items-center gap-2"><Check className="h-4 w-4" />Marquer fait</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChecklistBoardPage() {
  const [state, setState] = useState(() => readWeddingState());

  useEffect(() => {
    writeWeddingState(state);
  }, [state]);

  const docs = useMemo(() => filterDocumentsByRole(state.documents, "planner"), [state.documents]);
  const reminders = state.reminders || [];
  const todo = [
    ...reminders.filter((item) => item.status !== "done").map((item) => ({ id: item.id, title: item.title, detail: item.context || item.owner, kind: "reminder" })),
    ...docs.filter((doc) => ["brouillon", "à verrouiller", "à mettre à jour"].includes(doc.status)).map((doc) => ({ id: doc.id, title: doc.title, detail: doc.status, kind: "doc" })),
  ];
  const progress = docs.filter((doc) => ["à relire", "en cours"].includes(doc.status)).map((doc) => ({ id: doc.id, title: doc.title, detail: doc.status, kind: "doc" }));
  const done = [
    ...reminders.filter((item) => item.status === "done").map((item) => ({ id: item.id, title: item.title, detail: item.context || item.owner, kind: "reminder" })),
    ...docs.filter((doc) => ["prêt", "partagé", "complet"].includes(doc.status)).map((doc) => ({ id: doc.id, title: doc.title, detail: doc.status, kind: "doc" })),
  ];

  const markDone = (id) => {
    setState((current) => ({
      ...current,
      reminders: current.reminders.map((item) => item.id === id ? { ...item, status: "done" } : item),
    }));
    toast.success("Tâche marquée comme faite");
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] text-[var(--color-text-primary)] overflow-x-hidden">
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-24 md:px-8 md:pb-16 lg:px-10">
        <div className="mb-8 md:mb-10">
          <WeddingModuleHeader
            universeId="athena"
            eyebrow="Athéna · checklist détaillée"
            title="Les tâches du mariage, en lecture Kanban."
            description="La vue détaillée d’Athéna pour transformer alertes, rappels et documents en tâches lisibles et actionnables."
            stats={[
              { label: "À faire", value: todo.length, detail: "ouverts" },
              { label: "En cours", value: progress.length, detail: "docs actifs" },
              { label: "Fait", value: done.length, detail: "clos" },
            ]}
            actions={[
              { to: "/notifications?role=planner", label: "Alertes" },
              { to: "/documents?role=planner", label: "Documents" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Column title="À faire" items={todo} onDone={markDone} />
          <Column title="En cours" items={progress} />
          <Column title="Fait" items={done} />
        </div>

        <div className="mt-6 text-sm text-zinc-500">
          <Link to="/point-zero" className="hover:text-zinc-950">Retour cockpit</Link>
        </div>
      </div>
    </div>
  );
}
