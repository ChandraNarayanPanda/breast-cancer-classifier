import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import insights from "../data/model_insights.json";

const COLORS = {
  "Logistic Regression": "#6d63f0",
  "SVM (RBF)": "#14b8a6",
  "Random Forest": "#f59e0b",
};
const SHORT = { "Logistic Regression": "LogReg", "SVM (RBF)": "SVM", "Random Forest": "RF" };
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const prettify = (s) => s.replace(/^(mean|worst)\s/, "$1 ").replace(/_/g, " ");

function Card({ title, children, note }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
      {note && <p className="mt-3 text-xs leading-relaxed text-white/50">{note}</p>}
    </section>
  );
}

function ConfusionMatrix({ matrix }) {
  const [[tm, fb], [fm, tb]] = matrix; // rows: actual malignant, benign; cols: predicted malignant, benign
  const cell = "grid place-items-center rounded-xl p-3 text-center";
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-stretch gap-2 text-xs">
      <span />
      <span className="text-center text-white/60">Predicted malignant</span>
      <span className="text-center text-white/60">Predicted benign</span>

      <span className="self-center text-white/60 [writing-mode:vertical-rl] rotate-180">Actual malignant</span>
      <div className={`${cell} bg-teal-400/15`}>
        <p className="text-2xl font-light">{tm}</p>
        <p className="text-white/60">found</p>
      </div>
      <div className={`${cell} bg-pink-500/20`}>
        <p className="text-2xl font-light">{fb}</p>
        <p className="text-white/60">missed (false negative)</p>
      </div>

      <span className="self-center text-white/60 [writing-mode:vertical-rl] rotate-180">Actual benign</span>
      <div className={`${cell} bg-white/[0.06]`}>
        <p className="text-2xl font-light">{fm}</p>
        <p className="text-white/60">flagged (false positive)</p>
      </div>
      <div className={`${cell} bg-teal-400/15`}>
        <p className="text-2xl font-light">{tb}</p>
        <p className="text-white/60">correct</p>
      </div>
    </div>
  );
}

export default function Insights() {
  const { models, dataset, top_features: topFeatures, procedure, final_model: finalName } = insights;
  const final = models.find((m) => m.name === finalName);
  const metrics = [
    ["Accuracy", final.test.accuracy],
    ["Precision", final.test.precision],
    ["Recall", final.test.recall],
    ["F1-score", final.test.f1],
    ["ROC-AUC", final.test.roc_auc],
  ];

  const compareData = models.map((m) => ({
    name: SHORT[m.name] ?? m.name,
    Accuracy: m.test.accuracy,
    Recall: m.test.recall,
    "ROC-AUC": m.test.roc_auc,
  }));

  const featureData = topFeatures.map((f) => ({ name: prettify(f.feature), value: f.toward_malignant }));

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 35% at 0% 0%, rgba(99,102,241,0.35), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl space-y-5 px-5 pb-16 pt-24 sm:px-10 sm:pt-28">
        <header>
          <h1 className="text-3xl font-light leading-tight sm:text-5xl">
            Model <em className="font-bold">insights</em>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            Real results exported from the training notebook. Final model in the API:{" "}
            <strong className="font-medium text-white">{finalName}</strong>.
          </p>
        </header>

        <Card
          title={`${finalName}: test-set results`}
          note={`Test set: ${dataset.n_test} samples (${dataset.test_malignant} malignant, ${dataset.test_benign} benign). Precision, recall and F1 treat malignant as the positive class.`}
        >
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/[0.05] p-3">
                <dd className="text-2xl font-light">{pct(value)}</dd>
                <dt className="mt-1 text-xs text-white/60">{label}</dt>
              </div>
            ))}
          </dl>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            title="Confusion matrix"
            note="A false negative (a malignant case predicted benign) is the costly error, which is why recall matters more here than accuracy alone."
          >
            <ConfusionMatrix matrix={final.confusion_matrix} />
          </Card>

          <Card
            title="ROC curves"
            note="The closer a curve hugs the top-left corner, the better the model separates the two groups."
          >
            <div className="h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" dataKey="fpr" domain={[0, 1]} tick={{ fill: "#9ca3af", fontSize: 11 }} label={{ value: "False positive rate", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis type="number" domain={[0, 1]} tick={{ fill: "#9ca3af", fontSize: 11 }} width={36} />
                  <Tooltip contentStyle={{ background: "#0b0b14", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {models.map((m) => (
                    <Line
                      key={m.name}
                      data={m.roc_curve}
                      dataKey="tpr"
                      name={`${SHORT[m.name] ?? m.name} (AUC ${m.test.roc_auc.toFixed(3)})`}
                      stroke={COLORS[m.name]}
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card
          title="Model comparison (test set)"
          note="The chart axis starts at 0.90 so small differences are visible, which also exaggerates them. SVM scored one more malignant case correctly than Logistic Regression. With only 42 malignant test cases, that is within noise. The final model was chosen using cross-validation on the training set before the test set was opened, so it was not switched afterwards."
        >
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis domain={[0.9, 1]} tick={{ fill: "#9ca3af", fontSize: 11 }} width={36} />
                <Tooltip formatter={(v) => v.toFixed(4)} contentStyle={{ background: "#0b0b14", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Accuracy" fill="#6d63f0" isAnimationActive={false} />
                <Bar dataKey="Recall" fill="#14b8a6" isAnimationActive={false} />
                <Bar dataKey="ROC-AUC" fill="#f59e0b" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs text-white/50">
                <tr>
                  <th className="py-2 pr-3 font-normal">Model</th>
                  <th className="py-2 pr-3 font-normal">Accuracy</th>
                  <th className="py-2 pr-3 font-normal">Recall</th>
                  <th className="py-2 pr-3 font-normal">F1</th>
                  <th className="py-2 pr-3 font-normal">ROC-AUC</th>
                  <th className="py-2 font-normal">Missed</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name} className="border-t border-white/10">
                    <td className="py-2.5 pr-3">{m.name}{m.name === finalName && " (final)"}</td>
                    <td className="py-2.5 pr-3">{pct(m.test.accuracy)}</td>
                    <td className="py-2.5 pr-3">{pct(m.test.recall)}</td>
                    <td className="py-2.5 pr-3">{pct(m.test.f1)}</td>
                    <td className="py-2.5 pr-3">{m.test.roc_auc.toFixed(4)}</td>
                    <td className="py-2.5">{m.confusion_matrix[0][1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Which inputs push the model most"
          note="Standardised logistic regression coefficients (top 10 by size). Positive means a higher value moves the score toward malignant, negative toward benign. Many features are strongly correlated, so weight is shared between them. This describes this model, not medical causes."
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={118} tick={{ fill: "#d1d5db", fontSize: 11 }} />
                <Tooltip formatter={(v) => v.toFixed(3)} contentStyle={{ background: "#0b0b14", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" isAnimationActive={false}>
                  {featureData.map((d) => (
                    <Cell key={d.name} fill={d.value >= 0 ? "#e11d74" : "#14b8a6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="How these numbers were produced">
          <p className="text-sm leading-relaxed text-white/70">{procedure}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Dataset: {dataset.name}, {dataset.n_total} samples ({dataset.n_train} train,{" "}
            {dataset.n_test} test). The dataset is small and comes from a single source, so these
            results do not show how the model would perform on real patients. This is an
            educational project, not a diagnostic tool.
          </p>
        </Card>
      </div>
    </div>
  );
}