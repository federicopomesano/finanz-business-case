"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUtente } from "@/components/Providers";
import { NOME_RAMO } from "@/lib/utenti";
import { BottomBar, PrimaryButton, SecondaryButton, Icona } from "@/components/ui";
import { CalcolatoreVita } from "@/components/CalcolatoreVita";

// Mappatura stime risparmio medio / valore per la Value Preview
const STIMA_RISPARMIO: Record<string, { risparmio: string; nota: string }> = {
  rc_auto: { risparmio: "fino a 140€/anno", nota: "Sulla tua polizza RC Auto" },
  casa: { risparmio: "fino a 95€/anno", nota: "Protezione incendio e caparra" },
  salute: { risparmio: "fino a 180€/anno", nota: "Rimborso visite e degenze" },
  vita: { risparmio: "da 7,50€/mese", nota: "Capitale garantito fino a 200.000€" },
  dentale: { risparmio: "fino a 110€/anno", nota: "Pulizia e cure coperte" },
};

export default function PartnerPage() {
  const router = useRouter();
  const { utente, track, toast } = useUtente();
  const [mostraCalcolatore, setMostraCalcolatore] = useState(utente.ramo === "vita");

  // Track automatico dell'evento "Partner Screen Viewed" al mount
  useEffect(() => {
    track("Partner Screen Viewed", {
      ramo: utente.ramo,
      onboarding_intent: utente.onboarding_intent,
    });
  }, [track, utente]);

  // Gestione della CTA con Value Preview integrata
  const gestisciCtaPartner = (origine = "main_cta", extra = {}) => {
    track("Partner CTA Clicked", {
      ramo: utente.ramo,
      origine,
      ...extra,
    });
    toast("Reindirizzamento al comparatore partner...");
  };

  const infoRisparmio = STIMA_RISPARMIO[utente.ramo] ?? {
    risparmio: "fino a 120€/anno",
    nota: "Preventivo su misura",
  };

  return (
    <div className="flex flex-col min-h-full bg-white px-4 pt-6 pb-24">
      {/* Header Risultato */}
      <div className="text-center">
        <span className="text-5xl">🎉</span>
        <h1 className="mt-3 text-2xl font-bold text-ink">
          Percorso Completato, {utente.nome}!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Hai dimostrato un'ottima conoscenza delle polizze sul ramo{" "}
          <span className="font-semibold text-ink">{NOME_RAMO[utente.ramo]}</span>.
        </p>
      </div>

      {/* VALUE PREVIEW (Risolve il bottone al 20% di conversione) */}
      <div className="mt-6 rounded-[24px] bg-gradient-to-br from-kiwi-400/20 to-soft p-5 border border-forest/20">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-forest p-1 text-white">
            <Icona nome="check" size={16} />
          </span>
          <span className="text-xs font-bold text-forest uppercase tracking-wider">
            Value Preview Riservata
          </span>
        </div>

        <div className="mt-3">
          <p className="text-xs text-muted">Risparmio stimato personalizzato:</p>
          <p className="text-3xl font-extrabold text-forest">
            {infoRisparmio.risparmio}
          </p>
          <p className="text-xs text-ink/70 mt-0.5">{infoRisparmio.nota}</p>
        </div>

        <ul className="mt-4 flex flex-col gap-2 text-xs text-ink/80 border-t border-forest/10 pt-3">
          <li className="flex items-center gap-2">
            <span className="text-forest">✓</span> Confronto istantaneo tra 5+ compagnie
          </li>
          <li className="flex items-center gap-2">
            <span className="text-forest">✓</span> Nessun costo nascosto o vincolo
          </li>
        </ul>
      </div>

      {/* SEZIONE SPECIALE RAMO VITA (Payout 80€) */}
      <div className="mt-6">
        {utente.ramo !== "vita" && (
          <button
            onClick={() => setMostraCalcolatore(!mostraCalcolatore)}
            className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-soft text-sm font-semibold text-ink"
          >
            <span>💡 Vuoi proteggere la tua famiglia? (Ramo Vita)</span>
            <span>{mostraCalcolatore ? "▲" : "▼"}</span>
          </button>
        )}

        {(mostraCalcolatore || utente.ramo === "vita") && (
          <div className="mt-2">
            <CalcolatoreVita
              onCalcola={(capitale, rata) => {
                gestisciCtaPartner("calcolatore_vita", { capitale, rata });
              }}
            />
          </div>
        )}
      </div>

      {/* BOTTOM BAR CON CTA PRINCIPALE */}
      <BottomBar>
        <PrimaryButton onClick={() => gestisciCtaPartner("main_cta")}>
          Confronta e Risparmia Ora →
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push("/percorso")}>
          Torna al Percorso
        </SecondaryButton>
      </BottomBar>
    </div>
  );
}
