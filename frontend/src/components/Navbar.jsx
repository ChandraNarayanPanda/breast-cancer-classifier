import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Predict", to: "/predict" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-10 sm:py-5"
      >
        <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-wide">
          <Activity className="h-5 w-5 text-brand" aria-hidden="true" />
          BREASTCARE AI
        </Link>

        <ul className="hidden items-center gap-8 text-xs text-white/80 md:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="transition hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/predict"
            className="hidden items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-4 pr-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/10 sm:flex"
          >
            Start Analysis
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="mx-4 rounded-2xl border border-white/10 bg-black/85 p-3 backdrop-blur-xl md:hidden"
        >
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-base text-white/90 active:bg-white/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/predict"
            onClick={() => setOpen(false)}
            className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand text-sm font-medium"
          >
            Start Analysis
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </header>
  );
}