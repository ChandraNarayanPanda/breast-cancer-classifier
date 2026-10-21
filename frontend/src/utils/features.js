export const BASE_MEASUREMENTS = [
  { key: "radius", label: "Radius", hint: "Average distance from the nucleus center to its edge." },
  { key: "texture", label: "Texture", hint: "Variation in gray-scale values across the nucleus." },
  { key: "perimeter", label: "Perimeter", hint: "Length of the nucleus outline." },
  { key: "area", label: "Area", hint: "Size of the nucleus." },
  { key: "smoothness", label: "Smoothness", hint: "Local variation in radius lengths." },
  { key: "compactness", label: "Compactness", hint: "Perimeter squared divided by area, minus 1." },
  { key: "concavity", label: "Concavity", hint: "Severity of indentations in the outline. Zero is allowed.", zeroAllowed: true },
  { key: "concave_points", label: "Concave points", hint: "Number of indented portions of the outline. Zero is allowed.", zeroAllowed: true },
  { key: "symmetry", label: "Symmetry", hint: "How symmetrical the nucleus is." },
  { key: "fractal_dimension", label: "Fractal dimension", hint: "Roughness of the outline." },
];

export const GROUPS = [
  { id: "mean", title: "Mean values", description: "Average of each measurement", name: (k) => `mean_${k}` },
  { id: "error", title: "Standard error", description: "Variation of each measurement", name: (k) => `${k}_error` },
  { id: "worst", title: "Worst values", description: "Mean of the three largest values", name: (k) => `worst_${k}` },
];

// All 30 fields in the exact order the backend expects
export const FEATURES = GROUPS.flatMap((group) =>
  BASE_MEASUREMENTS.map((m) => ({
    name: group.name(m.key),
    label: `${m.label} (${group.id})`,
    hint: m.hint,
    group: group.id,
    zeroAllowed: Boolean(m.zeroAllowed),
  }))
);