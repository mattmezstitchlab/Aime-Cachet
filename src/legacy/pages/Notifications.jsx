import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, AlertTriangle, Info, ShieldAlert, ShieldCheck, FileText, MapPin, Euro, Send, Calendar, Cake,
  CheckCheck, Sparkles, Clock, X, Check
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageShell from "@/components/aime/PageShell";
import { formatRelativeFR, computeSimulator } from "@/lib/aimeData";

// Niveaux : badges en gris neutre (sauf urgent). Icônes toujours grises sur la carte.
const LEVEL_META = {
  urgent:    { label: "Urgent",    badge: "bg-red-50 text-red-700 border-red-200",       icon: "bg-zinc-100 text-zinc-500", Icon: AlertTriangle },
  attention: { label: "Attention", badge: "bg-zinc-100 text-zinc-600 border-zinc-200",   icon: "bg-zinc-100 text-zinc-500", Icon: ShieldAlert },
  info:      { label: "Info",      badge: "bg-zinc-100 text-zinc-600 border-zinc-200",   icon: "bg-zinc-100 text-zinc-500", Icon: Info },
};

const READ_KEY = "aime_notifications_read_v1";

function getRead() {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveRead(set) {
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
}

function buildNotifications(prestations, events, simulator) {
  const list = [];

  // Fiches à resceller (heuristique simple : modifiée après scellement)
  for (const p of prestations) {
    if (p.verification_hash && p.verification_hash_at && p.updated_date) {
      const sealedAt = new Date(p.verification_hash_at);
      const updatedAt = new Date(p.updated_date);
      if (updatedAt > sealedAt) {
        list.push({
          id: `reseal-${p.id}`,
          level: "attention",
          Icon: ShieldAlert,
          title: "Fiche à resceller",
          desc: `${p.employer || "Fiche sans employeur"} a été modifiée depuis son scellement.`,
          date: p.updated_date,
          to: `/fiche/${p.id}`,
        });
      }
    }
  }

  // Fiches sans employeur
  for (const p of prestations) {
    if (!p.employer || !p.employer.trim()) {
      list.push({
        id: `noemp-${p.id}`,
        level: "attention",
        Icon: FileText,
        title: "Fiche sans employeur",
        desc: `Prestation du ${p.date || "—"} à compléter.`,
        date: p.updated_date || p.created_date,
        to: `/fiche/${p.id}`,
      });
    }
  }

  // Fiches sans lieu
  for (const p of prestations) {
    if (!p.location || !p.location.trim()) {
      list.push({
        id: `noloc-${p.id}`,
        level: "info",
        Icon: MapPin,
        title: "Fiche sans lieu",
        desc: `${p.employer || "Fiche"} — lieu manquant.`,
        date: p.updated_date || p.created_date,
        to: `/fiche/${p.id}`,
      });
    }
  }

  // Fiches sans montant
  for (const p of prestations) {
    if (!p.amount) {
      list.push({
        id: `noamt-${p.id}`,
        level: "info",
        Icon: Euro,
        title: "Fiche sans montant",
        desc: `${p.employer || "Fiche"} — montant non renseigné.`,
        date: p.updated_date || p.created_date,
        to: `/fiche/${p.id}`,
      });
    }
  }

  // Documents manquants
  for (const p of prestations) {
    if ((p.missing_documents || 0) > 0) {
      list.push({
        id: `docs-${p.id}`,
        level: "attention",
        Icon: FileText,
        title: `${p.missing_documents} document${p.missing_documents > 1 ? "s" : ""} manquant${p.missing_documents > 1 ? "s" : ""}`,
        desc: `${p.employer || "Fiche"} — préparation incomplète.`,
        date: p.updated_date || p.created_date,
        to: `/fiche/${p.id}`,
      });
    }
  }

  // Fiches prêtes à vérifier
  for (const p of prestations.filter((x) => x.status === "pret_a_verifier")) {
    list.push({
      id: `verif-${p.id}`,
      level: "info",
      Icon: ShieldCheck,
      title: "Fiche prête à vérifier",
      desc: `${p.employer || "Fiche"} attend une vérification.`,
      date: p.updated_date || p.created_date,
      to: `/fiche/${p.id}`,
    });
  }

  // Fiches transmises
  for (const p of prestations.filter((x) => x.status === "transmis")) {
    list.push({
      id: `trans-${p.id}`,
      level: "info",
      Icon: Send,
      title: "Fiche transmise",
      desc: `${p.employer || "Fiche"} marquée comme transmise.`,
      date: p.updated_date || p.created_date,
      to: `/fiche/${p.id}`,
    });
  }

  // Approche objectif 507h
  if (simulator && simulator.percent >= 80 && simulator.percent < 100) {
    list.push({
      id: "507-approach",
      level: "info",
      Icon: Calendar,
      title: `Approche objectif 507h (${simulator.percent}%)`,
      desc: `${simulator.total} h cumulées sur 12 mois — ${simulator.objective - simulator.total} h restantes à confirmer.`,
      date: new Date().toISOString(),
      to: `/507`,
    });
  }

  // Période anniversaire (12 mois glissants — info statique)
  if (simulator && simulator.percent >= 95) {
    list.push({
      id: "507-anniv",
      level: "urgent",
      Icon: Cake,
      title: "Période de référence à surveiller",
      desc: `Vous approchez de l'objectif 507h. Consultez votre cockpit pour faire le point.`,
      date: new Date().toISOString(),
      to: `/507`,
    });
  }

  // Événements récents (PDF, partage, scellement)
  for (const e of events.slice(0, 20)) {
    const map = {
      dossier_exported: { title: "PDF généré", Icon: FileText, level: "info" },
      document_generated: { title: "Document généré", Icon: FileText, level: "info" },
      message_generated: { title: "Action de partage préparée", Icon: Send, level: "info" },
      memo_generated: { title: "Lien copié", Icon: Send, level: "info" },
    };
    const meta = map[e.kind];
    if (!meta) continue;
    list.push({
      id: `ev-${e.id}`,
      level: meta.level,
      Icon: meta.Icon,
      title: meta.title,
      desc: e.text,
      date: e.created_date,
      to: e.prestation_id ? `/fiche/${e.prestation_id}` : "/",
    });
  }

  // Tri date desc
  list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return list;
}

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [readSet, setReadSet] = useState(getRead());
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [pres, evts, rems] = await Promise.all([
      base44.entities.Prestation.list("-updated_date", 500),
      base44.entities.HistoryEvent.list("-created_date", 100),
      base44.entities.AssistantReminder.filter({ status: "pending" }, "-created_date", 50),
    ]);
    setItems(pres);
    setEvents(evts);
    setReminders(rems || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateReminder = async (id, patch) => {
    await base44.entities.AssistantReminder.update(id, patch);
    fetchAll();
  };

  const snoozeReminder = (id) => {
    const due = new Date();
    due.setDate(due.getDate() + 1);
    updateReminder(id, { status: "snoozed", due_at: due.toISOString() });
  };

  const simulator = useMemo(() => computeSimulator(items), [items]);
  const notifications = useMemo(() => buildNotifications(items, events, simulator), [items, events, simulator]);

  const markAllRead = () => {
    const next = new Set(notifications.map((n) => n.id));
    setReadSet(next);
    saveRead(next);
  };

  const markRead = (id) => {
    const next = new Set(readSet);
    next.add(id);
    setReadSet(next);
    saveRead(next);
  };

  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length;

  return (
    <PageShell
      eyebrow="Notifications"
      title="Centre de notifications"
      subtitle="Toutes vos alertes préparatoires AIME Cachet — locales et applicatives uniquement. Aucun email ni push envoyé."
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-zinc-500">
          {unreadCount} non lue{unreadCount > 1 ? "s" : ""} · {notifications.length} au total
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 text-zinc-600 rounded-full transition-colors"
          >
            <CheckCheck className="w-3 h-3" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-12 text-sm text-zinc-400">Chargement…</div>
      )}

      {!loading && reminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-aime-red" />
            <h2 className="text-[11px] tracking-[0.25em] text-zinc-500 font-semibold uppercase">Rappels assistant</h2>
            <span className="text-[10px] text-zinc-400">· {reminders.length}</span>
          </div>
          <div className="space-y-2">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="bg-gradient-to-br from-aime-red/5 to-white border border-aime-red/20 rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-aime-red/10 text-aime-red flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-zinc-900">{r.label}</h3>
                  {r.reason && (
                    <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{r.reason}</p>
                  )}
                  <div className="text-[10px] text-zinc-400 mt-1">
                    {r.due_at ? `Prévu · ${formatRelativeFR(r.due_at)}` : formatRelativeFR(r.created_date)}
                    {r.cachet_code && <span className="ml-2">· {r.cachet_code}</span>}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => snoozeReminder(r.id)}
                    title="Reporter à demain"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateReminder(r.id, { status: "dismissed" })}
                    title="Ignorer"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {r.target ? (
                    <Link
                      to={r.target}
                      onClick={() => updateReminder(r.id, { status: "done" })}
                      className="text-xs px-3 py-1.5 bg-aime-red hover:bg-aime-red/90 text-white rounded-full transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Traiter
                    </Link>
                  ) : (
                    <button
                      onClick={() => updateReminder(r.id, { status: "done" })}
                      className="text-xs px-3 py-1.5 bg-aime-red hover:bg-aime-red/90 text-white rounded-full transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Fait
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-12 text-center">
          <Bell className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-700 font-medium">Aucune notification pour le moment</p>
          <p className="text-xs text-zinc-500 mt-2">Tout est en ordre dans votre espace préparatoire.</p>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => {
          const meta = LEVEL_META[n.level] || LEVEL_META.info;
          const isRead = readSet.has(n.id);
          return (
            <div
              key={n.id}
              className={`bg-white border rounded-xl px-4 py-3 flex items-start gap-3 transition-all ${
                isRead ? "border-zinc-100 opacity-60" : "border-zinc-200"
              }`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${meta.icon}`}>
                <n.Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-medium text-zinc-900">{n.title}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{n.desc}</p>
                <div className="text-[10px] text-zinc-400 mt-1">{formatRelativeFR(n.date)}</div>
              </div>
              <Link
                to={n.to}
                onClick={() => markRead(n.id)}
                className="shrink-0 text-xs px-3 py-1.5 bg-zinc-900 hover:bg-aime-red text-white rounded-full transition-colors"
              >
                Ouvrir
              </Link>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}