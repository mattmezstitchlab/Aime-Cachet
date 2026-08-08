import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const go = () => {
    toast.success("Lien magique envoyé", {
      description: email ? `Connexion préparée pour ${email}.` : "Prototype local : le back auth viendra ensuite.",
    });
    navigate("/espace-maries");
  };

  return (
    <div className="min-h-screen bg-[#efefeb] overflow-hidden text-[var(--color-text-primary)]">
      <div className="min-h-screen p-2 md:p-6">
        <div className="mx-auto h-[calc(100vh-16px)] md:h-[calc(100vh-48px)] max-w-[1600px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] grid lg:grid-cols-[1fr_0.98fr]">
          <div className="relative hidden lg:block">
            <img src="/landing/hero-aime-wedding.jpg" alt="AIME Wedding" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.32))]" />
            <div className="absolute left-10 bottom-10 max-w-[520px] text-white">
              <div className="font-display text-[3.3rem] leading-[1.04] italic">"La promesse d'une organisation poétique et sereine."</div>
              <div className="mt-6 text-sm uppercase tracking-[0.18em] text-white/78">AIME Wedding Atelier</div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-16 overflow-y-auto">
            <div className="w-full max-w-[460px]">
              <div className="flex items-center justify-center gap-3 mb-14">
                <Link to="/" className="font-display text-[2rem] leading-none text-zinc-950">AIME</Link>
                <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Wedding</span>
              </div>

              <h1 className="font-display text-[2.8rem] md:text-[3.35rem] leading-[0.96] text-zinc-950">Entrer dans le mariage</h1>
              <p className="mt-4 text-[15px] text-zinc-500">Connectez-vous à votre espace AIME Wedding</p>

              <div className="mt-12">
                <label className="block text-[11px] uppercase tracking-[0.16em] text-zinc-600">Adresse email</label>
                <div className="mt-3 rounded-[16px] border border-black/8 bg-[#f8f1e8] px-5 py-4 flex items-center gap-3">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400" />
                </div>
              </div>

              <button onClick={go} className="mt-7 w-full rounded-full bg-black px-6 py-4 text-[15px] text-white hover:bg-zinc-800 inline-flex items-center justify-center gap-2">
                Recevoir un lien magique
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-8 flex items-center gap-4 text-sm text-zinc-400">
                <div className="h-px flex-1 bg-black/8" />
                <span>ou</span>
                <div className="h-px flex-1 bg-black/8" />
              </div>

              <button onClick={() => navigate("/espace-planner")} className="mt-8 w-full rounded-full border border-black/16 bg-white px-6 py-4 text-[15px] text-zinc-950 hover:bg-black/[0.02] inline-flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4" />
                Continuer avec Google
              </button>

              <div className="mt-10 text-center text-[15px] text-zinc-700">
                <span className="text-zinc-500">Pas encore de compte ? </span>
                <Link to="/onboarding" className="underline underline-offset-4 hover:text-zinc-950 inline-flex items-center gap-1">
                  Créer mon mariage
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
