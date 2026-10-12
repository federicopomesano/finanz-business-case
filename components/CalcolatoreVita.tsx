"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui";

export function CalcolatoreVita({
  onCalcola,
}: {
  onCalcola: (capitale: number, rataMensile: number) => void;
}) {
  const [capitale, setCapitale] = useState(100000);

  // Stima calcolata: circa 0.08€ al mese ogni 1.000€ di capitale
  const rataMensile = Math.round((capitale / 1000) * 0.08 * 10) / 10;

  const euro = (n: number) =>
    `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}€`;

  return (
    <div className="rounded-[24px] border-[1.5px] border-forest/30 bg-soft/50 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        <div>
          <h3 className="font-bold text-ink">Protezione Famiglia & Vita</h3>
          <p className="text-xs text-muted">
            Simula la tua copertura Ramo Vita
          </p>
        </div>
        <span className="ml-auto rounded-full bg-kiwi-400/30 px-2.5 py-1 text-[11px] font-bold text-forest">
          Payout Top
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Capitale Protetto:</span>
          <b className="text-base text-ink">{euro(capitale)}</b>
        </div>
        <input
          type="range"
          min={30000}
          max={300000}
          step={10000}
          value={capitale}
          onChange={(e) => setCapitale(Number(e.target.value))}
          className="w-full accent-forest"
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-3.5 border border-line">
        <div>
          <p className="text-xs text-muted">A partire da soli</p>
          <p className="text-2xl font-extrabold text-forest">
            {rataMensile.toFixed(2)}€{" "}
            <span className="text-xs font-normal text-muted">/ mese</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-muted">Massimale garantito</span>
          <p className="text-xs font-semibold text-ink">{euro(capitale)}</p>
        </div>
      </div>

      <PrimaryButton
        onClick={() => onCalcola(capitale, rataMensile)}
        className="mt-4 h-12 text-base"
      >
        Richiedi Preventivo Vita
      </PrimaryButton>
    </div>
  );
}
