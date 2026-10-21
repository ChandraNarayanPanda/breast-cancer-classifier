import { Cpu, Database, ExternalLink, Info, Monitor, Server, ShieldAlert, Target } from "lucide-react";
 
// EDIT 1: your name and course line
const DEVELOPER_NAME = "Your Name";
const DEVELOPER_ROLE = "B.Tech Computer Science student, AI/ML specialization";

// EDIT 2: your GitHub repository (create it later; leave empty until then)
const GITHUB_URL = "https://github.com/ChandraNarayanPanda/breast-cancer-classifier";
 
const FACTS = [
  ["569", "patient samples"],
  ["30", "numeric measurements"],
  ["6", "models compared"],
];
 
const STACK = [
  { icon: Cpu, name: "Machine learning", items: "Python, scikit-learn, pandas, NumPy, Jupyter, joblib" },
  { icon: Server, name: "Backend", items: "FastAPI, Pydantic, Uvicorn, pytest" },
  { icon: Monitor, name: "Frontend", items: "React, Vite, Tailwind CSS, React Router, Recharts" },
];
 
const WORKFLOW = [
  ["Inspect the data", "Load the dataset and check for missing, duplicate and invalid values."],
  ["Explore", "Look at distributions, box plots and a correlation heatmap."],
  ["Split first", "Stratified train and test sets with a fixed random seed, before any fitting."],
  ["Compare and tune", "Six models compared with cross-validation. The strongest are tuned on the training set only."],
  ["Test once", "Shortlisted models are scored once on the test set. The full pipeline is saved with joblib."],
  ["Serve and present", "FastAPI validates every input and this React app shows the result."],
];
 
const LIMITS = [
  "569 samples from a single source. It may not generalize to other populations.",
  "Inputs are lab-derived image measurements that a person cannot measure at home.",
  "On 42 malignant test cases, one missed case changes recall by about 2.4 points.",
  "Model scores are not the probability that a person has cancer.",
];
 
function Panel({ icon: Icon, title, children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <h2 className="text-lg font-medium sm:text-xl">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[15px]">{children}</div>
    </section>
  );
}
 
export default function About() {
  const initials = DEVELOPER_NAME.split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
 
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 0% 0%, rgba(99,102,241,0.35), transparent 70%), radial-gradient(ellipse 50% 25% at 100% 18%, rgba(236,72,153,0.14), transparent 70%)",
        }}
      />
 
      <div className="relative mx-auto max-w-4xl space-y-5 px-5 pb-20 pt-24 sm:px-10 sm:pt-32">
        {/* Header */}
        <header className="pb-4">
          <h1 className="max-w-2xl text-4xl font-light leading-[1.1] sm:text-6xl">
            A machine learning project, built end to end
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
            BreastCare AI takes a public dataset all the way to a deployed web app. It is an
            educational and portfolio project, and this page explains how it was made and where it
            falls short.
          </p>
 
          <dl className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
            {FACTS.map(([n, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <dt className="text-2xl font-semibold text-white sm:text-3xl">{n}</dt>
                <dd className="mt-0.5 text-xs leading-snug text-white/55">{label}</dd>
              </div>
            ))}
          </dl>
        </header>
 
        {/* Objective + Dataset */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Panel icon={Target} title="Objective">
            <p>
              Classify a breast mass as more consistent with a benign or malignant group, using 30
              numeric measurements, and explain honestly how well the model does it.
            </p>
          </Panel>
          <Panel icon={Database} title="Dataset">
            <p>
              Wisconsin Diagnostic Breast Cancer (WDBC), from the UCI Machine Learning Repository
              (Wolberg, Mangasarian, Street and Street, 1995), loaded through scikit-learn. License:
              CC BY 4.0.
            </p>
          </Panel>
        </div>
 
        {/* Workflow timeline: the standout element */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-500/[0.08] to-transparent p-6 sm:p-10">
          <h2 className="text-xl font-medium sm:text-2xl">How the model was built</h2>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Six steps, in this order. The test set stays untouched until step 5.
          </p>
 
          <ol className="mt-8">
            {WORKFLOW.map(([title, text], i) => (
              <li key={title} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
                {i < WORKFLOW.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-indigo-400/60 to-indigo-400/10"
                  />
                )}
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-indigo-400/50 bg-[#12122a] text-sm font-semibold text-indigo-200">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-medium text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
 
        {/* Stack */}
        <Panel title="Technology stack">
          <div className="grid gap-4 sm:grid-cols-3">
            {STACK.map(({ icon: Icon, name, items }) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-white">
                  <Icon className="h-4 w-4 text-indigo-300" aria-hidden="true" />
                  <h3 className="text-sm font-medium">{name}</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {items.split(", ").map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-white/75"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
 
        {/* Limitations */}
        <section className="rounded-3xl border border-amber-300/25 bg-amber-300/[0.06] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
              <Info className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-medium sm:text-xl">Known limitations</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            {LIMITS.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>
 
        {/* Developer */}
        <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:p-8">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 text-xl font-semibold text-white"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-medium text-white sm:text-xl">{DEVELOPER_NAME}</h2>
            <p className="mt-1 text-sm leading-relaxed text-white/65">{DEVELOPER_ROLE}</p>
          </div>
          {GITHUB_URL && (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View on GitHub
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </section>
 
        {/* Disclaimer */}
        <div
          role="note"
          className="flex gap-3 rounded-2xl border border-pink-400/30 bg-pink-400/10 p-5 text-sm leading-relaxed text-white/85"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-pink-300" aria-hidden="true" />
          <p>
            <strong className="font-medium">Disclaimer.</strong> This project is not a clinically
            validated tool and cannot diagnose breast cancer or replace a healthcare professional.
            If you have a health concern, please talk to a doctor.
          </p>
        </div>
      </div>
    </div>
  );
}
 
