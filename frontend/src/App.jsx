import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Predict from "./pages/Predict";
import { getHealth } from "./services/api";

const Insights = lazy(() => import("./pages/Insights"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center px-5 text-center">
      <div>
        <h1 className="text-3xl font-light">
          <em className="font-bold">Page not found</em>
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-8 text-xs leading-relaxed text-white/50 sm:px-10">
      <p className="mx-auto max-w-3xl">
        BreastCare AI is an educational machine learning project and portfolio demonstration. It is
        not a clinically validated tool and does not provide medical diagnoses. Please consult a
        qualified healthcare professional about any health concern.
      </p>
    </footer>
  );
}

export default function App() {
  const [api, setApi] = useState({ ok: null, text: "Checking API..." });

  useEffect(() => {
    getHealth()
      .then((d) =>
        setApi({ ok: d.model_loaded, text: d.model_loaded ? "API connected" : "API up, model not loaded" })
      )
      .catch(() => setApi({ ok: false, text: "API offline" }));
  }, []);

  return (
    <div className="min-h-svh bg-ink text-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route
            path="/insights"
            element={
              <Suspense fallback={<div className="grid min-h-svh place-items-center text-sm text-white/60">Loading...</div>}>
                <Insights />
              </Suspense>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      <div
        role="status"
        className="fixed bottom-3 right-3 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-2 text-[11px] backdrop-blur sm:bottom-4 sm:right-4 sm:px-3"
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            api.ok === null ? "bg-white/40" : api.ok ? "bg-benign" : "bg-malignant"
          }`}
        />
        <span className="sr-only sm:not-sr-only">{api.text}</span>
      </div>
    </div>
  );
}