import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, FlaskConical, Loader2, RotateCcw } from "lucide-react";
import { FEATURES, GROUPS } from "../utils/features";
import { SAMPLE_RECORD } from "../utils/sampleRecord";
import { predict } from "../services/api";
import ResultCard from "../components/ResultCard";

const EMPTY = Object.fromEntries(FEATURES.map((f) => [f.name, ""]));
const LAST_STEP = GROUPS.length - 1;

function validateField(feature, raw) {
  const text = String(raw).trim();
  if (text === "") return "Required";
  const n = Number(text);
  if (!Number.isFinite(n)) return "Enter a valid number";
  if (feature.zeroAllowed ? n < 0 : n <= 0) {
    return feature.zeroAllowed ? "Must be 0 or more" : "Must be greater than 0";
  }
  return "";
}

function collectErrors(list, values) {
  const out = {};
  for (const f of list) {
    const message = validateField(f, values[f.name]);
    if (message) out[f.name] = message;
  }
  return out;
}

export default function Predict() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const pendingFocus = useRef(null);

  const group = GROUPS[step];
  const fields = useMemo(() => FEATURES.filter((f) => f.group === group.id), [group.id]);

  // Move keyboard focus to a field after the screen has updated
  useEffect(() => {
    if (pendingFocus.current) {
      document.getElementById(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  });

  function goToField(name) {
    const feature = FEATURES.find((f) => f.name === name);
    if (!feature) return;
    setStep(GROUPS.findIndex((g) => g.id === feature.group));
    pendingFocus.current = name;
  }

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
    setSampleLoaded(false);
  }

  function handleNext() {
    const found = collectErrors(fields, values);
    setErrors((prev) => ({ ...prev, ...found }));
    const first = fields.find((f) => found[f.name]);
    if (first) {
      pendingFocus.current = first.name;
      return;
    }
    setStep((s) => Math.min(s + 1, LAST_STEP));
    window.scrollTo(0, 0);
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  }

  function handleReset() {
    setValues(EMPTY);
    setErrors({});
    setStep(0);
    setServerError("");
    setResult(null);
    setSampleLoaded(false);
    window.scrollTo(0, 0);
  }

  function handleLoadSample() {
    setValues(Object.fromEntries(FEATURES.map((f) => [f.name, String(SAMPLE_RECORD[f.name])])));
    setErrors({});
    setServerError("");
    setSampleLoaded(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;
    // Pressing Enter on steps 1 and 2 should act like "Next"
    if (step < LAST_STEP) {
      handleNext();
      return;
    }

    const all = collectErrors(FEATURES, values);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      goToField(FEATURES.find((f) => all[f.name]).name);
      return;
    }

    setStatus("loading");
    setServerError("");
    const payload = Object.fromEntries(
      FEATURES.map((f) => [f.name, Number(String(values[f.name]).trim())])
    );

    try {
      const data = await predict(payload);
      setResult(data);
      window.scrollTo(0, 0);
    } catch (err) {
      if (err.status === 422 && Array.isArray(err.details)) {
        const mapped = {};
        for (const d of err.details) {
          const name = d.loc?.[d.loc.length - 1];
          if (name) mapped[name] = d.msg;
        }
        setErrors(mapped);
        const first = FEATURES.find((f) => mapped[f.name]);
        if (first) goToField(first.name);
        setServerError("The server rejected some values. Please check the highlighted fields.");
      } else if (err.status) {
        setServerError("Something went wrong on the server. Please try again.");
      } else {
        setServerError(err.message);
      }
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 35% at 0% 0%, rgba(99,102,241,0.35), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-24 sm:px-10 sm:pt-28">
        {result ? (
          <ResultCard result={result} onBack={() => setResult(null)} onNew={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-3xl font-light leading-tight sm:text-5xl">
              Prediction <em className="font-bold">workspace</em>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Enter the 30 measurements in three short steps. This is an educational tool and does
              not provide a medical diagnosis.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleLoadSample}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition hover:bg-white/10"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                Load sample record
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset form
              </button>
            </div>

            {sampleLoaded && (
              <p role="status" className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/70">
                Sample loaded: record #0 from the public Wisconsin Diagnostic Breast Cancer dataset.
                For demonstration only. It is not a real person's data.
              </p>
            )}

            <div className="mt-8">
              <ol className="flex gap-2" aria-hidden="true">
                {GROUPS.map((g, i) => (
                  <li key={g.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-white/10"}`} />
                ))}
              </ol>
              <p className="mt-3 text-xs text-white/60">
                Step {step + 1} of {GROUPS.length}
              </p>
              <h2 className="mt-1 text-xl font-medium">{group.title}</h2>
              <p className="text-sm text-white/60">{group.description}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => {
                const error = errors[f.name];
                return (
                  <div key={f.name}>
                    <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">
                      {f.label}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={values[f.name]}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${f.name}-err ${f.name}-hint` : `${f.name}-hint`}
                      className={`h-12 w-full rounded-xl border bg-black/40 px-4 text-base text-white placeholder:text-white/30 ${
                        error ? "border-pink-400" : "border-white/15"
                      }`}
                    />
                    {error && (
                      <p id={`${f.name}-err`} className="mt-1.5 text-xs font-medium text-pink-400">
                        {error}
                      </p>
                    )}
                    <p id={`${f.name}-hint`} className="mt-1 text-xs leading-snug text-white/50">
                      {f.hint}
                    </p>
                  </div>
                );
              })}
            </div>

            {serverError && (
              <div role="alert" className="mt-6 flex gap-3 rounded-xl border border-pink-400/40 bg-pink-400/10 p-4 text-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" aria-hidden="true" />
                <p>{serverError}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium transition hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
              ) : (
                <span />
              )}

              {step < LAST_STEP ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium transition hover:brightness-110"
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium transition hover:brightness-110 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Analysing...
                    </>
                  ) : (
                    "Run analysis"
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}