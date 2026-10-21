import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ParticleSphere from "./ParticleSphere";

// Copied from backend/app/model/model_metadata.json (test set, 114 samples).
const STATS = [
  { value: "97.4%", label: "Test accuracy" },
  { value: "0.996", label: "ROC-AUC" },
  { value: "95.2%", label: "Malignant recall (42 cases)" },
];

export default function Hero() {
  return (
    <section className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(99,102,241,0.55), transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[22%] select-none whitespace-nowrap text-center text-[18vw] font-bold leading-none text-white/[0.035]"
      >
        BREASTCARE
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <ParticleSphere className="aspect-square w-[min(88vw,620px)] -translate-y-8 opacity-80 sm:translate-y-0" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col justify-between px-5 pb-8 pt-24 sm:px-10 sm:pb-10 sm:pt-28">
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-balance text-center text-[clamp(1.9rem,8.5vw,4.5rem)] font-light leading-[1.1] tracking-tight">
            Classify measurements.
            <br />
            <em className="font-bold">Understand</em> the <em className="font-bold">model</em>.
          </h1>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-white/65">
              An educational machine learning tool that analyses 30 numerical features from a
              breast mass examination. Not a medical diagnosis.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/predict"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium transition hover:brightness-110"
              >
                Start Analysis
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white/85 transition hover:bg-white/10"
              >
                Explore the Technology
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <dd className="text-xl font-light sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-[11px] leading-tight text-white/55 sm:max-w-[7rem]">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}