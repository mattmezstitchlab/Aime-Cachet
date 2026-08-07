import React from "react";
import {
  Folder, Files, CalendarDays, Hourglass, Send, CheckCircle2,
  Drama, Clapperboard, Inbox, Music2, Mic2, Palette, Tent, Ticket,
  Briefcase, Landmark, MapPin, Star, Flame, Gem, Sparkles,
} from "lucide-react";

const ICONS = {
  Folder, Files, CalendarDays, Hourglass, Send, CheckCircle2,
  Drama, Clapperboard, Inbox, Music2, Mic2, Palette, Tent, Ticket,
  Briefcase, Landmark, MapPin, Star, Flame, Gem, Sparkles,
};

export default function WalletIcon({ name, className = "w-4 h-4" }) {
  const Cmp = ICONS[name] || Folder;
  return <Cmp className={className} strokeWidth={1.8} />;
}