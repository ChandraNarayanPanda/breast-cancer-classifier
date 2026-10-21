# Breast Cancer Classifier (BreastCare AI)

An educational machine learning project that classifies breast mass measurements as more consistent with a benign or malignant group. It covers the full workflow: data analysis, model training, a FastAPI backend, and a React frontend.

> **Disclaimer:** This is a portfolio project. It is not clinically validated and does not provide medical diagnoses. Please consult a qualified healthcare professional about any health concern.

**Live demo:** [add after deployment]

## Screenshots
[add a desktop and a phone screenshot of the home page, the form, and the result]

## Dataset
Wisconsin Diagnostic Breast Cancer (WDBC) from the UCI Machine Learning Repository, loaded through scikit-learn. 569 samples, 30 numeric features. License: CC BY 4.0.

## Model results (test set)
[add your best model's name, accuracy, precision, recall, and ROC-AUC]

## Tech stack
- ML: Python, scikit-learn, pandas, NumPy, Jupyter, joblib
- Backend: FastAPI, Pydantic, Uvicorn, pytest
- Frontend: React, Vite, Tailwind CSS, React Router, Recharts

## Run it locally

Backend:
```
cd backend
python -m venv ../.venv
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Limitations
- 569 samples from a single source, so it may not generalize.
- Inputs are lab-derived image measurements that a person cannot measure at home.
- Model scores are not the probability that a person has cancer.