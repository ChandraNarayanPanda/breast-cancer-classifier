import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Hero from "../components/Hero";
import insights from "../data/model_insights.json";

const STEPS = [
  { n: "01", title: "Data", text: "569 samples and 30 numeric features from the public Wisconsin Diagnostic Breast Cancer dataset." },
  { n: "02", title: "Preprocessing", text: "Checked for missing values and duplicates. Scaling is fitted on training data only, inside a pipeline." },
  { n: "03", title: "Training", text: "Six algorithms compared with 5-fold stratified cross-validation, with no use of the test set." },
  { n: "04", title: "Evaluation", text: "Accuracy, precision, recall, F1, ROC-AUC and confusion matrices, with malignant as the positive class." },
  { n: "05", title: "API", text: "A FastAPI service validates all 30 inputs and rejects missing, negative or non-finite values." },
  { n: "06", title: "Prediction", text: "The saved pipeline returns a class and model scores, always with a clear disclaimer." },
];

function PipelineCard({ step }) {
  return (
    <li className="relative min-h-56 w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-5 sm:w-auto">
      <div className="flex items-start justify-between">
        <span className="text-xl font-light">{step.n}</span>
        <ArrowUpRight className="h-4 w-4 text-white/60" aria-hidden="true" />
      </div>
      <h3 className="mt-10 text-lg font-medium">{step.title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-white/60">{step.text}</p>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #8b84ff 1px, transparent 1.5px)",
          backgroundSize: "8px 8px",
        }}
      />
    </li>
  );
}

export default function Home() {
  const { dataset, models, final_model: finalName } = insights;
  const final = models.find((m) => m.name === finalName);
  const fn = final.confusion_matrix[0][1];

  const facts = [
    {
      title: "Dataset",
      text: `${dataset.n_total} samples, 30 features computed from images of fine needle aspirates. ${dataset.n_train} samples for training and ${dataset.n_test} held back for testing.`,
    },
    {
      title: "Final model",
      text: `${finalName}, chosen with cross-validation on the training set before the test set was opened. On ${dataset.test_malignant} malignant test cases it missed ${fn}.`,
    },
    {
      title: "Limits",
      text: "Small, single-source and old data. The inputs are lab-derived image measurements. High scores here do not mean clinical reliability.",
    },
  ];

  return (
    <>
      <Hero />

      <section aria-labelledby="pipeline-heading" className="px-5 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 id="pipeline-heading" className="text-3xl font-light sm:text-5xl">
            How it <em className="font-bold">works</em>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            The same six stages you would find in a real machine learning project, from raw data to
            a prediction.
          </p>
          <ol className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {STEPS.map((s) => (
              <PipelineCard key={s.n} step={s} />
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="transparency-heading" className="px-5 pb-16 sm:px-10 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 id="transparency-heading" className="text-3xl font-light sm:text-5xl">
            Model <em className="font-bold">transparency</em>
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {facts.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.text}</p>
              </div>
            ))}
          </div>
          <Link
            to="/insights"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium transition hover:bg-white/10"
          >
            See all results
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-10 sm:pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-transparent p-7 sm:p-12">
          <h2 className="text-3xl font-light leading-tight sm:text-5xl">
            Try it with a <em className="font-bold">sample record</em>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Load a record from the public dataset and see what the model returns. Educational use
            only. This tool does not diagnose anything.
          </p>
          <Link
            to="/predict"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-medium transition hover:brightness-110"
          >
            Start Analysis
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}