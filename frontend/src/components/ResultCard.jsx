import { useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";

function formatScore(p) {
  const pct = p * 100;
  if (pct >= 99) return ">99%";
  if (pct <= 1) return "<1%";
  return `${Math.round(pct)}%`;
}

function ScoreRow({ label, value, barClass }) {
  const width = Math.min(100, Math.max(2, value * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="font-medium">{formatScore(value)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function ResultCard({ result, onBack, onNew }) {
  const headingRef = useRef(null);
  const isMalignant = result.prediction === "Malignant";

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby="result-heading" className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-white/50">Analysis result</p>
        <h2
          id="result-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 text-2xl font-light leading-snug sm:text-4xl"
        >
          More consistent with the{" "}
          <em className={`font-bold ${isMalignant ? "text-pink-400" : "text-teal-300"}`}>
            {isMalignant ? "malignant" : "benign"}
          </em>{" "}
          group
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          {isMalignant
            ? "Based on the 30 values you entered, the model places them closer to the malignant examples in its training data. This does not mean a person has cancer."
            : "Based on the 30 values you entered, the model places them closer to the benign examples in its training data. This does not rule out any condition."}{" "}
          Only a qualified healthcare professional can interpret real clinical findings.
        </p>

        <div className="mt-6 space-y-4">
          <ScoreRow label="Benign model score" value={result.probabilities.benign} barClass="bg-benign" />
          <ScoreRow label="Malignant model score" value={result.probabilities.malignant} barClass="bg-malignant" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-white/50">{result.probability_note}</p>

        <p className="mt-4 text-xs text-white/50">
          Model: {result.model_name} v{result.model_version}
        </p>
      </div>

      <div role="note" className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <p>
          <strong className="font-medium">Not a medical diagnosis.</strong> {result.disclaimer} If you
          have a health concern, please talk to a doctor.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to form
        </button>
        <button
          type="button"
          onClick={onNew}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium transition hover:brightness-110"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          New analysis
        </button>
      </div>
    </section>
  );
}